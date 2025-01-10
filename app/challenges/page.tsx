"use client";

import { useCurrentUser } from "../../redux/slices/currentUserSlice";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Challenge } from "@/types/general";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import ChallengeBox from "../components/ChallengeBox";
import ChallengeModal from "../components/ChallengeModal";

/**
 * Challenges page for signed-in users.
 */
const Challenges = () => {
  const { uid } = useCurrentUser();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      const challengesRef = collection(db, "challenges");
      const q = query(challengesRef, where("creator", "==", uid));
      const challengesSnapshot = await getDocs(q);

      const challengesData = challengesSnapshot.docs.map((doc) =>
        doc.data()
      ) as Challenge[];
      setChallenges(challengesData);
    };

    fetchChallenges();
  }, [uid]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitChallenge = (newChallenge: Challenge) => {
    setChallenges([...challenges, newChallenge]);
    handleCloseModal();
  };

  const activeChallenges = challenges.filter(
    (challenge) => challenge.status !== "completed"
  ) as unknown as Challenge[];

  const completedChallenges = challenges.filter(
    (challenge) => challenge.status === "completed"
  ) as unknown as Challenge[];

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center mb-8 mdmax:flex-col mdmax:items-start mdmax:gap-4">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FaPlus className="mr-2" /> Create New Challenge
        </button>
      </header>
      {/* Active Challenges Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Active Challenges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeChallenges.map((challenge, index) => (
            <ChallengeBox key={index} challenge={challenge} />
          ))}
        </div>
      </div>
      {/* Completed Challenges Grid */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Completed Challenges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* When completed challenges are empty */}
          {completedChallenges.length === 0 && (
            <div className="text-gray-500 text-left col-span-full">
              No completed challenges yet.
            </div>
          )}

          {completedChallenges.map((challenge, index) => (
            <ChallengeBox key={index} challenge={challenge} />
          ))}
        </div>
      </div>
      <ChallengeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitChallenge}
      />
    </div>
  );
};

export default Challenges;
