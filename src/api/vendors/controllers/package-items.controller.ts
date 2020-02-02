import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { VendorsService } from '../services/vendors.service';
import { VendorEntity } from '../entities/vendors.entity';
import { CreateVendorDTO } from '../dtos/create-vendor.dto';
import { UpdateVendorPackageDTO, CreateVendorPackageDTO } from '../dtos/create-package.dto';
import { VendorPackagesService } from '../services/packages.service';
import { PackageEntity } from '../entities/packages.entity';
import { VendorPackageItemsService } from '../services/package-items.service';
import { PackageItemEntity } from '../entities/package-items.entity';
import { CreateVendorPackageItemDTO } from '../dtos/create-package-item.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/vendorapi-package-items')
export class VendorPackageItemsController {

  constructor(
    private readonly vendorPackageItemsService: VendorPackageItemsService
  ) {}
  
  @Get()
  showAllVendorPackageItems(): Promise<PackageItemEntity[]> {
    return this.vendorPackageItemsService.showAll()
  }


  @Get(':id')
  findById(@Param('id') id: string): Promise<PackageItemEntity> {
    return this.vendorPackageItemsService.findById(id)
  }


  @Get('by-pkg/:id')
  findByPackageItemById(@Param('id') id: string): Promise<PackageItemEntity[]> {
    return this.vendorPackageItemsService.findByPackageItemId(id)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createVendorPackageItem(@Body() vendorPackageItemData: Partial<CreateVendorPackageItemDTO>): Promise<CreateVendorPackageItemDTO> {
    return this.vendorPackageItemsService.create(vendorPackageItemData)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateVendorPackageItem(
    @Param('id') id: string,
    @Body() newVendorPackageItemData: Partial<CreateVendorPackageItemDTO>
  ): Promise<CreateVendorPackageItemDTO> {
    return this.vendorPackageItemsService.update(id, newVendorPackageItemData)
  } 

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteVendorPackageItem(
    @Param('id') id: string
  ) {
    return this.vendorPackageItemsService.destroy(id)
  }

}
