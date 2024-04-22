import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entiites/task';
import { PrismaService } from 'src/prisma/prisma.service';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    owner: 'Description 1',
    isDone: false,
  },
  {
    id: '2',
    title: 'Task 2',
    owner: 'Description 2',
    isDone: false,
  },
  {
    id: '3',
    title: 'Task 3',
    owner: 'Description 3',
    isDone: false,
  },
];

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  tasks: Task[] = tasks;

  async findAll() {
    return this.prisma.task.findMany();
  }
  async findById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async create(data: Omit<Task, 'id'>) {
    return this.prisma.task.create({
      data,
    });
  }

  async update(id: string, data: Partial<Omit<Task, 'id'>>) {
    try {
      return await this.prisma.task.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }
}
