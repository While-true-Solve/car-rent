import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClassCars } from './class-car.entity';

@Entity('class')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => ClassCars, (cc) => cc.classEntity)
  classCars: ClassCars[];
}
