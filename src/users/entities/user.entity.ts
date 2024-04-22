export type Role = 'admin' | 'user' | 'guest';

export class User {
  id: number;
  email: string;
  password: string;
  role: Role;
}
