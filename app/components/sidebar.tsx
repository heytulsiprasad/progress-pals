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
      className="w-64 bg-white shadow-lg sticky top-0 h-screen"
    >
      <nav className="flex flex-col p-6 space-y-2">
        <div className="flex items-center space-x-2 mb-6">
          <span role="img" aria-label="gorilla" className="text-3xl">
            🦍
          </span>
          <span className="text-2xl font-bold">Progress Pals</span>
        </div>
        <a
          href="/dashboard"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition",
            isActive("/dashboard")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiHome />
          <span>Dashboard</span>
        </a>
        <a
          href="/challenges"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition",
            isActive("/challenges")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiList />
          <span>My Challenges</span>
        </a>
        <a
          href="/auditor-roles"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition",
            isActive("/auditor-roles")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiUser />
          <span>Auditor Roles</span>
        </a>
        <a
          href="/profile"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition",
            isActive("/profile")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiUser />
          <span>Profile</span>
        </a>
        <a
          href="/settings"
          className={clsx(
            "flex items-center space-x-3 p-3 rounded-lg transition",
            isActive("/settings")
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          )}
        >
          <FiSettings />
          <span>Settings</span>
        </a>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
