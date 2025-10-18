import { Enrollment, PaymentMethod } from "./enrollment";

export interface Payment {
  id: number;
  amount: number;
  paidAt: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  enrollment: Enrollment;
}
