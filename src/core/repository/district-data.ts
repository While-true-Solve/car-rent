import { Repository } from 'typeorm';
import { District } from '../entity/district.entity';

export type DistrictRepository = Repository<District>;
