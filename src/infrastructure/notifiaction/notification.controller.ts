import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { NotificationService } from './Notification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/core';
import { Repository } from 'typeorm';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SendDeadlineDto } from './Dto/send-deadline.dto';
import { SendLateDto } from './Dto/SendLateDto';
import { OrderStatus } from 'src/common/enum/order-status-enum';

@ApiTags('Notification Test')
@Controller('test')
export class TestController {
    constructor(
        private readonly notificationService: NotificationService,
        @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    ) { }

    @Post('cron/notify')
    @ApiBody({ type: SendDeadlineDto })
    async triggerNotify(@Body() body: SendDeadlineDto) {
        const { orderId } = body;

        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['customer'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.notificationService.sendDeadlineSoon(order.customer, order);

        return {
            message: 'Manual trigger ✅ Email notification yuborildi',
            orderId,
            customer: order.customer.email,
        };
    }

    @Post('notify/late')
    @ApiBody({ type: SendLateDto })
    async triggerLateNotify(@Body() body: SendLateDto) {
        const { orderId } = body;

        const order = await this.orderRepo.findOne({
            where: { id: orderId, status: OrderStatus.ACTIVE },
            relations: ['customer'],
        });

        if (!order) {
            throw new NotFoundException('Order not found or not active');
        }

        // Kuniga qancha kechikkanini hisoblaymiz
        const now = new Date();
        const daysLate =
            Math.floor((now.getTime() - order.finish_time.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const penaltyAmount = daysLate * 100;

        // Email yuboramiz
        await this.notificationService.sendLateOrder(order.customer, order, penaltyAmount);

        return {
            message: 'Manual trigger ✅ Late order notification yuborildi',
            orderId,
            customer: order.customer.email,
            penaltyAmount,
        };
    }

}

