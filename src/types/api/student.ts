import { Gender } from "@/constants/gender";
import { User } from "./user";

export enum StudentStatus {
  ACTIVE = "active",
  DROPPED_OUT = "dropped_out",
  COMPLETED = "completed",
}

export interface Student {
  id: number;
  registrationNumber: string;
  fullName: string;
  phone: string;
  address: string;
  gender: Gender;
  status: StudentStatus;
  guardianContact: string;
  guardianName: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}
