import { useRead } from "@/lib/queryClient";
import { CalendarEvent } from "@/types/common/calendarEvent";

export const useGetAdminCalendar = () => {
  return useRead<{ data: CalendarEvent[] }>({
    queryKey: ["calendars/admins"],
    url: "/calendars/admins",
  });
};

export const useGetTeacherCalendar = (id: number) => {
  return useRead<{ data: CalendarEvent[] }>({
    queryKey: [`calendars/teachers/${id}`],
    url: `/calendars/teachers/${id}`,
  });
};

export const useGetStudentCalendar = (id: number) => {
  return useRead<{ data: CalendarEvent[] }>({
    queryKey: [`calendars/students/${id}`],
    url: `/calendars/students/${id}`,
  });
};
