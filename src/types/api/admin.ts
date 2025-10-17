import { Role } from "./role";
import { User } from "./user";
import { Gender } from "@/constants/gender";

export interface Admin {
  id: number;
  fullName: string;
  phone: string;
  address: string;
  gender: Gender;
  status: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
  user: User;
}
