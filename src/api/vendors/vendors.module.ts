import { Module } from '@nestjs/common';
import { VendorsService } from './services/vendors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './entities/vendors.entity';
import { PackageEntity } from './entities/packages.entity';
import { PackageItemEntity } from './entities/package-items.entity';
import { GoodsEntity } from './entities/goods.entity';
import { VendorsController } from './controllers/vendors.controller';
import { CategoryEntity } from '../categories/categories.entity';
import { VendorPackagesService } from './services/packages.service';
import { VendorPackageItemsService } from './services/package-items.service';
import { VendorGoodsService } from './services/goods.service';
import { VendorPackagesController } from './controllers/packages.controller';
import { VendorGoodsController } from './controllers/goods.controller';
import { VendorPackageItemsController } from './controllers/package-items.controller';
import { RatingEntity } from './entities/rating.entity';
import { RatingService } from './services/rating.service';
import { RatingController } from './controllers/rating.controller';
import { ProvinsiEntity } from './entities/provinsi.entity';
import { KotaKabupatenEntity } from './entities/kotakabupaten.entity';
import { NegaraEntity } from './entities/negara.entity';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      VendorEntity,
      PackageEntity,
      PackageItemEntity,
      GoodsEntity,
      RatingEntity,
      ProvinsiEntity,
      KotaKabupatenEntity,
      NegaraEntity
    ])
  ],
  providers: [
    VendorsService,
    VendorPackagesService,
    VendorPackageItemsService,
    VendorGoodsService,
    RatingService,
    AddressService
  ],
  controllers: [
    VendorsController,
    VendorPackagesController,
    VendorPackageItemsController,
    VendorGoodsController,
    RatingController,
    AddressController
  ]
})
export class VendorsModule {}
