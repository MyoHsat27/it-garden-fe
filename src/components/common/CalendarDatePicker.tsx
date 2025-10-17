"use client";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface CalendarDatePickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  isDisabled?: boolean;
  disabledBeforeToday?: boolean;
  placeholder?: string;
}

export function CalendarDatePicker({
  label,
  value,
  onChange,
  error,
  isDisabled = false,
  disabledBeforeToday = false,
  placeholder = "Select date",
}: CalendarDatePickerProps) {
  const today = new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full pl-3 text-left font-normal justify-start",
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
            disabled={isDisabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            {value ? format(new Date(value), "yyyy-MM-dd") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (date && onChange) onChange(format(date, "yyyy-MM-dd"));
            }}
            disabled={disabledBeforeToday ? (date) => date < today : undefined}
          />
        </PopoverContent>
      </Popover>

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
