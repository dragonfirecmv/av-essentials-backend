import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NegaraEntity } from "../entities/negara.entity";
import { Repository } from "typeorm";
import { ProvinsiEntity } from "../entities/provinsi.entity";
import { KotaKabupatenEntity } from "../entities/kotakabupaten.entity";
import { CreateAddressDTO } from "../dtos/address.dto";

@Injectable()
export class AddressService {

    constructor(
        @InjectRepository(NegaraEntity)
        private readonly negaraRepository: Repository<NegaraEntity>,

        @InjectRepository(ProvinsiEntity)
        private readonly provinsiRepository: Repository<ProvinsiEntity>,

        @InjectRepository(KotaKabupatenEntity)
        private readonly kotaKabupatenRepository: Repository<KotaKabupatenEntity>,
    ) {}

    // GET
    async getAllNegaras() {
        const allNegaras = await this.negaraRepository.find()
        return allNegaras.map(negara => negara.toLiteResponseObject())
    }

    async getOneNegara(negaraId: String) {
        const negara = await this.negaraRepository.findOne({
            where: {id: negaraId},
            relations: ['provinsis', 'kotaKabupatens']
        })
        return negara.toResponseObject()
    }

    async getAllProvinsis() {
        const allProvinsis = await this.provinsiRepository.find()
        return allProvinsis.map(provinsi => provinsi.toLiteResponseObject())
    }

    async getOneProvinsi(provinsiId: String) {
        const provinsi = await this.provinsiRepository.findOne({
            where: {id: provinsiId},
            relations: ['negara', 'kotaKabupatens']
        })
        return provinsi.toResponseObject()
    }

    async getAllKotaKabupatens() {
        const allKotaKabupatens = await this.kotaKabupatenRepository.find()
        return allKotaKabupatens.map(kotaKabupaten => kotaKabupaten.toLiteResponseObject())
    }

    async getOneKotaKabupaten(kotaKabupatenId: String) {
        const kotaKabupaten = await this.kotaKabupatenRepository.findOne({
            where: {id: kotaKabupatenId},
            relations: ['negara', 'provinsi']
        })
        return kotaKabupaten.toResponseObject()
    }

    async getProvinsisFromNegara(negaraId: String) {
        const negara = await this.negaraRepository.findOne({
            where: {id: negaraId},
            relations: ['provinsis', 'kotaKabupatens']
        })

        return negara.provinsis.map(provinsi => provinsi.toLiteResponseObject())
    }

    async getKabupatensFromNegara(negaraId: String) {
        const negara = await this.negaraRepository.findOne({
            where: {id: negaraId},
            relations: ['provinsis', 'kotaKabupatens']
        })

        return negara.kotaKabupatens.map(kotaKabupaten => kotaKabupaten.toLiteResponseObject())
    }

    async getKabupatensFromProvinsi(provinsiId: String) {
        const provinsi = await this.provinsiRepository.findOne({
            where: {id: provinsiId},
            relations: ['negara', 'kotaKabupatens']
        })

        return provinsi.kotaKabupatens.map(kotaKabupaten => kotaKabupaten.toLiteResponseObject())
    }


    // POST
    async createNegara(payload: Partial<CreateAddressDTO>) {
        const negara = await this.checkDoesNegaraExist(payload.name)
        if (negara) {
            throw new HttpException('Negara already exists!', HttpStatus.BAD_REQUEST)
        }

        const newNegara = await this.negaraRepository.create({...payload})
        await this.negaraRepository.save(newNegara)

        const negaraCreated = await this.checkDoesNegaraExist(payload.name)
        return negaraCreated.toLiteResponseObject()
    }

    async createProvinsi(payload: Partial<CreateAddressDTO>) {
        const provinsi = await this.checkDoesProvinsiExist(payload.name, payload.negara.id)

        if (provinsi) {
            throw new HttpException('Provinsi already exists!', HttpStatus.BAD_REQUEST)
        }

        const newProvinsi = await this.provinsiRepository.create({...payload})
        await this.provinsiRepository.save(newProvinsi)

        const provinsiCreated = await this.checkDoesProvinsiExist(payload.name, payload.negara.id)
        return provinsiCreated.toLiteResponseObject()
    }

    async createKotaKabupaten(payload: Partial<CreateAddressDTO>) {
        const kotaKabupaten = await this.checkDoesKotaKabupatenExist(payload.name, payload.provinsi.id)

        if (kotaKabupaten) {
            throw new HttpException('Kota Kabupaten already exists!', HttpStatus.BAD_REQUEST)
        }

        const provinsi = await this.provinsiRepository.findOne({
            where: {id: payload.provinsi.id},
            relations: ['negara']
        })

        const newKotaKabupaten = await this.kotaKabupatenRepository.create({
            ...payload,
            negara: provinsi.negara
        })

        await this.kotaKabupatenRepository.save(newKotaKabupaten)

        const kotaKabupatenCreated = await this.checkDoesKotaKabupatenExist(payload.name, payload.provinsi.id)

        return kotaKabupatenCreated.toLiteResponseObject()
    }

    // check if exists
    async checkDoesNegaraExist(negaraName: String) {
        const negara = this.negaraRepository.findOne({
            where: {name: negaraName}
        })

        return negara
    }

    async checkDoesProvinsiExist(
        provinsiName: String, negaraId: String
    ) {
        const negara = this.provinsiRepository.findOne({
            where: {name: provinsiName, negara: {id: negaraId}}
        })

        return negara
    }

    async checkDoesKotaKabupatenExist(
        kotaKabupatenName: String, provinsiId: String
    ) {
        const negara = this.kotaKabupatenRepository.findOne({
            where: {name: kotaKabupatenName, provinsi: {id: provinsiId}}
        })

        return negara
    }

    // handle unauthorized
    async unAuthorizedOnlyAdmin() {
        throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED) 
    }


}