import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorEntity } from '../entities/vendors.entity';
import { Repository, TreeRepository, In } from 'typeorm';
import { CategoryEntity } from '../../categories/categories.entity';
import { CreateVendorDTO } from '../dtos/create-vendor.dto';
import { slugifyWithCode } from '../../../libs/slugifier/slugifier';
import { UserEntity } from '../../users/users.entity';
import { safe } from 'src/libs/helper/safeObjects';
import { flatternToArrayFromCertainKey } from '../../../libs/helper/flattern-obj'

@Injectable()
export class VendorsService {

  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
    @InjectRepository(CategoryEntity)
    private readonly vendorCategoryRepos: TreeRepository<CategoryEntity>
  ) { }



  async showAll() {
    const listVendor = await this.vendorRepository.find({
      relations: ['vendor_categories', 'owned_by_who', 'packages_to_sell', 'goods_items']
    })

    return listVendor.map(vendor => vendor.toResponseObject())
  }


  async showByCategory(catId: any) {
    console.log('loading...')
    // const listVendor = await this.vendorRepository.find({
    //   // where: { vendor_categories: { id: catId } },
    //   relations: ['vendor_categories', 'owned_by_who', 'packages_to_sell', 'goods_items']
    // })

    const getVendorsFromCategory = await this.vendorCategoryRepos.findOne({
      where: { id: catId },
      relations: ['vendors']
    })

    return getVendorsFromCategory.getVendorList()

  }

  async showByCategoryAndItsDescendant(catId: any) {
    console.log('loading...')

    let tempVendors = [];
    const fetchVendors = await this.vendorRepository.find({
      relations: ['vendor_categories', 'owned_by_who', 'packages_to_sell', 'goods_items']
    })
    const listVendor = await fetchVendors.map(vendor => vendor.toResponseObject())

    // /**
    //  * NOTE TO SELF, THIS IS ONLY ONE DEEP.
    //  * ALSO, THIS DO NOT INCLUDE THE catID. ONLY ITS DESCENDANT!!!
    //  */

    const parentCategory = await this.vendorCategoryRepos.findOneOrFail({
      where: { id: catId }
    })

    const categories_ids = await this.vendorCategoryRepos.findDescendantsTree(parentCategory)

    const preparedIds = [catId, ...flatternToArrayFromCertainKey(categories_ids, 'children').map(item => item.id)]

    // return { flat: flatten.map(item => item.id) }

    for (let index = 0; index < preparedIds.length; index++) {

      const getVendorsFromCategory = listVendor.filter(item => {
        const filtered = item.vendor_categories.filter(catx => catx.id === preparedIds[index])

        if (filtered.length > 0)
          return true
        else
          return false
      })

      tempVendors = [
        ...tempVendors,
        ...getVendorsFromCategory
      ]

    }

    const uniqued = Array.from(new Set(tempVendors.map(a => a.id)))
      .map(id => {
        return tempVendors.find(a => a.id === id)
      })

    // console.log(categories_ids)

    return uniqued
    // return categories_ids

  }



  async findById(id: string) {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['vendor_categories', 'owned_by_who', 'packages_to_sell', 'goods_items']
    })

    return vendor.toResponseObject()
  }


  async findBySlug(slug: string) {
    const vendor = await this.vendorRepository.findOne({
      where: { slug },
      relations: ['vendor_categories', 'owned_by_who', 'packages_to_sell', 'goods_items']
    })

    return vendor.toResponseObject()
  }


  async findByCurrentUser(user: UserEntity) {
    console.log({ user })
    const listVendor = await this.vendorRepository.find({
      where: { owned_by_who: user.id },
      relations: ['vendor_categories', 'owned_by_who', 'packages_to_sell', 'goods_items']
    })

    console.log({ listVendor })
    return listVendor.map(vendor => vendor.toLiteResponseObject())
  }


  async create(
    payload: Partial<CreateVendorDTO>,
    user: UserEntity
  ): Promise<CreateVendorDTO> {

    if (!payload.vendor_categories)
      throw new HttpException(
        "Vendor's category must be specified.",
        HttpStatus.BAD_REQUEST
      )

    payload.vendor_categories.map(async (categoryPayload) => {
      await this.vendorCategoryRepos.findOneOrFail({
        where: categoryPayload,
        relations: ['vendor_categories']
      })
    })

    const slugTemp = slugifyWithCode(payload.vendor_name)

    /**
     * different create scheme by admin and user
     */
    let tmpVendor: VendorEntity
    if (user.admin) {
      tmpVendor = await this.vendorRepository.create({
        ...payload,
        slug: slugTemp
      })
    } else {
      tmpVendor = await this.vendorRepository.create({
        ...payload,
        owned_by_who: user,
        slug: slugTemp
      })
    }

    console.log('created vendor', tmpVendor)
    this.vendorRepository.save(tmpVendor)

    return tmpVendor.toResponseObject()
  }



  async update(
    slug: string,
    payload: Partial<CreateVendorDTO>,
    user: UserEntity
  ): Promise<CreateVendorDTO> {

    // Check whether the vendor exists.
    let vendor = await this.vendorRepository.findOne({
      where: { slug },
      relations: ['owned_by_who']
    })

    if (!vendor) {
      throw new HttpException(
        'Vendor not found!',
        HttpStatus.NOT_FOUND
      )
    }

    console.log('CHECKING AUTHORIZATION =====================')
    console.log('owner', vendor.owned_by_who, ' token', user)

    /**
     * different update scheme by admin and user
     */
    // check if targeted vendor does not match the user.
    if (!user.admin) {
      if (vendor.owned_by_who.id !== user.id) {
        throw new HttpException(
          'Unauthorized user access!',
          HttpStatus.UNAUTHORIZED
        )
      }
    }


    let tempPayload = { ...payload }
    delete tempPayload['vendor_categories']

    console.log('trying to UPDATE ENTITIES ==============', tempPayload)
    // UPDATE!
    await this.vendorRepository.update({ slug }, tempPayload)


    vendor = await this.vendorRepository.findOne({
      where: { slug },
      relations: [
        'vendor_categories',
        'owned_by_who',
        'packages_to_sell',
        'goods_items'
      ]
    })

    return vendor.toResponseObject()
  }


  async updateCategories(
    slug: string,
    payload: Partial<CreateVendorDTO>,
    user: UserEntity
  ) {
    // Check whether the vendor exists.
    let vendor = await this.vendorRepository.findOne({
      where: { slug },
      relations: ['owned_by_who']
    })

    if (!vendor) {
      throw new HttpException(
        'Vendor not found!',
        HttpStatus.NOT_FOUND
      )
    }

    console.log('CHECKING AUTHORIZATION =====================')
    console.log('owner', vendor.owned_by_who, ' token', user)

    // check if targeted vendor does not match the user.
    // if (vendor.owned_by_who.id !== user.id && !user.admin) {
    //   throw new HttpException(
    //     'Unauthorized user access!',
    //     HttpStatus.UNAUTHORIZED
    //   )
    // }

    await this.vendorRepository.query(`
      DELETE FROM public.vendors_categories
        WHERE vendor_id = '${vendor.id}';

      ${
      payload.vendor_categories.map((category) => `
          INSERT INTO public.vendors_categories (vendor_id, category_id)
            VALUES ('${vendor.id}', '${category.id}');
        `).reduce((befur, after) => `${befur} ${after}`)
      }
    `)

    return vendor

  }



  async destroy(
    slug: string,
    user: UserEntity
  ) {
    let vendor = (null as VendorEntity)

    if (!user.admin) {
      vendor = await this.vendorRepository.findOne({
        where: { slug },
        relations: ['owned_by_who']
      })

      // check if targeted vendor does not match the user.
      if (vendor.owned_by_who.id !== user.id) {
        throw new HttpException(
          'Unauthorized user access!',
          HttpStatus.UNAUTHORIZED
        )
      }
    }

    else
      await this.vendorRepository.findOne({
        where: { slug }
      })


    const result = await this.vendorRepository.delete({ slug })

    if (result.affected < 1) return { deleted: false }
    return { slug, deleted: true }
  }

}
