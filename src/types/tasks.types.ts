export interface ITaskItem {
  uniqueId: string;
  taskName: string;
  targetNumOfSessions: number;
  completedNumOfSessions: number;
  category_name: string | null;
  category_colour: string | null;
  isArchived: boolean;
  isCompleted: boolean;
  isSelectedForTimer: boolean;
  isSelectedForEdit: boolean;
}

export interface ITaskInTheYear {
  taskName: string;
  dateOfSession: string;
  completedNumOfMinutes: number;
  category_name: string | null;
  category_colour: string | null;
}

export interface UpdateTaskAfterSessioPayload {
  task_id: string;
  number_of_sessions: number;
  number_of_minutes: number;
}

export interface ArchiveTaskPayload {
  task_id: string;
}

export interface CreateNewTaskPayload {
  task_id: string;
  task_name: string;
  target_num_of_sessions: number;
  category_name?: string;
  category_colour?: string;
}

export interface DeleteExistingTaskPayload {
  task_id: string;
}

export interface UpdateExistingTaskPayload {
  task_id: string;
  task_name: string;
  target_num_of_sessions: number;
  category_name?: string;
  category_colour?: string;
}
