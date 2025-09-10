import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({    // Car id
        type: 'number',
        description: 'ID of the car being rented',
        example: 3,
    })
    @IsNumber()
    @IsNotEmpty()
    car_id: number;

    @ApiProperty({  // Customer id
        type: Number,
        description: 'ID of the customer who rents the car',
        example: 7,
    })
    @IsNumber()
    @IsNotEmpty()
    customer_id: number;

    @ApiProperty({   // Start date
        type: String,
        format: 'date-time',
        description: 'Start date and time of the rental',
        example: '2025-09-11T09:00:00Z',
    })
    @IsDateString()
    @IsNotEmpty()
    start_time: Date;

    @ApiProperty({  // Finish date
        type: String,
        format: 'date-time',
        description: 'Finish date and time of the rental',
        example: '2025-09-15T18:00:00Z',
    })
    @IsDateString()
    @IsNotEmpty()
    finish_time: Date;

}
