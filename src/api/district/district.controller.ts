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
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { districtData } from 'src/common/document';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @SwagSuccessRes(
    'creating district',
    HttpStatus.CREATED,
    'create function for district',
    201,
    'success',
    districtData,
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtService.create(createDistrictDto);
  }

  @SwagSuccessRes(
    'get all districts with pagination',
    HttpStatus.OK,
    'function for get all with pagination',
    200,
    'success',
    [districtData],
  )
  @SwagFailedRes()
  @Roles('public')
  @Get()
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;

    const where = query ? { name: ILike(`%${query}%`) } : {};

    return this.districtService.findAllWithPagination({
      where,
      order: { created_at: 'DESC' },
      relations: { regionId: true },
      skip: page,
      take: limit,
    });
  }

  @SwagSuccessRes(
    'all districts',
    HttpStatus.OK,
    'function for get all districts',
    200,
    'success',
    [districtData],
  )
  @SwagFailedRes()
  @Roles('public')
  @Get('all')
  findAll() {
    return this.districtService.findAll({
      relations: { regionId: true },
    });
  }

  @SwagSuccessRes(
    'get by admin',
    HttpStatus.OK,
    'function for get district by id',
    200,
    'success',
    districtData,
  )
  @SwagFailedRes()
  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOneById(id, {
      relations: { regionId: true },
    });
  }

  @SwagSuccessRes(
    'update districts',
    HttpStatus.OK,
    'function for update  districts',
    200,
    'success',
    districtData,
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtService.updateDistrict(id, updateDistrictDto);
  }

  @SwagSuccessRes(
    'deleting districts',
    HttpStatus.OK,
    'function for deleting district',
    200,
    'success',
    {},
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtService.remove(id);
  }
}
