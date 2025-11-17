import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString, IsEnum } from 'class-validator';
import { Role } from '../users.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role; // allow admin or user
}
