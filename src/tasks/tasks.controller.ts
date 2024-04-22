import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './entiites/tasks.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getAll() {
    return await this.taskService.findAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.taskService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateTaskDto) {
    return await this.taskService.create(data);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    return await this.taskService.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }
}
