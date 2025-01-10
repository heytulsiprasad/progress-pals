"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Challenge } from "@/types/general";

const ChallengeDetails = () => {
  const router = useRouter();
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
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{challenge.title}</h1>
      <p className="mb-4">{challenge.description}</p>
      <p className="mb-4">
        <strong>Start Time:</strong>{" "}
        {new Date(challenge.startDate).toLocaleString()}
      </p>
      <p className="mb-4">
        <strong>End Time:</strong>{" "}
        {new Date(challenge.endDate).toLocaleString()}
      </p>
      <p className="mb-4">
        <strong>Wager Amount:</strong> ${challenge.wagerAmount}
      </p>
      <p className="mb-4">
        <strong>Status:</strong> {challenge.status}
      </p>
    </div>
  );
};

export default ChallengeDetails;
