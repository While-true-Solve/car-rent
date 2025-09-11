import { Repository } from "typeorm";
import { ClassCars } from "../entity/class-car.entity";

export type ClassCarRepository = Repository<ClassCars>