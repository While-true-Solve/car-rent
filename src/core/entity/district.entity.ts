import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Region } from './region.entity';

@Entity('district')
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Region, (region) => region.districts, {
    onDelete: 'CASCADE',
  })
  region: Region;
}
