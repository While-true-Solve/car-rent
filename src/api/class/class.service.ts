import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Class } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { ClassRepository } from 'src/core';
import { ISuccessRes } from 'src/common/interface';

@Injectable()
export class ClassService extends BaseService<
  CreateClassDto,
  UpdateClassDto,
  Class
> {
  constructor(
    @InjectRepository(Class) private readonly classRepo: ClassRepository,
  ) {
    super(classRepo);
  }
  async create(dto: CreateClassDto): Promise<ISuccessRes> {
    const exists = await this.classRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new BadRequestException('bu class mavjud');

    return super.create(dto);
  }

  async update(id: string, dto: UpdateClassDto): Promise<ISuccessRes> {
    const exists = await this.classRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new BadRequestException('bu class mavjud');
    return super.update(id, dto);
  }
}
