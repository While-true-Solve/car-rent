import { Module } from '@nestjs/common';
import { NotificationService } from './Notification.service';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
