import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class ConfirmPassDto {
  @ApiProperty({
    type: 'string',
    example: 'user@gmail.com',
    description: 'Foydalanuvchi emaili',
  })
  @IsEmail({}, { message: "Iltimos, to'g'ri email kiriting" })
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'Parol123_',
    description: 'Yangi parol',
  })
  @IsString({ message: "Parol matn ko'rinishida bo'lishi kerak" })
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  @MaxLength(20, { message: "Parol 20 tadan ko'p bo'lmasligi kerak" })
  passwordOne: string;

  @ApiProperty({
    type: 'string',
    example: 'Parol123_',
    description: 'Parolni tasdiqlash',
  })
  @IsString({ message: "Tasdiqlash paroli matn ko'rinishida bo'lishi kerak" })
  @MinLength(6, {
    message: "Tasdiqlash paroli kamida 6 ta belgidan iborat bo'lishi kerak",
  })
  @MaxLength(20, {
    message: "Tasdiqlash paroli 20 tadan ko'p bo'lmasligi kerak",
  })
  passwordTwo: string;
}
