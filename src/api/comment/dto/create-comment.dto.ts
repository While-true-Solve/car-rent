import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  @IsNotEmpty()
  car_id: string;

  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @IsString()
  @IsOptional()
  impression?: string;
}
