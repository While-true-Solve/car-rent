import { PartialType } from '@nestjs/swagger';
import { CreateClassCarDto } from './create-class-car.dto';

export class UpdateClassCarDto extends PartialType(CreateClassCarDto) {}
