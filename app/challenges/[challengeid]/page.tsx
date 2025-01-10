"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Challenge, ChallengeStatus } from "@/types/general";
import ProgressSection from "@/app/components/ProgressSection";
import UserAvatar from "@/app/components/UserAvatar";
import clsx from "clsx";

const ChallengeDetails = () => {
  const { challengeid } = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (challengeid) {
        const docRef = doc(db, "challenges", challengeid as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setChallenge(docSnap.data() as Challenge);
        } else {
          console.error("No such document!");
        }
      }
    };

    fetchChallenge();
  }, [challengeid]);

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {challenge.title}
            </h1>
            <div className="divider"></div>
            <p className="text-lg text-base-content/80">
              {challenge.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 mdmax:grid-cols-1 gap-6">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Wager Amount</div>
                <div className="stat-value text-primary">
                  ${challenge.wagerAmount}
                </div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Status</div>
                <div className="stat-value">
                  <span
                    className={`badge badge-lg ${
                      challenge.status === ChallengeStatus.IN_PROGRESS
                        ? "badge-primary"
                        : challenge.status === ChallengeStatus.COMPLETED
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {challenge.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Creator and Auditors Section */}
          <div className="mt-8 grid grid-cols-2 mdmax:grid-cols-1 gap-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title text-xl mb-2">Creator</h3>
                <UserAvatar uid={challenge.creator} />
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title text-xl">Auditors</h3>

                {/* When there are no auditors */}
                <div className="avatar-group -space-x-6">
                  {!challenge?.auditors && (
                    <span
                      className={clsx(
                        "px-2 py-1 rounded-full text-sm font-medium",
                        "bg-green-100 text-green-700"
                      )}
                    >
                      Open for Auditors
                    </span>
                  )}
                </div>

                {challenge.auditors && challenge.auditors.length > 0 && (
                  <div className="avatar-group -space-x-6">
                    {challenge.auditors.map((auditor, index) => (
                      <UserAvatar key={index} uid={auditor} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mt-8">
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Challenge Timeline</h2>
                <ul className="steps steps-vertical lg:steps-horizontal w-full">
                  <li className="step step-primary">
                    Start: {new Date(challenge.startDate).toLocaleDateString()}
                  </li>
                  <li className="step">In Progress</li>
                  <li
                    className={`step ${
                      challenge.status === ChallengeStatus.COMPLETED
                        ? "step-primary"
                        : ""
                    }`}
                  >
                    End: {new Date(challenge.endDate).toLocaleDateString()}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <ProgressSection
            progress={challenge.progress || []}
            challengeId={challenge.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;
