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
  completedNumberOfMinutes: number;
  category_name: string | null;
  category_colour: string | null;
}

export interface IGridData {
  date: Date;
  number_of_minutes: number;
}
