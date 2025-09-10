import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { District } from './district.entity';

@Entity('region')
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => District, (district) => district.region)
  districts: District[];
}
