import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { ProvinsiEntity } from "./provinsi.entity";
import { NegaraEntity } from "./negara.entity";
import { VendorEntity } from "./vendors.entity";

@Entity('vendor_kota_kabupaten')
export class KotaKabupatenEntity {
    
    @PrimaryGeneratedColumn('uuid') id: String

    @Column()
    name: String

    @ManyToOne(type => NegaraEntity, negara => negara.kotaKabupatens)
    negara: NegaraEntity

    @ManyToOne(type => ProvinsiEntity, provinsi => provinsi.kotaKabupatens)
    provinsi: ProvinsiEntity

    @OneToMany(type => VendorEntity, vendor => vendor.kotaKabupaten)
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
            negara: {
                id: this.negara.id,
                name: this.negara.id
            },
            provinsi: {
                id: this.provinsi.id,
                name: this.provinsi.name
            }
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

    getProvinsi() {
        return {
            provinsi: {
                id: this.provinsi.id,
                name: this.provinsi.name
            }
        }
    }

    getAllVendors(): any {
        return {
            vendors: this.vendors
        }
    }
}