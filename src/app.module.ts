import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './api/projects/projects.module'
import { CategoriesModule } from './api/categories/categories.module';
import { VendorsModule } from './api/vendors/vendors.module';
import { ProfilesModule } from './api/profiles/profiles.module';
import { AccountTypesModule } from './api/account-types/account-types.module';
import { FileBucketsModule } from './api/file-buckets/file-buckets.module';
import { ShopCartModule } from './api/shop-cart/shop-cart.module';
import multer = require('multer');



@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "postgres",
      "host": process.env.GAE_APPLICATION ? "/cloudsql/artz-backend:asia-northeast2:cloud-dbpg-artz" : "127.0.0.1",
      "port": 5432,
      // "port": process.env.GAE_APPLICATION ? 5432 : 1234,
      "username": "postgres",
      // "password": process.env.GAE_APPLICATION ? "Zakytoroaray3#" : "vendor19_forAll",
      "password": "Zakytoroaray3#",
      // "database": process.env.GAE_APPLICATION ? "dbdisponsorin" : "postgres",
      "database": "dbdisponsorin",


      // db test
      // "password": "vendor19_forAll",
      // "database": "postgres", 
      "entities": [__dirname + '/**/*.entity{.ts,.js}'],
      "synchronize": true,
      "dropSchema": false,
      "logging": true
    }),
    MulterModule.register({
      storage: multer.memoryStorage,
      limits: {
        fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
      },
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    // AccountTypesModule,
    CategoriesModule,  
    ProjectsModule,
    VendorsModule,
    FileBucketsModule,
    ShopCartModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpErrorFilter
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor
    // }
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
