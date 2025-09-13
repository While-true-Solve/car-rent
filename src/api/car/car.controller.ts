import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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

@UseGuards(AuthGuard, RolesGuard)
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) { }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.createCar(createCarDto);
  }

  @Roles('public')
  @Get('all')
  findAll() {
    return this.carService.findAll({ relations: { brand: true, district: true } });
  }

  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOneById(id, { relations: { brand: true, district: true } });
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.updateCar(id, updateCarDto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}
