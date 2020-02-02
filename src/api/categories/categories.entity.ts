import {Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn, OneToMany, ManyToMany} from "typeorm";
import { ICategory } from "./interfaces/categories.interface";
import { ProjectEntity } from "../projects/projects.entity";
import { PackageEntity } from "../vendors/entities/packages.entity";
import { GoodsEntity } from "../vendors/entities/goods.entity";
import { IMedia } from "../../shared/interfaces/media.interface";
import { VendorEntity } from "../vendors/entities/vendors.entity";


@Tree("closure-table")
@Entity('categories')
export class CategoryEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  slug: string

  @Column()
  name: string;

  @Column('json', { nullable: true })
  media: IMedia[]

  @TreeChildren()
  children: CategoryEntity[];

  @TreeParent()
  parent: CategoryEntity;

  @OneToMany(
    () => ProjectEntity,
    project => project.category
  )
  projects: ProjectEntity[]

  @OneToMany(
    type => GoodsEntity,
    individual => individual.category
  )
  goods: GoodsEntity[]

  @OneToMany(
    type => GoodsEntity,
    individual => individual.category
  )
  goodstypes: GoodsEntity[]

  @ManyToMany(
    type => VendorEntity, 
    vendor => vendor.vendor_categories,
    { cascade: true, nullable: true }
  )
  vendors: VendorEntity[]

  toResponseObject(): ICategory {
    return {
      id: this.id,
      name: this.name,
      media: this.media,
      children: this.children,
      parent: this.parent
    }
  }

  getVendorList(): any {
    return this.vendors
  }
}