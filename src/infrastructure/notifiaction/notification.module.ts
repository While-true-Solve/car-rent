import { Module } from '@nestjs/common';
import { NotificationService } from './Notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/core';
import { TestController } from './notification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]), // 🔑 bu joyda qo‘shish kerak
  ],
  controllers: [TestController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
