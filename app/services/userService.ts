import { db } from "@/firebaseConfig";
import { User } from "@/types/general";
import { doc, getDoc } from "firebase/firestore";

export const getUserDetails = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    console.error("No such user!");
    return null;
  }
};
