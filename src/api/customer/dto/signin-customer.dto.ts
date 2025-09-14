import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInCustomerDto {
  @ApiProperty({ type: 'string', example: 'jorabek@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', example: 'Parol123_' })
  @IsString()
  @MinLength(6)
  password: string;
}
