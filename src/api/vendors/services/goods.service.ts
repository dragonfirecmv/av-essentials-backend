import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { CategoryEntity } from '../../categories/categories.entity';
import { CreateVendorDTO } from '../dtos/create-vendor.dto';
import { slugifyWithCode } from '../../../libs/slugifier/slugifier';
import { GoodsEntity } from '../entities/goods.entity';
import { CreateVendorGoodsDTO } from '../dtos/create-goods.dto';

@Injectable()
export class VendorGoodsService {

  constructor(
    @InjectRepository(GoodsEntity)
      private readonly vendorGoodsRepository: Repository<GoodsEntity>,
  ) {}



  async showAll() {
    const listGoods = await this.vendorGoodsRepository.find({
      relations: ['category', 'owned_by', 'packaged_in', 'goods_type']
    })

    return listGoods.map(goods => goods.toResponseObject())
  }

  async showAllPriceASC() {
    const listGoods = await this.vendorGoodsRepository.find({
      relations: ['category', 'owned_by', 'packaged_in', 'goods_type'],
      order: {
        price: "ASC"
      }
    })

    return listGoods.map(goods => goods.toResponseObject())
  }

  async showAllPriceDSC() {
    const listGoods = await this.vendorGoodsRepository.find({
      relations: ['category', 'owned_by', 'packaged_in', 'goods_type'],
      order: {
        price: "DESC"
      }
    }) 
    return listGoods.map(goods => goods.toResponseObject())
  }

  

  async findById(id: string) {
    const goods = await this.vendorGoodsRepository.findOne({
      where: { id },
      relations: ['category', 'owned_by', 'packaged_in', 'goods_type']
    })

    return goods.toResponseObject()
  }


  async listWhatPackageIncludedMe(id: string) {

  }



  async create(payload: Partial<CreateVendorGoodsDTO>) {
  
    if (!payload.category)
      throw new HttpException(
        "Goods individual's category must be specified.",
        HttpStatus.BAD_REQUEST
      )

    const tmpGoods = await this.vendorGoodsRepository.create({
      ...payload
    })
    console.log('created goods individual', tmpGoods)
    this.vendorGoodsRepository.save(tmpGoods)

    return tmpGoods.toResponseObject()
  }



  async update(
    id: string,
    payload: Partial<CreateVendorGoodsDTO>
  ) {

    // Check whether the project exists.
    let vendorGoods= await this.vendorGoodsRepository.findOne({ 
      where: { id }
    }) 

    if (!vendorGoods) {
      throw new HttpException(
        'Vendor individual not found!',
        HttpStatus.NOT_FOUND
      )
    }

    // UPDATE!
    await this.vendorGoodsRepository.update({ id }, payload)


    vendorGoods = await this.vendorGoodsRepository.findOne({ 
      where: { id }, 
      relations: [ 'category', 'owned_by', 'packaged_in', 'goods_type' ]
    })
    return vendorGoods.toResponseObject()
  }



  async destroy(
    id: string
  ) {
    const result = await this.vendorGoodsRepository.delete({ id })

    if (result.affected < 1) return { deleted: false }
    return { id, deleted: true }
  }

}
