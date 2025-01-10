type Progress = {
  proofType: "photo";
  url: string;
  timestamp: string;
};

export interface Challenge {
  title: string;
  description: string;
  wagerAmount: number;
  startDate: string;
  endDate: string;
  status: "in_progress" | "completed" | "failed";
  creator: string;
  progress?: Progress[];
  auditors?: string[];
}
