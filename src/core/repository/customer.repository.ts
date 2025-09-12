import { Repository } from "typeorm";
import { Customer } from "../entity/customer.entity";

export type CustomerRepository = Repository<Customer>