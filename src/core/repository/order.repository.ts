import { Repository } from 'typeorm';
import { Order } from '../';

export type orderRepository = Repository<Order>;
