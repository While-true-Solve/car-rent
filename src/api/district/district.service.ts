import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { District, type DistrictRepository } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionService } from '../region/region.service';
import { ISuccessRes } from 'src/common/interface';
import { successRes } from 'src/infrastructure/response/successRes';

@Injectable()
export class DistrictService extends BaseService<
  CreateDistrictDto,
  UpdateDistrictDto,
  District
> {
  constructor(
    @InjectRepository(District)
    private readonly districtRepo: DistrictRepository,
    private readonly regionService: RegionService,
  ) {
    super(districtRepo);
  }

  async create(dto: CreateDistrictDto): Promise<ISuccessRes> {
    await this.regionService.findOneById(dto.regionId);

    const exists = await this.districtRepo.findOne({
      where: { name: dto.name },
    });

    if (exists) throw new ConflictException('name already exists');

    return super.create(dto);
  }

  async updateDistrict(
    id: string,
    dto: UpdateDistrictDto,
  ): Promise<ISuccessRes> {
    const district = await this.districtRepo.findOne({
      where: { id },
      relations: ['regionId'],
    });
    if (!district) throw new NotFoundException('district not found');

    const { name: districtName, regionId: rId } = dto;

    let region = district.regionId;
    if (rId) {
      const foundRegion = await this.regionService.findOneById(rId);
      if (!foundRegion) throw new NotFoundException('region not found');
      region = { id: rId } as any;
    }

    let name = district.name;
    if (districtName) {
      const exists = await this.districtRepo.findOne({
        where: { name: districtName },
      });
      if (exists && exists.id !== id) {
        throw new ConflictException('name already exists');
      }
      name = districtName;
    }

    await this.districtRepo.update(id, { name, regionId: region });

    const updatingDistrict = await this.districtRepo.findOne({
      where: { id },
      relations: ['regionId'],
    });

    return successRes(updatingDistrict);
  }
}
