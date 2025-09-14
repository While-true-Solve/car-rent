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
import { SwagFailedRes, SwagSuccessRes } from 'src/common/decorator/swaggerSuccesRes-decorator';
import { customerData } from 'src/common/document/res-data-swagger/customer-data';

@UseGuards(AuthGuard, RolesGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @SwagSuccessRes(
    'Register customer',
    201,
    'Customer registered successfully',
    201,
    'success',
    customerData
  )
  @SwagFailedRes(
    400,
    'Failed to register customer',
    400,
    'Validation error or already exists',
  )
  @Roles('public')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.registerCustomer(createCustomerDto);
  }

  @SwagSuccessRes(
    'Login customer',
    200,
    'Customer logged in successfully',
    200,
    'success',
    { token: 'jwt.token.here' },
  )
  @SwagFailedRes(
    401,
    'Failed to login customer',
    401,
    'Invalid credentials',
  )
  @Roles('public')
  @Post('logen')
  login(@Body() loginCustomerDto: LoginCustomerDto) {
    return this.customerService.loginCustomer(loginCustomerDto);
  }

  @SwagSuccessRes(
    'Get customers with pagination',
    200,
    'Customers retrieved successfully with pagination',
    200,
    'success',
    [customerData],
  )
  @SwagFailedRes(
    404,
    'Failed to get customers',
    404,
    'No customers found',
  )
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

  @SwagSuccessRes(
    'Get all customers',
    200,
    'All customers retrieved successfully',
    200,
    'success',
    [customerData],
  )
  @SwagFailedRes(
    404,
    'Failed to get customers',
    404,
    'No customers found',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get('all')
  findAll() {
    return this.customerService.findAll({ relations: { orders: true, wallets: true, comments: true, adoptedCars: true, } });
  }

  @SwagSuccessRes(
    'Get customer by ID',
    200,
    'Customer retrieved successfully',
    200,
    'success',
    customerData,
  )
  @SwagFailedRes(
    404,
    'Failed to get customer',
    404,
    'Customer not found',
  )
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOneById(id, { relations: { orders: true, wallets: true, comments: true, adoptedCars: true, } });
  }

  @SwagSuccessRes(
    'Update customer',
    200,
    'Customer updated successfully',
    200,
    'success',
    customerData,
  )
  @SwagFailedRes(
    400,
    'Failed to update customer',
    400,
    'Validation failed or not found',
  )
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @SwagSuccessRes(
    'Delete customer',
    204,
    'Customer deleted successfully',
    204,
    'success',
    {},
  )
  @SwagFailedRes(
    404,
    'Failed to delete customer',
    404,
    'Customer not found',
  )
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.removeCustomer(id);
  }

  @SwagSuccessRes(
    'Sign in customer',
    200,
    'Customer signed in successfully',
    200,
    'success',
    { message: 'Signed in successfully' },
  )
  @SwagFailedRes(
    400,
    'Failed to sign in customer',
    400,
    'Invalid data or session already active',
  )
  @Roles('ID')
  @Post('signin')
  signIn(@Body() signInCustomerDto: SignInCustomerDto, @Res() res: Response) {
    return this.customerService.signInCustomer(signInCustomerDto, res);
  }

  @SwagSuccessRes(
    'Sign out customer',
    200,
    'Customer signed out successfully',
    200,
    'success',
    { message: 'Signed out successfully' },
  )
  @SwagFailedRes(
    400,
    'Failed to sign out customer',
    400,
    'Invalid session or already signed out',
  )
  @Roles('ID')
  @Post('signout')
  signOut(
    @Body() signOutCustomerDto: SignOutCustomerDto,
    @Res() res: Response,
  ) {
    return this.customerService.signOutCustomer(signOutCustomerDto, res);
  }
}