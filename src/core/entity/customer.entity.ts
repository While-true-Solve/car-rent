import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Wallet } from './wallet.entity';
import { Comments } from './comment.entity';
import { AdoptedCar } from './adopdet-car.entity';
import { UserRole } from 'src/common/enum/user-enum';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hashed_password: string;

  @Column({ nullable: true })
  adress: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Wallet, (wallet) => wallet.customer)
  wallets: Wallet[];

  @OneToMany(() => Comments, (comment) => comment.customer)
  comments: Comments[];

  @OneToMany(() => AdoptedCar, (ac) => ac.customer)
  adoptedCars: AdoptedCar[];

  @Column({ nullable: true })
  otp: string;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
