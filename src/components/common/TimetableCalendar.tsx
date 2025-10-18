"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function TimetableCalendar({ events }: { events: any[] }) {
  const typeColors: Record<string, string> = {
    class: "bg-blue-100 text-blue-800 border-blue-300",
    exam: "bg-red-100 text-red-800 border-red-300",
    assignment: "bg-green-100 text-green-800 border-green-300",
  };

  return (
    <TooltipProvider>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        events={events}
        eventContent={(info) => {
          const { batchName, teacherName, classroom, type } =
            info.event.extendedProps;

          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col gap-1 p-1 rounded-md overflow-hidden">
                  <Badge
                    variant="outline"
                    className={`font-semibold text-xs ${
                      typeColors[type] || ""
                    }`}
                  >
                    {type?.toUpperCase() || "EVENT"}
                  </Badge>

                  <div className="text-sm font-medium truncate max-w-[120px]">
                    {batchName && <span>{batchName} - </span>}
                    {info.event.title}
                  </div>

                  <div className="flex flex-wrap gap-1 text-xs text-gray-600">
                    {teacherName && (
                      <Badge
                        variant="secondary"
                        className="text-xs truncate max-w-[100px]"
                      >
                        👨‍🏫 {teacherName}
                      </Badge>
                    )}
                    {classroom && (
                      <Badge
                        variant="secondary"
                        className="text-xs truncate max-w-[100px]"
                      >
                        🏫 {classroom}
                      </Badge>
                    )}
                  </div>
                </div>
              </TooltipTrigger>

              <TooltipContent className="max-w-xs">
                <div className="flex flex-col gap-1 text-sm">
                  <div className="font-semibold">{info.event.title}</div>
                  {batchName && <div>📘 Batch: {batchName}</div>}
                  {teacherName && <div>👨‍🏫 Teacher: {teacherName}</div>}
                  {classroom && <div>🏫 Classroom: {classroom}</div>}
                  <div>📅 Start: {info.event.start?.toLocaleString()}</div>
                  {info.event.end && (
                    <div>⏰ End: {info.event.end?.toLocaleString()}</div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        }}
      />
    </TooltipProvider>
  );
}
