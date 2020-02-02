import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { VendorsService } from '../services/vendors.service';
import { VendorEntity } from '../entities/vendors.entity';
import { CreateVendorDTO } from '../dtos/create-vendor.dto';
import { UpdateVendorPackageDTO, CreateVendorPackageDTO, UpdateVendorPackageCategoriesDTO } from '../dtos/create-package.dto';
import { VendorPackagesService } from '../services/packages.service';
import { PackageEntity } from '../entities/packages.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/vendorapi-packages')
export class VendorPackagesController {

  constructor(
    private readonly vendorPackagesService: VendorPackagesService
  ) {}
  
  @Get()
  showAllVendorPackages() {
    return this.vendorPackagesService.showAll()
  }


  @Get(':id')
  findById(@Param('id') id: string) {
    return this.vendorPackagesService.findById(id)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createVendorPackage(@Body() vendorPackageData: Partial<UpdateVendorPackageDTO>) {
    return this.vendorPackagesService.create(vendorPackageData)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateVendorPackage(
    @Param('id') id: string,
    @Body() newVendorPackageData: Partial<UpdateVendorPackageDTO>
  ) {
    return this.vendorPackagesService.update(id, newVendorPackageData)
  } 

  @Put(':id/update-categories')
  @UseGuards(AuthGuard('jwt'))
  updateVendorPackageCategories(
    @Param('id') id: string,
    @Body() vPkgCategories: UpdateVendorPackageCategoriesDTO
  ) {
    return this.vendorPackagesService.updateCategories(id, vPkgCategories)
  } 

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteVendorPackage(
    @Param('id') id: string
  ) {
    return this.vendorPackagesService.destroy(id)
  }

}
