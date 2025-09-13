import { IsEmail, IsNumber, Max, Min } from 'class-validator';

export class LoginCustomerDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @Min(6)
  @Max(6)
  otpPass: number;
}
