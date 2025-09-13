import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdopdetCarDto } from './dto/create-adopdet-car.dto';
import { UpdateAdopdetCarDto } from './dto/update-adopdet-car.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { InjectRepository } from '@nestjs/typeorm';

import {
  AdoptedCar,
  Car,
  Customer,
  Order,
  type adopted_carRepository,
  type carRepository,
  type CustomerRepository,
} from 'src/core';
import { successRes } from 'src/infrastructure/response/successRes';
import type { orderRepository } from 'src/core/repository/order.repository';

@Injectable()
export class AdopdetCarService extends BaseService<
  CreateAdopdetCarDto,
  UpdateAdopdetCarDto,
  AdoptedCar
> {
  constructor(
    @InjectRepository(AdoptedCar)
    private readonly adopdet_carRepo: adopted_carRepository,

    @InjectRepository(Customer)
    private readonly customerRepo: CustomerRepository,

    @InjectRepository(Car) private readonly carRepo: carRepository,

    @InjectRepository(Order) private readonly orderRepo: orderRepository,
  ) {
    super(adopdet_carRepo);
  }

  async createAdoped(createAdopdetCarDto: CreateAdopdetCarDto) {
    const today = new Date().toISOString().split('T')[0];

    if (createAdopdetCarDto.adopted_date > today) {
      throw new BadRequestException('Adopted date cannot be in the future');
    }

    // const customer = await this.customerRepo.findOne({ where: { id: createAdopdetCarDto.customer_id } })
    // if (!customer) {
    //   throw new NotFoundException('Customer not found')
    // }

    const car = await this.carRepo.findOne({
      where: { id: createAdopdetCarDto.car_id },
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    // Duplicate tekshiruv (agar bir mashina bir nechta adopt qilinmasligi kerak bo‘lsa):
    const existingAdopt = await this.adopdet_carRepo.findOne({
      where: { car: { id: createAdopdetCarDto.car_id } },
    });
    if (existingAdopt) {
      throw new BadRequestException('This car has already been adopted');
    }

    const newAdopdet = this.adopdet_carRepo.create({
      adopted_date: createAdopdetCarDto.adopted_date,
      is_adopted: createAdopdetCarDto.is_adopted ?? true,
      // customer,
      car,
    });
    await this.adopdet_carRepo.save(newAdopdet);

    return successRes(newAdopdet, 201);
  }

  async updateAdopdet_car(
    id: string,
    updateAdopdetCarDto: UpdateAdopdetCarDto,
  ) {
    const adopdet = await this.adopdet_carRepo.findOne({ where: { id } });
    if (!adopdet) {
      throw new NotFoundException('Adopdet not found');
    }

    const today = new Date().toISOString().split('T')[0];

    if (
      updateAdopdetCarDto.adopted_date &&
      updateAdopdetCarDto.adopted_date > today
    ) {
      throw new BadRequestException('Adopdet data cannot be in the future');
    }

    if (updateAdopdetCarDto.customer_id) {
      const customer = await this.customerRepo.findOne({
        where: { id: updateAdopdetCarDto.customer_id },
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Shu customer id  boshqa joyda bondmi yoki yoqmi tekshiradi
      const existsAdopdet = await this.adopdet_carRepo.findOne({
        where: { customer: { id: updateAdopdetCarDto.customer_id } },
      });

      if (existsAdopdet && existsAdopdet.id !== adopdet.id) {
        throw new BadRequestException(
          'This customer has already adopted a car',
        );
      }

      adopdet.customer = customer;
    }

    if (updateAdopdetCarDto.car_id) {
      const car = await this.carRepo.findOne({
        where: { id: updateAdopdetCarDto.car_id },
      });
      if (!car) {
        throw new NotFoundException('Car not found');
      }

      // shu car id boshqa joyda bandmi yoki yoqmi tekshiradi
      const existingAdopdet = await this.adopdet_carRepo.findOne({
        where: { car: { id: updateAdopdetCarDto.car_id } },
      });

      // Agar bu mashina boshqa odamda band bo‘lsa va hozirgi recordga tegishli bo‘lmasa → xato
      if (existingAdopdet && existingAdopdet.id !== adopdet.id) {
        throw new BadRequestException('This car has already been adopted');
      }

      adopdet.car = car;
    }

    await this.adopdet_carRepo.save(adopdet);

    return successRes(adopdet);
  }
}
