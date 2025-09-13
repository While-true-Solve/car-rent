import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty({
    type: 'string',
    description: 'district name',
    example: "Marg'ilon",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type:"string",
    description:"region Id",
    example:"4db235ba-4253-4b82-9e09-250cd8b3d796"
  })
  @IsUUID()
  @IsNotEmpty()
  regionId: string;
}
