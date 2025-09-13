import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SignInCustomerDto } from './dto/signin-customer.dto';
import { SignOutCustomerDto } from './dto/signout-customer.dto';
import { LoginCustomerDto } from './dto/login.customer-otp.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';
import type { Response } from 'express';

@UseGuards(AuthGuard, RolesGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Roles('public')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.registerCustomer(createCustomerDto);
  }

  @Roles('public')
  @Post('logen')
  login(@Body() loginCustomerDto: LoginCustomerDto) {
    return this.customerService.loginCustomer(loginCustomerDto);
  }

  @Get()
  @ApiBearerAuth()
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;
    const where = query
      ? { full_name: ILike(`%${query}%`) }
      : { };
    return this.customerService.findAllWithPagination({
      where,
      order: { created_at: 'DESC' },
      select: {
        id: true,
        is_active: true,
      },
      relations:{ orders:true, wallets:true, comments:true, adoptedCars:true, },
      skip: page,
      take: limit,
    });
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get('all')
  findAll() {
    return this.customerService.findAll({ relations: { orders: true, wallets: true, comments: true, adoptedCars: true, } });
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOneById(id, { relations: { orders: true, wallets: true, comments: true, adoptedCars: true, } });
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.removeCustomer(id);
  }

  @Roles('ID')
  @Post('signin')
  signIn(@Body() signInCustomerDto: SignInCustomerDto, @Res() res: Response) {
    return this.customerService.signInCustomer(signInCustomerDto, res);
  }

  @Roles('ID')
  @Post('signout')
  signOut(
    @Body() signOutCustomerDto: SignOutCustomerDto,
    @Res() res: Response,
  ) {
    return this.customerService.signOutCustomer(signOutCustomerDto, res);
  }
}