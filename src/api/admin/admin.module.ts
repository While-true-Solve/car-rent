import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '../../core';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.register({ global: true }),
  ],
  controllers: [AdminController],
  providers: [AdminService, CryptoService, TokenService],
})
export class AdminModule {}
