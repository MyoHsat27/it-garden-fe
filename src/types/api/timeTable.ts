import { Batch } from "./batch";
import { Classroom } from "./classroom";
import { Teacher } from "./teacher";
import { TimeSlot } from "./timeSlot";

export interface TimeTable {
  id: number;
  dayOfWeek: number;
  batch: Batch;
  classroom: Classroom;
  teacher: Teacher;
  timeSlot: TimeSlot;
  createdAt: string;
  updatedAt: string;
}
