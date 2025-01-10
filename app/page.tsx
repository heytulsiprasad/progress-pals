"use client";

import clsx from "clsx";
import { FiExternalLink } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { auth, db, provider, signInWithPopup } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/slices/currentUserSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleGetStarted = async () => {
    try {
      // Sign in or sign up with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Dispatch user data to Redux store
      dispatch(
        setCurrentUser({
          isAuth: true,
          uid: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email || "",
          photoURL: user.photoURL || null,
        })
      );

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userDocRef, {
          name: user?.displayName,
          email: user.email,
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
        });
        console.log("New user document created!");
      } else {
        console.log("User already exists in Firestore!");
      }

      //  Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div
      className={clsx(
        "min-h-screen p-8 pb-20 font-sans bg-gray-50 text-gray-900",
        "flex flex-col"
      )}
    >
      <header className="text-center py-16">
        <h1 className="text-6xl font-bold text-blue-600">ProgressPals</h1>
        <p className="mt-4 text-xl lgmax:text-2xl">Apes Together Strong 🦍</p>
        <button
          onClick={handleGetStarted}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </header>

      <main className="space-y-16 grow">
        <section className="text-center">
          <h2 className="text-3xl font-bold text-blue-600">Features</h2>
          <div className="mt-8 grid gap-8 grid-cols-3 mdmax:grid-cols-1 mdmax:grid-flow-row">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Set Challenges</h3>
              <p className="mt-2 text-gray-700">
                Create and join challenges to push your limits.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Stay Accountable</h3>
              <p className="mt-2 text-gray-700">
                Track your progress and stay motivated with friends.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Achieve Goals</h3>
              <p className="mt-2 text-gray-700">
                Reach your goals with the support of your community.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 text-center">
        <div className="flex justify-center space-x-6">
          <p className="italic text-sm">
            Built after{" "}
            <a
              className="underline hover:text-blue-600 inline-flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
              href="https://x.com/thebuildguy/status/1812852056912490956"
            >
              179 days <FiExternalLink />
            </a>{" "}
            of having the idea as I had no accountability.
          </p>
        </div>
      </footer>
    </div>
  );
}
