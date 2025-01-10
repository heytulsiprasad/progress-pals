"use client";

import { FiHome, FiList, FiUser, FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      className="w-64 bg-white shadow-lg sticky top-0 h-screen mdmax:w-16"
    >
      <nav className="flex flex-col p-6 space-y-2 mdmax:p-2">
        <div className="flex items-center space-x-2 mb-6 mdmax:justify-center mdmax:mb-4">
          <span role="img" aria-label="gorilla" className="text-3xl">
            🦍
          </span>
          <span className="text-2xl font-bold mdmax:hidden">Progress Pals</span>
        </div>
        <a
          href="/dashboard"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition mdmax:justify-center mdmax:space-x-0",
            isActive("/dashboard")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiHome />
          <span className="mdmax:hidden">Dashboard</span>
        </a>
        <a
          href="/dashboard/challenges"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition mdmax:justify-center mdmax:space-x-0",
            isActive("/challenges")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiList />
          <span className="mdmax:hidden">My Challenges</span>
        </a>
        <a
          href="/dashboard/auditor-roles"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition mdmax:justify-center mdmax:space-x-0",
            isActive("/auditor-roles")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiUser />
          <span className="mdmax:hidden">Auditor Roles</span>
        </a>
        <a
          href="/dashboard/profile"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition mdmax:justify-center mdmax:space-x-0",
            isActive("/profile")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiUser />
          <span className="mdmax:hidden">Profile</span>
        </a>
        <a
          href="/dashboard/settings"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition mdmax:justify-center mdmax:space-x-0",
            isActive("/settings")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiSettings />
          <span className="mdmax:hidden">Settings</span>
        </a>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
