import { Repository } from 'typeorm';
import { Brand } from '../entity/brand.entity';

export type BrandRepository = Repository<Brand>;
