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

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  payment_date: Date;

  @Column({ default: false })
  payment_status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;
}
