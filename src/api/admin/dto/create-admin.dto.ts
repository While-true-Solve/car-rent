import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    type: 'string',
    description: 'user_name for admin',
    example: 'developer',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'full name for admin',
    example: 'Qosimov DinMuhammad',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    type: 'string',
    description: 'Password for admin',
    example: 'Developer1!',
  })
  @IsStrongPassword()
  password: string;
}
