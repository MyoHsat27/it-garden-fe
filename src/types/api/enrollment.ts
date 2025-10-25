import { Batch } from "./batch";
import { Payment } from "./payment";
import { Student } from "./student";

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
}

export enum PaymentMethod {
  KBZ_SAVING = "KBZ_SAVING",
  AYA_SAVING = "AYA_SAVING",
  KPAY = "KPAY",
  AYA_PAY = "AYA_PAY",
  WAVE = "WAVE",
  FOC = "FOC",
  CASH = "CASH",
}

export enum EnrollmentStatus {
  ACTIVE = "active",
  DROPPED = "dropped",
  COMPLETED = "completed",
}

export interface Enrollment {
  id: number;
  feeAmount: string;
  discountAmount: number;
  finalFee: string;
  paymentMethod: PaymentMethod;
  enrollmentStatus: EnrollmentStatus;
  feeStatus: PaymentStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  student: Student;
  batch: Batch;
  payment?: Payment | null;
}
