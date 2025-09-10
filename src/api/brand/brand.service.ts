import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  create(createBrandDto: CreateBrandDto) {
    return 'This action adds a new brand';
  }

  findAll() {
    return `This action returns all brand`;
  }

  findOne(id: string) {
    return `This action returns a #${id} brand`;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: string) {
    return `This action removes a #${id} brand`;
  }
}
