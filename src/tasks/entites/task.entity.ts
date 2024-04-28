import { User } from '../../users/entities/user.entity';

export class Task {
  id: string;
  title: string;
  owner: Omit<User, 'tasks' | 'avatar'>;
  isDone: boolean;
}
