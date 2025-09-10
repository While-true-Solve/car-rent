import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Class } from './class.entity';
import { Car } from './car.entity';

@Entity('class_cars')
export class ClassCars {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Class, (cls) => cls.classCars)
  classEntity: Class;

  @ManyToOne(() => Car, (car) => car.classCars)
  car: Car;
}
