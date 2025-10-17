import { useRead, useWrite } from "@/lib/queryClient";
import { PaginatedResponse } from "@/types/api/pagination";
import { TimeSlot } from "@/types/api/timeSlot";

interface TimeSlotFilter {
  search?: string;
  page?: number;
  limit?: number;
}
export const useGetFilteredTimeSlots = (filter: TimeSlotFilter) => {
  return useRead<PaginatedResponse<TimeSlot>>({
    queryKey: ["time-slots/filtered", JSON.stringify(filter)],
    url: "/time-slots/filtered",
    params: filter,
  });
};

export const useGetAllTimeSlots = () => {
  return useRead<{ data: TimeSlot[] }>({
    queryKey: ["time-slots"],
    url: "/time-slots",
  });
};

export const useCreateTimeSlot = () => {
  return useWrite<TimeSlot>({
    queryKey: ["time-slots/filtered"],
    url: "/time-slots",
    method: "POST",
  });
};

export const useUpdateTimeSlot = (timeSlotId?: number) => {
  return useWrite<TimeSlot>({
    queryKey: ["time-slots/filtered"],
    url: `/time-slots/${timeSlotId}`,
    method: "PUT",
  });
};

export const useDeleteTimeSlot = (timeSlotId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["time-slots/filtered"],
    url: `/time-slots/${timeSlotId}`,
    method: "DELETE",
  });
};
