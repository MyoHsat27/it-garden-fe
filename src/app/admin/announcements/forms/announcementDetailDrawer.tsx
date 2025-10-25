import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Announcement } from "@/types/api/announcement";
import { Payment } from "@/types/api/payment";

interface AnnouncementDetailDrawerProps {
  announcement: Announcement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnnouncementDetailDrawer({
  announcement,
  open,
  onOpenChange,
}: AnnouncementDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Payment Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {announcement.id}
        </div>
        {/* <div>
          <strong>Created At:</strong>{" "}
          {new Date(announcement.).toLocaleString()}
        </div> */}
      </div>
    </AppDrawer>
  );
}
