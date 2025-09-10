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
    return this.adopdetCarService.create(createAdopdetCarDto);
  }

  @Get()
  findAll() {
    return this.adopdetCarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adopdetCarService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdopdetCarDto: UpdateAdopdetCarDto,
  ) {
    return this.adopdetCarService.update(+id, updateAdopdetCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adopdetCarService.remove(+id);
  }
}
