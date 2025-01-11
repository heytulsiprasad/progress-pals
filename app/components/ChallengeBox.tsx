import { Challenge, ChallengeStatus } from "@/types/general";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import ChallengeStatusBadge from "./ChallengeStatusBadge";

interface ChallengeProps {
  challenge: Challenge;
}

const ChallengeBox = ({ challenge }: ChallengeProps) => {
  return (
    <Link
      href={`/challenges/${challenge.id}`}
      className={clsx(
        "border p-6 rounded-xl shadow-sm transform transition-all duration-200 hover:scale-102 hover:shadow-lg",
        {
          "bg-gray-50 border-gray-200":
            challenge.status === ChallengeStatus.COMPLETED,
          "bg-white border-gray-100":
            challenge.status !== ChallengeStatus.COMPLETED,
        }
      )}
      style={{ maxHeight: "400px" }}
    >
      <div className="flex flex-col h-full">
        <div className="space-y-2 mb-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-tight">
              {challenge.title}
            </h2>
            <ChallengeStatusBadge status={challenge.status} />
          </div>
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

          {/* Creator info moved to bottom right */}
          <div className="flex justify-end mt-2">
            <UserAvatar uid={challenge.creator} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeBox;
