export type Progress = {
  proofType: "photo";
  url: string;
  description?: string;
  timestamp: string;
};

export enum ChallengeStatus {
  UPCOMING = "upcoming",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  wagerAmount: number;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  creator: string;
  progress?: Progress[];
  auditors?: string[];
}

export interface User {
  name: string;
  photoURL: string;
  email: string;
  uid: string;
  createdAt: string;
  challenges?: string[];
}
