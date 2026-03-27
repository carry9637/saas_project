import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sideW = collapsed ? 68 : 256;

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className="flex flex-col flex-1 min-w-0 transition-[margin-left] duration-300"
        style={{ marginLeft: sideW }}
      >
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          <div
            className="page-enter"
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "32px 40px",
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
