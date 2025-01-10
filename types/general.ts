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
  pendingAuditors?: string[];
}

export interface User {
  name: string;
  photoURL: string;
  email: string;
  uid: string;
  createdAt: string;
  challenges?: string[];
}

export enum NotificationType {
  AUDITOR_REQUEST = "auditor_request",
  PROGRESS_UPDATE = "progress_update",
}

export interface Notification {
  id: string; // Firestore document ID
  author: string; // UID of the user who triggered the notification
  recipient: string; // UID of the user receiving the notification
  message: string; // Notification text
  type: NotificationType; // Notification type
  challengeId?: string; // Related challenge ID
  createdAt: string; // Timestamp of the notification
  read: boolean; // Whether the notification has been read
  status?: string;
}
