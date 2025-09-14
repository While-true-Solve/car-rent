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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
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
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard) //  barcha metodlarga guard ishlaydi
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @SwagSuccessRes(
    'Order yaratish',
    201,
    'Order muvaffaqiyatli yaratildi',
    201,
    'success',
    orderData,
  )
  @SwagFailedRes() // faqat Customer order yaratadi
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  // 2. Order + Payment birga (tranzaksiya orqali)
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
  @Post('with-payment')
  @Roles(UserRole.USER, UserRole.SUPER_ADMIN) // faqat Customer to‘lov qiladi
  @ApiBearerAuth()
  async createWithPayment(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrderWithPayment(createOrderDto);
  }

  @SwagSuccessRes(
    'Barcha orderlarni olish',
    200,
    'Orderlar royxati muvaffaqiyatli olindi',
    200,
    'success',
    [orderData],
  )
  @SwagFailedRes(400, 'Orderlarni olishda xatolik')
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) // faqat adminlar ko‘radi
  @ApiBearerAuth()
  findAll() {
    return this.orderService.getOrders();
  }

  @SwagSuccessRes(
    'Orderlarni pagination bilan olish',
    200,
    'Orderlar pagination orqali olindi',
    200,
    'success',
    { items: [orderData], total: 1, page: 1, limit: 10 },
  )
  @SwagFailedRes(400, 'Pagination xatolik berdi')
  @Get('paginated')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  async getOrdersPaginated(@Query() query: QueryPaginationDto) {
    return this.orderService.getOrdersPaginated(query);
  }

  @SwagSuccessRes(
    'Bitta orderni olish',
    200,
    'Order topildi',
    200,
    'success',
    orderData,
  )
  @SwagFailedRes(404, 'Order topilmadi', 404, 'Order not found')
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @SwagSuccessRes(
    'Orderni bekor qilish',
    200,
    'Order muvaffaqiyatli bekor qilindi',
    200,
    'success',
    { ...orderData, status: 'CANCELLED' },
  )
  @SwagFailedRes(404, 'Order topilmadi', 404, 'Order not found')
  @Patch(':id/cancel')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, 'ID')
  @ApiBearerAuth()
  async cancel(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @SwagSuccessRes(
    'Orderni ochirish',
    200,
    'Order muvaffaqiyatli ochirildi',
    200,
    'success',
    { deleted: true },
  )
  @SwagFailedRes(404, 'Order topilmadi', 404, 'Order not found')
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
