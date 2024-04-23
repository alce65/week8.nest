import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3, { message: 'Title is too short' })
  title: string;
  @IsString()
  ownerId: string;
}

export class UpdateTaskDto {
  @IsString()
  @MinLength(3, { message: 'Title is too short' })
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  ownerId?: string;
  @IsBoolean()
  @IsOptional()
  isDone?: boolean;
}
