import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorEntity } from '../entities/vendors.entity';
import { Repository, TreeRepository } from 'typeorm';
import { CategoryEntity } from '../../categories/categories.entity';
import { CreateVendorDTO } from '../dtos/create-vendor.dto';
import { slugifyWithCode } from '../../../libs/slugifier/slugifier';
import { PackageEntity } from '../entities/packages.entity';
import { CreateVendorPackageDTO, UpdateVendorPackageDTO, UpdateVendorPackageCategoriesDTO } from '../dtos/create-package.dto';
import { VendorPackageItemsService } from './package-items.service'

@Injectable()
export class VendorPackagesService {

  constructor(
    @InjectRepository(PackageEntity)
    private readonly vendorPackageRepository: Repository<PackageEntity>,
    @InjectRepository(CategoryEntity)
    private readonly vendorPackageCategoriesRepos: TreeRepository<CategoryEntity>
  ) { }



  async showAll() {
    const listPackages = await this.vendorPackageRepository.find({
      relations: ['categories', 'vendor_owner', 'package_items']
    })

    return listPackages.map(packaged => packaged.toResponseObject())
  }



  async findById(id: string) {
    const packaged = await this.vendorPackageRepository.findOne({
      where: { id },
      relations: ['categories', 'vendor_owner', 'package_items']
    })

    return packaged.toResponseObject()
  }



  async create(
    payload: Partial<CreateVendorPackageDTO>
  ) {

    if (!payload.categories)
      throw new HttpException(
        "Vendor's category must be specified.",
        HttpStatus.BAD_REQUEST
      )

    payload.categories.map(async (categoryPayload) => {
      await this.vendorPackageCategoriesRepos.findOneOrFail({
        where: categoryPayload,
        relations: ['categories', 'vendor_owner', 'package_items']
      })
    })

    let tmpPayload: Partial<CreateVendorPackageDTO> = { ...payload }
    delete tmpPayload['package_items']


    const tmpVendorPkg = await this.vendorPackageRepository.create(tmpPayload)

    console.log('created vendor package', tmpVendorPkg)
    this.vendorPackageRepository.save(tmpVendorPkg)

    return tmpVendorPkg.toResponseObject()
  }



  async update(
    id: string,
    payload: Partial<UpdateVendorPackageDTO>
  ) {

    // Check whether the project exists.
    let tmpVendorPkg = await this.vendorPackageRepository.findOne({
      where: { id }
    })

    if (!tmpVendorPkg) {
      throw new HttpException(
        'Package not found!',
        HttpStatus.NOT_FOUND
      )
    }

    delete payload['categories']

    // UPDATE!
    await this.vendorPackageRepository.update({ id }, payload)


    tmpVendorPkg = await this.vendorPackageRepository.findOne({
      where: { id },
      relations: ['categories', 'vendor_owner', 'package_items']
    })
    return tmpVendorPkg.toResponseObject()
  }


  async updateCategories(
    id: string,
    payload: UpdateVendorPackageCategoriesDTO
  ) {

    // Check whether the project exists.
    let tmpVendorPkg = await this.vendorPackageRepository.findOne({
      where: { id },
      relations: ['categories']
    })


    if (!tmpVendorPkg) {
      throw new HttpException(
        'Package not found!',
        HttpStatus.NOT_FOUND
      )
    }

    await this.vendorPackageRepository.query(`
      DELETE FROM public.vendor_packages_categories_categories
        WHERE package_id = '${tmpVendorPkg.id}';

      ${
      payload.categories.map((category) => `
          INSERT INTO public.vendor_packages_categories_categories (package_id, category_id)
            VALUES ('${tmpVendorPkg.id}', '${category.id}');
        `).reduce((befur, after) => `${befur} ${after}`)
      }
    `)


    return tmpVendorPkg

  }



  async destroy(
    id: string
  ) {
    const result = await this.vendorPackageRepository.delete({ id })

    if (result.affected < 1) return { deleted: false }
    return { id, deleted: true }
  }

}
