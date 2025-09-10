import { Injectable } from '@nestjs/common';
import { CreateAdopdetCarDto } from './dto/create-adopdet-car.dto';
import { UpdateAdopdetCarDto } from './dto/update-adopdet-car.dto';

@Injectable()
export class AdopdetCarService {
  create(createAdopdetCarDto: CreateAdopdetCarDto) {
    return 'This action adds a new adopdetCar';
  }

  findAll() {
    return `This action returns all adopdetCar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adopdetCar`;
  }

  update(id: number, updateAdopdetCarDto: UpdateAdopdetCarDto) {
    return `This action updates a #${id} adopdetCar`;
  }

  remove(id: number) {
    return `This action removes a #${id} adopdetCar`;
  }
}
