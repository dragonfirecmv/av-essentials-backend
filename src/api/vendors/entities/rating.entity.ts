import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "../../../api/users/users.entity";
import { VendorEntity } from "./vendors.entity";


@Entity('vendor_ratings')
export class RatingEntity {

    @PrimaryGeneratedColumn('uuid') id: string

    @Column('int')
    rating: number

    @ManyToOne(type => UserEntity, user => user.given_ratings)
    user: UserEntity

    @ManyToOne(type => VendorEntity, vendor => vendor.ratings)
    vendor: VendorEntity


    toResponseObject() {
        return {
            id: this.id,
            rating: this.rating,
            giving_user: {
                user_id: this.user.id,
                givenname: this.user.givenname,
                email: this.user.email
            },
            vendor_given: {
                vendor_id: this.vendor.id,
                vendor_name: this.vendor.vendor_name,
                vendor_email: this.vendor.vendor_email
            }
        }
    }

    toResponseObjectForVendor() {
        return {
            id: this.id,
            rating: this.rating,
            giving_user: {
                user_id: this.user.id,
                givenname: this.user.givenname,
                email: this.user.email
            },   
        }
    }

}