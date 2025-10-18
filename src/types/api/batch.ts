import { Classroom } from "./classroom";
import { Course } from "./course";
import { Teacher } from "./teacher";
import { TimeTable } from "./timeTable";

export enum BatchStatus {
  ACTIVE = "active",
  FUTURE = "future",
  COMPLETED = "completed",
}

export interface Batch {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  spotsLeft: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  course: Course;
  teacher: Teacher;
  classroom: Classroom;
  timetables: TimeTable[];
}
