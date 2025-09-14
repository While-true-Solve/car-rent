import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePenaltyDto {
  @ApiProperty({
    example: 'a3f8e2c1-9b87-4b35-9f2c-1a2b3c4d5e6f',
  })
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty({
    type: Number,
    description: 'Penalty price per delayed day',
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  penalty_day_price: number;
}
