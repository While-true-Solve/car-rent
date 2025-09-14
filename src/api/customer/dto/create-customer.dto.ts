import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsPhoneNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ type: 'string', example: 'Jorabek Asatullayev' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ type: 'string', example: '+998500406088' })
  @IsString()
  @IsPhoneNumber('UZ')
  // @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ type: 'string', example: 'jorabekasatullayev61@gmail.com' })
  @IsEmail()
  // @IsNotEmpty()
  email: string;

  @ApiProperty({ type: 'string', example: 'Parol123_' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', example: 'Toshkent, Chilonzor 9-kvartal' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: 'boolean', example: true })
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  @ApiProperty({ type: 'boolean', required: false, example: false })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}