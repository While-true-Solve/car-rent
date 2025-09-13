import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Region } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { RegionRepository } from 'src/core';
import { ISuccessRes } from 'src/common/interface';

@Injectable()
export class RegionService extends BaseService<
  CreateRegionDto,
  UpdateRegionDto,
  Region
> {
  constructor(
    @InjectRepository(Region) private readonly regionRepo: RegionRepository,
  ) {
    super(regionRepo);
  }
  async create(dto: CreateRegionDto): Promise<ISuccessRes> {
    const exists = await this.regionRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('bu region mavjud');

    return super.create(dto);
  }

  async update(id: string, dto: UpdateRegionDto): Promise<ISuccessRes> {
    const exists = await this.regionRepo.findOne({ where: { name: dto.name } });
    if (exists && exists.id !== id)
      throw new ConflictException('bu region mavjud');
    return super.update(id, dto);
  }
}
