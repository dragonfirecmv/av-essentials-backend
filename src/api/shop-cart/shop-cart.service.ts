import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopCartEntity } from './shop-cart.entity';
import { ShopCartItemEntity } from './shop-cart-item.entity'
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { AddNewShopcartItemDTO } from './dto/add-new-shopcart-item.dto';
import * as moment from 'moment';
import { UpdateShopCartItemDTO } from './dto/update-shopcart-item.dto';

@Injectable()
export class ShopCartService {

  constructor(
    @InjectRepository(ShopCartEntity)
    private readonly shopcartRepos: Repository<ShopCartEntity>,
    @InjectRepository(ShopCartItemEntity)
    private readonly shopcartItemRepos: Repository<ShopCartItemEntity>
  ) { }

  async showAllShopCartWithItems() {
    const listShopcart = await this.shopcartRepos.find({
      relations: ['cart_items', 'owner_user']
    })
    return listShopcart.map(shopcart => shopcart.toResponseObject())
  }

  async showWhoShopCartWithItems(user: UserEntity) {
    const myShopcart = await this.shopcartRepos.findOneOrFail({
      where: { owner_user: { id: user.id } },
      relations: ['cart_items', 'owner_user']
    })
    

    const shouldBeExpired = await this.checkShouldBeExpired(myShopcart.checked_out_date)
    if (myShopcart.checked_out_date !== null && shouldBeExpired) {
      this.expireGeneral(user)
    }

    return myShopcart.toResponseObject()
  }

  async getCurrentMyShopcart(user: UserEntity) {
    const shopCart = await this.checkIsShopCartExistCURRENT(user)

    return shopCart.toResponseObject()
  }

  async createShopcart(user: UserEntity) {
    const isShopcartExists = await this.shopcartRepos.findOne({
      where: { owner_user: { id: user.id }, checked_out: false },
      relations: ['cart_items', 'owner_user']
    })

    console.log({ isShopcartExists })

    if (isShopcartExists)
      throw new HttpException(
        'CREATE FAILED: Shopcart with CHECKOUT FALSE already exists!',
        HttpStatus.BAD_REQUEST
      )

    const tempShopcart = await this.shopcartRepos.create({
      owner_user: user
    })

    console.log({ tempShopcart })

    this.shopcartRepos.save(tempShopcart)

    return tempShopcart.toResponseObject()
  }

  async removeShopcart(user: UserEntity) {
    const isShopcartExists = await this.shopcartRepos.findOne({
      where: { owner_user: { id: user.id }, checked_out: false },
      relations: ['cart_items', 'owner_user']
    })

    if (!isShopcartExists)
      throw new HttpException(
        'Shopcart does not exists!',
        HttpStatus.BAD_REQUEST
      )

    const result =
      await this.shopcartRepos.delete({
        id: isShopcartExists.id
      })


    if (result.affected < 1) return { deleted: false }
      return { id: isShopcartExists.id, deleted: true }
  }

  async addNewItem(user: UserEntity, payload: AddNewShopcartItemDTO) {
    // const isShopcartExists = await this.shopcartRepos.findOne({
    //   where: { owner_user: { id: user.id } },
    //   relations: ['cart_items', 'owner']
    // })
    let isShopcartExists = await this.checkIsShopCartExistCURRENT(user)

    if (!isShopcartExists) {
      await this.createShopcart(user)

      isShopcartExists = await this.checkIsShopCartExistCURRENT(user)
    }
      // throw new HttpException(
      //   'Shopcart does not exists!',
      //   HttpStatus.BAD_REQUEST
      // )

    console.log({ payload })

    const tempShopcartitem = await this.shopcartItemRepos.create({
      ...payload,
      shop_cart: isShopcartExists
    })

    this.shopcartItemRepos.save(tempShopcartitem)
    
    const newerShopcart = await this.shopcartRepos.findOne({
      where: { owner_user: { id: user.id }, checked_out: false },
      relations: ['cart_items', 'owner_user']
    })

    return newerShopcart.toResponseObject()

  }

  async removeItemFromShopcart(user: UserEntity, cartitem_id: string) {
    const isShopcartExists = await this.shopcartRepos.findOne({
      where: { owner_user: { id: user.id } },
      relations: ['cart_items', 'owner_user']
    })

    if (!isShopcartExists)
      throw new HttpException(
        'Shopcart does not exists!',
        HttpStatus.BAD_REQUEST
      )

    const isShopcartItemExists = await this.shopcartItemRepos.findOne({
      where: { id: cartitem_id },
      relations: ['shop_cart', 'item_from_packages', 'item_from_goods']
    })

    if (!isShopcartItemExists)
      throw new HttpException(
        'Cart item does not exists!',
        HttpStatus.BAD_REQUEST
      )

    const result = await this.shopcartItemRepos.delete({ id: cartitem_id })

    if (result.affected < 1) return { deleted: false }
    return { cartitem_id, deleted: true }

  }

  async viewSpecificShopcartitemDetails(cartitem_id: string) {
    const shopcartItem = await this.shopcartItemRepos.findOneOrFail({
      where: { id: cartitem_id },
      relations: ['shop_cart', 'item_from_packages', 'item_from_goods']
    })

    return shopcartItem.toResponseObject()
  }

  async unAuthorizedOnlyAdmin() {
    throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED) 
  }

  async editAdditionalInfoToCurrentShopcart(user: UserEntity, payload: object) {
    const shopCart = await this.checkIsShopCartExistCURRENT(user)

    shopCart.additional_data = payload
    this.shopcartRepos.save(shopCart)

    return {
      'statusCode': HttpStatus.OK,
      'message': "Edited the shop cart's additional info."
    }
  }

  async checkOutShopCart(user: UserEntity) {
    const shopCart = await this.checkIsShopCartExistCURRENT(user)

    shopCart.checked_out = true
    shopCart.checked_out_date = new Date()
    this.shopcartRepos.save(shopCart)

    return {
      'statusCode': HttpStatus.OK,
      'message': 'Shop cart is checked out'
    }
  }

  async finalizeShopCart(user: UserEntity) {
    const shopCart = await this.checkIsShopCartExistCHECKEDOUTONLY(user)
    
    if (shopCart.checked_out) {
      shopCart.paid = true
      this.shopcartRepos.save(shopCart)

      return {
        'statusCode': HttpStatus.OK,
        'message': 'Shop cart is finalized'
      }
    }
    throw new HttpException(
      'Shop cart is not checked out', HttpStatus.BAD_REQUEST
    )
  }

  async finalizeShopCartByAdmin(shopcartId: string) {
    const shopCart = await this.checkIsShopCartExistById(shopcartId);

    if (shopCart.checked_out) {
      shopCart.paid = true
      this.shopcartRepos.save(shopCart)

      return {
        'statusCode': HttpStatus.OK,
        'message': 'Shop cart is finalized'
      }
    }

    throw new HttpException(
      'Shop cart is not checked out', HttpStatus.BAD_REQUEST
    )
  }

  async expireShopCart(user: UserEntity) {
    const shopCart = await this.checkIsShopCartExistCHECKEDOUTONLY(user)
    
    if (shopCart.checked_out && !shopCart.paid) {
      shopCart.expired = true
      this.shopcartRepos.save(shopCart)

      return {
        'statusCode': HttpStatus.OK,
        'message': 'Shop cart is expired'
      }
    }

    if (!shopCart.checked_out) {
      throw new HttpException(
        'Shop cart is not checked out', HttpStatus.BAD_REQUEST
      )
    }
    throw new HttpException(
      'Shop cart is already paid', HttpStatus.BAD_REQUEST
    )

  }

  async expireShopCartByAdmin(shopCartId: string) {
    const shopCart = await this.checkIsShopCartExistById(shopCartId)
    
    if (shopCart.checked_out && !shopCart.paid) {
      shopCart.expired = true
      this.shopcartRepos.save(shopCart)

      return {
        'statusCode': HttpStatus.OK,
        'message': 'Shop cart is expired'
      }
    }

    if (!shopCart.checked_out) {
      throw new HttpException(
        'Shop cart is not checked out', HttpStatus.BAD_REQUEST
      )
    }
    throw new HttpException(
      'Shop cart is already paid', HttpStatus.BAD_REQUEST
    )

  }
  
  async expireGeneral(user: UserEntity) {
    const shopCart = await this.checkIsShopCartExist(user)

    shopCart.expired = true
    this.shopcartRepos.save(shopCart)
  }


  async calculateAndUpdate_TotalPriceOf_CURRENTShopCart(user: UserEntity) {
    const shopCart = await this.checkIsShopCartExistCURRENT(user)

    if (!shopCart) {
      throw new HttpException(
        'Shopcart does not exists!',
        HttpStatus.BAD_REQUEST
      )
    }

    let price = 0;

    shopCart.cart_items && shopCart.cart_items.forEach(cart_item => {
      price += cart_item.total_price
    })

    shopCart.calculated_price = price
    this.shopcartRepos.save(shopCart)

    return {
      'statusCode': HttpStatus.OK,
      'message': 'Shop cart is checked out'
    }
  }

  async checkIsShopCartExist(user: UserEntity) {
    const shopCart = await this.shopcartRepos.findOne({
      where: { owner_user: { id: user.id } },
      relations: ['cart_items', 'owner_user']
    })

    if (!shopCart)
      throw new HttpException(
        'Shopcart does not exists!',
        HttpStatus.BAD_REQUEST
      )
    return shopCart
  }

  async checkIsShopCartExistById(shopcartId: string) {
    const shopCart = await this.shopcartRepos.findOne({
      where: { id: shopcartId },
      relations: ['cart_items', 'owner_user']
    })

    if (!shopCart)
      throw new HttpException(
        'Shopcart does not exists!',
        HttpStatus.BAD_REQUEST
      )
    return shopCart
  }

  async checkIsShopCartExistCURRENT(user: UserEntity) {
    const shopCart = await this.shopcartRepos.findOne({
      where: { owner_user: { id: user.id }, checked_out: false },
      relations: ['cart_items', 'owner_user']
    })

    if (!shopCart)
      return null

    return shopCart
  }

  async checkIsShopCartExistCHECKEDOUTONLY(user: UserEntity) {
    const shopCart = await this.shopcartRepos.findOne({
      where: { owner_user: { id: user.id }, checked_out: true, paid: false },
      relations: ['cart_items', 'owner_user']
    })

    if (!shopCart)
      return null
    return shopCart
  }


  async checkShouldBeExpired(date: Date) {
    const stringDateEvaluation = await moment(date).fromNow()

    const dateEvaluation = stringDateEvaluation.split(" ")
    if ((dateEvaluation[1] == 'few') || (dateEvaluation[1] == 'second') || (dateEvaluation[1] == 'seconds') || (dateEvaluation[1] == 'minute') || (dateEvaluation[1] == 'minutes') || (dateEvaluation[1] == 'hour') || (dateEvaluation[1] == 'hours') || (dateEvaluation[1] == 'day')) {
      return false;
    } 
    return true;
  }

  async updateShopCartItem(user: UserEntity, cartitem_id: string, payload: Partial<UpdateShopCartItemDTO>) {
    
    await this.shopcartItemRepos.update({ id: cartitem_id }, payload)

    const shopcart = await this.checkIsShopCartExist(user)

    return shopcart.toResponseObject()
  }

}
