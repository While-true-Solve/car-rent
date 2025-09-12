import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('penalty')
export class Penalty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  penalty_day_price: number;

  @Column('decimal')
  penalty_amount: number;

  @Column({ default: false })
  is_paid_penalty: boolean;

  @OneToOne(() => Order, (order) => order.penalty, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;
}
