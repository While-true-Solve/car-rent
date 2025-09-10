import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    type: 'string',
    description: 'user_name for admin',
    example: 'toshmat1',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    type: 'string',
    description: 'Password for admin',
    example: 'Toshmat123!',
  })
  @IsStrongPassword()
  password: string;
}
