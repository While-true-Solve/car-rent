import { Repository } from "typeorm";
import { Customer } from "../";

export type CustomerRepository = Repository<Customer>;