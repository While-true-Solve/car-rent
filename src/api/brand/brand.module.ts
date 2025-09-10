import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Brand, Car } from 'src/core';
import { CarModule } from '../car/car.module';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), CarModule],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
