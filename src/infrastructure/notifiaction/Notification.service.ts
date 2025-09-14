import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from 'src/config';
import { Customer, Order } from 'src/core';

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // TLS ishlatiladi
      auth: {
        user: config.Email.user, // .env dan olish
        pass: config.Email.pass,
      },
    });
  }

  async sendOTP(email: string, otp: string) {
    // console.log(email, otp, config.Email.user, config.Email.pass)
    const info = await this.transporter.sendMail({
      from: `"My App" <${config.Email.user}>`,
      to: email,
      subject: 'Registration successful. Please verify your OTP',
      text: `Your OTP code is: ${otp}\nLogin link: http://localhost:${config.PORT}/api/v1/customer/login`,
    });
    console.log(info);
    
  }

  async sendDeadlineSoon(customer: Customer, order: Order) {
    await this.transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: 'Order deadline yaqinlashmoqda!',
      text: `Hurmatli ${customer.full_name}, sizning order #${order.id} 3 soatda tugaydi!`,
    });
  }

  async sendLateOrder(customer: Customer, order: Order, penalty: number) {
    await this.transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: 'Order muddati tugagan',
      text: `Hurmatli ${customer.full_name}, order #${order.id} muddati tugagan. Jarima: $${penalty}`,
    });
  }
}
