import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  // @IsStrongPassword()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  password?: string;
}
