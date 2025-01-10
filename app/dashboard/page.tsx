"use client";

import {
  clearCurrentUser,
  useCurrentUser,
} from "../../redux/slices/currentUserSlice";
import { useState, useRef, useEffect } from "react";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useDispatch } from "react-redux";
import { auth, db } from "@/firebaseConfig";
import { getOpenChallenges } from "../services/challengeService";
import { Challenge, Notification } from "@/types/general";
import ChallengeBox from "../components/ChallengeBox";
import Image from "next/image";
import {
  getNotifications,
  updateNotificationStatus,
} from "../services/notificationService";
import NotificationItem from "../components/NotificationItem";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import toast from "react-hot-toast";

/**
 * Dashboard for signed-in users.
 */
const Dashboard = () => {
  const { name: userName, uid, photoURL } = useCurrentUser();
  console.log(uid);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );

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
      const allOpenChallenges = await getOpenChallenges(uid);
      setChallenges(allOpenChallenges);
    };

    const fetchNotifications = async () => {
      const userNotifications = await getNotifications(uid);
      setNotifications(userNotifications);
    };

    fetchChallenges();
    fetchNotifications();
  }, [uid]);

  const handleNotificationAction = async (
    notificationId: string,
    action: "accept" | "reject"
  ) => {
    // Get the notification to find challengeId
    const notificationRef = doc(db, "notifications", notificationId);
    const notificationDoc = await getDoc(notificationRef);
    const notification = notificationDoc.data() as Notification;

    if (notification && notification.challengeId) {
      const challengeRef = doc(db, "challenges", notification.challengeId);

      // Remove from pendingAuditors
      await updateDoc(challengeRef, {
        pendingAuditors: arrayRemove(notification.author),
      });

      // If accepted, add to auditors
      if (action === "accept") {
        await updateDoc(challengeRef, {
          auditors: arrayUnion(notification.author),
        });
      }

      // Update notification status
      await updateNotificationStatus(notificationId, action);

      // Update local state
      setNotifications(notifications.filter((n) => n.id !== notificationId));

      // Send toast
      if (action === "accept") {
        toast.success("Auditor request accepted!");
      } else {
        toast.error("Auditor request rejected!");
      }
    }
  };

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

        {/* Notifications */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="space-y-4 w-full">
            {notifications === null ? (
              <div className="flex justify-center w-full">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onAction={handleNotificationAction}
                />
              ))
            )}

            {notifications && notifications.length === 0 && (
              <div className="text-gray-500 text-left">
                You&apos;re all caught up!
              </div>
            )}
          </div>
        </section>

        {/* Open challenges */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            Open Challenges for you to Audit
          </h2>
          {challenges === null ? (
            <div className="flex justify-center w-full">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="grid grid-cols-2 mdmax:grid-cols-1 gap-4 w-full">
              {challenges.map((challenge) => (
                <ChallengeBox challenge={challenge} key={challenge.id} />
              ))}
            </div>
          )}

          {/* When no challenges exist */}
          {challenges && challenges.length === 0 && (
            <div className="text-gray-500 text-left">
              No open challenges for you to audit!
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
