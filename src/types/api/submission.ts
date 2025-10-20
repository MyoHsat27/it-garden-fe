import { Assignment } from "./assignment";
import { Enrollment } from "./enrollment";
import { Media } from "./media";

export enum SubmissionStatus {
  PENDING = "pending",
  GRADED = "graded",
}

export interface Submission {
  id: number;
  content: string;
  grade: string;
  feedback: string;
  status: SubmissionStatus;
  submittedAt: string;
  assignment: Assignment;
  enrollment: Enrollment;
  media: Media;
  createdAt: Date;
  updatedAt: Date;
}
