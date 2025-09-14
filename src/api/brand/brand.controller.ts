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

import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { brandData } from 'src/common/document';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @SwagSuccessRes(
    'create brand',
    HttpStatus.CREATED,
    'creating brand',
    201,
    'success',
    brandData,
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @SwagSuccessRes(
    'ger all brands with pagintion',
    HttpStatus.OK,
    'get brands with pagination',
    200,
    'success',
    [brandData],
  )
  @SwagFailedRes()
  @Roles('public')
  @Get()
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;

    const where = query ? { name: ILike(`%${query}%`) } : {};

    return this.brandService.findAllWithPagination({
      where,
      order: { created_at: 'DESC' },
      relations: { cars: true },
      skip: page,
      take: limit,
    });
  }

  @SwagSuccessRes(
    'get all brands',
    HttpStatus.OK,
    'get all brands',
    200,
    'success',
    [brandData],
  )
  @SwagFailedRes()
  @Roles('public')
  @Get('/all')
  findAll() {
    return this.brandService.findAll({ relations: { cars: true } });
  }

  @SwagSuccessRes(
    'get brand by id',
    HttpStatus.OK,
    'get all brands',
    200,
    'success',
    brandData,
  )
  @SwagFailedRes()
  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOneById(id, { relations: { cars: true } });
  }

  @SwagSuccessRes(
    'update brand',
    HttpStatus.OK,
    'update brands',
    200,
    'success',
    [brandData],
  )
  @SwagFailedRes()
  @SwagSuccessRes(
    'update brand',
    HttpStatus.OK,
    'update brand',
    200,
    'success',
    [brandData],
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @SwagSuccessRes(
    'deleting brand',
    HttpStatus.OK,
    'deleting brand',
    200,
    'success',
    {},
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
