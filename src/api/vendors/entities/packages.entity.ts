import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { PackageItemEntity } from "./package-items.entity";
import { CategoryEntity } from "../../../api/categories/categories.entity";
import { VendorEntity } from "./vendors.entity";
import { IMedia } from "../../../shared/interfaces/media.interface";
import { safe } from "../../../libs/helper/safeObjects";
import { ShopCartItemEntity } from "../../../api/shop-cart/shop-cart-item.entity";


@Entity('vendor_packages')
export class PackageEntity {

  @PrimaryGeneratedColumn('uuid') id: string

  @ManyToOne(
    () => VendorEntity,
    vendor => vendor.packages_to_sell,
    {
      onDelete: "CASCADE"
    }
  )
  vendor_owner: VendorEntity

  @Column('text') package_name: string

  @Column('text', { nullable: true }) description: string

  @ManyToMany(type => CategoryEntity)
  @JoinTable({
    name: "vendor_packages_categories_categories",
    joinColumn: {
      name: "package_id",
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id'
    }
  })
  categories: CategoryEntity[]

  @OneToMany(
    type => PackageItemEntity,
    packageItem => packageItem.packaged_on,
    {
      nullable: true
    }
  )
  package_items: PackageItemEntity[]

  @Column('bigint')
  price_total: number

  @Column('text', { nullable: true })
  min_order_details

  @Column('bigint', { nullable: true })
  min_order_price

  @Column('json', { nullable: true })
  metadata: object

  @Column('json', { nullable: true })
  media: IMedia[]



  @OneToMany(
    type => ShopCartItemEntity,
    shopcartitem => shopcartitem.item_from_goods,
    { nullable: true }
  )
  connected_shopcartitem: ShopCartItemEntity[]


  toResponseObject() {
    let listPackageItems = safe(this.package_items, 'EMPTY').$

    if (listPackageItems !== 'EMPTY') {
      listPackageItems = listPackageItems.map(packaged => {
        return {
          id: packaged.id,
          selected_item: packaged.selected_item,
          quantity: packaged.quantity
        }
      })
    }

    return {
      id: this.id,
      vendor_owner: {
        id: this.vendor_owner.id,
        slug: this.vendor_owner.slug,
        vendor_name: this.vendor_owner.vendor_name,
        vendor_localization_code: this.vendor_owner.vendor_localization_code,
        vendor_currency_code: this.vendor_owner.vendor_currency_code
      },
      package_name: this.package_name,
      description: this.description,
      categories: this.categories,
      package_items: listPackageItems,
      price_total: this.price_total,
      metadata: this.metadata,
      media: this.media
    }
  }
}
