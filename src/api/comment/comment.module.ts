import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/core/entity/comment.entity';
import { Customer } from 'src/core/entity/customer.entity';
import { Car } from 'src/core/entity/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Customer, Car])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
