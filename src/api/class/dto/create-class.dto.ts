import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CarClass } from 'src/common/enum/class-enum';

export class CreateClassDto {
  @ApiProperty({
    type: 'string',
    description: 'car sigments',
    example: CarClass.BUSINESS,
  })
  @IsEnum(CarClass)
  @MinLength(2)
  @IsNotEmpty()
  name: CarClass;
}
