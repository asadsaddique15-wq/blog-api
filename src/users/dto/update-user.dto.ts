import { IsOptional, IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { Role } from '../users.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string; //match entity property

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  @MinLength(6)
  password?: string; 

  @IsOptional()
  @IsEnum(Role)
  role?: Role; 
}
