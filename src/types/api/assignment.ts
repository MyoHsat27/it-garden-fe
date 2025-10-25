import { Batch } from "./batch";
import { Media } from "./media";
import { Submission } from "./submission";

export interface Assignment {
  id: number;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  batch: Batch;
  media: Media;
  totalRequiredSubmissions: number;
  currentSubmissionCount: number;
  pendingSubmissionCount: number;
  gradedSubmissionCount: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface StudentAssignment {
  id: number;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: "PENDING" | "SUBMITTED";
  courseName: string;
  teacherName: string;
  batchName: string;
  submission?: Submission;
  media?: Media | null;
  createdAt: Date;
  updatedAt: Date;
}
