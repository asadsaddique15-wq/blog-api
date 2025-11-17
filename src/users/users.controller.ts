import { Controller,Get,Post,Patch,Delete,Body,Param,ParseIntPipe,UseGuards,Req,ForbiddenException,} 
     from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './users.entity';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users') //swagger group
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Admin: Create a new user manually' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Admin: get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  //get a user by ID
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get by id, yourself or admin' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const currentUser = req.user;
    //allow self-access or admin
    if (currentUser.id !== id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('You cannot view other users');
    }

    return this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'both user and admin can update' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    const currentUser = req.user;
    if (currentUser.id !== id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('You cannot update this user');
    }
    return this.usersService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Delete a user' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
