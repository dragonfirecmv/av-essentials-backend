import { Entity, Tree, PrimaryGeneratedColumn, Column, TreeChildren, ManyToOne, OneToMany } from "typeorm";
import { KotaKabupatenEntity } from "./kotakabupaten.entity";
import { type } from "os";
import { NegaraEntity } from "./negara.entity";
import { VendorEntity } from "./vendors.entity";

@Entity('vendor_provinsi')
export class ProvinsiEntity {

    @PrimaryGeneratedColumn('uuid') id: String

    @Column()
    name: String

    @ManyToOne(type => NegaraEntity, negara => negara.provinsis)
    negara: NegaraEntity

    @OneToMany(type => KotaKabupatenEntity, kotaKabupaten => kotaKabupaten.provinsi)
    kotaKabupatens: KotaKabupatenEntity[]

    @OneToMany(type => VendorEntity, vendor => vendor.provinsi)
    vendors: VendorEntity[]

    toLiteResponseObject() {
        return {
            id: this.id,
            name: this.name,
        }
    }

    toResponseObject() {
        return {
            id: this.id,
            name: this.name,
            negara: {
                id: this.negara.id,
                name: this.negara.name
            },
            kotaKabupaten: this.kotaKabupatens
        }
    }

    getNegara() {
        return {
            negara: {
                id: this.negara.id,
                name: this.negara.name
            }
        }
    }

    getKotaKabupatens() {
        return {
            kabupaten: this.kotaKabupatens
        }
    }

    getAllVendors(): any {
        return {
            vendors: this.vendors
        }
    }

}