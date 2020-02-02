import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { GoodsEntity } from "./goods.entity";
import { PackageEntity } from "./packages.entity";


@Entity('vendor_package_items')
export class PackageItemEntity {

  @PrimaryGeneratedColumn('uuid') id: string

  @ManyToOne(
    type => PackageEntity,
    packaged => packaged.package_items, 
    {
      eager: true
    }
  )
  packaged_on: PackageEntity
    
  @ManyToOne(
    type => GoodsEntity,
    individual => individual.packaged_in, 
    {
      onDelete: "CASCADE",
      eager: true
    })
  selected_item: GoodsEntity

  @Column('int') quantity: number



  toResponseObject() {

    return {
      id: this.id,
      packaged_on: this.packaged_on,
      selected_item: this.selected_item,
      quantity: this.quantity
    }
  }
}