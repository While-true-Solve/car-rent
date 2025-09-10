import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand, Car, District } from 'src/core';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { successRes } from 'src/infrastructure/response/successRes';
import { DistrictService } from '../district/district.service';
import { BrandService } from '../brand/brand.service';
import type{ carRepository } from 'src/core';

@Injectable()
export class CarService extends BaseService<CreateCarDto, UpdateCarDto, Car> {
  constructor(
    @InjectRepository(Car) private readonly carRepo: carRepository,
private readonly brandRepo: BrandService,
 private readonly districtRepo:DistrictService
  ){
    super(carRepo);
  }

  async createCar(createCarDto: CreateCarDto) {
    const brand = await this.brandRepo.findOne(createCarDto.brand_id)
    if(!brand) {
      throw new NotFoundException('Brand not found')
    }

    const district = await this.districtRepo.findOne(createCarDto.district_id)
    if(!district){
      throw new NotFoundException('District not found')
    }

    const car = this.carRepo.create(createCarDto);

    const saveCar = await this.carRepo.save(car)

    return successRes(saveCar, 201);
  }

  

  // findAll() {
  //   return `This action returns all car`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} car`;
  // }

  // update(id: number, updateCarDto: UpdateCarDto) {
  //   return `This action updates a #${id} car`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} car`;
  // }
}
