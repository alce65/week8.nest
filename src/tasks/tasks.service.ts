import { Injectable } from '@nestjs/common';
import { Task } from './entiites/task';

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
  tasks: Task[] = tasks;

  async findAll() {
    return this.tasks;
  }
  async findById(id: string) {
    return this.tasks.find((task) => task.id === id);
  }

  async create(data: Omit<Task, 'id'>) {
    const newTask = { ...data, id: String(this.tasks.length + 1) };
    this.tasks.push(newTask);
    return newTask;
  }

  async update(id: string, data: Partial<Omit<Task, 'id'>>) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      Object.assign(task, data);
      return task;
    }
  }

  async delete(id: string) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index > -1) {
      const task = this.tasks[index];
      this.tasks.splice(index, 1);
      return task;
    }
  }
}
