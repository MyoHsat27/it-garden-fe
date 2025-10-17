import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Batch } from "@/types/api/batch";

interface BatchDetailDrawerProps {
  batch: Batch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchDetailDrawer({
  batch,
  open,
  onOpenChange,
}: BatchDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Course Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {batch.id}
        </div>
        <div>
          <strong>Name:</strong> {batch.name}
        </div>
        <div>
          <strong>Description:</strong> {batch.description}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(batch.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
