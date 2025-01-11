"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebaseConfig";
import { FaInfoCircle, FaRegClock } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
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
import { AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ChallengeStatusBadge from "@/app/components/ChallengeStatusBadge";
import { AuditorApplicationModal } from "@/app/components/modals/AuditorApplicationModal";
import { ReviewSubmissionModal } from "@/app/components/modals/ReviewSubmissionModal";
import { ApprovalRejectModal } from "@/app/components/modals/ApprovalRejectModal";
import { PaymentModal } from "@/app/components/modals/PaymentModal";
import ChatModal from "@/app/components/modals/ChatModal";

const ChallengeDetails = () => {
  const { challengeid } = useParams();
  const { uid, name: userName } = useCurrentUser();
  const [challenge, setChallenge] = useState<Challenge>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [finalComments, setFinalComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      const challengeRef = doc(db, "challenges", challenge.id);
      await updateDoc(challengeRef, {
        pendingAuditors: arrayUnion(uid),
      });

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

  const handleMarkComplete = async () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    const challengeRef = doc(db, "challenges", challenge.id);

    const newCreatorReviews = challenge.creatorReviews || [];
    newCreatorReviews.push({
      comment: finalComments,
      timestamp: new Date().toISOString(),
    });

    await updateDoc(challengeRef, {
      status: ChallengeStatus.WAITING_FOR_REVIEW,
      creatorReviews: newCreatorReviews,
    });

    for (const auditor of challenge.auditors || []) {
      await addDoc(collection(db, "notifications"), {
        recipient: auditor,
        author: uid,
        message: `${userName} has completed the challenge "${
          challenge.title
        }" and is waiting for review. ${
          finalComments && `Comments: ${finalComments}`
        }`,
        type: NotificationType.REVIEW_REQUEST,
        read: false,
        challengeId: challenge.id,
      });
    }

    setChallenge((prev) =>
      prev
        ? {
            ...prev,
            status: ChallengeStatus.WAITING_FOR_REVIEW,
            creatorReviews: newCreatorReviews,
          }
        : prev
    );

    setIsSubmitting(false);
    setIsConfirmModalOpen(false);
    setFinalComments("");
  };

  const handleApprove = async () => {
    setIsApproveModalOpen(true);
  };

  const handleReject = async () => {
    setIsRejectModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    setIsApproving(true);

    if (challenge) {
      const challengeRef = doc(db, "challenges", challenge.id);

      const newAuditorReviews = challenge.auditorReviews || {};

      newAuditorReviews[uid] = {
        status: "approved",
        comment: approvalReason,
        timestamp: new Date().toISOString(),
      };

      await updateDoc(challengeRef, {
        status: ChallengeStatus.COMPLETED,
        auditorReviews: newAuditorReviews,
      });

      await addDoc(collection(db, "notifications"), {
        recipient: challenge.creator,
        author: uid,
        message: `Your challenge "${challenge.title}" has been approved. ${
          approvalReason && `Review: ${approvalReason}`
        }`,
        type: NotificationType.APPROVAL_NOTICE,
        read: false,
        challengeId: challenge.id,
      });

      setChallenge((prev) =>
        prev
          ? {
              ...prev,
              status: ChallengeStatus.COMPLETED,
              auditorReviews: newAuditorReviews,
            }
          : prev
      );
    }

    setIsApproving(false);
    setIsApproveModalOpen(false);
    setApprovalReason("");
  };

  const handleConfirmReject = async () => {
    setIsRejecting(true);

    if (challenge) {
      const challengeRef = doc(db, "challenges", challenge.id);

      const newAuditorReviews = challenge.auditorReviews || {};

      newAuditorReviews[uid] = {
        status: "rejected",
        comment: rejectionReason,
        timestamp: new Date().toISOString(),
      };

      await updateDoc(challengeRef, {
        status: ChallengeStatus.FAILED,
        auditorReviews: newAuditorReviews,
      });

      await addDoc(collection(db, "notifications"), {
        recipient: challenge.creator,
        author: uid,
        message: `Your challenge "${challenge.title}" has been rejected. ${
          rejectionReason && `Reason: ${rejectionReason}`
        }`,
        type: NotificationType.REJECTION_NOTICE,
        read: false,
        challengeId: challenge.id,
      });

      setChallenge((prev) =>
        prev
          ? {
              ...prev,
              status: ChallengeStatus.FAILED,
              auditorReviews: newAuditorReviews,
            }
          : prev
      );
    }

    setIsRejecting(false);
    setIsRejectModalOpen(false);
    setRejectionReason("");
  };

  const handlePaymentConfirm = async () => {
    setIsPaymentProcessing(true);
    if (challenge) {
      const challengeRef = doc(db, "challenges", challenge.id);
      await updateDoc(challengeRef, {
        isPaid: true,
      });

      setChallenge((prev) => (prev ? { ...prev, isPaid: true } : prev));
    }
    setIsPaymentProcessing(false);
    setIsPaymentModalOpen(false);
    toast.success("Payment confirmed!");
  };

  const isCreator = challenge.creator === uid;
  const isAuditor = challenge.auditors?.includes(uid);
  const isParticipant = isAuditor || isCreator;
  const isChallengeFinished =
    challenge.status === ChallengeStatus.COMPLETED ||
    challenge.status === ChallengeStatus.FAILED;
  const noAuditorExists =
    !challenge.auditors || challenge.auditors.length === 0;

  return (
    <div className="container mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {challenge.title}
            </h1>

            <div className="flex items-center gap-4">
              {isParticipant && (
                <div
                  className="tooltip"
                  data-tip="Chat with challenge participants"
                >
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="btn btn-circle btn-ghost"
                  >
                    <IoChatboxOutline className="size-5" />
                  </button>
                </div>
              )}

              {challenge.status === ChallengeStatus.FAILED &&
                isCreator &&
                !challenge.isPaid && (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="btn btn-error btn-sm"
                  >
                    Pay Wager
                  </button>
                )}

              {challenge.isPaid && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md">
                  Paid
                </span>
              )}
            </div>
          </div>

          <div className="mb-8 flex items-center">
            <span className="mr-4">Mark as Locked</span>
            <input
              type="checkbox"
              className="toggle"
              defaultChecked={isLocked}
              onChange={handleToggleLock}
              disabled={isChallengeFinished || !isCreator}
            />
            <div
              className="tooltip ml-2"
              data-tip={
                isChallengeFinished
                  ? "Challenge is already completed"
                  : "When locked people can't see your challenge in open challenges"
              }
            >
              <FaInfoCircle className="text-primary" />
            </div>
          </div>

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
                  <ChallengeStatusBadge status={challenge.status} />
                </div>
              </div>
            </div>
          </div>

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
                  {noAuditorExists && isCreator && (
                    <span
                      className={clsx(
                        "px-2 py-1 rounded-full text-sm font-medium",
                        "bg-green-100 text-green-700"
                      )}
                    >
                      Looking for auditors
                    </span>
                  )}

                  {!isCreator && noAuditorExists && (
                    <button
                      className={clsx(
                        "btn btn-sm",
                        challenge?.pendingAuditors?.includes(uid)
                          ? "btn-secondary btn-outline"
                          : "btn-primary "
                      )}
                      onClick={handleApplyAsAuditor}
                      disabled={challenge?.pendingAuditors?.includes(uid)}
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

          <div className="mt-8">
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Challenge Timeline</h2>
                <ul className="steps steps-vertical lg:steps-horizontal w-full">
                  <li className="step step-primary">
                    Start: {format(new Date(challenge.startDate), "PPPP")}
                  </li>
                  <li className="step">In Progress</li>
                  <li
                    className={`step ${
                      challenge.status === ChallengeStatus.COMPLETED
                        ? "step-primary"
                        : ""
                    }`}
                  >
                    End: {format(new Date(challenge.endDate), "PPPP")}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <ProgressSection challenge={challenge} />

          {isParticipant && !isChallengeFinished && !noAuditorExists && (
            <div className="mt-8 w-full flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <h2 className="text-2xl font-bold">End Challenge</h2>
                <div
                  className="tooltip"
                  data-tip={
                    isCreator
                      ? "If you want to end the challenge, send it for review once it'll be accepted by all auditors only then it'll be marked as complete"
                      : "If you approve challenge gets done, if you reject it'll be failed"
                  }
                >
                  <FaInfoCircle className="text-primary" />
                </div>
              </div>

              {isCreator && (
                <button
                  onClick={
                    challenge.status === ChallengeStatus.WAITING_FOR_REVIEW
                      ? () => toast.error("Challenge already sent for review")
                      : handleMarkComplete
                  }
                  className={clsx(
                    "w-full btn btn-outline flex-row-reverse items-center justify-center hover:scale-105",
                    challenge.status === ChallengeStatus.WAITING_FOR_REVIEW
                      ? "btn-primary"
                      : "btn-success"
                  )}
                >
                  {challenge.status === ChallengeStatus.WAITING_FOR_REVIEW ? (
                    <>
                      <FaRegClock className="size-4" />
                      <span>Waiting for Review</span>
                    </>
                  ) : (
                    <>
                      <IoMdSend className="size-4" />
                      <span>Send for Review</span>
                    </>
                  )}
                </button>
              )}

              {isAuditor &&
                challenge.status === ChallengeStatus.WAITING_FOR_REVIEW && (
                  <div className="flex gap-4 w-full">
                    <button
                      onClick={handleApprove}
                      className="btn btn-success flex-grow"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      className="btn btn-error flex-grow"
                    >
                      Reject
                    </button>
                  </div>
                )}

              {isAuditor &&
                (challenge.status === ChallengeStatus.IN_PROGRESS ||
                  challenge.status === ChallengeStatus.UPCOMING) && (
                  <div className="text-left text-sm text-gray-500">
                    You can approve/reject here once the creator sends for
                    review
                  </div>
                )}

              {isAuditor && challenge.status === ChallengeStatus.FAILED && (
                <div className="text-left text-sm text-gray-500">
                  You have marked as failed.
                </div>
              )}

              {isAuditor && challenge.status === ChallengeStatus.COMPLETED && (
                <div className="text-left text-sm text-gray-500">
                  You have approved the challenge.
                </div>
              )}
            </div>
          )}

          <ChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            challengeId={challenge.id}
            participants={challenge.auditors || []}
            isLoading={isLoading}
          />
        </div>
      </div>

      <AnimatePresence>
        <AuditorApplicationModal
          key="auditor-modal"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApply={handleApply}
          isLoading={isLoading}
        />

        <ReviewSubmissionModal
          key="review-modal"
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onSubmit={handleConfirmSubmit}
          isLoading={isSubmitting}
        />

        <ApprovalRejectModal
          key="approve-modal"
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={handleConfirmApprove}
          isLoading={isApproving}
          type="approve"
        />

        <ApprovalRejectModal
          key="reject-modal"
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={handleConfirmReject}
          isLoading={isRejecting}
          type="reject"
        />

        <PaymentModal
          key="payment-modal"
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirmPayment={handlePaymentConfirm}
          isLoading={isPaymentProcessing}
          wagerAmount={challenge.wagerAmount}
        />
      </AnimatePresence>
    </div>
  );
};

export default ChallengeDetails;
