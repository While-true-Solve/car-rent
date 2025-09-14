import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumberString, Length, Matches } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    type: 'string',
    description: 'ID of the customer who owns the wallet',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({
    type: 'string',
    description: '16-digit card number',
    example: '8600123456789012',
  })
  @IsNumberString({}, {
    message: "Karta raqami faqat raqamlardan iborat bo'lishi kerak",
  })
  @Length(16, 16, {
    message: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak",
  })
  @Matches(/^[0-9]{16}$/, {
    message: "Karta raqami faqat 16 ta raqamdan iborat bo'lishi kerak",
  })
  card: string;
}