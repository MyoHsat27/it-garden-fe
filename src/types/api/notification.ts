import { User } from "./user";

export enum NotificationType {
  ANNOUNCEMENT = "announcement",
  ASSIGNMENT_CREATED = "assignment_created",
  ASSIGNMENT_SUBMITTED = "assignment_submitted",
  ASSIGNMENT_GRADED = "assignment_graded",
  CHAT_MESSAGE = "chat_message",
  CUSTOM = "custom",
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  type: NotificationType;
  payload: any;
  sourceId?: number;
  recipient: User;
  channels: string[];
  createdAt: Date;
}
