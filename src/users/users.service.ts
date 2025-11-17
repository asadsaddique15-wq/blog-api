import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(createUserDto);
    return this.usersRepo.save(user);
  }
  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }
  async update(id: number, data: Partial<User>): Promise<User> {
    const existing = await this.findOne(id);
    Object.assign(existing, data);
    return this.usersRepo.save(existing);
  }
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
    return { message: `User with ID ${id} deleted successfully` };
  }
}

