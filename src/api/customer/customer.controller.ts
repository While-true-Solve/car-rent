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
import { ForgetPassDto } from './dto/forget-pass.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ConfirmPassDto } from './dto/confirm-pass.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';
import type { Response } from 'express';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { customerData } from 'src/common/document/res-data-swagger/customer-data';

@UseGuards(AuthGuard, RolesGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @SwagSuccessRes(
    'Register customer',
    201,
    'Customer registered successfully',
    201,
    'success',
    customerData,
  )
  @SwagFailedRes(
    400,
    'Failed to register customer',
    400,
    'Validation error or already exists',
  )
  @Roles('public')
  @Post('register')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.registerCustomer(createCustomerDto);
  }

  @SwagSuccessRes(
    'Login customer',
    200,
    'Customer logged in successfully',
    200,
    'success',
    { message: 'Login successful' },
  )
  @SwagFailedRes(401, 'Failed to login customer', 401, 'Invalid credentials')
  @Roles('public')
  @Post('login')
  login(@Body() loginCustomerDto: LoginCustomerDto) {
    return this.customerService.loginCustomer(loginCustomerDto);
  }

  @SwagSuccessRes(
    'Forget password',
    200,
    'OTP sent to email successfully',
    200,
    'success',
    { message: 'OTP sent to your email.' },
  )
  @SwagFailedRes(404, 'Failed to send OTP', 404, 'Email not found')
  @Roles('public')
  @Post('forgetPass')
  forgetPass(@Body() forgetPassDto: ForgetPassDto) {
    return this.customerService.forgetPass(forgetPassDto);
  }

  @SwagSuccessRes(
    'Verify OTP',
    200,
    'OTP verified successfully',
    200,
    'success',
    { message: 'OTP verified successfully' },
  )
  @SwagFailedRes(400, 'Failed to verify OTP', 400, 'Invalid or expired OTP')
  @Roles('public')
  @Post('verifyOtp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.customerService.verifyOtp(verifyOtpDto);
  }

  @SwagSuccessRes(
    'Confirm new password',
    200,
    'Password reset successfully',
    200,
    'success',
    { message: 'Password reset successfully' },
  )
  @SwagFailedRes(400, 'Failed to reset password', 400, 'Passwords do not match')
  @Roles('public')
  @Post('confirmPass')
  confirmPass(@Body() confirmPassDto: ConfirmPassDto) {
    return this.customerService.confirmPass(confirmPassDto);
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
  @Roles('public')
  @Post('signIn')
  signIn(
    @Body() signInCustomerDto: SignInCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customerService.signInCustomer(signInCustomerDto, res);
  }

  @SwagSuccessRes(
    'Get customers with pagination',
    200,
    'Customers retrieved successfully with pagination',
    200,
    'success',
    [customerData],
  )
  @SwagFailedRes(404, 'Failed to get customers', 404, 'No customers found')

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get('withPagination')
  @ApiBearerAuth()
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;
    const where = query ? { full_name: ILike(`%${query}%`) } : {};
    return this.customerService.findAllWithPagination({
      where,
      select: { id: true, is_active: true },
      relations: {
        orders: true,
        wallets: true,
        comments: true,
        adoptedCars: true,
      },
      relations: {
        orders: true,
        wallets: true,
        comments: true,
        adoptedCars: true,
      },
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
  @SwagFailedRes(404, 'Failed to get customers', 404, 'No customers found')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get('all')
  @ApiBearerAuth()
  findAll() {
    return this.customerService.findAll({
      relations: {
        orders: true,
        wallets: true,
        comments: true,
        adoptedCars: true,
      },
    });
  }

  @SwagSuccessRes(
    'Get customer by ID',
    200,
    'Customer retrieved successfully',
    200,
    'success',
    customerData,
  )
  @SwagFailedRes(404, 'Failed to get customer', 404, 'Customer not found')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.customerService.findOneById(id, {
      relations: {
        orders: true,
        wallets: true,
        comments: true,
        adoptedCars: true,
      },
    });
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
  @ApiBearerAuth()
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
  @SwagFailedRes(404, 'Failed to delete customer', 404, 'Customer not found')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @Delete(':id')
  @ApiBearerAuth()
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
  @Roles('public')
  @Post('signin')
  signIn(
    @Body() signInCustomerDto: SignInCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
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
  @Post('signOut')
  @ApiBearerAuth()
  signOut(
    @Body() signOutCustomerDto: SignOutCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customerService.signOutCustomer(signOutCustomerDto, res);
  }
}
