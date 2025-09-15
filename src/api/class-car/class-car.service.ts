import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassCarDto } from './dto/create-class-car.dto';
import { UpdateClassCarDto } from './dto/update-class-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car, Class, ClassCars } from 'src/core';
import { BaseService } from 'src/infrastructure/base/base.servise';
import type { ClassRepository } from 'src/core';
import type { ClassCarRepository } from 'src/core/repository/class-car.repository';
import type { carRepository } from 'src/core';
import { successRes } from 'src/infrastructure/response/successRes';

@Injectable()
export class ClassCarService extends BaseService<
  CreateClassCarDto,
  UpdateClassCarDto,
  ClassCars
> {
  constructor(
    @InjectRepository(ClassCars)
    private readonly classCarRepo: ClassCarRepository,

    @InjectRepository(Class) private readonly classRepo: ClassRepository,

    @InjectRepository(Car) private readonly carRepo: carRepository,
  ) {
    super(classCarRepo);
  }

  async createClassCar(createClassCarDto: CreateClassCarDto) {
    const classs = await this.classRepo.findOne({
      where: { id: createClassCarDto.class_id },
    });
    if (!classs) {
      throw new NotFoundException('Classs not found');
    }

    const car = await this.carRepo.findOne({
      where: { id: createClassCarDto.car_id },
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const classCar = this.classCarRepo.create({
      classEntity: classs,
      car: car,
    });

    await this.classCarRepo.save(classCar);

    const saved = await this.classCarRepo.findOne({
      where: { id: classCar.id },
      relations: { classEntity: true, car: true },
    });

    return successRes(classCar, 201);
  }

  async updateClassCar(id: string, updateClassCarDto: UpdateClassCarDto) {
    const classCar = await this.classCarRepo.findOne({
      where: { id },
      relations: ['classEntity', 'car'],
    });
    if (!classCar) {
      throw new NotFoundException('ClassCar not found');
    }

    const { class_id, car_id } = updateClassCarDto;

    if (class_id) {
      const classId = await this.classRepo.findOne({
        where: { id: updateClassCarDto.class_id },
      });
      if (!classId) {
        throw new NotFoundException('ClassId not found');
      }
      classCar.classEntity = classId;
    }

    if (car_id) {
      const carId = await this.carRepo.findOne({
        where: { id: updateClassCarDto.car_id },
      });
      if (!carId) {
        throw new NotFoundException('Car not found');
      }
      classCar.car = carId;
    }

    await this.classCarRepo.save(classCar);

    return successRes(classCar);
  }
}
