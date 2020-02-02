import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany, OneToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { IsEmail } from 'class-validator'
import { ProjectEntity } from "../projects/projects.entity";
import { ProfileEntity } from "../profiles/profiles.entity";
import { IUserModel } from './interface/user-model.interface';
import { VendorEntity } from '../vendors/entities/vendors.entity';
import { ShopCartEntity } from "../shop-cart/shop-cart.entity";
import { type } from "os";
import { RatingEntity } from "../vendors/entities/rating.entity";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string
  
  @CreateDateColumn() created: string

  @UpdateDateColumn() time_last_edited: string

  @Column('boolean') verified: boolean
  @Column('boolean') staff: boolean
  @Column('boolean') admin: boolean

  // User profile that accompanies the user entity.
  @OneToOne(
    type => ProfileEntity, 
    profile => profile.connected_user,
    { 
      onDelete: "CASCADE",
      eager: true
    })
  @JoinColumn() profile: ProfileEntity

  @Column({  
    type: 'text',  
    unique: true 
  })
  @IsEmail() email: string

  @Column('text') givenname: string

  @Column('text') password_hash: string


  // Projects, vendor, ...
  @OneToMany(
    type => VendorEntity,
    vendors => vendors.owned_by_who
  )
  vendors_registered: VendorEntity[]
  
  @OneToMany(
    () => ProjectEntity, 
    project => project.creator
  ) 
  projects: ProjectEntity[]

  // User profile that accompanies the user entity.
  @OneToOne(
    type => ShopCartEntity, 
    shopcart => shopcart.owner_user,
    { 
      onDelete: "CASCADE",
      eager: true
    })
  shop_cart: ShopCartEntity

  @OneToMany(type => RatingEntity, rating => rating.user)
  given_ratings: RatingEntity[]
  

    
  // Method to pack the returned data nicely.
  
  toLiteResponseObject(): Partial<IUserModel> {
    const { email, givenname, projects } = this
    return { email, givenname, projects } 
  }

  toEssentialResponseObject(): Partial<IUserModel> {
    const { id, email, verified, givenname } = this
    return { id, email, verified, givenname } 
  }

  toFullResponseObject(): IUserModel {
    const { id, created, verified, staff, admin, email, givenname, projects, vendors_registered, profile } = this
    return { id, created, verified, staff, admin, email, givenname, projects, vendors_registered, profile }
  }

}