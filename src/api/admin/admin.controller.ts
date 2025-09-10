import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RolesGuard } from '../../common/guard/roles.guard';
import { AuthGuard } from '../../common/guard/auth.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { SignInDto } from './dto/signin-admin.dto';
import type { Response } from 'express';

@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Roles('public')
  @Post('signin')
  signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signIn(signInDto, res);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Roles(UserRole.SUPER_ADMIN, 'ID')
  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.adminService.findOneById(id);
  }

  @Roles(UserRole.SUPER_ADMIN, 'ID') /**kallani ishlating jigar */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
