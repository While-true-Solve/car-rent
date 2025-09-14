import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgetPassDto {
  @ApiProperty({ type: 'string', example: 'user@gmail.com' })
  @IsEmail()
  email: string;
}
