import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePenaltyDto {
    @ApiProperty({
        type: Number,
        description: 'ID of the order this penalty belongs to',
        example: 5,
    })
    @IsNumber()
    @IsNotEmpty()
    order_id: number;

    @ApiProperty({
        type: Number,
        description: 'Penalty price per delayed day',
        example: 100000,
    })
    @IsNumber()
    @IsNotEmpty()
    penalty_day_price: number;

}
