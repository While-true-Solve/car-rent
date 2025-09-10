import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { UpdatePenaltyDto } from './dto/update-penalty.dto';

@Controller('penalty')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Post()
  create(@Body() createPenaltyDto: CreatePenaltyDto) {
    return this.penaltyService.create(createPenaltyDto);
  }

  @Get()
  findAll() {
    return this.penaltyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.penaltyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePenaltyDto: UpdatePenaltyDto) {
    return this.penaltyService.update(+id, updatePenaltyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.penaltyService.remove(+id);
  }
}
