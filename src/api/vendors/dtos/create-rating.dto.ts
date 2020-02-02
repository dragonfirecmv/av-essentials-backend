import { IsNumber, IsString, IsNotEmpty } from "class-validator";
import { VendorEntity } from "../entities/vendors.entity";

export class CreateRatingDTO {
    
    @IsNumber()
    @IsNotEmpty()
    readonly rating: number

    @IsString()
    @IsNotEmpty()
    readonly vendor: VendorEntity

}