import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsJSON } from "class-validator";
import { CategoryEntity } from "../../../api/categories/categories.entity";
import { SetCategory } from "../../../api/categories/dto/set-categories.dto";
import { VendorItemTypes } from "../interfaces/item-types";
import { PackageItemEntity } from "../entities/package-items.entity";
import { VendorEntity } from "../entities/vendors.entity";


export class CreateVendorGoodsDTO {

  @IsNotEmpty()
  readonly category: CategoryEntity

  @IsString()
  readonly main_label: string

  @IsString()
  readonly description: string

  @IsString()
  @IsNotEmpty()
  readonly goods_type: CategoryEntity

  @IsBoolean()
  readonly only_buy_with_packet: boolean

  @IsNumber()
  readonly price: number

  @IsJSON()
  readonly additional_info: object

}

export class UpdateVendorGoodsDTO 
extends CreateVendorGoodsDTO {

  readonly packaged_in: PackageItemEntity[]
  
}