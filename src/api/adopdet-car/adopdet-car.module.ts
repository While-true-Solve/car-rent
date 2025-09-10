import { Module } from '@nestjs/common';
import { AdopdetCarService } from './adopdet-car.service';
import { AdopdetCarController } from './adopdet-car.controller';

@Module({
  controllers: [AdopdetCarController],
  providers: [AdopdetCarService],
})
export class AdopdetCarModule {}
