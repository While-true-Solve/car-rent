import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ILike } from 'typeorm';

import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { regionData } from 'src/common/document';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @SwagSuccessRes(
    'region creating',
    HttpStatus.CREATED,
    'function for creating region',
    201,
    'success',
    regionData,
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @SwagSuccessRes(
    'get regions with pagination',
    HttpStatus.OK,
    'function for get regions with pagination',
    200,
    'success',
    [regionData],
  )
  @SwagFailedRes()
  @Roles('public')
  @Get()
  findWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;
    const where = query ? { name: ILike(`%${query}%`) } : {};

    return this.regionService.findAllWithPagination({
      where,
      order: { created_at: 'DESC' },
      relations: { districts: true },
      skip: page,
      take: limit,
    });
  }

  @SwagSuccessRes(
    'get regions',
    HttpStatus.OK,
    'function for get region',
    200,
    'success',
    [regionData],
  )
  @SwagFailedRes()
  @Roles('public')
  @Get('all')
  findAll() {
    return this.regionService.findAll({ relations: { districts: true } });
  }

  @SwagSuccessRes(
    'get region by id',
    HttpStatus.OK,
    'function for get region by id',
    200,
    'success',
    regionData,
  )
  @SwagFailedRes()
  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOneById(id, {
      relations: { districts: true },
    });
  }

  @SwagSuccessRes(
    'update region',
    HttpStatus.OK,
    'function for update region',
    200,
    'success',
    regionData,
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }

  @SwagSuccessRes(
    'delete region',
    HttpStatus.OK,
    'function for delete region',
    200,
    'success',
    {},
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}
