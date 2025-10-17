import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { TimeSlot } from "@/types/api/timeSlot";

interface TimeSlotDetailDrawerProps {
  timeSlot: TimeSlot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TimeSlotDetailDrawer({
  timeSlot,
  open,
  onOpenChange,
}: TimeSlotDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Time Slot Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {timeSlot.id}
        </div>
        <div>
          <strong>Name:</strong> {timeSlot.name}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(timeSlot.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
