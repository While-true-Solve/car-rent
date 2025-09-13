import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    type: 'string',
    description: 'id owner card',
    example: 'fjhduiuhfnjfl-jfhasjnfdkla',
  })
  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({
    type: 'string',
    description: 'card number',
  })
  @IsNumberString(
    {},
    { message: "Karta raqami faqat raqamlardan iborat bo'lishi kerak" },
  )
  @Length(16, 16, {
    message: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak",
  })
  @Matches(/^[0-9]{16}$/, {
    message: "Karta raqami faqat 16 ta raqamdan iborat bo'lishi kerak",
  })
  card: string;
}
