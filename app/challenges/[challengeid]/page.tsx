"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebaseConfig";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Challenge, ChallengeStatus, NotificationType } from "@/types/general";
import ProgressSection from "@/app/components/ProgressSection";
import UserAvatar from "@/app/components/UserAvatar";
import clsx from "clsx";
import { useCurrentUser } from "@/redux/slices/currentUserSlice";
import Modal from "@/app/components/Modal"; // Assuming you have a Modal component
import { AnimatePresence, motion } from "framer-motion";

const ChallengeDetails = () => {
  const { challengeid } = useParams();
  const { uid, name: userName } = useCurrentUser();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (challengeid) {
        const docRef = doc(db, "challenges", challengeid as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const challengeData = docSnap.data() as Challenge;
          setChallenge(challengeData);
          setIsLocked(challengeData.locked || false);
        } else {
          console.error("No such document!");
        }
      }
    };

    fetchChallenge();
  }, [challengeid]);

  const handleToggleLock = async () => {
    if (challenge) {
      const challengeRef = doc(db, "challenges", challenge.id);
      await updateDoc(challengeRef, {
        locked: !isLocked,
      });
      setIsLocked(!isLocked);
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const handleApplyAsAuditor = () => {
    setIsModalOpen(true);
  };

  const handleApply = async () => {
    setIsLoading(true);
    if (challenge) {
      // Add to pendingAuditors in Challenge
      // We do this because we can know who all have applied to be auditors
      // and make the button text "Already applied"
      const challengeRef = doc(db, "challenges", challenge.id);
      await updateDoc(challengeRef, {
        pendingAuditors: arrayUnion(uid),
      });

      // Update local state (challenge)
      setChallenge((prevChallenge) => {
        if (prevChallenge) {
          return {
            ...prevChallenge,
            pendingAuditors: [...(prevChallenge.pendingAuditors || []), uid],
          };
        }
        return prevChallenge;
      });

      await addDoc(collection(db, "notifications"), {
        recipient: challenge.creator,
        author: uid,
        message,
        type: NotificationType.AUDITOR_REQUEST,
        read: false,
        challengeId: challenge.id,
        accepted: false,
      });
      setIsLoading(false);
      setIsModalOpen(false);
      setMessage("");
    }
  };

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

          {/* Lock Toggle */}
          <div className="mb-8 flex items-center">
            <span className="mr-4">Mark as Locked</span>
            <input
              type="checkbox"
              className="toggle"
              defaultChecked={isLocked}
              onChange={handleToggleLock}
            />
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

                <div className="avatar-group -space-x-6">
                  {/* When there are no auditors (and is being seen by creator himself) */}
                  {(!challenge?.auditors ||
                    challenge?.auditors?.length === 0) &&
                    challenge.creator === uid && (
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-full text-sm font-medium",
                          "bg-green-100 text-green-700"
                        )}
                      >
                        Looking for auditors
                      </span>
                    )}

                  {/* When being seen by any other user */}
                  {!challenge?.auditors && challenge.creator !== uid && (
                    <button
                      className={clsx(
                        "btn btn-sm",
                        challenge?.pendingAuditors?.includes(uid)
                          ? "btn-secondary"
                          : "btn-primary "
                      )}
                      onClick={handleApplyAsAuditor}
                    >
                      {challenge?.pendingAuditors?.includes(uid)
                        ? "Already applied"
                        : "Apply as Auditor"}
                    </button>
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

          <ProgressSection challenge={challenge} />
        </div>
      </div>

      {/* Modal for applying as auditor */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">Apply as Auditor</h2>
              <textarea
                className="w-full p-2 border rounded mb-4"
                placeholder="Add a message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className={clsx("btn btn-primary", {
                  "btn-loading": isLoading,
                })}
                onClick={handleApply}
                disabled={isLoading}
              >
                {isLoading ? "Applying..." : "Apply"}
              </button>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChallengeDetails;
