import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Car } from './car.entity';

@Entity('adopted_car')
export class AdoptedCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adopted_date: Date;

  @Column({ default: true })
  is_adopted: boolean;

  @ManyToOne(() => Customer, (customer) => customer.adoptedCars)
  customer: Customer;

  @ManyToOne(() => Car, (car) => car.adoptedCars)
  car: Car;
}
