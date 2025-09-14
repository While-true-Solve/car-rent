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
import { AdopdetCarService } from './adopdet-car.service';
import { CreateAdopdetCarDto } from './dto/create-adopdet-car.dto';
import { UpdateAdopdetCarDto } from './dto/update-adopdet-car.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { adminData } from 'src/common/document';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';

@UseGuards(AuthGuard, RolesGuard)
@Controller('adopdet-car')
export class AdopdetCarController {
  constructor(private readonly adopdetCarService: AdopdetCarService) { }

  // Create  =====================
  @SwagSuccessRes(
    'create car',
    HttpStatus.CREATED,
    'function creating cars',
    201,
    'success',
    adminData,
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'failed creating adopdet-car',
    400,
    'already exists',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createAdopdetCarDto: CreateAdopdetCarDto) {
    return this.adopdetCarService.createAdoped(createAdopdetCarDto);
  }

  @Roles('public')
  @Get()
  @ApiBearerAuth()
  findAllPaginationAdopted_car(@Query() queryDto: QueryPaginationDto) {
    const { query, page = 1, limit = 10 } = queryDto
    return this.adopdetCarService.findAllWithPagination({
      where: query ? { car: {model: ILike(`%${query}%`) }} : {},
      order: { created_at: 'DESC' },
      relations: { customer: true, car: true },
      skip: page,
      take: limit,
    });
  }

  // FindAll  =====================
  @SwagSuccessRes(
    'get car',
    HttpStatus.OK,
    'function get cars',
    200,
    'success',
    adminData,
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    'failed get adopdet-car',
    404,
    'adopdet-car not found',
  )
  @Roles('public')
  @Get('all')
  findAll() {
    return this.adopdetCarService.findAll({
      relations: { car: true, customer: true },
    });
  }

  // FindOne  =====================
  @SwagSuccessRes(
    'get sigment car',
    HttpStatus.OK,
    'get sigment succssefully',
    200,
    'success',
    adminData,
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    'failed get adopdet-car',
    404,
    'Adopdet-car not found',
  )
  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adopdetCarService.findOneById(id, {
      relations: { car: true, customer: true }
    });
  }

  // Update  =====================
  @SwagSuccessRes(
    'Update car',
    HttpStatus.OK,
    'Car updated successfully',
    200,
    'success',
    adminData,
  )
  @SwagFailedRes(
    HttpStatus.BAD_REQUEST,
    'Invalid data',
    400,
    'Validation failed',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdopdetCarDto: UpdateAdopdetCarDto,
  ) {
    return this.adopdetCarService.updateAdopdet_car(id, updateAdopdetCarDto);
  }

  // Delete  =====================
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
    'Adopdet-car not found',
    404,
    'Adopdet-car with given ID does not exist',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.adopdetCarService.remove(id);
  }
}
