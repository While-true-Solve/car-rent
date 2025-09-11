import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @ApiProperty({
        type: String,
        description: 'UUID of the order this payment belongs to',
        example: 'b5f5d6e3-4c7d-4f8b-9f3d-3d5b5a9f7e8c',
    })
    @IsString()
    @IsNotEmpty()
    order_id: string;

    @ApiProperty({ type: String, example: 'pending' })
    @IsString()
    @IsNotEmpty()
    payment_status: string;
}
