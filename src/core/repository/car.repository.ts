import { Repository } from 'typeorm';

import { Car } from '../';

export type carRepository = Repository<Car>;
