import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SignOutCustomerDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}