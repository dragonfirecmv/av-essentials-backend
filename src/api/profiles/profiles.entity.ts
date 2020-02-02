import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from "typeorm";
import { AccountTypeEntity } from "../account-types/account-types.entity";
import { UserEntity } from "../users/users.entity";


@Entity('profiles')
export class ProfileEntity {

  @PrimaryGeneratedColumn('uuid') id: string

  @OneToOne(
    type => UserEntity,
    user => user.profile
  )
  connected_user: UserEntity

  // @ManyToOne(
  //   type => AccountTypeEntity,
  //   account_type => account_type.type_name
  // )
  //   account_type: AccountTypeEntity

  @Column('text', { nullable: true }) display_picture_url: string

  @Column('text', { nullable: true }) about_me: string

  @Column('text', { nullable: true }) location: string

  @Column('text', { nullable: true }) website: string

  toResponseObject() {
    return {
      id: this.id,
      connected_user: {
        user_id: this.connected_user.id,
        givenname: this.connected_user.givenname,
        email: this.connected_user.email,
        verified: this.connected_user.verified
      },
      display_picture_url: this.display_picture_url,
      about_me: this.about_me,
      location: this.location,
      website: this.website
    }
  }
}