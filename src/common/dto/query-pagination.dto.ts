import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class QueryPaginationDto {
    @ApiPropertyOptional({
        type: 'string',
        example: 'Eshmat',
        description: 'Query for each'
    })
    @IsString()
    @IsOptional()
    query?: string;

    @ApiPropertyOptional({
        type: 'string',
        example: '1',
        description: 'Page'
    })
    @Type(() => Number)
    @IsString()
    @IsOptional()
    page?: string;

    @ApiPropertyOptional({
        type: 'string',
        example: '10',
        description: 'Limit'
    })
    @Type(() => Number)
    @IsString()
    @IsOptional()
    limit?: string;
}