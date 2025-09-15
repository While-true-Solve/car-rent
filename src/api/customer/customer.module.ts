import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/core';
import { OrderModule } from '../order/order.module';
import { WalletModule } from '../wallet/wallet.module';
import { CommentModule } from '../comment/comment.module';
import { AdopdetCarModule } from '../adopdet-car/adopdet-car.module';
import { NotificationModule } from 'src/infrastructure/notifiaction/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    NotificationModule,
    OrderModule,
    WalletModule,
    CommentModule,
    AdopdetCarModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CryptoService, TokenService],
})
export class CustomerModule {}
