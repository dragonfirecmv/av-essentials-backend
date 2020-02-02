import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsJSON } from "class-validator";
import { CategoryEntity } from "../../../api/categories/categories.entity";
import { SetCategory } from "../../../api/categories/dto/set-categories.dto";
import { VendorItemTypes } from "../interfaces/item-types";
import { GoodsEntity } from "../entities/goods.entity";
import { PackageItemEntity } from "../entities/package-items.entity";
import { VendorEntity } from "../entities/vendors.entity";


export class CreateVendorPackageDTO {

  @IsNotEmpty()
  readonly vendor_owner: VendorEntity

  @IsNotEmpty()
  readonly categories: CategoryEntity[]

  @IsNotEmpty()
  @IsString()
  readonly package_name: string

  @IsString()
  readonly description: string

  @IsNumber()
  @IsNotEmpty()
  readonly price_total: number

  @IsJSON()
  readonly metadata: object

  @IsNotEmpty()
  package_items: PackageItemEntity[]

}

export class UpdateVendorPackageDTO {

  @IsNotEmpty()
  readonly vendor_owner: VendorEntity

  @IsNotEmpty()
  @IsString()
  readonly package_name: string

  @IsString()
  readonly description: string

  @IsNumber()
  @IsNotEmpty()
  readonly price_total: number

  @IsJSON()
  readonly metadata: object

  @IsNotEmpty()
  readonly package_items: PackageItemEntity[]
  
}

export class UpdateVendorPackageCategoriesDTO {

  @IsNotEmpty()
  readonly categories: CategoryEntity[]
  
}