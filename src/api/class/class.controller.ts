import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UserRole } from 'src/common/enum/user-enum';
import { Roles } from 'src/common/decorator/roles-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swaggerSuccesRes-decorator';
import { classData } from 'src/common/document';

@UseGuards(AuthGuard, RolesGuard)
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @SwagSuccessRes(
    'created sigments class',
    HttpStatus.CREATED,
    'created successefully',
    201,
    'success',
    classData,
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @SwagSuccessRes(
    'get sigments cars',
    HttpStatus.OK,
    'get sigments successefully',
    200,
    'success',
    [classData],
  )
  @SwagFailedRes()
  @Roles('public')
  @Get()
  findAll() {
    return this.classService.findAll({ relations: { classCars: true } });
  }

  @SwagSuccessRes(
    'get sigment car',
    HttpStatus.OK,
    'get sigment successefully',
    200,
    'success',
    classData,
  )
  @SwagFailedRes()
  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOneById(id, {
      relations: { classCars: true },
    });
  }

  @SwagSuccessRes(
    'updating sigment car',
    HttpStatus.OK,
    'updateing sigment successefully',
    200,
    'success',
    classData,
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto);
  }

  @SwagSuccessRes(
    'deleting sigment car',
    HttpStatus.OK,
    'deleting sigment successefully',
    200,
    'success',
    {},
  )
  @SwagFailedRes()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}
