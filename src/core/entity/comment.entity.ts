import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Car } from './car.entity';
import { Customer } from './customer.entity';

@Entity('comments')
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  impression: string;

  @ManyToOne(() => Car, (car) => car.comments)
  car: Car;

  @ManyToOne(() => Customer, (customer) => customer.comments)
  customer: Customer;
}
