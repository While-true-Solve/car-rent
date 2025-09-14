import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { PenaltyModule } from './penalty/penalty.module';
import { ClassModule } from './class/class.module';
import { ClassCarModule } from './class-car/class-car.module';
import { BrandModule } from './brand/brand.module';
import { RegionModule } from './region/region.module';
import { DistrictModule } from './district/district.module';
import { CarModule } from './car/car.module';
import { CommentModule } from './comment/comment.module';
import { AdopdetCarModule } from './adopdet-car/adopdet-car.module';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentModule } from './payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';

const { url, sync } = config.DB;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: url,
      synchronize: sync,
      autoLoadEntities: true,
      entities: ['dist/core/entity/*.entity{.ts,.js}'],
    }),
    AdminModule,
    PaymentModule,
    ClassModule,
    ClassCarModule,
    BrandModule,
    RegionModule,
    DistrictModule,
    CarModule,
    CommentModule,
    AdopdetCarModule,
    OrderModule,
    CustomerModule,
    WalletModule,
    PenaltyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
