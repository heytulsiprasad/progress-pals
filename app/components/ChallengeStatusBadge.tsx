import { ChallengeStatus } from "@/types/general";
import clsx from "clsx";

const ChallengeStatusBadge = ({ status }: { status: ChallengeStatus }) => {
  const badgeStyles = {
    [ChallengeStatus.UPCOMING]: "bg-violet-400 text-black",
    [ChallengeStatus.IN_PROGRESS]: "bg-yellow-100 text-yellow-700",
    [ChallengeStatus.COMPLETED]: "bg-green-100 text-green-700",
    [ChallengeStatus.WAITING_FOR_REVIEW]: "bg-orange-100 text-orange-700",
    [ChallengeStatus.FAILED]: "bg-red-100 text-red-700",
  };

  const statusNames = {
    [ChallengeStatus.UPCOMING]: "Upcoming",
    [ChallengeStatus.IN_PROGRESS]: "In Progress",
    [ChallengeStatus.COMPLETED]: "Completed",
    [ChallengeStatus.WAITING_FOR_REVIEW]: "Waiting for Review",
    [ChallengeStatus.FAILED]: "Failed",
  };

  return (
    <span
      className={clsx(
        "px-2 py-1 rounded-full text-xs font-medium",
        badgeStyles[status]
      )}
    >
      {statusNames[status]}
    </span>
  );
};

export default ChallengeStatusBadge;
