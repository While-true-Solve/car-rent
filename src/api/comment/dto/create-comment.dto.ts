import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  car_id: string;

  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Great car, really enjoyed it!',
  }) // Ajoyib mashina, juda yoqdi!
  @IsString()
  @IsOptional()
  impression?: string;
}
