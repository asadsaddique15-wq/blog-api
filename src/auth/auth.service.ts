import {Injectable,UnauthorizedException,ForbiddenException,NotFoundException,} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { Role } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    //send in database
    const user = await this.usersService.create({
      ...dto,password: hashedPassword,
    });
    return {id: user.id,email: user.email,name: user.name,role: user.role,hashedPassword: user.password,};
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //JWT token
    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { message: 'Login successful', access_token: token };
  }

  //any logged-in user
  async getProfile(user: any) {
    const foundUser = await this.usersService.findOne(user.id);
    if (!foundUser) throw new NotFoundException('User not found');

    const { password, ...result } = foundUser; 
    return result;
  }

  async refreshToken(user: any) {
    const newToken = this.jwtService.sign({ id: user.id, role: user.role });
    return { message: 'Token refreshed', access_token: newToken };
  }

  //logged in, admin
  async updateUser(id: number, dto: UpdateUserDto, currentUser: any) {
    const userToUpdate = await this.usersService.findOne(id);
    if (!userToUpdate) throw new NotFoundException('User not found');
    if (currentUser.id !== id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('You cannot update this user');
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    const updated = await this.usersService.update(id, dto);
    const { password, ...result } = updated; 
    return { message: 'User updated successfully', user: result };
  }

  //only admins can delete a user
  async deleteUser(id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersService.remove(id);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
