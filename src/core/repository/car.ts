import { Repository } from 'typeorm';
import { Car } from '../entity/car.entity';

export type CarRepository = Repository<Car>;
