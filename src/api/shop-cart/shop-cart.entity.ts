import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ShopCartItemEntity } from "./shop-cart-item.entity";
import { UserEntity } from "../users/users.entity";

@Entity('shop_carts')
export class ShopCartEntity {

  @PrimaryGeneratedColumn('uuid') id: string

  @CreateDateColumn()
  time_created: string

  @UpdateDateColumn()
  time_last_edited: string

  @OneToMany(
    type => ShopCartItemEntity,
    shopcartitem => shopcartitem.shop_cart,
    {
      nullable: true,
      eager: true,
      onDelete: 'CASCADE'
    }
  )
  cart_items: ShopCartItemEntity[]

  @Column({ type: 'bigint', nullable: true })
  calculated_price: number

  @ManyToOne(
    type => UserEntity,
    owner => owner.shop_cart
  )
  owner_user: UserEntity

  @Column({type: 'boolean', default:false})
  checked_out: boolean

  @Column({type: 'boolean', default:false})
  paid: boolean

  @Column({type: 'boolean', default:false})
  expired: boolean

  @Column({type: 'timestamp without time zone', nullable:true})
  checked_out_date: Date

  @Column({type: 'json', nullable: true})
  additional_data: object

  toResponseObject() {
    return {
      id: this.id,
      time_created: this.time_created,
      time_last_edited: this.time_last_edited,
      cart_items: this.cart_items,
      checked_out: this.checked_out,
      checked_out_date: this.checked_out_date,
      calculated_price: this.calculated_price,
      paid: this.paid,
      expired: this.expired,
      owner: this.owner_user.toEssentialResponseObject(),
      additional_data: this.additional_data
    }
  }
}