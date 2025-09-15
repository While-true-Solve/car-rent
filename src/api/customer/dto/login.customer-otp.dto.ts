import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginCustomerDto {
  @ApiProperty({ type: 'string', example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: '123456',
    description: '6 xonali OTP kod',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otpPass: string;
}
