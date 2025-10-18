"use client";

import { TimetableCalendar } from "@/components/common/TimetableCalendar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetStudentCalendar } from "@/hooks/useCalendar";
import { CalendarEvent } from "@/types/common/calendarEvent";

export function StudentTimetable() {
  const { user } = useAuth();

  const studentId = user?.studentProfile?.id;
  const { data: eventsRes } = useGetStudentCalendar(studentId || 0);

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
