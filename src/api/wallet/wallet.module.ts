import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, Wallet } from 'src/core';

@Module({
  imports:[TypeOrmModule.forFeature([Wallet,Customer])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
