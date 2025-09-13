import { Repository } from 'typeorm';
import { Car } from '..';

export type CarRepository = Repository<Car>;
