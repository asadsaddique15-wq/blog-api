import {Controller,Post,Body,Get,UseGuards,Req,Patch,Delete,Param,ParseIntPipe,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '../users/users.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth') // Swagger group
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  //any logged-in user can get their own profile
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user);
  }

  //any logged-in user can refresh their own JWT
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  refreshToken(@Req() req: any) {
    return this.authService.refreshToken(req.user);
  }

  //logged-in user can update their own data, admins can update any user
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.authService.updateUser(id, dto, req.user);
  }

  //only admin can delete a user
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.deleteUser(id);
  }
}
