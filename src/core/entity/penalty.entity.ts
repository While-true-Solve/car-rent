import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => Order, (order) => order.penalty, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;
}
