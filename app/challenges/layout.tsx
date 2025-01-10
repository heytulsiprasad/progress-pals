import Sidebar from "../components/Sidebar";

import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 mdmax:p-4">{children}</main>
    </div>
  );
};

export default Layout;
