import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Region } from './region.entity';
import { Car } from './car.entity';

@Entity('district')
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Region, (region) => region.districts, { onDelete: 'CASCADE' })
  region: Region;

  @OneToMany(() => Car, (car) => car.district)
  cars: Car[]
}
