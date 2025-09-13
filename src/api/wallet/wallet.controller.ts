import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Delete,
  Patch
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

@UseGuards(AuthGuard, RolesGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER)
  @Post()
  @ApiBearerAuth()
  create(@Body() createWalletDto: CreateWalletDto, @Req() req: Request) {
    this.walletService.createeWallet(createWalletDto, req);
  }

  @Get()
  findAll() {
    return this.walletService.findAll(); //
  }

  @Get(':id')
    findOne(@Param('id') id: string) {
      return this.walletService.findOneById(id, {relations:['customer']});
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto, @Req() req: Request) {
      return this.walletService.updateWallet(id, updateWalletDto, req);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.walletService.remove(id);
    }
}