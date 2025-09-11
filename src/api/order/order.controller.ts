import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()   // 1. Faqat Order yaratish (to‘lovsiz)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto)
  }

  // 2. Order + Payment birga (tranzaksiya orqali)
  @Post('with-payment')
  async createWithPayment(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrderWithPayment(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.getOrders();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
