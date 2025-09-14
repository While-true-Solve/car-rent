import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  applyDecorators,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { orderData } from 'src/common/document';

@UseGuards(AuthGuard, RolesGuard) //  barcha metodlarga guard ishlaydi
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.USER) // faqat Customer order yaratadi
  @SwagSuccessRes(
    'Order yaratish',
    201,
    'Order muvaffaqiyatli yaratildi',
    201,
    'success',
    orderData,
  )
  @SwagFailedRes(400, 'Order yaratishda xatolik', 400, 'Invalid input data')
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  // 2. Order + Payment birga (tranzaksiya orqali)
  @Post('with-payment')
  @Roles(UserRole.USER) // faqat Customer to‘lov qiladi
  @SwagSuccessRes(
    'Order va Payment yaratish',
    201,
    'Order va payment muvaffaqiyatli yaratildi',
    201,
    'success',
    { ...orderData, payment: { id: 'payment-uuid', amount: 350.75 } },
  )
  @SwagFailedRes(
    400,
    'Order + Payment yaratishda xatolik',
    400,
    'Transaction failed',
  )
  async createWithPayment(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrderWithPayment(createOrderDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) // faqat adminlar ko‘radi
  @SwagSuccessRes(
    'Barcha orderlarni olish',
    200,
    'Orderlar royxati muvaffaqiyatli olindi',
    200,
    'success',
    [orderData],
  )
  @SwagFailedRes(400, 'Orderlarni olishda xatolik')
  findAll() {
    return this.orderService.getOrders();
  }

  @Get('paginated')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @SwagSuccessRes(
    'Orderlarni pagination bilan olish',
    200,
    'Orderlar pagination orqali olindi',
    200,
    'success',
    { items: [orderData], total: 1, page: 1, limit: 10 },
  )
  @SwagFailedRes(400, 'Pagination xatolik berdi')
  async getOrdersPaginated(@Query() query: QueryPaginationDto) {
    return this.orderService.getOrdersPaginated(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @SwagSuccessRes(
    'Bitta orderni olish',
    200,
    'Order topildi',
    200,
    'success',
    orderData,
  )
  @SwagFailedRes(404, 'Order topilmadi', 404, 'Order not found')
  findOne(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @SwagSuccessRes(
    'Orderni bekor qilish',
    200,
    'Order muvaffaqiyatli bekor qilindi',
    200,
    'success',
    { ...orderData, status: 'CANCELLED' },
  )
  @SwagFailedRes(404, 'Order topilmadi', 404, 'Order not found')
  async cancel(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @SwagSuccessRes(
    'Orderni ochirish',
    200,
    'Order muvaffaqiyatli ochirildi',
    200,
    'success',
    { deleted: true },
  )
  @SwagFailedRes(404, 'Order topilmadi', 404, 'Order not found')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
