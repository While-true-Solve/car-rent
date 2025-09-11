import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand, Car, District } from 'src/core';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { successRes } from 'src/infrastructure/response/successRes';
import type { BrandRepository, carRepository, DistrictRepository } from 'src/core';

@Injectable()
export class CarService extends BaseService<CreateCarDto, UpdateCarDto, Car> {
  constructor(
    @InjectRepository(Car) private readonly carRepo: carRepository,
    @InjectRepository(Brand) private readonly brandRepo: BrandRepository,
    @InjectRepository(District) private readonly districtRepo: DistrictRepository,
  ) {
    super(carRepo);
  }


  async createCar(createCarDto: CreateCarDto) {
    const brand = await this.brandRepo.findOne({where: {id: createCarDto.brand_id}})
    if (!brand) {
      throw new NotFoundException('Brand not found')
    }

    const district = await this.districtRepo.findOne({where: {id: createCarDto.district_id}})
    if (!district) {
      throw new NotFoundException('District not found')
    }

    const car = this.carRepo.create(createCarDto);

    const saveCar = await this.carRepo.save(car)

    return successRes(saveCar, 201);
  }


  async findAllCars() {
    return this.carRepo.find({ relations: ['brand', 'district'] });
  }


  async findOneCar(id: string) {
    const car = await this.carRepo.findOne({
      where: { id },
      relations: ['brand', 'district']
    });

    if (!car) throw new NotFoundException('Car not found');

    return successRes(car);
  }


  async updateCar(id: string, updateCarDto: UpdateCarDto) {
    const car = await this.carRepo.findOne({ where: { id }, relations: ['brand', 'district'] });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (updateCarDto.brand_id) {
      const brand = await this.brandRepo.findOne({ where: { id: updateCarDto.brand_id } });
      if (!brand) throw new NotFoundException('Brand not found');
      car.brand = brand;
    }

    if (updateCarDto.district_id) {
      const district = await this.districtRepo.findOne({ where: { id: updateCarDto.district_id } });
      if (!district) throw new NotFoundException('District not found');
      car.district = district;
    }


    Object.assign(car, {
      model: updateCarDto.model,
      price_daily: updateCarDto.price_daily,
      color: updateCarDto.color,
      fuelType: updateCarDto.fuelType,
    });

    const updatedCar = await this.carRepo.save(car);

    return successRes(updatedCar);
  }

  async deleteCar(id: string){
    const car = await this.carRepo.findOne({ where: { id }})
    if(!car){
      throw new NotFoundException('Car not found')
    }

    await this.carRepo.delete(car)
    
    return successRes({})
  }
}
