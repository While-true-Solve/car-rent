import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { RegionService } from '../region/region.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from 'src/core';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [TypeOrmModule.forFeature([District]), RegionModule],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
