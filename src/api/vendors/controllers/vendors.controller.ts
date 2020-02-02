import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { VendorsService } from '../services/vendors.service';
import { VendorEntity } from '../entities/vendors.entity';
import { CreateVendorDTO } from '../dtos/create-vendor.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../../api/users/decorator/users.decorator';
import { UserEntity } from '../../../api/users/users.entity';

@Controller('api/vendors')
export class VendorsController {

  constructor(
    private readonly vendorsService: VendorsService
  ) {}
  
  /**
   * List every registered vendors, 
   */
  @Get()
  showAllVendors() {
    return this.vendorsService.showAll()
  }

  @Get('by-category/:categoryId')
  ShowVendorByQuery(@Param('categoryId') catId) {
    return this.vendorsService.showByCategory(catId)
  }

  @Get('by-category-deep/:categoryId')
  ShowVendorByCategoryDeep(@Param('categoryId') catId) {
    return this.vendorsService.showByCategoryAndItsDescendant(catId)
  }


  /**
   * Find a vendor information by its slug,
   * If exist, it returns the information about
   * that vendor.
   */
  @Get('id/:id')
  findById(@Param('id') id: string) {
    return this.vendorsService.findById(id)
  }

  /**
   * Find a vendor information by its slug,
   * If exist, it returns the information about
   * that vendor.
   */
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.vendorsService.findBySlug(slug)
  }


  /**
   * List every registered vendor the current user have.
   * @param user 
   */
  @Get('by-user')
  @UseGuards(AuthGuard('jwt'))
  findVendorByCurrentUser(
    @User()
      user: UserEntity
  ) {
    console.log({ user })
    return this.vendorsService.findByCurrentUser(user)
  }


  /**
   * Create a new vendor under current user.
   * @param user 
   * @param vendorData 
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  createVendor(
    @User()
      user: UserEntity,
    @Body() 
      vendorData: Partial<CreateVendorDTO>
  ): Promise<CreateVendorDTO> {
    return this.vendorsService.create(vendorData, user)
  }


  /**
   * Update current user's selected vendor
   * @param slug 
   * @param newVendorData 
   */
  @Put('slug/:slug')
  @UseGuards(AuthGuard('jwt'))
  updateVendor(
    @User()
      user: UserEntity,
    @Param('slug') slug: string,
    @Body() newVendorData: Partial<CreateVendorDTO>
  ): Promise<CreateVendorDTO> {
    return this.vendorsService.update(slug, newVendorData, user)
  } 


  /**
   * Update current user's selected vendor
   * @param slug 
   * @param newVendorData 
   */
  @Put('slug/:slug/update-category')
  @UseGuards(AuthGuard('jwt'))
  updateVendorCategory(
    @User()
      user: UserEntity,
    @Param('slug') slug: string,
    @Body() newVendorCategoryData: Partial<CreateVendorDTO>
  ) {
    return this.vendorsService.updateCategories(slug, newVendorCategoryData, user)
  } 


  /**
   * Route for deleting vendor.
   * @param slug 
   */
  @Delete('slug/:slug')
  @UseGuards(AuthGuard('jwt'))
  deleteVendor(
    @User()
      user: UserEntity,
    @Param('slug') slug: string
  ) {
    return this.vendorsService.destroy(slug, user)
  }

}
