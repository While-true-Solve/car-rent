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
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';
import { SwagFailedRes, SwagSuccessRes } from 'src/common/decorator/swaggerSuccesRes-decorator';
import { walletData } from 'src/common/document/res-data-swagger/wallet-data';
import type { IUserRequest } from 'src/common/interface/request-user.interface';

@UseGuards(AuthGuard, RolesGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @SwagSuccessRes(
    'Create wallet',
    201,
    'Wallet created successfully',
    201,
    'success',
    walletData,
  )
  @SwagFailedRes(
    400,
    'Failed to create wallet',
    400,
    'Invalid data or already exists',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER)
  @ApiBearerAuth()
  @Post()
  create(@Body() createWalletDto: CreateWalletDto, @Req() req: IUserRequest) {
    return this.walletService.createeWallet(createWalletDto, req.user);
  }

  @SwagSuccessRes(
    'Get wallets with pagination',
    200,
    'Wallets retrieved successfully with pagination',
    200,
    'success',
    [walletData],
  )
  @SwagFailedRes(
    404,
    'Failed to get wallets',
    404,
    'No wallets found',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @Get()
  findAllPaginationWallet(@Query() queryDto: QueryPaginationDto) {
    const { query, page = 1, limit = 10 } = queryDto;
    const where = query ? { card: ILike(`%${query}%`) } : {};

    return this.walletService.findAllWithPagination({
      where,
      order: { created_at: 'DESC' },
      relations: { customer: true },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  @SwagSuccessRes(
    'Get all wallets',
    200, 
    'All wallets retrieved successfully',
    200,
    'success',
    [walletData],
  )
  @SwagFailedRes(
    404,
    'Failed to get wallets',
    404,
    'No wallets found',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('all')
  findAll() {
    return this.walletService.findAllWallet();
  }

  @SwagSuccessRes(
    'Get wallet by ID',
    200,
    'Wallet retrieved successfully',
    200,
    'success',
    walletData,
  )
  @SwagFailedRes(
    404,
    'Failed to get wallet',
    404,
    'Wallet not found',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, 'ID')
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOneById(id, { relations: ['customer'] });
  }

  @SwagSuccessRes(
    'Update wallet',
    200,
    'Wallet updated successfully',
    200,
    'success',
    walletData,
  )
  @SwagFailedRes(
    400,
    'Failed to update wallet',
    400,
    'Validation failed or not found',
  )
  @Roles('ID')
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Req() req: Request & {user: any},
  ) {
    return this.walletService.updateWallet(id, updateWalletDto, req.user);
  }

  @SwagSuccessRes(
    'Delete wallet',
    204,
    'Wallet deleted successfully',
    204,
    'success',
    {},
  )
  @SwagFailedRes(
    404,
    'Failed to delete wallet',
    404,
    'Wallet not found',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(id);
  }
}