import { useState } from "react";
import { useRouter } from "next/navigation";
import { Challenge, ChallengeStatus } from "@/types/general";
import { db } from "@/firebaseConfig";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { useCurrentUser } from "@/redux/slices/currentUserSlice";

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newChallenge: Challenge) => void;
}

const ChallengeModal = ({ isOpen, onClose, onSubmit }: ChallengeModalProps) => {
  const { uid } = useCurrentUser();
  const router = useRouter();
  const [challengeData, setChallengeData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    wagerAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setChallengeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const newChallenge: Challenge = {
      ...challengeData,
      id: "",
      status: ChallengeStatus.UPCOMING,
      isPaid: false,
      creator: uid,
      startDate: new Date(challengeData.startTime).toISOString(),
      endDate: new Date(challengeData.endTime).toISOString(),
      pendingAuditors: [],
      auditors: [],
    };

    try {
      const docRef = await addDoc(collection(db, "challenges"), newChallenge);
      await updateDoc(docRef, { id: docRef.id }); // Update the document with its own ID
      await updateDoc(doc(db, "users", uid), {
        challenges: [
          ...((await (await getDoc(doc(db, "users", uid))).data()
            ?.challenges) || []),
          docRef.id,
        ],
      });
      onSubmit({ ...newChallenge, id: docRef.id });
      router.push(`/challenges/${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Create New Challenge</h2>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={challengeData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Description"
            value={challengeData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            placeholder="Start Time"
            value={challengeData.startTime}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            placeholder="End Time"
            value={challengeData.endTime}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Wager Amount</label>
          <input
            type="number"
            name="wagerAmount"
            placeholder="Wager Amount"
            min="0"
            value={challengeData.wagerAmount}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="btn btn-error btn-outline mr-2">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
