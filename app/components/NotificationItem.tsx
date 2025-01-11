import { Notification, NotificationType } from "@/types/general";
import { FaCheck, FaTimes, FaChevronRight } from "react-icons/fa";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: Notification;
  onAction: (id: string, action?: "accept" | "reject") => void;
}

const NotificationBadge = ({ type }: { type: NotificationType }) => {
  const badgeStyles = {
    [NotificationType.AUDITOR_REQUEST]: "bg-blue-100 text-blue-700",
    [NotificationType.PROGRESS_UPDATE]: "bg-purple-100 text-purple-700",
    [NotificationType.REVIEW_REQUEST]: "bg-orange-100 text-orange-700",
    [NotificationType.APPROVAL_NOTICE]: "bg-green-100 text-green-700",
    [NotificationType.REJECTION_NOTICE]: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={clsx(
        "text-xs px-2 py-1 rounded-full font-medium",
        badgeStyles[type]
      )}
    >
      {type.replace("_", " ").toUpperCase()}
    </span>
  );
};

const NotificationItem = ({
  notification,
  onAction,
}: NotificationItemProps) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-700 font-medium mb-2">
            {notification.message}
          </p>
          <NotificationBadge type={notification.type} />
        </div>

        {/* Request to be an auditor in open challenge */}
        {notification.type === NotificationType.AUDITOR_REQUEST && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAction(notification.id, "accept")}
              className="p-2 rounded-full hover:bg-green-50 text-green-600 transition-colors"
              title="Accept"
            >
              <FaCheck size={18} />
            </button>
            <button
              onClick={() => onAction(notification.id, "reject")}
              className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
              title="Reject"
            >
              <FaTimes size={18} />
            </button>
          </div>
        )}

        {/* Open challenge for specific notifications */}
        {[
          NotificationType.APPROVAL_NOTICE,
          NotificationType.REJECTION_NOTICE,
          NotificationType.REVIEW_REQUEST,
        ].includes(notification.type) && (
          <button
            onClick={() => {
              // Mark as read
              onAction(notification.id);

              // Go to challenge
              router.push(`/challenges/${notification.challengeId}`);
            }}
            className="btn btn-primary btn-sm"
          >
            View Challenge
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
