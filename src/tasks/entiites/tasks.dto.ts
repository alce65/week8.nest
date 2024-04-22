import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3, { message: 'Title is too short' })
  title: string;
  @IsString()
  owner: string;
}

export class UpdateTaskDto {
  @IsString()
  @MinLength(3, { message: 'Title is too short' })
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  owner?: string;
  @IsBoolean()
  @IsOptional()
  isDone?: boolean;
}
