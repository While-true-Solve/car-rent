import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import type { BrandRepository } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/core/';

@Injectable()
export class BrandService extends BaseService<
  CreateBrandDto,
  UpdateBrandDto,
  Brand
> {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: BrandRepository,
  ) {
    super(brandRepo);
  }
}
