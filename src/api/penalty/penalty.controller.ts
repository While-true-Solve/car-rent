import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  applyDecorators,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { SwagFailedRes, SwagSuccessRes } from 'src/common/decorator/swaggerSuccesRes-decorator';
import { penaltyData } from 'src/common/document';


@UseGuards(AuthGuard, RolesGuard)
@Controller('penalty')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) { }

  ///
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @SwagSuccessRes(
    'Penalty yaratish',
    201,
    'Penalty muvaffaqiyatli yaratildi',
    201,
    'success',
    penaltyData,
  )
  @SwagFailedRes(400, 'Penalty yaratib bolmadi', 400, 'Invalid data')
  create(@Body() createPenaltyDto: CreatePenaltyDto) {
    return this.penaltyService.createPenaltyForOrder(createPenaltyDto);
  }

  @Get()
  @SwagSuccessRes(
    'Barcha Penaltylarni olish',
    200,
    'Penaltylar royxati',
    200,
    'success',
    [penaltyData],
  )
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll() {
    return this.penaltyService.findAll();
  }

  // Pagination Penalty
  @Get('paginated')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @SwagSuccessRes(
    'Penaltylarni pagination bilan olish',
    200,
    'Penaltylar pagination bilan qaytarildi',
    200,
    'success',
    {
      items: [penaltyData],
      total: 1,
      page: 1,
      limit: 10,
    },
  )
  async findAllPaginated(@Query() query: QueryPaginationDto) {
    return this.penaltyService.findAllPaginated(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @SwagSuccessRes(
    'Penaltyni ID orqali olish',
    200,
    'Penalty topildi',
    200,
    'success',
    penaltyData,
  )
  @SwagFailedRes(404, 'Penalty topilmadi', 404, 'Penalty not found')
  findOne(@Param('id') id: string) {
    return this.penaltyService.findOneById(id);
  }

  ///
  @Patch(':id/pay')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @SwagSuccessRes(
    'Penaltyni tolangan deb belgilash',
    200,
    'Penalty muvaffaqiyatli tolangan deb belgilandi',
    200,
    'success',
    { ...penaltyData, is_paid_penalty: true },
  )
  @SwagFailedRes(404, 'Penalty topilmadi', 404, 'Penalty not found')
  markAsPaid(@Param('id') id: string) {
    return this.penaltyService.markAsPaid(id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @SwagSuccessRes(
    'Penaltyni ochirish',
    200,
    'Penalty muvaffaqiyatli ochirildi',
    200,
    'success',
    { deleted: true },
  )
  @SwagFailedRes(404, 'Penalty topilmadi', 404, 'Penalty not found')
  remove(@Param('id') id: string) {
    return this.penaltyService.remove(id);
  }
}
