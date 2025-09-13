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
import type { Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';

@UseGuards(AuthGuard, RolesGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Roles('public')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.registerCustomer(createCustomerDto);
  }

  @Get()
  @ApiBearerAuth()
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;
    const where = query
      ? { email: ILike(`%${query}%`), role: UserRole.ADMIN }
      : { role: UserRole.ADMIN };
    return this.customerService.findAllWithPagination({
      where,
      order: { created_at: 'DESC' },
      select: {
        id: true,
        is_active: true,
      },
      skip: page,
      take: limit,
    });
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get('all/admins')
  findAll() {
    return this.customerService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, 'ID')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.removeCustomer(id);
  }

  @Post('signin')
  signIn(@Body() signInCustomerDto: SignInCustomerDto, @Res() res: Response) {
    return this.customerService.signInCustomer(signInCustomerDto, res);
  }

  @Post('signout')
  signOut(
    @Body() signOutCustomerDto: SignOutCustomerDto,
    @Res() res: Response,
  ) {
    return this.customerService.signOutCustomer(signOutCustomerDto, res);
  }
}
