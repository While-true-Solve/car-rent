import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';
import { SwagFailedRes, SwagSuccessRes } from 'src/common/decorator/swaggerSuccesRes-decorator';
import { commentData } from 'src/common/document/res-data-swagger/comment-data';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @SwagSuccessRes(
    'create comment',
    HttpStatus.CREATED,
    'function created comment',
    201,
    'success',
    commentData
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    'Failed creating comment', // Kamentariya yaratilmadi
    400,
    'Already exists or invalid data' // Allaqachon mavjud yoki yaroqsiz ma’lumotlar
  )
  @Roles(UserRole.SUPER_ADMIN, 'ID')
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }


  @SwagSuccessRes(
    'Get comments with pagination', // Sahifalash orqali kamentlarni oling
    HttpStatus.OK,
    'Successfully retrieved comments with pagination', // Sahifalangan fikrlar olindi
    200,
    'success',
    [commentData],
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    'Failed to get comment', // Fikr olinmadi
    404,
    'No comment found' // Hech qanday fikr topilmadi
  )
  @Roles('public')
  @Get()
  @ApiBearerAuth()
  findAllWithPaginationComment(@Query() queryDto: QueryPaginationDto) {
    const { query, page = 1, limit = 10 } = queryDto;

    const where = query ? { id: ILike(`%${query}%`) } : {};

    return this.commentService.findAllWithPagination({
      where,
      order: { created_at: 'DESC' },
      relations: { car: true, customer: true },
      skip: page,
      take: limit,
    });
  }

  @SwagSuccessRes(
    'Get all comments',
    HttpStatus.OK,
    'Successfully retrieved all comments',
    200,
    'success',
    [commentData],
  )
  @Roles('public')
  @Get('all')
  findAll() {
    return this.commentService.findAll();
  }

  @SwagSuccessRes(
    'Get comment by ID',
    HttpStatus.OK,
    'Successfully retrieved comment by ID',
    200,
    'success',
    commentData
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    'Comment not found',
    404,
    'Comment with given ID does not exist',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, 'ID')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOneById(id);
  }

  @SwagSuccessRes(
    'Update comment',
    HttpStatus.OK,
    'Comment updated successfully',
    200,
    'success',
    commentData,
  )
  @SwagFailedRes(
    HttpStatus.BAD_REQUEST,
    'Failed to update comment',
    400,
    'Validation failed or comment not found',
  )
  @Roles('ID')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @SwagSuccessRes(
    'Delete comment',
    HttpStatus.NO_CONTENT,
    'Comment deleted successfully',
    204,
    'success',
    {},
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    'Failed to delete comment',
    404,
    'Comment with given ID does not exist',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
