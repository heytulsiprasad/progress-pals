"use client";

import {
  clearCurrentUser,
  useCurrentUser,
} from "../../redux/slices/currentUserSlice";
import { useState, useRef, useEffect } from "react";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useDispatch } from "react-redux";
import { auth } from "@/firebaseConfig";
import { getChallenges } from "../services/challengeService";
import { Challenge } from "@/types/general";
import ChallengeBox from "../components/ChallengeBox";
import Image from "next/image";

/**
 * Dashboard for signed-in users.
 */
const Dashboard = () => {
  const { name: userName, uid, photoURL } = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    dispatch(clearCurrentUser());
    // Optionally, redirect to the landing page
    window.location.href = "/";

    // signout from firebase
    auth.signOut();
  };

  useOutsideClick(dropdownRef, () => setDropdownOpen(false));

  useEffect(() => {
    const fetchChallenges = async () => {
      const allChallenges = await getChallenges();
      const openChallenges = allChallenges.filter(
        (challenge) => challenge.creator !== uid
      );
      setChallenges(openChallenges);
    };

    fetchChallenges();
  }, [uid]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
          <div className="relative" ref={dropdownRef}>
            <Image
              src={photoURL || ""}
              alt="Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full cursor-pointer hover:shadow-lg hover:shadow-gray-500/50 transition-shadow"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <FaCog className="mr-2" /> Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <section>
          <h2 className="text-xl font-bold mb-4">
            Open Challenges for You to Audit
          </h2>
          <div className="grid grid-cols-2 mdmax:grid-cols-1 gap-4">
            {challenges.map((challenge) => (
              <ChallengeBox challenge={challenge} key={challenge.id} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
