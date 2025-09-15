import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
export class WalletService extends BaseService<
  CreateWalletDto,
  UpdateWalletDto,
  Wallet
> {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepo: WalletRepository,
    @InjectRepository(Customer) private readonly customerRepo: CustomerRepository,
  ) {
    super(walletRepo);
  }

  async createeWallet(
    createWalletDto: CreateWalletDto,
    user: any, // req.user keladi
  ): Promise<ISuccessRes> {
    const { customer_id, card, type } = createWalletDto;

    const customer = await this.customerRepo.findOne({ where: { id: customer_id } });
    if (!customer) {
      throw new NotFoundException('Bunday customer topilmadi..!');
    }

    if (!(user.id === customer_id || [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER].includes(user.role))) {
      throw new ForbiddenException("Sizda wallet yaratishga ruxsatingiz yo'q");
    }

    const existsCard = await this.walletRepo.findOne({ where: { card } });
    if (existsCard) {
      throw new BadRequestException('Bunday karta raqami mavjud!!!');
    }

    const newWallet = this.walletRepo.create({
      customer,
      card,
      type,
    });

    const wallet = await this.walletRepo.save(newWallet);
    return successRes(wallet);
  }

  async findAllWallet(): Promise<ISuccessRes> {
    const wallets = await this.walletRepo.find({
      relations: ['customer'],
      order: { created_at: 'DESC' },
    });

    return successRes(wallets);
  }

  async updateWallet(
    id: string,
    updateWalletDto: UpdateWalletDto,
    user: any,
  ): Promise<ISuccessRes> {
    const wallet = await this.walletRepo.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!wallet) throw new NotFoundException('Not found wallet');

    const { customer_id, card, type } = updateWalletDto;

    if (card) {
      const existsCard = await this.walletRepo.findOne({ where: { card } });
      if (existsCard && existsCard.id !== id) {
        throw new BadRequestException('Bunday karta raqami mavjud!!!');
      }
    }

    const customer = await this.customerRepo.findOne({ where: { id: customer_id } });
    if (!customer) throw new NotFoundException('Bunday customer topilmadi..!');

    if (!(user.id === customer_id || [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role))) {
      throw new ForbiddenException("Sizda walletni yangilashga ruxsatingiz yo'q");
    }

    await this.walletRepo.update(id, { customer, card, type });

    const updatedWallet = await this.walletRepo.findOne({
      where: { id },
      relations: ['customer'],
    });

    return successRes(updatedWallet);
  }

  async remove(id: string): Promise<ISuccessRes> {
    const wallet = await this.walletRepo.findOne({ where: { id } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    await this.walletRepo.delete(id);
    return successRes({});
  }
}