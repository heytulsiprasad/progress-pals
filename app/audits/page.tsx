"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/redux/slices/currentUserSlice";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Challenge } from "@/types/general";
import ChallengeBox from "@/app/components/ChallengeBox";

/**
 * Audits Dashboard for signed-in users.
 */
const AuditsDashboard = () => {
  const { uid } = useCurrentUser();
  const [audits, setAudits] = useState<Challenge[] | null>(null);

  useEffect(() => {
    const fetchAudits = async () => {
      const q = query(
        collection(db, "challenges"),
        where("auditors", "array-contains", uid)
      );
      const querySnapshot = await getDocs(q);
      const userAudits = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Challenge)
      );
      setAudits(userAudits);
    };

    fetchAudits();
  }, [uid]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Audits</h1>
        </header>

        <section>
          <h2 className="text-xl font-bold mb-4">
            Challenges You Are Auditing
          </h2>
          {audits === null ? (
            <div className="flex justify-center w-full">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="grid grid-cols-2 mdmax:grid-cols-1 gap-4 w-full">
              {audits.map((audit) => (
                <ChallengeBox challenge={audit} key={audit.id} />
              ))}
            </div>
          )}

          {audits && audits.length === 0 && (
            <div className="text-gray-500 text-left">
              No challenges found where you are an auditor!
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AuditsDashboard;
