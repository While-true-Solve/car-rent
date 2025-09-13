import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateAdopdetCarDto {
  @ApiProperty({ example: '2025-09-11', description: 'Adoption date' })
  @IsDateString()
  @IsNotEmpty()
  adopted_date: string;

  @ApiProperty({ example: true, description: 'Adopted status' })
  @IsBoolean()
  @IsOptional()
  is_adopted: boolean;

  @ApiProperty({ example: 'uuid', description: 'Customer ID' })
  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({ example: 'uuid', description: 'Car ID' })
  @IsUUID()
  @IsNotEmpty()
  car_id: string;
}
