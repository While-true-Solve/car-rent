import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';

@UseGuards(AuthGuard, RolesGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER)
  @Post()
  @ApiBearerAuth()
  create(@Body() createWalletDto: CreateWalletDto, @Req() req: Request) { // Shu yerda hatolik bolishi mumkin
    this.walletService.createeWallet(createWalletDto, req);

  }

  @Get()
  findAll() {
    return this.walletService.findAll(); //
  }

  // @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.walletService.findOneBy(id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
  //     return this.walletService.updateWallet(id, updateWalletDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.walletService.removeWallet(id);
  //   }
}