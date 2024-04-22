import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

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
  async create(@Body() data: any) {
    return await this.taskService.create(data);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: any) {
    return await this.taskService.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }
}