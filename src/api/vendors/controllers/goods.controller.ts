import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { VendorsService } from '../services/vendors.service';
import { GoodsEntity } from '../entities/goods.entity';
import { CreateVendorDTO } from '../dtos/create-vendor.dto';
import { VendorGoodsService } from '../services/goods.service';
import { CreateVendorGoodsDTO } from '../dtos/create-goods.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/vendorapi-goods')
export class VendorGoodsController {

  constructor(
    private readonly vendorGoodsService: VendorGoodsService
  ) {}
  
  @Get()
  showAllVendorGoodss() {
    return this.vendorGoodsService.showAll()
  }

  @Get('sort-by/:sortBy')
  showAllVendorGoodssByOrdering(
    @Param('sortBy') sortBy: string
  ) {
    if(sortBy === 'ASC') {
      return this.vendorGoodsService.showAllPriceASC()
    }
    return this.vendorGoodsService.showAllPriceDSC()
  }


  @Get(':id')
  findById(@Param('id') id: string) {
    return this.vendorGoodsService.findById(id)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createVendorGoods(@Body() vendorData: Partial<CreateVendorGoodsDTO>) {
    return this.vendorGoodsService.create(vendorData)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateVendorGoods(
    @Param('id') id: string,
    @Body() newVendorData: Partial<CreateVendorGoodsDTO>
  ): Promise<CreateVendorGoodsDTO> {
    return this.vendorGoodsService.update(id, newVendorData)
  } 

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteVendorGoods(
    @Param('id') id: string
  ) {
    return this.vendorGoodsService.destroy(id)
  }

}
