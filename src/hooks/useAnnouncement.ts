import { useRead, useWrite } from "@/lib/queryClient";
import { PaginatedResponse } from "@/types/api/pagination";
import { Announcement } from "@/types/api/announcement";

interface AnnouncementFilter {
  search?: string;
  page?: number;
  limit?: number;
}

export const useGetFilteredAnnouncements = (filter: AnnouncementFilter) => {
  return useRead<PaginatedResponse<Announcement>>({
    queryKey: ["announcements/filtered", JSON.stringify(filter)],
    url: "/announcements/filtered",
    params: filter,
  });
};

export const useCreateAnnouncement = () => {
  return useWrite<Announcement>({
    queryKey: ["announcements/filtered"],
    url: "/announcements",
    method: "POST",
  });
};
