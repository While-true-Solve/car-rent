import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Car, Customer, Order, Payment, Wallet } from 'src/core';
import type {
  carRepository,
  CustomerRepository,
  orderRepository,
} from '../../core/';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, LessThan, MoreThan } from 'typeorm'; // DB connection va ORM’ning markaziy boshqaruvchisi.
import { OrderStatus } from 'src/common/enum/order-status-enum';
import { PenaltyService } from '../penalty/penalty.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { RepositoryPager } from 'src/infrastructure/pagination';
import { NotificationService } from 'src/infrastructure/notifiaction/Notification.service';

@Injectable()
export class OrderService extends BaseService<
  CreateOrderDto,
  UpdateOrderDto,
  Order
> {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: orderRepository,
    @InjectRepository(Customer)
    private readonly customerRepo: CustomerRepository,
    @InjectRepository(Car) private readonly carRepo: carRepository,
    private dataSource: DataSource,
    private penaltyService: PenaltyService, // <-- inject qilyapmiz
    private notificationService: NotificationService,
  ) {
    super(orderRepo);
  }

  // Har soatda ishlaydi , Deadline tugashiga 3 soat qolganda bildirishnoma!
  @Cron(CronExpression.EVERY_HOUR)
  async notifyBeforeDeadline() {
    const now = new Date();
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const orders = await this.orderRepo.find({
      where: {
        finish_time: Between(now, threeHoursLater),
        status: OrderStatus.ACTIVE,
      },
      relations: ['customer'],
    });
    for (const order of orders) {
      await this.notificationService.sendDeadlineSoon(order.customer, order); // customer email yoki socketga xabar yuborish
    }
  }

  // Har kuni 00:00 da ishlaydi ,  Deadline o‘tgan orderlarga penalty hisoblab yozadi
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Har kun 00: 00 da ishlaydi
  async handleLateOrdersPenalty() {
    console.log('Cron: kechikkan orderlar tekshirildi ✅');
    await this.checkAndCreatePenaltyForLateOrders();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleLateOrdersNotification() {
    const now = new Date();

    const lateOrders = await this.orderRepo.find({
      where: { finish_time: LessThan(now), status: OrderStatus.ACTIVE },
      relations: ['customer'],
    });

    for (const order of lateOrders) {
      const daysLate =
        Math.floor(
          (now.getTime() - order.finish_time.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1;

      const penaltyAmount = daysLate * 100;

      // 1️⃣ Penalty yozish
      await this.penaltyService.createPenaltyForOrder({
        order_id: order.id.toString(), // number → string
        penalty_day_price: 100, // kunlik jarima narxi
      });

      // 2️⃣ Mijozni ogohlantirish
      await this.notificationService.sendLateOrder(
        order.customer,
        order,
        penaltyAmount,
      );
    }
  }

  // Orderni ozini  Create qilish Tranzaksiya mavjud emas
  async createOrder(createOrderDto: CreateOrderDto) {
    const { car_id, customer_id, ...rest } = createOrderDto;

    const customer = await this.customerRepo.findOne({
      where: { id: customer_id },
    });
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
        finish_time: MoreThan(new Date()), // hali tugamagan buyurtma
      },
    });
    if (activeOrder) {
      throw new BadRequestException('Car already rented');
    }

    // Total amount hisoblash
    const start = new Date(createOrderDto.start_time);
    const finish = new Date(createOrderDto.finish_time);
    const diffDays = Math.ceil(
      (finish.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalAmount = diffDays * car.price_daily;

    // 5️⃣ Order yaratish
    const order = this.orderRepo.create({
      ...rest,
      car,
      customer,
      total_amount: totalAmount,
    });

    return this.orderRepo.save(order);
  }

  /// dataSource orqali Tranzaksiya Order va Payment
  async createOrderWithPayment(createOrderDto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      const { car_id, customer_id, start_time, finish_time, ...rest } =
        createOrderDto;

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
      const diffDays = Math.ceil(
        (finish.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
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
        payment_status: true, // shu yerda Default true qildim
      });
      await manager.getRepository(Payment).save(payment);

      return {
        message: 'Order and payment created successfully',
        order,
        payment,
      }; // Result
    });
  }

  // Get Order
  async getOrders() {
    const orders = await this.orderRepo.find({
      relations: ['car', 'customer', 'penalty'],
      order: { start_time: 'DESC' }, // ixtiyoriy, oxirgi buyurtmalar yuqorida
    });
    return orders;
  }

  // Orderlarni Pagination orqali ko'rish
  async getOrdersPaginated(query: QueryPaginationDto) {
    const { page = 1, limit = 10, query: searchQuery } = query;

    // Find options
    const findOptions: any = {
      take: limit,
      skip: page,
      relations: ['car', 'customer', 'penalty'],
      order: { start_time: 'DESC' },
    };

    // Agar qidiruv so‘rovi bo‘lsa
    if (searchQuery) {
      findOptions.where = [
        { customer: { name: searchQuery } },
        { car: { name: searchQuery } },
      ];
    }

    // Pagination bilan data olish
    return RepositoryPager.findAll(this.orderRepo, findOptions);
  }

  // Get Order By Id
  async getOrderById(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['car', 'customer', 'penalty'],
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

    if (!order) {
      // order Nul bop qolsa
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

  // Tugagan orderlarni tekshirib penalty yaratish (cron job yoki service orqali chaqiriladi)
  async checkAndCreatePenaltyForLateOrders() {
    const now = new Date();
    const orders = await this.orderRepo.find({
      where: { finish_time: MoreThan(new Date(0)), status: OrderStatus.ACTIVE },
      relations: ['penalty'],
    });

    for (const order of orders) {
      if (now > order.finish_time) {
        const penaltyDto = { order_id: order.id, penalty_day_price: 100 };

        if (!order.penalty) {
          await this.penaltyService.createPenaltyForOrder(penaltyDto);
        } else {
          await this.penaltyService.updatePenaltyForOrder(order.id);
        }
      }
    }
  }

  // Rolback orqali Tranzaksiya Controllerda buni chaqirmabman istasangiz buni tanlang
  async createOrderWithPaymentRolback(createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { car_id, customer_id, start_time, finish_time, ...rest } =
        createOrderDto;

      // 1. Customer tekshirish
      const customer = await queryRunner.manager.findOne(Customer, {
        where: { id: customer_id },
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // 2. Wallet tekshirish
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { customer: { id: customer_id } },
      });
      if (!wallet) {
        throw new BadRequestException('Customer wallet not found');
      }

      // 3. Car tekshirish
      const car = await queryRunner.manager.findOne(Car, {
        where: { id: car_id },
      });
      if (!car) {
        throw new NotFoundException('Car not found');
      }

      // 4. Car band emasligini tekshirish
      const activeOrder = await queryRunner.manager.findOne(Order, {
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
      const diffDays = Math.ceil(
        (finish.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      const totalAmount = diffDays * Number(car.price_daily);

      // 6. Order yaratish
      const order = queryRunner.manager.create(Order, {
        ...rest,
        car,
        customer,
        total_amount: totalAmount,
        start_time: start,
        finish_time: finish,
      });
      await queryRunner.manager.save(order);

      // 7. Payment yaratish
      const payment = queryRunner.manager.create(Payment, {
        order,
        payment_date: new Date(),
        payment_status: true,
      });
      await queryRunner.manager.save(payment);

      // ✅ Hamma joyi to‘g‘ri bo‘lsa commit
      await queryRunner.commitTransaction();

      return {
        message: 'Order and payment created successfully',
        order,
        payment,
      };
    } catch (error) {
      // Xato bo‘lsa rollback
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Connectionni yopish
      await queryRunner.release();
    }
  }
}
