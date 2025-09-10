import { OmitType } from "@nestjs/swagger";
import { CreateCustomerDto } from "./create-customer.dto";

export class SignInCustomerDto extends OmitType(CreateCustomerDto, ['address'] as const) { }