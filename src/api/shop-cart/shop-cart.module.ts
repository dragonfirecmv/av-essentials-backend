import { Module } from '@nestjs/common';
import { ShopCartController } from './shop-cart.controller';
import { ShopCartService } from './shop-cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopCartEntity } from './shop-cart.entity';
import { ShopCartItemEntity } from './shop-cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShopCartEntity,
      ShopCartItemEntity
    ])
  ],
  controllers: [ShopCartController],
  providers: [ShopCartService]
})
export class ShopCartModule {}
