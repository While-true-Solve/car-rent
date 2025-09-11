import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Car, Customer, Order, Payment, Wallet } from 'src/core';
import type { OrderRepository } from '../../core/'
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan } from 'typeorm'; // DB connection va ORM’ning markaziy boshqaruvchisi.
import { OrderStatus } from 'src/common/enum/order-status-enum';

@Injectable()
export class OrderService extends BaseService<CreateOrderDto, UpdateOrderDto, Order> {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: OrderRepository,
    @InjectRepository(Customer) private readonly customerRepo: CustomerRepository,
    @InjectRepository(Car) private readonly carRepo: CarRepository,
    private dataSource: DataSource
  ) {
    super(orderRepo)
  }

  // Orderni ozini  Create qilish Tranzaksiya mavjud emas
  async createOrder(createOrderDto: CreateOrderDto) {
    const { car_id, customer_id, ...rest } = createOrderDto

    const customer = await this.customerRepo.findOne({ where: { id: customer_id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    //  Car tekshirish
    const car = await this.carRepo.findOne({ where: { id: car_id } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    //  Car band emasligini tekshirish
    const activeOrder = await this.orderRepo.findOne({
      where: {
        car: { id: car_id },
        finish_time: MoreThan(new Date()) // hali tugamagan buyurtma
      },
    });
    if (activeOrder) {
      throw new BadRequestException('Car already rented');
    }




    // Total amount hisoblash
    const start = new Date(createOrderDto.start_time);
    const finish = new Date(createOrderDto.finish_time);
    const diffDays = Math.ceil((finish.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = diffDays * car.price_daily

    // 5️⃣ Order yaratish
    const order = this.orderRepo.create({
      ...rest,
      car,
      customer,
      total_amount: totalAmount,
    });

    return this.orderRepo.save(order);

  }


  /// Tranzaksiya Order va Payment
  async createOrderWithPayment(createOrderDto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      const { car_id, customer_id, start_time, finish_time, ...rest } = createOrderDto;

      // 1️.Customer tekshirish
      const customer = await manager.getRepository(Customer).findOne({
        where: { id: customer_id },
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // 2️ Wallet tekshirish
      const wallet = await manager.getRepository(Wallet).findOne({
        where: { customer: { id: customer_id } },
      });
      if (!wallet) {
        throw new BadRequestException('Customer wallet not found');
      }

      // 3. Car tekshirish
      const car = await manager.getRepository(Car).findOne({
        where: { id: car_id },
      });
      if (!car) {
        throw new NotFoundException('Car not found');
      }

      // 4. Car band emasligini tekshirish
      const activeOrder = await manager.getRepository(Order).findOne({
        where: {
          car: { id: car_id },
          finish_time: MoreThan(new Date()),
        },
      });
      if (activeOrder) {
        throw new BadRequestException('Car already rented');
      }

      // 5. Total amount hisoblash
      const start = new Date(start_time);
      const finish = new Date(finish_time);
      const diffDays = Math.ceil((finish.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = diffDays * Number(car.price_daily);


      // 6. Order yaratish
      const order = manager.getRepository(Order).create({
        ...rest,
        car,
        customer,
        total_amount: totalAmount,
        start_time: start,
        finish_time: finish,
      });
      await manager.getRepository(Order).save(order);

      



      // 7. Payment yaratish
      const payment = manager.getRepository(Payment).create({
        order,
        payment_date: new Date(),
        payment_status: true // shu yerda Default true qildim
      })
      await manager.getRepository(Payment).save(payment);


      return { message: 'Order and payment created successfully', order, payment };  // Result


    })
  }


  // Get Order
  async getOrders() {
    const orders = await this.orderRepo.find({
      relations: ['car', 'customer'],
      order: { start_time: 'DESC' }, // ixtiyoriy, oxirgi buyurtmalar yuqorida
    });
    return orders;
  }

  // Get Order By Id
  async getOrderById(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['car', 'customer'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }


  // Orderni cancell qilish
  async cancelOrder(id: string) {
    // orderni ovolamiz
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['payment'],
    });

    if (!order) {    // order Nul bop qolsa
      throw new NotFoundException('Order not found');
    }

    // Agar order allaqachon tugagan yoki bekor qilingan bo‘lsa
    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Order already cancelled');
    }
    if (order.finish_time < new Date()) {
      throw new BadRequestException('Order already finished, cannot cancel');
    }

    // Payment bo‘lsa → refund qilish (wallet’ga pul qaytarish)


    // ✅ faqat statusni yangilaymiz
    order.status = OrderStatus.CANCELLED;
    await this.orderRepo.save(order);

    return {
      message: 'Order bekor qilindi',
      data: order,
    };


  }

}
