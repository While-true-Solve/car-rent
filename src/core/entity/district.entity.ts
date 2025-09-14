import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Region } from './region.entity';
import { Car } from './car.entity';

@Entity('district')
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Car, (car) => car.district, {
    onDelete: 'CASCADE',
  })
  cars: Car[];

  @ManyToOne(() => Region, (region) => region.districts, {
    onDelete: 'CASCADE',
  })
  regionId: Region;
}
