import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Roles('ID')
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

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
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  @Roles('public')
  @Get('all')
  findAll() {
    return this.commentService.findAll();
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, 'ID')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOneById(id);
  }

  @Roles('ID')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
