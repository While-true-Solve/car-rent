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
} from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
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

@Controller('penalty')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  ///
  @Post()
  @ApiBody({ type: CreatePenaltyDto })
  @SwagSuccessRes(
    'Penalty yaratish',
    201,
    'Penalty muvaffaqiyatli yaratildi',
    201,
    'success',
    { id: 1, orderId: 10, amount: 50, paid: false },
  )
  @SwagFailedRes(
    'Penalty yaratish - xato',
    400,
    'Penalty yaratishda xatolik',
    400,
    'Invalid data',
  )
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
    [{ id: 1, orderId: 10, amount: 50, paid: false }],
  )
  @SwagFailedRes(
    'Penaltylarni olish - xato',
    400,
    'Sorovda xato',
    400,
    'Invalid request',
  )
  findAll() {
    return this.penaltyService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Penalty ID' })
  @SwagSuccessRes(
    'Bitta Penaltyni olish',
    200,
    'Penalty topildi',
    200,
    'success',
    { id: 1, orderId: 10, amount: 50, paid: false },
  )
  @SwagFailedRes(
    'Bitta Penaltyni olish - xato',
    404,
    'Penalty topilmadi',
    404,
    'Not found',
  )
  findOne(@Param('id') id: string) {
    return this.penaltyService.findOneById(id);
  }

  ///
  @Patch(':id/pay')
  @ApiParam({ name: 'id', description: 'Penalty ID' })
  @SwagSuccessRes(
    'Penaltyni tolangan deb belgilash',
    200,
    'Penalty tolandi',
    200,
    'success',
    { id: 1, paid: true },
  )
  @SwagFailedRes(
    'Penaltyni tolangan deb belgilash - xato',
    404,
    'Penalty topilmadi',
    404,
    'Not found',
  )
  markAsPaid(@Param('id') id: string) {
    return this.penaltyService.markAsPaid(id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Penalty ID' })
  @SwagSuccessRes(
    'Penaltyni ochirish',
    200,
    'Penalty ochirildi',
    200,
    'success',
    { id: 1, deleted: true },
  )
  @SwagFailedRes(
    'Penaltyni ochirish - xato',
    404,
    'Penalty topilmadi',
    404,
    'Not found',
  )
  remove(@Param('id') id: string) {
    return this.penaltyService.remove(id);
  }
}
