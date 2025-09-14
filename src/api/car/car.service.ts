import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand, Car, District, Order } from 'src/core';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { successRes } from 'src/infrastructure/response/successRes';
import type {
  BrandRepository,
  carRepository,
  DistrictRepository,
} from 'src/core';
import type { orderRepository } from 'src/core/repository/order.repository';
import { OrderStatus } from 'src/common/enum/order-status-enum';

@Injectable()
export class CarService extends BaseService<CreateCarDto, UpdateCarDto, Car> {
  constructor(
    @InjectRepository(Car) private readonly carRepo: carRepository,
    @InjectRepository(Brand) private readonly brandRepo: BrandRepository,
    @InjectRepository(District)
    private readonly districtRepo: DistrictRepository,
    @InjectRepository(Order) private readonly orderRepo: orderRepository,
  ) {
    super(carRepo);
  }

  async createCar(createCarDto: CreateCarDto) {
    const brand = await this.brandRepo.findOne({
      where: { id: createCarDto.brand_id },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const district = await this.districtRepo.findOne({
      where: { id: createCarDto.district_id },
    });
    if (!district) {
      throw new NotFoundException('District not found');
    }

    const car = this.carRepo.create(createCarDto);
    car.brand = brand;
    car.district = district;
    const saveCar = await this.carRepo.save(car);

    return successRes(saveCar, 201);
  }

  async updateCar(id: string, updateCarDto: UpdateCarDto) {
    const car = await this.carRepo.findOne({
      where: { id },
      relations: ['brand', 'district'],
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (updateCarDto.brand_id) {
      const brand = await this.brandRepo.findOne({
        where: { id: updateCarDto.brand_id },
      });
      if (!brand) throw new NotFoundException('Brand not found');
      car.brand = brand;
    }

    if (updateCarDto.district_id) {
      const district = await this.districtRepo.findOne({
        where: { id: updateCarDto.district_id },
      });
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

  async deleteCar(id: string) {
    const car = await this.carRepo.findOne({ where: { id } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const today = new Date().toISOString().split('T')[0];

    const activeOrder = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoin('order.car', 'car')
      .where('car.id = :carId', { carId: id })
      .andWhere('order.finish_time >= :today AND order.status = :status', {
        today,
        status: OrderStatus.ACTIVE,
      })
      .getOne();

    if (activeOrder) {
      throw new BadRequestException(
        'This car cannot be deleted because it is currently rented.',
      );
    }

    await this.carRepo.remove(car);

    return successRes({});
  }
}
