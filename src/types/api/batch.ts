import { Course } from "./course";
import { Teacher } from "./teacher";

export interface Batch {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  course: Course;
  teacher: Teacher;
}
