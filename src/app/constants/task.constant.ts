import { SelectType } from "../models/task-form.model";

export const TASK_PRIORITY: SelectType[] = [
  {value: 'LOW', label: 'Low'},
  {value: 'HIGH', label: 'High'},
  {value: 'CRITICAL', label: 'Critical'},
];

export const TASK_STATUS: SelectType[] = [
  {value: 'NOT_STARTED', label: 'Not Started'},
  {value: 'IN_PROGRESS', label: 'In Progress'},
  {value: 'COMPLETE', label: 'Complete'},
  {value: 'CANCELLED', label: 'Cancelled'},
];