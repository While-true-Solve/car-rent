import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { District } from './district.entity';
import { Order } from './order.entity';
import { Comments } from './comment.entity';
import { AdoptedCar } from './adopdet-car.entity';
import { ClassCars } from './class-car.entity';
import { CreateAdminDto } from 'src/api/admin/dto/create-admin.dto';

@Entity('car')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  model: string;

  @Column('decimal')
  price_daily: number;

  @Column()
  color: string;

  @Column()
  fuelType: string;

  @ManyToOne(() => Brand, (brand) => brand.cars)
  brand: Brand;

  @ManyToOne(() => District, (district) => district.cars)
  district: District;

  @OneToMany(() => Order, (order) => order.car)
  orders: Order[];

  @OneToMany(() => Comments, (comment) => comment.car)
  comments: Comments[];

  @OneToMany(() => AdoptedCar, (ac) => ac.car)
  adoptedCars: AdoptedCar[];

  @OneToMany(() => ClassCars, (cc) => cc.car)
  classCars: ClassCars[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
