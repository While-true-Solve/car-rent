import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateClassCarDto {
  @ApiProperty({ example: 'UUID' })
  @IsUUID()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ example: 'UUID' })
  @IsUUID()
  @IsNotEmpty()
  car_id: string;
}
