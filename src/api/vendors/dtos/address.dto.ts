import { IsNotEmpty, IsString } from "class-validator";
import { ProvinsiEntity } from "../entities/provinsi.entity";
import { NegaraEntity } from "../entities/negara.entity";

export class CreateAddressDTO {

    @IsNotEmpty()
    @IsString()
    readonly name: String

    @IsNotEmpty()
    readonly negara: NegaraEntity

    @IsNotEmpty()
    readonly provinsi: ProvinsiEntity
}