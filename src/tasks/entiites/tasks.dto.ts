export class CreateTaskDto {
  title: string;
  owner: string;
}

export class UpdateTaskDto {
  title?: string;
  owner?: string;
  isDone?: boolean;
}
