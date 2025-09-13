import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Customer, Order } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { SignInCustomerDto } from './dto/signin-customer.dto';
import { IPayload, ISuccessRes } from 'src/common/interface';
import { successRes } from 'src/infrastructure/response/successRes';
import { Response } from 'express';
import { MoreThan } from 'typeorm';
import { SignOutCustomerDto } from './dto/signout-customer.dto';
import { LoginCustomerDto } from './dto/login.customer-otp.dto';
import { MailerService } from '@nestjs-modules/mailer';
import type { CustomerRepository } from 'src/core';
import { ForgetPassDto } from './dto/forget-pass.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class CustomerService extends BaseService<
  CreateCustomerDto,
  UpdateCustomerDto,
  Customer
> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: CustomerRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailerService,
  ) {
    super(customerRepo);
  }

  async registerCustomer(createCustomerDto: CreateCustomerDto,): Promise<ISuccessRes> {

    const { phone_number, email, password, ...rest } = createCustomerDto;

    const exists_number = await this.customerRepo.findOne({
      where: { phone_number },
    });
    if (exists_number)
      throw new HttpException('Phone number alread exists', 400); // tel raqam unique ekanligini tekshirish

    const exists_email = await this.customerRepo.findOne({ where: { email } });
    if (exists_email) throw new HttpException('Email alread exists', 400); // email unique ekanligini tekshirish

    const hashed_password = await this.crypto.encrypt(password); // parolni hashlash

    // 6 honali OTP generatsiya qilish
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await super.create({
      ...rest,
      email,
      phone_number,
      password: hashed_password,
      otp,
      is_verified: false,
    } as any);

    //Email ga OTP yuborish
    await this.mailService.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: otp,
    });

    return successRes({
      message:
        'Registration successful.Please check your email for OTP and proceed to login.',
      login_link: 'http://localhost:1024/api/v1/customer/logen',
    });
  }

  async loginCustomer(loginCustomerDto: LoginCustomerDto): Promise<ISuccessRes> {
    const { email, otpPass } = loginCustomerDto;
    const customer = await this.customerRepo.findOne({ where: { email } });
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    if (customer.otp !== otpPass) {
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    customer.is_verified = true;
    await this.customerRepo.save(customer);

    return successRes({
      message: 'Login successful'
    });
  }

  async forgetPass(forgetPass: ForgetPassDto): Promise<ISuccessRes> {
    const { email } = forgetPass;

    const customer = await this.customerRepo.findOne({ where: { email } });
    if (!customer) {
      throw new NotFoundException('Unable to find such email!');
    }

    // 6 xonali OTP yaratish
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.customerRepo.update(
      { email },
      {
        otp,
        otp_expires: new Date(Date.now() + 5 * 60 * 1000), // 5 daqiqa amal qiladi
      },
    );

    // OTP ni emailga yuborish (masalan nodemailer bilan)
    await this.mailService.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    return successRes({
      message: 'OTP sent to your email.',
    });
  } //emailga otp jonatish
    
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    
  } // jonatilgan otp ni tekshirib confirmning linkini berish
  // confirmPass //password ni yangilash

  async signInCustomer(signInCustomerDto: SignInCustomerDto,res: Response): Promise<ISuccessRes> {
    const { email, password } = signInCustomerDto;

    const customer = await this.customerRepo.findOne({ where: { email } });
    if (!customer) {
      throw new BadRequestException('username or password incorrect');
    }

    const isMatchPassword = await this.crypto.decrypt(
      password,
      customer?.password as any,
    );
    if (!isMatchPassword) {
      throw new BadRequestException('username or password incorrect');
    }

    const payload: IPayload = {
      id: customer.id,
      isActive: customer.is_active,
      role: customer.role,
    };

    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);

    await this.tokenService.writeCookie(res, 'userToken', refreshToken, 15);

    return successRes({ token: accessToken });
  }

  async signOutCustomer(signOutDto: SignOutCustomerDto,res: Response): Promise<ISuccessRes> {
    const { id } = signOutDto;
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    await this.tokenService.clearCookie(res, 'userToken');

    return successRes({});
  }

  async updateCustomer(id: string,updateCustomerDto: UpdateCustomerDto): Promise<ISuccessRes> {
    const { email, phone_number, password, ...rest } = updateCustomerDto;

    const customer = await this.customerRepo.findOne({ where: { id } });

    if (!customer) {
      throw new BadRequestException('Customer not found..!');
    }

    if (email && email !== customer.email) {
      const exists_email = await this.customerRepo.findOne({
        where: { email },
      });
      if (exists_email) {
        throw new BadRequestException('Email already exists');
      }
      customer.email = email;
    }

    if (phone_number && phone_number !== customer.phone_number) {

      const exists_number = await this.customerRepo.findOne({ where: { phone_number } });
      
      if (exists_number) throw new BadRequestException('Phone number already exists');
      customer.phone_number = phone_number;
    }

    if (password) {
      const hashed_password = await this.crypto.encrypt(password);
      customer.password = hashed_password;
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
    const activeOrder = await this.customerRepo.manager
      .getRepository(Order)
      .findOne({
        where: {
          customer: { id },
          finish_time: MoreThan(new Date()),
        },
      });

    if (activeOrder) {
      throw new BadRequestException(
        'Customer has active rental. Cannot be deleted until rental is finished.',
      );
    }
    await this.customerRepo.remove(customer);
    return successRes({});
  }
}