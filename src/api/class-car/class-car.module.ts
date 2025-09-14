import { Module } from '@nestjs/common';
import { ClassCarService } from './class-car.service';
import { ClassCarController } from './class-car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car, Class, ClassCars, Order } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([ClassCars, Car, Class])],
  controllers: [ClassCarController],
  providers: [ClassCarService],
})
export class ClassCarModule {}
