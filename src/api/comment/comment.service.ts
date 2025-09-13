import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { InjectRepository } from '@nestjs/typeorm';
import { Car, Comments, Customer } from 'src/core';
import type { CustomerRepository } from 'src/core/repository/customer.repository';
import type { CommentRepository } from 'src/core/repository/comment.repository';
import type { CarRepository } from 'src/core/repository/car.repository';
import { successRes } from 'src/infrastructure/response/successRes';

@Injectable()
export class CommentService extends BaseService<CreateCommentDto, UpdateCommentDto, Comment> {
  constructor(
    @InjectRepository(Comments) private readonly commentRepo: CommentRepository,
    @InjectRepository(Customer) private readonly customerRepo: CustomerRepository,
    @InjectRepository(Car) private readonly carRepo: CarRepository
  ) {
    super(commentRepo)
  }

  async createComment(createCommentDto: CreateCommentDto) {
    const { car_id, customer_id, impression } = createCommentDto;

    const existsCar = await this.carRepo.findOne({ where: { id: car_id } });
    if (!existsCar) {
      throw new NotFoundException('No such car found!!!'); //Bunday mashina topilmadi!!!
    }

    const existsCustomer = await this.customerRepo.findOne({ where: { id: customer_id } });
    if (!existsCustomer) {
      throw new NotFoundException('No such customer found!!!'); //Bunday mijoz topilmadi!!!
    }

    const newComment = this.commentRepo.create({
      car: existsCar,
      customer: existsCustomer,
      impression
    });

    await this.commentRepo.save(newComment);

    return successRes(newComment);
  }

  findAllComment() {
    return `This action returns all comment`;
  }

  findOneComment(id: number) {
    return `This action returns a #${id} comment`;
  }

  updateComment(id: string, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  removeComment(id: string) {
    return `This action removes a #${id} comment`;
  }
}
