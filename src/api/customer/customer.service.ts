import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Customer } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { SignInCustomerDto } from './dto/signin-customer.dto';
import { IPayload, ISuccessRes } from 'src/common/interface';
import { successRes } from 'src/infrastructure/response/successRes';
import { Response } from 'express';
import type { CustomerRepository } from 'src/core';
import { MoreThan } from 'typeorm';
import { SignOutCustomerDto } from './dto/signout-customer.dto';
import { CreateOtpDto } from './dto/create-otp.dto';

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

  async sendOTP(createOtpDto: CreateOtpDto) {
    const { email } = createOtpDto;
    
  }

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<ISuccessRes> {
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

  async signInCustomer(signInCustomerDto: SignInCustomerDto, res: Response): Promise<ISuccessRes> {
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

  async signOutCustomer(signOutDto: SignOutCustomerDto, res: Response): Promise<ISuccessRes> {
    const { id } = signOutDto;
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    await this.tokenService.clearCookie(res, 'accesskey');

    return successRes({});
  }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<ISuccessRes> {
    const { email, phone_number, password, ...rest } = updateCustomerDto;

    const customer = await this.customerRepo.findOne({ where: { id } });

    if (!customer) {
      throw new BadRequestException('Customer not found..!');
    }

    if (email && email !== customer.email) {
      const exists_email = await this.customerRepo.findOne({ where: { email } });
      if (exists_email) {
        throw new BadRequestException('Email already exists');
      }
      customer.email = email;
    }

    if (password) {
      const hashed_password = await this.crypto.encrypt(password);
      customer.hashed_password = hashed_password;
    }

    Object.assign(customer, rest);

    await this.customerRepo.save(customer);
    return successRes(customer);
  }

  async removeCustomer(id: string): Promise<ISuccessRes> {
    // customerni o'chirishdan oldin , mashina olganini(order dan finish_time vaqti hozirgi vaqtdan katta bolsa ochirmaslik kerak) tekshirish kerak mashina arendaga olgan bolsa o'chirish mumkin emas
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new BadRequestException('Customer not found..!');
    }
    const activeOrder = await this.customerRepo.manager.getRepository('Order').findOne({
      where: {
        customer: { id },
        finish_time: MoreThan(new Date()),
      },
    });

    if (activeOrder) {
      throw new BadRequestException('Customer has active rental. Cannot be deleted until rental is finished.');
    }
    await this.customerRepo.remove(customer);
    return successRes({});
  }
}
