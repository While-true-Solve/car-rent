import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassCarService } from './class-car.service';
import { CreateClassCarDto } from './dto/create-class-car.dto';
import { UpdateClassCarDto } from './dto/update-class-car.dto';

@Controller('class-car')
export class ClassCarController {
  constructor(private readonly classCarService: ClassCarService) {}

  @Post()
  create(@Body() createClassCarDto: CreateClassCarDto) {
    return this.classCarService.createClassCar(createClassCarDto);
  }

  @Get()
  findAll() {
    return this.classCarService.findAll({
      relations: ['classEntity', 'car'],
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classCarService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassCarDto: UpdateClassCarDto,
  ) {
    return this.classCarService.updateClassCar(id, updateClassCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classCarService.remove(id);
  }
}
