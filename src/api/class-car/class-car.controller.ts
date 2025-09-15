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
import { ClassCarService } from './class-car.service';
import { CreateClassCarDto } from './dto/create-class-car.dto';
import { UpdateClassCarDto } from './dto/update-class-car.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { ClassCar } from 'src/common/document';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';

@UseGuards(AuthGuard, RolesGuard)
@Controller('class-car')
export class ClassCarController {
  constructor(private readonly classCarService: ClassCarService) {}

  @SwagSuccessRes(
    'class-car creating',
    HttpStatus.CREATED,
    'function for creating class-car',
    201,
    'success',
    ClassCar,
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'failed creating Class-car',
    400,
    'already exists',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createClassCarDto: CreateClassCarDto) {
    return this.classCarService.createClassCar(createClassCarDto);
  }

  @Roles('public')
  @Get()
  @ApiBearerAuth()
  findAllPaginationClass_car(@Query() queryDto: QueryPaginationDto) {
    const { query, page = 1, limit = 10 } = queryDto;
    return this.classCarService.findAllWithPagination({
      where: query ? { car: { model: ILike(`%${query}%`) } } : {},
      order: { created_at: 'DESC' },
      relations: { classEntity: true, car: true },
      skip: page,
      take: limit,
    });
  }

  @SwagSuccessRes(
    'get sigment class-car',
    HttpStatus.OK,
    'function get class-car',
    200,
    'success',
    ClassCar,
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    'failed get Class-car',
    404,
    'Class-car not found',
  )
  @Roles('public')
  @Get('all')
  findAll() {
    return this.classCarService.findAll({
      relations: ['classEntity', 'car'],
    });
  }

  @SwagSuccessRes(
    'get sigment class-car',
    HttpStatus.OK,
    'finction get class-car',
    200,
    'success',
    ClassCar,
  )
  @SwagFailedRes(HttpStatus.NOT_FOUND, 'failed get car', 404, 'Car not found')
  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classCarService.findOneById(id, {
      relations: { classEntity: true, car: true },
    });
  }

  @SwagSuccessRes(
    'update Class-car',
    HttpStatus.OK,
    'Class-car updated successfully',
    200,
    'success',
    ClassCar,
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
  update(
    @Param('id') id: string,
    @Body() updateClassCarDto: UpdateClassCarDto,
  ) {
    return this.classCarService.updateClassCar(id, updateClassCarDto);
  }

  @SwagSuccessRes(
    'delete class-car',
    HttpStatus.NO_CONTENT,
    'Class-car deleted successfully',
    204,
    'success',
    {},
  )
  @SwagFailedRes(
    HttpStatus.BAD_REQUEST,
    'Class-car not found',
    404,
    'Class-car with given ID does not exist',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.classCarService.remove(id);
  }
}
