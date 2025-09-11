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
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

// === Swagger dekoratorlari shu faylda ===
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

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Paymentni Ruchnoy create qilish
  @Post()
  @ApiBody({ type: CreatePaymentDto })
  @SwagSuccessRes(
    'Payment yaratish',
    201,
    'Payment muvaffaqiyatli yaratildi',
    201,
    'success',
    { id: 1, amount: 200, status: false },
  )
  @SwagFailedRes(
    'Payment yaratish - xato',
    400,
    'Payment yaratishda xatolik',
    400,
    'Invalid data',
  )
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get()
  @SwagSuccessRes(
    'Barcha Paymentlarni olish',
    200,
    'Paymentlar royxati',
    200,
    'success',
    [{ id: 1, amount: 200, status: false }],
  )
  @SwagFailedRes(
    'Paymentlarni olish - xato',
    400,
    'Sorovda xato',
    400,
    'Invalid request',
  )
  findAll() {
    return this.paymentService.findAllPayments();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @SwagSuccessRes(
    'Bitta Paymentni olish',
    200,
    'Payment topildi',
    200,
    'success',
    { id: 1, amount: 200, status: false },
  )
  @SwagFailedRes(
    'Bitta Paymentni olish - xato',
    404,
    'Payment topilmadi',
    404,
    'Not found',
  )
  findOne(@Param('id') id: string) {
    return this.paymentService.findPaymentById(id);
  }

  // payment_status falsedan true ga ozgartirish ruchnoy
  @Patch(':id/confirm')
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @SwagSuccessRes(
    'Paymentni tasdiqlash',
    200,
    'Payment tasdiqlandi',
    200,
    'success',
    { id: 1, status: true },
  )
  @SwagFailedRes(
    'Paymentni tasdiqlash - xato',
    404,
    'Payment topilmadi',
    404,
    'Not found',
  )
  confirm(@Param('id') id: string) {
    return this.paymentService.confirmPayment(id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @SwagSuccessRes(
    'Paymentni ochirish',
    200,
    'Payment ochirildi',
    200,
    'success',
    { id: 1, deleted: true },
  )
  @SwagFailedRes(
    'Paymentni ochirish - xato',
    404,
    'Payment topilmadi',
    404,
    'Not found',
  )
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
