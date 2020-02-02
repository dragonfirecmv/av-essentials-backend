import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsJSON } from "class-validator";
import { CategoryEntity } from "../../../api/categories/categories.entity";
import { SetCategory } from "../../../api/categories/dto/set-categories.dto";
import { VendorItemTypes } from "../interfaces/item-types";
import { GoodsEntity } from "../entities/goods.entity";
import { PackageEntity } from "../entities/packages.entity";


export class CreateVendorPackageItemDTO {

  @IsNotEmpty()
  readonly packaged_on: PackageEntity

  @IsNotEmpty()
  readonly selected_item: GoodsEntity

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number

}