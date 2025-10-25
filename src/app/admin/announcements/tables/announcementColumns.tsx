import { Column } from "@/components/common/DataTable";
import { truncateDescription } from "@/lib/helpers";
import { Announcement } from "@/types/api/announcement";

export const announcementColumns: Column<Announcement>[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  {
    key: "body",
    label: "Message",
    render: (a: Announcement) => truncateDescription(a.body),
  },
  {
    key: "batch",
    label: "Batch",
    render: (a: Announcement) => (a.batch ? a.batch.name : "all batch"),
  },
  {
    key: "channel",
    label: "Channel",
    render: (a: Announcement) => a.channels.join(", "),
  },
  {
    key: "publishedAt",
    label: "Published At",
    render: (a: Announcement) => new Date(a.publishAt).toLocaleString(),
  },
];
