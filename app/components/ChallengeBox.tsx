import { Challenge, ChallengeStatus } from "@/types/general";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import Link from "next/link";

interface ChallengeProps {
  challenge: Challenge;
}

/**
 * Based on status enum convert it to a human-readable string.
 */
const getStatusName = (status: string) => {
  switch (status) {
    case ChallengeStatus.IN_PROGRESS:
      return "In Progress";
    case ChallengeStatus.COMPLETED:
      return "Completed";
    case ChallengeStatus.FAILED:
      return "Failed";
    case ChallengeStatus.UPCOMING:
    default:
      return "Upcoming";
  }
};

const ChallengeBox = ({ challenge }: ChallengeProps) => {
  return (
    <Link
      href={`/challenges/${challenge.id}`}
      className={clsx(
        "border p-6 rounded-xl shadow-sm transform transition-all duration-200 hover:scale-102 hover:shadow-lg",
        {
          "bg-gray-50 border-gray-200": challenge.status === "completed",
          "bg-white border-gray-100": challenge.status !== "completed",
        }
      )}
      style={{ maxHeight: "400px" }}
    >
      <div className="flex flex-col h-full">
        <div className="space-y-2 mb-2">
          <h2 className="text-xl font-bold tracking-tight">
            {challenge.title}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            {challenge.description}
          </p>
        </div>

        <div className="mt-auto pt-2 space-y-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Wager</span>
            <span className="font-medium">${challenge.wagerAmount}</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">
              Starts:{" "}
              {formatDistanceToNow(new Date(challenge.startDate), {
                addSuffix: true,
              })}
            </p>
            <p className="text-xs text-gray-500">
              Ends:{" "}
              {formatDistanceToNow(new Date(challenge.endDate), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div className="flex items-center justify-end">
            <span
              className={clsx("px-2 py-1 rounded-full text-xs font-medium", {
                "bg-violet-400 text-black":
                  challenge.status === ChallengeStatus.UPCOMING,
                "bg-yellow-100 text-yellow-700":
                  challenge.status === ChallengeStatus.IN_PROGRESS,
                "bg-green-100 text-green-700":
                  challenge.status === ChallengeStatus.COMPLETED,
                "bg-red-100 text-red-700":
                  challenge.status !== ChallengeStatus.IN_PROGRESS &&
                  challenge.status !== ChallengeStatus.COMPLETED,
              })}
            >
              {getStatusName(challenge.status)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeBox;
