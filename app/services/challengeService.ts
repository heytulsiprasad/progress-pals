import { db } from "@/firebaseConfig"; // Assume this is your Firebase configuration
import { Challenge } from "@/types/general";
import { collection, getDocs } from "firebase/firestore";

// Get open challenges
// where the creator is not the current user and locked is not true
export const getOpenChallenges = async (uid: string): Promise<Challenge[]> => {
  const challengesCollection = collection(db, "challenges");
  const challengeSnapshot = await getDocs(challengesCollection);
  const challengeList = challengeSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Challenge))
    .filter((challenge) => challenge.creator !== uid && !challenge.locked);

  return challengeList;
};
