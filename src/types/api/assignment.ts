import { Batch } from "./batch";
import { Media } from "./media";

export interface Assignment {
  id: number;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  batch: Batch;
  media: Media;
  createdAt: Date;
  updatedAt: Date;
}
