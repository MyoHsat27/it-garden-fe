"use client";

import { TimetableCalendar } from "@/components/common/TimetableCalendar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetTeacherCalendar } from "@/hooks/useCalendar";
import { CalendarEvent } from "@/types/common/calendarEvent";

export function TeacherTimetable() {
  const { user } = useAuth();

  const teacherId = user?.teacherProfile?.id;
  const { data: eventsRes } = useGetTeacherCalendar(teacherId || 0);

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
