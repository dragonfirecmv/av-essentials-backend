import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ProfileEntity } from "../profiles/profiles.entity";

@Entity('account_types')
export class AccountTypeEntity {

  @PrimaryGeneratedColumn('uuid') id: string

  // @OneToMany(
  //   type => ProfileEntity, 
  //   profile => profile.account_type
  // ) profiles: ProfileEntity

  @Column('text') type_name: string
}