import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({    // Car id
        example: 'a3f8e2c1-9b87-4b35-9f2c-1a2b3c4d5e6f'
    })
    @IsString()
    @IsNotEmpty()
    car_id: string;

    @ApiProperty({  // Customer id
        example: 'a3f8e2c1-9b87-4b35-9f2c-1a2b3c4d5e6f'
    })
    @IsString()
    @IsNotEmpty()
    customer_id: string;

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
