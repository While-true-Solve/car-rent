import { PartialType } from '@nestjs/swagger';
import { CreateAdopdetCarDto } from './create-adopdet-car.dto';

export class UpdateAdopdetCarDto extends PartialType(CreateAdopdetCarDto) {}
