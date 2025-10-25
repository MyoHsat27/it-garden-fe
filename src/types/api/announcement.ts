import { Batch } from "./batch";
import { User } from "./user";

export interface Announcement {
  id: number;
  title: string;
  body: string;
  author: User;
  batch: Batch;
  channels: string[];
  publishAt: Date;
  createdAt: Date;
}

export enum NotificationChannel {
  WEB = "web",
  EMAIL = "email",
}
