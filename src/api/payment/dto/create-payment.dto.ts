import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePaymentDto {
    @ApiProperty({
        type: Number,
        description: 'ID of the order this payment belongs to',
        example: 12,
    })
    @IsNumber()
    @IsNotEmpty()
    order_id: number;

}
