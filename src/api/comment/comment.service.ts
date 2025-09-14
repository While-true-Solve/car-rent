import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { InjectRepository } from '@nestjs/typeorm';
import { Car, Comments, Customer } from 'src/core';
import type { CustomerRepository } from 'src/core/repository/customer.repository';
import type { CommentRepository } from 'src/core/repository/comment.repository';
import type { carRepository } from 'src/core/repository/car.repository';
import { successRes } from 'src/infrastructure/response/successRes';
import { ISuccessRes } from 'src/common/interface';

@Injectable()
export class CommentService extends BaseService<
  CreateCommentDto,
  UpdateCommentDto,
  Comments
> {
  constructor(
    @InjectRepository(Comments) private readonly commentRepo: CommentRepository,
    @InjectRepository(Customer)
    private readonly customerRepo: CustomerRepository,
    @InjectRepository(Car) private readonly carRepo: carRepository,
  ) {
    super(commentRepo);
  }

  async createComment(
    createCommentDto: CreateCommentDto,
  ): Promise<ISuccessRes> {
    const { car_id, customer_id, impression } = createCommentDto;

    const existsCar = await this.carRepo.findOne({ where: { id: car_id } });
    if (!existsCar) {
      throw new NotFoundException('No such car found!!!'); //Bunday mashina topilmadi!!!
    }

    const existsCustomer = await this.customerRepo.findOne({
      where: { id: customer_id },
    });
    if (!existsCustomer) {
      throw new NotFoundException('No such customer found!!!'); //Bunday mijoz topilmadi!!!
    }

    const newComment = this.commentRepo.create({
      car: existsCar,
      customer: existsCustomer,
      impression,
    });

    await this.commentRepo.save(newComment);

    return successRes(newComment);
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<ISuccessRes> {
    const { car_id, customer_id, impression } = updateCommentDto;

    const existingComment = await this.commentRepo.findOne({ where: { id } });
    if (!existingComment) {
      throw new NotFoundException('No such comment found!!!'); // Bunday comment topilmadi!!!
    }

    if (car_id) {
      const existsCar = await this.carRepo.findOne({ where: { id: car_id } });
      if (!existsCar) {
        throw new NotFoundException('No such car found!!!'); //Bunday mashina topilmadi!!!
      }
      existingComment.car = existsCar;
    }

    if (customer_id) {
      const existsCustomer = await this.customerRepo.findOne({
        where: { id: customer_id },
      });
      if (!existsCustomer) {
        throw new NotFoundException('No such customer found!!!'); //Bunday mijoz topilmadi!!!
      }
      existingComment.customer = existsCustomer;
    }

    if (impression != undefined) {
      existingComment.impression = impression;
    }

    await this.commentRepo.save(existingComment);

    return successRes(existingComment);
  }
}
