import { useRead } from "@/lib/queryClient";
import { PaginatedResponse } from "@/types/api/pagination";
import { Payment } from "@/types/api/payment";

interface PaymentFilter {
  studentId?: number;
  search?: string;
  page?: number;
  limit?: number;
}
export const useGetFilteredPayments = (filter: PaymentFilter) => {
  return useRead<PaginatedResponse<Payment>>({
    queryKey: ["payments/filtered", JSON.stringify(filter)],
    url: "/payments/filtered",
    params: filter,
  });
};
