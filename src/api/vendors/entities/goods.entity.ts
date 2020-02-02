import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { PackageItemEntity } from "./package-items.entity";
import { CategoryEntity } from "../../../api/categories/categories.entity";
import { VendorItemTypes } from "../interfaces/item-types";
import { VendorEntity } from "./vendors.entity";
import { IMedia } from "../../../shared/interfaces/media.interface";
import { ShopCartItemEntity } from "../../../api/shop-cart/shop-cart-item.entity";


@Entity('vendor_goods')
export class GoodsEntity {

  @PrimaryGeneratedColumn('uuid') id: string

  @ManyToOne(
    () => VendorEntity,
    vendor => vendor.goods_items,
    {
      onDelete: "CASCADE"
    }
  )
  owned_by: VendorEntity

  @OneToMany(
    type => PackageItemEntity,
    packageItem => packageItem.selected_item
  )
  packaged_in: PackageItemEntity[]

  @ManyToOne(
    type => CategoryEntity,
    category => category.goods
  )
  category: CategoryEntity

  @Column('text')
  main_label: string

  @Column('text')
  description: string

  @ManyToOne(
    type => CategoryEntity,
    cattype => cattype.goodstypes
  )
  goods_type: CategoryEntity

  @Column('boolean')
  only_buy_with_packet: boolean

  @Column('bigint')
  price: number

  @Column('text', { nullable: true })
  min_order_details

  @Column('bigint', { nullable: true })
  min_order_price

  @Column('json', { nullable: true })
  additional_info: object

  @Column('json', { nullable: true })
  media: IMedia[]


  @OneToMany(
    type => ShopCartItemEntity,
    shopcartitem => shopcartitem.item_from_goods,
    { nullable: true }
  )
  connected_shopcartitem: ShopCartItemEntity[]


  toResponseObject() {

    const filterToPackageIn = this.packaged_in && this.packaged_in.map(packageItem => packageItem.packaged_on) || []
    const listPackageIn = filterToPackageIn && filterToPackageIn.filter((packaged, index, self) => {
      return index === self.findIndex(pkg => (pkg.id === packaged.id))
    }) || []

    return {
      id: this.id,
      owned_by: {
        id: this.owned_by.id,
        slug: this.owned_by.slug,
        vendor_name: this.owned_by.vendor_name,
        vendor_localization_code: this.owned_by.vendor_localization_code,
        vendor_currency_code: this.owned_by.vendor_currency_code
      },
      packaged_in: listPackageIn,
      category: this.category,
      main_label: this.main_label,
      description: this.description,
      goods_type: this.goods_type,
      only_buy_with_packet: this.only_buy_with_packet,
      price: this.price,
      min_order_price: this.min_order_price,
      min_order_details: this.min_order_details,
      additional_info: this.additional_info,
      media: this.media
    }
  }
}