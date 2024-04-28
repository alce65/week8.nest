import { ImgData } from '../../types/image.data';
import { Task } from '../../tasks/entites/task.entity';

export type Role = 'admin' | 'user' | 'guest';

export class User {
  id: string;
  email: string;
  password?: string;
  role: Role;
  tasks: Array<Omit<Task, 'owner'>>;
  avatar: Partial<ImgData> | null;
}

export class SignUser {
  id: string;
  email?: string;
  password: string;
  role: Role;
}
