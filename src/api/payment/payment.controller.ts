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
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { paymentData } from 'src/common/document';

@UseGuards(AuthGuard, RolesGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Paymentni Ruchnoy create qilish
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @SwagSuccessRes(
    'Payment yaratish',
    201,
    'Payment muvaffaqiyatli yaratildi',
    201,
    'success',
    paymentData,
  )
  @SwagFailedRes(400, 'Payment yaratishda xatolik', 400, 'Invalid input data')
  @ApiBody({ type: CreatePaymentDto })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @SwagSuccessRes(
    'Barcha paymentlarni olish',
    200,
    'Paymentlar muvaffaqiyatli olindi',
    200,
    'success',
    [paymentData],
  )
  @SwagFailedRes(400, 'Paymentlarni olishda xatolik')
  findAll() {
    return this.paymentService.findAllPayments();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, 'ID') // customer ozinikini kora olsin
  // @ApiParam({ name: 'id', description: 'Payment ID' })
  @SwagSuccessRes(
    'Bitta paymentni olish',
    200,
    'Payment topildi',
    200,
    'success',
    paymentData,
  )
  @SwagFailedRes(404, 'Payment topilmadi', 404, 'Payment not found')
  findOne(@Param('id') id: string) {
    return this.paymentService.findPaymentById(id);
  }

  // payment_status falsedan true ga ozgartirish ruchnoy
  @Patch(':id/confirm')
  @Roles(UserRole.SUPER_ADMIN)
  @SwagSuccessRes(
    'Paymentni tasdiqlash',
    200,
    'Payment muvaffaqiyatli tasdiqlandi',
    200,
    'success',
    { ...paymentData, payment_status: true },
  )
  @SwagFailedRes(404, 'Payment topilmadi', 404, 'Payment not found')
  confirm(@Param('id') id: string) {
    return this.paymentService.confirmPayment(id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @SwagSuccessRes(
    'Paymentni ochirish',
    200,
    'Payment muvaffaqiyatli ochirildi',
    200,
    'success',
    { deleted: true },
  )
  @SwagFailedRes(404, 'Payment topilmadi', 404, 'Payment not found')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
