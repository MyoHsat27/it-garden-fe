"use client";

import { TimetableCalendar } from "@/components/common/TimetableCalendar";
import { useGetAdminCalendar } from "@/hooks/useCalendar";
import { CalendarEvent } from "@/types/common/calendarEvent";

export function AdminTimetable() {
  const { data: eventsRes } = useGetAdminCalendar();

  console.log(eventsRes?.data);
  const events = (eventsRes?.data ?? []).map((event: CalendarEvent) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    extendedProps: {
      type: event.type,
      batchName: event.batchName,
      teacherName: event.teacherName,
      classroom: event.classroom,
    },
  }));
  return (
    <>
      <TimetableCalendar events={events} />
    </>
  );
}
