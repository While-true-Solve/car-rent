import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Customer } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { SignInCustomerDto } from './dto/signin-customer.dto';
import { IPayload } from 'src/common/interface';
import { successRes } from 'src/infrastructure/response/successRes';
import { Response } from 'express';
import type { CustomerRepository } from 'src/core/repository/customer.repository';

@Injectable()
export class CustomerService extends BaseService<
  CreateCustomerDto,
  UpdateCustomerDto,
  Customer
  >  {
  constructor(
    @InjectRepository(Customer) private readonly customerRepo: CustomerRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(customerRepo)
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    const { phone_number, email, password, ...rest } = createCustomerDto;
    const exists_number = await this.customerRepo.findOne({ where: { phone_number } });
    if (exists_number) throw new HttpException('Phone number alread exists', 400);

    const exists_email = await this.customerRepo.findOne({ where: { email } });
    if (exists_email) throw new HttpException('Email alread exists', 400);

    const hashed_password = await this.crypto.encrypt(password);

    return super.create({
      ...rest,
      email,
      phone_number,
      hashed_password
    } as any);
  }

  async signInCustomer(signInCustomerDto: SignInCustomerDto, res: Response) {
    const { email, password } = signInCustomerDto;
    const customer = await this.customerRepo.findOne({ where: { email } });
    const isMatchPassword = await this.crypto.decrypt(
      password,
      customer?.hashed_password as any
    )

    if (!customer || !isMatchPassword) throw new BadRequestException('username or password incorect');

    const payload: IPayload = {
      id: customer.id,
      isActive: customer.is_active,
      role:customer.role
    }

    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(res, 'userToken', refreshToken, 15);
    return successRes({ token: accessToken });
  }

  updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} comment`;
  }

  removeCustomer(id: string) {
    // customerni o'chirishdan oldin , mashina olganini tekshirish kerak mashina arendaga olgan bolsa o'chirish mumkin emas
    return `This action removes a #${id} comment`;
  }
}
