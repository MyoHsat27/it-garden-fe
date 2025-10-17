import { Admin } from "./admin";
import { Student } from "./student";
import { Teacher } from "./teacher";

export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

export interface User {
  id: number;
  username: string;
  email: string;
  isEmailVerified: boolean;
  userRole: UserRole;
  studentProfile?: Student | null;
  teacherProfile?: Teacher | null;
  adminProfile?: Admin | null;
}
