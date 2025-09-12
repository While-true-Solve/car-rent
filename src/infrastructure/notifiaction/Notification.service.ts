import { Injectable } from '@nestjs/common';
import { Customer, Order } from 'src/core';

@Injectable()
export class NotificationService {
  async sendDeadlineSoon(customer: Customer, order: Order) {
    // Email yoki socket
    console.log(
      `📩 ${customer.email} - Sizning order #${order.id} 3 soatda tugaydi!`,
    );
  }

  async sendLateOrder(customer: Customer, order: Order, penalty: number) {
    console.log(
      `⚠️ ${customer.email} - Order #${order.id} muddati tugagan. Penalty: $${penalty}`,
    );
  }
}
