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
import { OrderStatus } from 'src/common/enum/order-status-enum';

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

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.ACTIVE,
  })
  status: OrderStatus;


  @ManyToOne(() => Car, (car) => car.orders)
  car: Car;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @OneToOne(() => Penalty, (penalty) => penalty.order)
  penalty: Penalty;
}
