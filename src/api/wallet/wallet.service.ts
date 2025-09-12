import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Roles, ROLES_KEY } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { successRes } from 'src/infrastructure/response/successRes';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer, Wallet } from 'src/core';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.servise';

@Injectable()
export class WalletService extends BaseService <CreateWalletDto,UpdateWalletDto,Wallet>{
  constructor(
    @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(Customer)private readonly customerRepo:Repository<Customer>
  ) {
    super(walletRepo)
  }

  async createeWallet(createWalletDto: CreateWalletDto, user: any) {
    const { customer_id, card } = createWalletDto;
    const customer = await this.customerRepo.findOne({ where: { id: customer_id } });
    if (!customer) {
      throw new NotFoundException('Bunday customer topilmadi..!');
    }

    if (!customer_id) {
      throw new ForbiddenException('customer_id kiritilishi shart..!');
    }

    const isOwner = user.id === customer_id;
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Sizda wallet yaratishga ruxsatinggiz yoq');
    }

    const wallet = this.walletRepo.create({
      customer,
      card
    });
    return successRes(wallet);
    // wallet create bo'ladigan vaqt customer_id kiritadi shuni tekshirish kerak . customer_id mavjudmi? va shu customer_id surov junatdigan odamni idisiga tengmi
  }

  findAllWallet() {
    return `This action returns all wallet`;
  }

  async findOneWallet(id: string) {
    const wallet = await this.walletRepo.findOne({
      where: { id },
      relations: ['customer']
    });
    if (!wallet) {
      throw new NotFoundException('Bunday Id da wallet topilmadi..!');
    }

    return successRes(wallet);
  }

  async updateWallet(id: string, updateWalletDto: UpdateWalletDto) {
    const wallet = await this.walletRepo.findOne({
      where: { id },
      relations: ['customer']
    });

    if (!wallet) {
      
    }
    return `This action updates a #${id} wallet`;
  }

  removeWallet(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
