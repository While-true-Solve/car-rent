import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { name } from 'ejs';
import { ILike } from 'typeorm';

@UseGuards(AuthGuard, RolesGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER)
  @Post()
  @ApiBearerAuth()
  create(@Body() createWalletDto: CreateWalletDto, @Req() req: Request) {
    this.walletService.createeWallet(createWalletDto, req);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get()
  @ApiBearerAuth()
  findAllPaginationWallet(@Query() queryDto: QueryPaginationDto) {
    const { query, page = 1, limit = 10 } = queryDto;

    const where = query ? { card: ILike(`%${query}%`) } : {}

    return this.walletService.findAllWithPagination({
      where,
      order: { created_at: 'DESC' },
      relations: { customer: true },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get('all')
  findAll() {
    return this.walletService.findAll(); //
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, 'ID')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOneById(id, { relations: ['customer'] });
  }

  @Roles('ID')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Req() req: Request,
  ) {
    return this.walletService.updateWallet(id, updateWalletDto, req);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(id);
  }
}
