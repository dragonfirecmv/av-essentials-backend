import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from "typeorm";
import { ShopCartEntity } from "../shop-cart/shop-cart.entity";
import { PackageEntity } from "../vendors/entities/packages.entity";
import { GoodsEntity } from "../vendors/entities/goods.entity";

@Entity('shop_cart_items')
export class ShopCartItemEntity {

  @PrimaryGeneratedColumn('uuid') id: string

  @ManyToOne(
    type => ShopCartEntity,
    shopcart => shopcart.cart_items
  )
  shop_cart: ShopCartEntity

  @ManyToOne(
    () => PackageEntity,
    packages => packages.connected_shopcartitem,
    { nullable: true, eager: true }
  )
  item_from_packages: PackageEntity

  @ManyToOne(
    () => GoodsEntity,
    indiv_items => indiv_items.connected_shopcartitem,
    { nullable: true, eager: true }
  )
  item_from_goods: GoodsEntity

  @Column('json', { nullable: true })
  buy_configuration: object

  @Column('bigint')
  total_price: number

  @Column('text')
  additional_notes: string

  @Column('int')
  quantity

  toResponseObject() {
    return {
      id: this.id,
      shop_cart: this.shop_cart,
      item_from_packages: this.item_from_packages,
      item_from_goods: this.item_from_goods,
      buy_configuration: this.buy_configuration,
      total_price: this.total_price,
      quantity: this.quantity,
      additional_notes: this.additional_notes,
    }
  }

}