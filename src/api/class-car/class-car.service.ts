import { Injectable } from '@nestjs/common';
import { CreateClassCarDto } from './dto/create-class-car.dto';
import { UpdateClassCarDto } from './dto/update-class-car.dto';

@Injectable()
export class ClassCarService {
  create(createClassCarDto: CreateClassCarDto) {
    return 'This action adds a new classCar';
  }

  findAll() {
    return `This action returns all classCar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classCar`;
  }

  update(id: number, updateClassCarDto: UpdateClassCarDto) {
    return `This action updates a #${id} classCar`;
  }

  remove(id: number) {
    return `This action removes a #${id} classCar`;
  }
}
