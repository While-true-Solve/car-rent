import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { FuelType } from "src/common/enum/fuel-type.enum"; 

export class CreateCarDto {
    @ApiProperty({ type: 'string', example: 'uuid'})
    @IsUUID()
    @IsNotEmpty()
    brand_id: string;

    @ApiProperty({ example: 'Malibu 2', description: 'Model name of the car' })
    @IsString()
    @IsOptional()
    model: string;

    @ApiProperty({ example: 250000, description: 'Daily rental price in UZS' })
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    price_daily: number;

    @ApiProperty({ example: 'Black', description: 'Car color' })
    @IsString()
    @IsOptional()
    color: string;

    @ApiProperty({ enum: FuelType ,example: FuelType.PETROL, description: 'Type of fuel' })
    @IsEnum(FuelType)
    fuel_type: FuelType;

    @ApiProperty({ example: 'uuid', description: 'District ID'})
    @IsUUID()
    district_id: string;
}
