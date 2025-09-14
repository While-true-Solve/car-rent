import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { penaltyData } from 'src/common/document';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@Controller('penalty')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  ///

  @SwagSuccessRes(
    'Penalty yaratish',
    201,
    'Penalty muvaffaqiyatli yaratildi',
    201,
    'success',
    penaltyData,
  )
  @SwagFailedRes(400, 'Penalty yaratib bolmadi', 400, 'Invalid data')
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  create(@Body() createPenaltyDto: CreatePenaltyDto) {
    return this.penaltyService.createPenaltyForOrder(createPenaltyDto);
  }

  @SwagSuccessRes(
    'Barcha Penaltylarni olish',
    200,
    'Penaltylar royxati',
    200,
    'success',
    [penaltyData],
  )
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  findAll() {
    return this.penaltyService.findAll();
  }

  // Pagination Penalty

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
  @Get('paginated')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  async findAllPaginated(@Query() query: QueryPaginationDto) {
    return this.penaltyService.findAllPaginated(query);
  }

  @SwagSuccessRes(
    'Penaltyni ID orqali olish',
    200,
    'Penalty topildi',
    200,
    'success',
    penaltyData,
  )
  @SwagFailedRes(404, 'Penalty topilmadi', 404, 'Penalty not found')
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.penaltyService.findOneById(id);
  }

  ///

  @SwagSuccessRes(
    'Penaltyni tolangan deb belgilash',
    200,
    'Penalty muvaffaqiyatli tolangan deb belgilandi',
    200,
    'success',
    { ...penaltyData, is_paid_penalty: true },
  )
  @SwagFailedRes(404, 'Penalty topilmadi', 404, 'Penalty not found')
  @Patch(':id/pay')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  markAsPaid(@Param('id') id: string) {
    return this.penaltyService.markAsPaid(id);
  }

  @SwagSuccessRes(
    'Penaltyni ochirish',
    200,
    'Penalty muvaffaqiyatli ochirildi',
    200,
    'success',
    { deleted: true },
  )
  @SwagFailedRes(404, 'Penalty topilmadi', 404, 'Penalty not found')
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.penaltyService.remove(id);
  }
}
