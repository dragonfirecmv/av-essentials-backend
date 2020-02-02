import { Controller, Get, UseGuards, Post, Delete, Param, Body, Put } from '@nestjs/common';
import { ShopCartService } from './shop-cart.service';
import { User } from '../users/decorator/users.decorator';
import { UserEntity } from '../users/users.entity';
import { AuthGuard } from '@nestjs/passport';
import { AddNewShopcartItemDTO } from './dto/add-new-shopcart-item.dto';
import { UpdateShopCartItemDTO } from './dto/update-shopcart-item.dto';
import { AdminOnlyGuard } from '../../shared/guards/admin.guard';
import { ShopCartEntity } from './shop-cart.entity';

@Controller('api/shop-cart')
export class ShopCartController {
  
  constructor(
    private readonly shopcartService: ShopCartService
  ) {}


  @Get()
  @UseGuards(AuthGuard('jwt'))
  listAllShopCartWithItems(
    @User() user: UserEntity
  ) {
    if (user.admin) {
      return this.shopcartService.showAllShopCartWithItems()
    }
    return this.shopcartService.unAuthorizedOnlyAdmin()
  }

  @Get('by-user')
  @UseGuards(AuthGuard('jwt'))
  findMyShopCart(
    @User() user: UserEntity
  ) {
    if (user.admin) {
      return this.shopcartService.showAllShopCartWithItems()
    }
    return this.shopcartService.showWhoShopCartWithItems(user)
  }

  @Get('my-shopcart')
  @UseGuards(AuthGuard('jwt'))
  getCurrentMyShopcart(
    @User() user: UserEntity
  ) {
    return this.shopcartService.getCurrentMyShopcart(user)
  }

  @Post('my-shopcart/new')
  @UseGuards(AuthGuard('jwt'))
  initializeNewShopCart(
    @User() user: UserEntity
  ) {
    return this.shopcartService.createShopcart(user)
  }

  @Post('my-shopcart/add-items')
  @UseGuards(AuthGuard('jwt'))
  addNewItemToShopCart(
    @User() user: UserEntity,
    @Body() payload: AddNewShopcartItemDTO
  ) {
    console.log({ payload })
    return this.shopcartService.addNewItem(user, payload)
  }

  @Get('shopcart/item/:id')
  @UseGuards(AuthGuard('jwt'))
  findShopCartItemDetails(
    @User() user: UserEntity,
    @Param('id') cartitem_id: string
  ) {
    return this.shopcartService.viewSpecificShopcartitemDetails(cartitem_id)
  }

  @Delete('shopcart/item/:id')
  @UseGuards(AuthGuard('jwt'))
  removeItemFromShopCart(
    @User() user: UserEntity,
    @Param('id') cartitem_id: string
  ) {
    return this.shopcartService.removeItemFromShopcart(user, cartitem_id)
  }

  @Put('shopcart/item/:id')
  @UseGuards(AuthGuard('jwt'))
  updateItemFromShopCart(
    @User() user: UserEntity,
    @Param('id') cartitem_id: string,
    @Body() payload: UpdateShopCartItemDTO
  ) {
    return this.shopcartService.updateShopCartItem(user, cartitem_id, payload)
  }


  @Delete('my-shopcart')
  @UseGuards(AuthGuard('jwt'))
  deleteMyShopCart(
    @User() user: UserEntity
  ) {
    return this.shopcartService.removeShopcart(user)
  }

  @Put('my-shopcart/additional-info')
  @UseGuards(AuthGuard('jwt'))
  putAdditionalInfo(
    @User() user: UserEntity,
    @Body() payload: object
  ) {
    return this.shopcartService.editAdditionalInfoToCurrentShopcart(user, payload)
  }

  @Post('my-shopcart/check-out')
  @UseGuards(AuthGuard('jwt'))
  checkOutMyShopCart(
    @User() user: UserEntity
  ) {
    return this.shopcartService.checkOutShopCart(user)
  }

  @Post('my-shopcart/finalize')
  @UseGuards(AuthGuard('jwt'))
  finalizeMyShopCart(
    @User() user: UserEntity
  ) {
    return this.shopcartService.finalizeShopCart(user)
  }

  @Post('my-shopcart/make-expire')
  @UseGuards(AuthGuard('jwt'))
  expireMyShopCart(
    @User() user: UserEntity
  ) {
    return this.shopcartService.expireShopCart(user)
  }

  @Put('finalize/:id')
  @UseGuards(AuthGuard('jwt'))
  finalizeShopCartById(
    @User() user: UserEntity,
    @Param('id') shopCartId: string
  ) {
    if (user.admin) {
      return this.shopcartService.finalizeShopCartByAdmin(shopCartId)
    }
    return this.shopcartService.unAuthorizedOnlyAdmin()
  }

  @Put('make-expire/:id')
  @UseGuards(AuthGuard('jwt'))
  expireShopCartById(
    @User() user: UserEntity,
    @Param('id') shopCartId: string
  ) {
    if (user.admin) {
      return this.shopcartService.expireShopCartByAdmin(shopCartId)
    }
    return this.shopcartService.unAuthorizedOnlyAdmin()
  }
  
}
