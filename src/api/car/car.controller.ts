import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum/user-enum';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { CarData, classData } from 'src/common/document';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';

@UseGuards(AuthGuard, RolesGuard)
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) { }

  @SwagSuccessRes(
    'create car',
    HttpStatus.CREATED,
    'function creating cars',
    201,
    'success',
    CarData,
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'failed creating car',
    400,
    'already exists',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.createCar(createCarDto);
  }

  @Roles('public')
  @Get()
  @ApiBearerAuth()
  findAllPaginationCar(@Query() queryDto: QueryPaginationDto) {
    const { query, page = 1, limit = 10 } = queryDto
    console.log(page);
    
    return this.carService.findAllWithPagination({
      where: query ? { model: ILike(`%${query}%`) } : {},
      order: { created_at: 'DESC' },
      relations: { brand: true, district: true },
      skip: page,
      take: limit,
    });
  }

  @SwagSuccessRes(
    'get car',
    HttpStatus.OK,
    'function get cars',
    200,
    'success',
    CarData,
  )
  @SwagFailedRes(HttpStatus.NOT_FOUND, 'failed get car', 404, 'Cars not found')
  @Roles('public')
  @Get('all')
  findAll() {
    return this.carService.findAll({
      relations: { brand: true, district: true },
    });
  }

  @SwagSuccessRes(
    'get sigment car',
    HttpStatus.OK,
    'get sigment succssefully',
    200,
    'success',
    CarData,
  )
  @SwagFailedRes(HttpStatus.NOT_FOUND, 'failed get car', 404, 'Car not found')
  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOneById(id, {
      relations: { brand: true, district: true },
    });
  }

  @SwagSuccessRes(
    'Update car',
    HttpStatus.OK,
    'Car updated successfully',
    200,
    'success',
    CarData,
  )
  @SwagFailedRes(
    HttpStatus.BAD_REQUEST,
    'Invalid data',
    400,
    'Validation failed',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.updateCar(id, updateCarDto);
  }

  @SwagSuccessRes(
    'Delete car',
    HttpStatus.NO_CONTENT,
    'Car deleted successfully',
    204,
    'success',
    {},
  )
  @SwagFailedRes(
    HttpStatus.BAD_REQUEST,
    'Car not found',
    404,
    'Car with given ID does not exist',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}
