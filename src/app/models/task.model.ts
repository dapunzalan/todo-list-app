import { Priority, Status } from '../enums/task.enum';

export interface Task {
  taskId: string;
  title: string;
  dateCreated: string;
  dateDue: string;
  details: string;
  priority: keyof typeof Priority;
  status: keyof typeof Status;
  attachments: Attachment[];
  subtasks: Subtask[];
  dateCompletion: string | null;
}

export interface Attachment {
  attachmentId: string;
  filename: string;
  fileSize: number;
  filePath: string;
}

export interface Subtask {
  subtaskId: string;
  title: string;
  status: keyof typeof Status;
  dateCompletion: string | null;
}
