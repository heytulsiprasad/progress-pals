type Progress = {
  proofType: "photo";
  url: string;
  timestamp: string;
};

export enum ChallengeStatus {
  UPCOMING = "upcoming",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Challenge {
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
