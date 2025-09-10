import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, Car, District } from 'src/core';
import { BrandModule } from '../brand/brand.module';
import { DistrictModule } from '../district/district.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car, District]), BrandModule, DistrictModule],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService]
})
export class CarModule {}

