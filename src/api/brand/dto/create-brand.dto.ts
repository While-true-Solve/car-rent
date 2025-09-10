import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ description: 'mashina uchun brand', example: 'Mercedec' })
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;
}
