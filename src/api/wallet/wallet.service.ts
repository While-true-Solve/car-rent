import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { UserRole } from 'src/common/enum/user-enum';
import { successRes } from 'src/infrastructure/response/successRes';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer, Wallet } from 'src/core';
import { BaseService } from 'src/infrastructure/base/base.servise';
import type { CustomerRepository } from 'src/core/repository/customer.repository';
import type { WalletRepository } from 'src/core/repository/wallet.repository';
import { ISuccessRes } from 'src/common/interface';

@Injectable()
export class WalletService extends BaseService<CreateWalletDto, UpdateWalletDto, Wallet> {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepo: WalletRepository,
    @InjectRepository(Customer) private readonly customerRepo: CustomerRepository
  ) {
    super(walletRepo)
  }

  // wallet create bo'ladigan vaqt customer_id kiritadi shuni tekshirish kerak .
  //  customer_id mavjudmi? va shu customer_id surov junatdigan odamni idisiga tengmi
  async createeWallet(createWalletDto: CreateWalletDto, user: any): Promise<ISuccessRes> {
    const { customer_id, card } = createWalletDto;
    const customer = await this.customerRepo.findOne({ where: { id: customer_id } });
    if (!customer) {
      throw new NotFoundException('Bunday customer topilmadi..!');
    }

    if (!(user.id === customer_id || [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role))) {
      throw new ForbiddenException('Sizda wallet yaratishga ruxsatingiz yo\'q');
    }



    if (card) {
      const existsCard = await this.walletRepo.findOne({ where: { card } });
      if (existsCard) {
        throw new BadRequestException('Bunday carta raqami mavjud!!!');
      }
    } else {
      throw new BadRequestException('Iltimos carta raqam kiriting!!!');
    }

    const newWallet = this.walletRepo.create({
      customer,
      card
    });

    const wallet = await this.walletRepo.save(newWallet)
    return successRes(wallet);
  }


  async updateWallet(id: string, updateWalletDto: UpdateWalletDto, user: any): Promise<ISuccessRes> {
    const wallet = await this.walletRepo.findOne({
      where: { id },
      relations: ['customer']
    });

    if (!wallet) {
      throw new NotFoundException('Not found wallet');
    }

    const { customer_id, card } = updateWalletDto;
    if (card) {
      const existsCard = await this.walletRepo.findOne({ where: { card } });
      if (existsCard && existsCard.id != id) {
        throw new BadRequestException('Bunday carta raqami mavjud!!!');
      }
    }

    const customer = await this.customerRepo.findOne({ where: { id: customer_id } });
    if (!customer) {
      throw new NotFoundException('Bunday customer topilmadi..!');
    }

    if (!(user.id === customer_id || [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role))) {
      throw new ForbiddenException('Sizda wallet yaratishga ruxsatingiz yo\'q');
    }

    await this.walletRepo.update(id, {
      customer,
      card
    });

    const updateWallet = await this.walletRepo.findOne({ where: { id }, relations: ['customer'] });
    return successRes(updateWallet);
  }
}