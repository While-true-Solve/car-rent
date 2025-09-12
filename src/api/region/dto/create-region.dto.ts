import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({
    type: 'string',
    description: 'region cars',
    example: 'Tashkent',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;
}
