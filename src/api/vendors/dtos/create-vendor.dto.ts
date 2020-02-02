import { IsString, IsNotEmpty, IsJSON } from "class-validator";
import { CategoryEntity } from "../../../api/categories/categories.entity";
import { SetCategory } from "../../../api/categories/dto/set-categories.dto";
import { NegaraEntity } from "../entities/negara.entity";
import { ProvinsiEntity } from "../entities/provinsi.entity";
import { KotaKabupatenEntity } from "../entities/kotakabupaten.entity";


export class CreateVendorDTO {

  @IsString()
  @IsNotEmpty()
  readonly slug: string

  @IsString()
  @IsNotEmpty()
  readonly vendor_name: string

  @IsNotEmpty()
  readonly vendor_categories: SetCategory[]

  @IsString()
  readonly vendor_description

  @IsString()
  readonly vendor_addess

  @IsString()
  @IsNotEmpty()
  readonly vendor_email

  @IsString()
  readonly vendor_contacts

  @IsString()
  readonly additional_info

  @IsNotEmpty()
  readonly negara: NegaraEntity

  @IsNotEmpty()
  readonly provinsi: ProvinsiEntity

  @IsNotEmpty()
  readonly kotaKabupaten: KotaKabupatenEntity

  @IsString()
  readonly vendor_address_two
}