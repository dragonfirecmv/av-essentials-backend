import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { type } from "os";
import { ProvinsiEntity } from "./provinsi.entity";
import { KotaKabupatenEntity } from "./kotakabupaten.entity";
import { VendorEntity } from "./vendors.entity";

@Entity('vendor_negara')
export class NegaraEntity {
    @PrimaryGeneratedColumn('uuid') id: String

    @Column()
    name: String

    @OneToMany(type => ProvinsiEntity, provinsi => provinsi.negara)
    provinsis: ProvinsiEntity[]

    @OneToMany(type => KotaKabupatenEntity, kotaKabupaten => kotaKabupaten.negara)
    kotaKabupatens: KotaKabupatenEntity[]

    @OneToMany(type => VendorEntity, vendor => vendor.negara)
    vendors: VendorEntity[]

    toLiteResponseObject() {
        return {
            id: this.id,
            name: this.name
        }
    }

    toResponseObject() {
        return {
            id: this.id,
            name: this.name,
            provinsi: this.provinsis,
            kotaKabupaten: this.kotaKabupatens
        }
    }

    getAllProvinsis(): any {
        return {
            provinsi: this.provinsis
        }
    }

    getAllKotaKabupatens(): any {
        return {
            provinsi: this.kotaKabupatens
        }
    }

    getAllVendors(): any {
        return {
            vendors: this.vendors
        }
    }

}