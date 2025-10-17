import { Gender } from "@/constants/gender";
import { User } from "./user";

export interface Teacher {
  id: number;
  fullName: string;
  phone: string;
  address: string;
  gender: Gender;
  createdAt: string;
  updatedAt: string;
  user: User;
}
