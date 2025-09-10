import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Injectable()
export class DistrictService {
  create(createDistrictDto: CreateDistrictDto) {
    return 'This action adds a new district';
  }

  findAll() {
    return `This action returns all district`;
  }

  findOne(id: string) {
    return `This action returns a #${id} district`;
  }

  update(id: string, updateDistrictDto: UpdateDistrictDto) {
    return `This action updates a #${id} district`;
  }

  remove(id: string) {
    return `This action removes a #${id} district`;
  }
}
