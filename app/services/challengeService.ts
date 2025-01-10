import { db } from "@/firebaseConfig"; // Assume this is your Firebase configuration
import { Challenge } from "@/types/general";
import { collection, getDocs } from "firebase/firestore";

export const getChallenges = async (): Promise<Challenge[]> => {
  const challengesCollection = collection(db, "challenges");
  const challengeSnapshot = await getDocs(challengesCollection);
  const challengeList = challengeSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return challengeList as Challenge[];
};
