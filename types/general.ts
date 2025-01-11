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
  WAITING_FOR_REVIEW = "waiting_for_review",
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
  isPaid?: boolean;
  locked?: boolean; // if author wants no more auditors
  creatorReviews?: { comment: string; timestamp: string }[];
  auditorReviews?: Record<
    string, // Auditor UID
    {
      status: "pending" | "approved" | "rejected"; // Review status
      comment?: string; // Optional feedback
      timestamp: string; // Timestamp of review
    }
  >;
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
  REVIEW_REQUEST = "review_request",
  APPROVAL_NOTICE = "approval_notice",
  REJECTION_NOTICE = "rejection_notice",
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

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

export interface AuditorModalProps extends BaseModalProps {
  onApply: (message: string) => Promise<void>;
}

export interface ReviewModalProps extends BaseModalProps {
  onSubmit: (comments: string) => Promise<void>;
}

export interface ApprovalRejectModalProps extends BaseModalProps {
  onConfirm: (reason: string) => Promise<void>;
  type: "approve" | "reject";
}

export interface PaymentModalProps extends BaseModalProps {
  onConfirmPayment: () => Promise<void>;
  wagerAmount: number;
}
