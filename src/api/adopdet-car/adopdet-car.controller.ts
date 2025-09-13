import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdopdetCarService } from './adopdet-car.service';
import { CreateAdopdetCarDto } from './dto/create-adopdet-car.dto';
import { UpdateAdopdetCarDto } from './dto/update-adopdet-car.dto';

@Controller('adopdet-car')
export class AdopdetCarController {
  constructor(private readonly adopdetCarService: AdopdetCarService) {}

  @Post()
  create(@Body() createAdopdetCarDto: CreateAdopdetCarDto) {
    return this.adopdetCarService.createAdoped(createAdopdetCarDto);
  }

  @Get()
  findAll() {
    return this.adopdetCarService.findAll({relations:{car:true, customer:true}});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adopdetCarService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdopdetCarDto: UpdateAdopdetCarDto,
  ) {
    return this.adopdetCarService.updateAdopdet_car(id, updateAdopdetCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adopdetCarService.remove(id);
  }
}
