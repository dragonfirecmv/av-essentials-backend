import { Controller, Get, Post, UseGuards, Param, Body } from "@nestjs/common";
import { AddressService } from "../services/address.service";
import { UserEntity } from "../../../api/users/users.entity";
import { CreateAddressDTO } from "../dtos/address.dto";
import { User } from "../../../api/users/decorator/users.decorator";
import { AuthGuard } from "@nestjs/passport";

@Controller('api/address')
export class AddressController {

    constructor(
        private readonly addressService: AddressService
      ) {}

    @Get('negara')
    getAllNegaras() {
        return this.addressService.getAllNegaras()
    }

    @Get('negara/:negaraId')
    getOneNegara(
        @Param('negaraId') negaraId: String
    ) {
        return this.addressService.getOneNegara(negaraId)
    }

    @Get('provinsi/:provinsiId')
    getOneProvinsi(
        @Param('provinsiId') provinsiId: String
    ) {
       return this.addressService.getOneProvinsi(provinsiId) 
    }

    @Get('kota-kabupaten/:kotaKabupatenId')
    getOneKotaKabupaten(
        @Param('kotaKabupatenId') kotaKabupatenId: String
    ) {
        return this.addressService.getOneKotaKabupaten(kotaKabupatenId)
    }

    @Get('provinsi')
    getAllProvinsis() {
        return this.addressService.getAllProvinsis()
    }

    @Get('kota-kabupaten')
    getAllKabupatenKotas(){
        return this.addressService.getAllKotaKabupatens()
    }

    @Get('provinsi-by-negara/:negaraId')
    getProvinsisByNegara(
        @Param('negaraId') negaraId: String
    ) {
        return this.addressService.getProvinsisFromNegara(negaraId)
    }

    @Get('kotaKabupaten-by-negara/:negaraId')
    getKotaKabupatensByNegara(
        @Param('negaraId') negaraId: String
    ) {
        return this.addressService.getKabupatensFromNegara(negaraId)
    }

    @Get('kotaKabupaten-by-provinsi/:provinsiId')
    getKotaKabupatensByProvinsi(
        @Param('provinsiId') provinsiId: String
    ) {
        return this.addressService.getKabupatensFromProvinsi(provinsiId)
    }


    @Post('negara')
    @UseGuards(AuthGuard('jwt'))
    createNegara(
        @User() user: UserEntity,
        @Body() payload: CreateAddressDTO
    ) {
        if (user.admin) {
            return this.addressService.createNegara(payload)
        }
        return this.addressService.unAuthorizedOnlyAdmin()
    }

    @Post('provinsi')
    @UseGuards(AuthGuard('jwt'))
    createProvinsi(
        @User() user: UserEntity,
        @Body() payload: CreateAddressDTO
    ) {
        if (user.admin) {
            return this.addressService.createProvinsi(payload)
        }
        return this.addressService.unAuthorizedOnlyAdmin()
    }

    @Post('kota-kabupaten')
    @UseGuards(AuthGuard('jwt'))
    createKotaKabupaten(
        @User() user: UserEntity,
        @Body() payload: CreateAddressDTO
    ) {
        if (user.admin) {
            return this.addressService.createKotaKabupaten(payload)
        }
        return this.addressService.unAuthorizedOnlyAdmin()
    }
    
}