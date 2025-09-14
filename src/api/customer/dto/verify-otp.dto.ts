import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ type: 'string', example: 'user@example.com' })
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
  otp: string;
}
