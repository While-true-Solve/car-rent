import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
