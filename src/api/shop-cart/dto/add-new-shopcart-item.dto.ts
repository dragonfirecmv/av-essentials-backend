import { IsNotEmpty, IsString, IsUrl, IsJSON } from "class-validator";
import { PackageEntity } from "../../vendors/entities/packages.entity";
import { GoodsEntity } from "../../../api/vendors/entities/goods.entity";


export class AddNewShopcartItemDTO {

  readonly item_from_packages: PackageEntity

  readonly item_from_goods: GoodsEntity

  @IsJSON()
  readonly buy_configuration: object

  @IsNotEmpty()
  readonly total_price

  @IsString()
  readonly additional_notes: string

  readonly quantity
}