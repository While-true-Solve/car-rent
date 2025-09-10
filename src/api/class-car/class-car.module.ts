import { Module } from '@nestjs/common';
import { ClassCarService } from './class-car.service';
import { ClassCarController } from './class-car.controller';

@Module({
  controllers: [ClassCarController],
  providers: [ClassCarService],
})
export class ClassCarModule {}
