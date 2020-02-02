import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { CategoryEntity } from "../../../api/categories/categories.entity";
import { SetCategory } from "../../../api/categories/dto/set-categories.dto";
import { PackageEntity } from "./packages.entity";
import { GoodsEntity } from "./goods.entity";
import { UserEntity } from "../../../api/users/users.entity";
import { IMedia } from "../../../shared/interfaces/media.interface";
import { RatingEntity } from "./rating.entity";
import { ProvinsiEntity } from "./provinsi.entity";
import { NegaraEntity } from "./negara.entity";
import { KotaKabupatenEntity } from "./kotakabupaten.entity";


@Entity('vendors')
export class VendorEntity {

  @PrimaryGeneratedColumn('uuid') id: string

  @CreateDateColumn()
  time_created: string

  @UpdateDateColumn()
  time_last_edited: string

  @ManyToOne(
    type => UserEntity,
    owner => owner.vendors_registered,
    {
      nullable: true
    }
  )
  owned_by_who: UserEntity

  @Column({ type: 'text', unique: true })
  slug: string


  @ManyToMany(
    type => CategoryEntity, 
    categories => categories.vendors,
    {
      nullable: true
    }
  )
  @JoinTable({
    name: "vendors_categories",
    joinColumn: {
      name: "vendor_id",
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id'
    }
  })
  vendor_categories: VendorEntity[]

  @Column('text') vendor_name: string

  @Column('boolean', { default: false }) vendor_verification: boolean

  @Column('text', { nullable: true }) vendor_description: string

  @Column('text', { nullable: true }) vendor_addess: string

  @Column('text', { nullable: true }) vendor_email: string

  @Column('text', { nullable: true }) vendor_contacts: string

  @Column('json', { nullable: true }) additional_info: object

  @Column('text') vendor_localization_code: string

  @Column('text') vendor_currency_code: string

  @Column('json', { nullable: true }) vendor_logo_url: IMedia

  @Column('json', { nullable: true })
    media: IMedia[]

  @OneToMany(
    () => PackageEntity,
    packages => packages.vendor_owner
  )
  packages_to_sell: PackageEntity[]

  @OneToMany(
    () => GoodsEntity,
    indiv_items => indiv_items.owned_by
  )
  goods_items: GoodsEntity[]

  
  @OneToMany(type => RatingEntity, rating => rating.vendor, { nullable: true})
  ratings: RatingEntity[]
  
  @ManyToOne(type => NegaraEntity, negara => negara.vendors, { nullable: true })
  negara: NegaraEntity

  @ManyToOne(type => ProvinsiEntity, provinsi => provinsi.vendors, { nullable: true })
  provinsi: ProvinsiEntity

  @ManyToOne(type => KotaKabupatenEntity, kotakabupaten => kotakabupaten.vendors, { nullable: true })
  kotaKabupaten: KotaKabupatenEntity

  @Column('text', { nullable: true }) vendor_address_two: string

  toResponseObject() {

    const ownedByWho = !this.owned_by_who ? {} : {
      user_id: this.owned_by_who.id,
      givenname: this.owned_by_who.givenname,
      email: this.owned_by_who.email
    }

    return {
      id: this.id,
      slug: this.slug,
      owned_by_who: ownedByWho,
      vendor_categories: this.vendor_categories,
      vendor_name: this.vendor_name,
      vendor_description: this.vendor_description,
      vendor_addess: this.vendor_addess,
      vendor_email: this.vendor_email,
      vendor_contacts: this.vendor_contacts,
      additional_info: this.additional_info,
      vendor_localization_code: this.vendor_localization_code,
      vendor_currency_code: this.vendor_currency_code,
      packages_to_sell: this.packages_to_sell,
      goods_items: this.goods_items,
      vendor_logo_url: this.vendor_logo_url,
      media: this.media,
      negara: this.negara,
      provinsi: this.provinsi,
      kotaKabupaten: this.kotaKabupaten,
      vendor_address_two: this.vendor_address_two
    }
  }

  toLiteResponseObject() {
    return {
      id: this.id,
      slug: this.slug,
      vendor_categories: this.vendor_categories,
      vendor_name: this.vendor_name,
      vendor_description: this.vendor_description,
      vendor_addess: this.vendor_addess,
      vendor_email: this.vendor_email,
      vendor_contacts: this.vendor_contacts,
      additional_info: this.additional_info,
      vendor_localization_code: this.vendor_localization_code,
      vendor_currency_code: this.vendor_currency_code,
      vendor_logo_url: this.vendor_logo_url,
      media: this.media
    }
  }
}