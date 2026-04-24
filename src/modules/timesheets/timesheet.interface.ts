export interface ITimesheet {
  id: string;
  userId: string;
  date: string;
  project: string;
  description: string;
  hours: number;
  hourlyRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTimesheetValues {
  date: string;
  project: string;
  description: string;
  hours: number;
  hourlyRate: number;
}

export interface IUpdateTimesheetValues {
  date?: string;
  project?: string;
  description?: string;
  hours?: number;
}

export interface IGetTimesheetsParams {
  cursor?: string;
  limit?: number;
  search?: string;
}

export interface IGetTimesheetsResponse {
  timesheets: ITimesheet[];
  nextCursor: string | null;
}

export interface ITimesheetDateGroup {
  date: string;
  projects: number;
  totalHours: number;
  timesheets: ITimesheet[];
}
