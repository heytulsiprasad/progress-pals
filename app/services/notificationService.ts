import { db } from "@/firebaseConfig";
import { Notification } from "@/types/general";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export const getNotifications = async (
  uid: string
): Promise<Notification[]> => {
  const q = query(
    collection(db, "notifications"),
    where("recipient", "==", uid),
    where("read", "==", false)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Notification)
  );
};

export const updateNotificationStatus = async (
  notificationId: string,
  action: "accept" | "reject"
) => {
  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, { status: action, read: true });
};
