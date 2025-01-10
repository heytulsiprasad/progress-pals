import { Notification, NotificationType } from "@/types/general";
import { FaCheck, FaTimes } from "react-icons/fa";
import clsx from "clsx";

interface NotificationItemProps {
  notification: Notification;
  onAction: (id: string, action: "accept" | "reject") => void;
}

const NotificationItem = ({
  notification,
  onAction,
}: NotificationItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-700 font-medium mb-2">
            {notification.message}
          </p>
          <span
            className={clsx("text-xs px-2 py-1 rounded-full font-medium", {
              "bg-blue-100 text-blue-700":
                notification.type === NotificationType.AUDITOR_REQUEST,
              "bg-green-100 text-green-700":
                notification.type === NotificationType.CHALLENGE_COMPLETED,
              "bg-yellow-100 text-yellow-700":
                notification.type === NotificationType.CHALLENGE_UPDATED,
            })}
          >
            {notification.type}
          </span>
        </div>

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
      </div>
    </div>
  );
};

export default NotificationItem;
