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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Cron } from '@nestjs/schedule';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';

// === Swagger dekoratorlari to‘g‘ridan-to‘g‘ri shu faylda yozilgan ===
function SwagSuccessRes(
  summary: string,
  status: number = HttpStatus.OK,
  description: string = 'Successful response',
  statusCode: number = HttpStatus.OK,
  message: string = 'success',
  data: object = {},
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status,
      description,
      schema: {
        example: {
          statusCode,
          message,
          data,
        },
      },
    }),
  );
}

function SwagFailedRes(
  summary: string,
  status: number = HttpStatus.BAD_REQUEST,
  description: string = 'Failed response',
  statusCode: number = HttpStatus.BAD_REQUEST,
  errorMessage: string = 'Some error occurred',
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status,
      description,
      schema: {
        example: {
          statusCode,
          error: {
            message: errorMessage,
          },
        },
      },
    }),
  );
}

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @SwagSuccessRes(
    'Yangi Order yaratish',
    201,
    'Order muvaffaqiyatli yaratildi',
    201,
    'success',
    { id: 1, product: 'Phone', price: 200 },
  ) // 1. Faqat Order yaratish (to‘lovsiz)
  @SwagFailedRes(
    'Yangi Order yaratish - xato',
    400,
    'Order yaratishda xatolik',
    400,
    'Invalid data',
  )
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  // 2. Order + Payment birga (tranzaksiya orqali)
  @Post('with-payment')
  @SwagSuccessRes(
    'Order + Payment yaratish',
    201,
    'Order va Payment yaratildi',
    201,
    'success',
    { orderId: 1, paymentId: 10 },
  )
  @SwagFailedRes(
    'Order + Payment yaratish - xato',
    400,
    'Tranzaksiya bajarilmadi',
    400,
    'Payment failed',
  )
  async createWithPayment(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrderWithPayment(createOrderDto);
  }

  @Get()
  @SwagSuccessRes(
    'Barcha Orderlarni olish',
    200,
    'Orderlar royxati',
    200,
    'success',
    [{ id: 1, product: 'Phone', price: 200 }],
  )
  @SwagFailedRes(
    'Orderlarni olish - xato',
    400,
    'Sorovda xato',
    400,
    'Invalid request',
  )
  findAll() {
    return this.orderService.getOrders();
  }

  @Get('paginated')
  @SwagSuccessRes(
    'Orderlarni paginated olish',
    200,
    'Pagination bilan Orderlar',
    200,
    'success',
    {
      data: [
        { id: 1, product: 'Phone', price: 200 },
        { id: 2, product: 'Laptop', price: 500 },
      ],
      totalElements: 50,
      totalPages: 5,
      pageSize: 10,
      currentPage: 1,
      from: 1,
      to: 10,
    },
  )
  @SwagFailedRes(
    'Pagination bilan Orderlarni olish - xato',
    400,
    'Sorovda xato',
    400,
    'Invalid request',
  )
  async getOrdersPaginated(@Query() query: QueryPaginationDto) {
    return this.orderService.getOrdersPaginated(query);
  }

  @Get(':id')
  @SwagSuccessRes('Bitta Orderni olish', 200, 'Order topildi', 200, 'success', {
    id: 1,
    product: 'Phone',
    price: 200,
  })
  @SwagFailedRes(
    'Bitta Orderni olish - xato',
    404,
    'Order topilmadi',
    404,
    'Not found',
  )
  findOne(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/cancel')
  @SwagSuccessRes(
    'Orderni bekor qilish',
    200,
    'Order bekor qilindi',
    200,
    'success',
    { id: 1, status: 'canceled' },
  )
  @SwagFailedRes(
    'Orderni bekor qilish - xato',
    404,
    'Order topilmadi',
    404,
    'Not found',
  )
  async cancel(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id')
  @SwagSuccessRes('Orderni ochirish', 200, 'Order ochirildi', 200, 'success', {
    id: 1,
    deleted: true,
  })
  @SwagFailedRes(
    'Orderni ochirish - xato',
    404,
    'Order topilmadi',
    404,
    'Not found',
  )
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
