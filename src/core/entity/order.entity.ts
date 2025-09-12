import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Car } from './car.entity';
import { Customer } from './customer.entity';
import { Payment } from './payment.entity';
import { Penalty } from './penalty.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  start_time: Date;

  @Column()
  finish_time: Date;

  @Column('decimal')
  total_amount: number;

  @ManyToOne(() => Car, (car) => car.orders)
  car: Car;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @OneToOne(() => Penalty, (penalty) => penalty.order)
  penalty: Penalty;
}
