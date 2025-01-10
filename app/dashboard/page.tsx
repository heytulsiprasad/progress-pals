"use client";

import { useCurrentUser } from "../../redux/slices/currentUserSlice";
import { FiHome, FiList, FiUser, FiSettings } from "react-icons/fi";

/**
 * Dashboard for signed-in users.
 */
const Dashboard = () => {
  const { name: userName } = useCurrentUser();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg sticky top-0 h-screen">
        <nav className="flex flex-col p-4 space-y-4">
          <a href="/dashboard" className="flex items-center space-x-2">
            <FiHome />
            <span>Dashboard</span>
          </a>
          <a href="/challenges" className="flex items-center space-x-2">
            <FiList />
            <span>My Challenges</span>
          </a>
          <a href="/auditor-roles" className="flex items-center space-x-2">
            <FiUser />
            <span>Auditor Roles</span>
          </a>
          <a href="/profile" className="flex items-center space-x-2">
            <FiUser />
            <span>Profile</span>
          </a>
          <a href="/settings" className="flex items-center space-x-2">
            <FiSettings />
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
          {/* Optional: Add search bar or notifications icon */}
        </header>

        {/* Challenge Summary Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-1">
            {/* Example challenge card */}
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Challenge Title</h3>
              <p>Progress: 50%</p>
              <p>Deadline: 2023-12-31</p>
            </div>
            {/* Add more challenge cards as needed */}
          </div>
        </section>

        {/* Progress Tracker */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
          <div className="flex items-center space-x-4">
            {/* Example circular progress chart */}
            <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center">
              50%
            </div>
            <p>Keep it up!</p>
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          <ul className="list-disc pl-5">
            {/* Example task */}
            <li>Task 1</li>
            {/* Add more tasks as needed */}
          </ul>
        </section>

        {/* Call-to-Action Button */}
        <div className="mb-8">
          <button className="px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition">
            Create New Challenge
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
