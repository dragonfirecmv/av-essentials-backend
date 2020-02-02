import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorEntity } from '../entities/vendors.entity';
import { Repository, TreeRepository } from 'typeorm';
import { CategoryEntity } from '../../categories/categories.entity';
import { CreateVendorDTO } from '../dtos/create-vendor.dto';
import { slugifyWithCode } from '../../../libs/slugifier/slugifier';
import { PackageEntity } from '../entities/packages.entity';
import { CreateVendorPackageItemDTO } from '../dtos/create-package-item.dto';
import { PackageItemEntity } from '../entities/package-items.entity';

@Injectable()
export class VendorPackageItemsService {

  constructor(
    @InjectRepository(PackageItemEntity)
      private readonly vendorPackageItemRepository: Repository<PackageItemEntity>
  ) {}



  async showAll(): Promise<PackageItemEntity[]> {
    return await this.vendorPackageItemRepository.find({
      relations: ['packaged_on', 'selected_item']
    })
  }


  async listByItemId(item_id: string): Promise<PackageItemEntity[]> {
    return await this.vendorPackageItemRepository.find({
      where: { selected_item: { id: item_id } },
      relations: ['packaged_on']
    })
  }
  

  async findById(id: string): Promise<PackageItemEntity> {
    return await this.vendorPackageItemRepository.findOne({
      where: { id },
      relations: ['packaged_on', 'selected_item']
    })
  }


  async findByPackageItemId(package_id: string): Promise<PackageItemEntity[]> {
    return await this.vendorPackageItemRepository.find({
      where: { packaged_on: { id: package_id } },
      relations: ['packaged_on', 'selected_item']
    })
  }


  async create(
    payload: Partial<CreateVendorPackageItemDTO>
  ): Promise<CreateVendorPackageItemDTO> {
    

    const tmpVendorPkgItem = await this.vendorPackageItemRepository.create({
      ...payload
    })

    console.log('created vendor package item', tmpVendorPkgItem)
    this.vendorPackageItemRepository.save(tmpVendorPkgItem)

    return tmpVendorPkgItem.toResponseObject()
  }



  async update(
    id: string,
    payload: Partial<CreateVendorPackageItemDTO>
  ): Promise<CreateVendorPackageItemDTO> {

    // Check whether the project exists.
    let vendorPkgItem = await this.vendorPackageItemRepository.findOne({ 
      where: { id }, 
      relations: [ 'packaged_on', 'selected_item' ]
    }) 

    if (!vendorPkgItem) {
      throw new HttpException(
        'Vendor Package item not found!',
        HttpStatus.NOT_FOUND
      )
    }

    // UPDATE!
    await this.vendorPackageItemRepository.update({ id }, payload)


    vendorPkgItem = await this.vendorPackageItemRepository.findOne({ 
      where: { id }, 
      relations: [ 'packaged_on', 'selected_item' ]
    })
    return vendorPkgItem.toResponseObject()
  }



  async destroy(
    id: string
  ) {
    const result = await this.vendorPackageItemRepository.delete({ id })

    if (result.affected < 1) return { deleted: false }
    return { id, deleted: true }
  }

}
