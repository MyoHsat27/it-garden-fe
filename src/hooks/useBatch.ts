import { useRead, useWrite } from "@/lib/queryClient";
import { Batch } from "@/types/api/batch";
import { PaginatedResponse } from "@/types/api/pagination";

interface BatchFilter {
  teacherId?: number;
  studentId?: number;
  search?: string;
  page?: number;
  limit?: number;
}
export const useGetFilteredBatches = (filter: BatchFilter) => {
  return useRead<PaginatedResponse<Batch>>({
    queryKey: ["batches/filtered", JSON.stringify(filter)],
    url: "/batches/filtered",
    params: filter,
  });
};

export const useGetAllBatches = () => {
  return useRead<{ data: Batch[] }>({
    queryKey: ["batches"],
    url: "/batches",
  });
};

export const useCreateBatch = () => {
  return useWrite<Batch>({
    queryKey: ["batches/filtered"],
    url: "/batches",
    method: "POST",
  });
};

export const useUpdateBatch = (batchId?: number) => {
  return useWrite<Batch>({
    queryKey: ["batches/filtered"],
    url: `/batches/${batchId}`,
    method: "PUT",
  });
};

export const useDeleteBatch = (batchId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["batches/filtered"],
    url: `/batches/${batchId}`,
    method: "DELETE",
  });
};
