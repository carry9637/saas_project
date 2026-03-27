import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  ChevronRight,
} from "lucide-react";

const TITLES = {
  "/": "Dashboard",
  "/clients": "Clients",
  "/services": "Services",
  "/subscriptions": "Subscriptions",
  "/tickets": "Tickets",
  "/profile": "Profile",
  "/settings": "Settings",
};

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const title = TITLES[pathname] || "Dashboard";

  return (
    <header
      style={{ padding: "0 40px" }}
      className="sticky top-0 z-20 flex items-center justify-between
      h-[60px] bg-white border-b border-slate-200/80"
    >
      {/* Left — page title + breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 text-[13px]">Pages</span>
        <ChevronRight size={13} className="text-slate-300" />
        <span className="font-semibold text-slate-800 text-[13px]">
          {title}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div style={{ position: "relative" }} className="hidden md:block">
          <Search
            size={15}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search..."
            style={{ paddingLeft: "36px", paddingRight: "14px" }}
            className="h-9 w-52 rounded-lg border border-slate-200 bg-slate-50
              text-[13px] text-slate-700 placeholder:text-slate-400
              focus:outline-none focus:border-indigo-400 focus:bg-white
              focus:ring-[3px] focus:ring-indigo-500/10 transition-all"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center
          rounded-lg border border-slate-200 bg-white text-slate-500
          hover:bg-slate-50 transition-colors"
        >
          <Bell size={16} />
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full
            bg-indigo-500 ring-[1.5px] ring-white"
          />
        </button>

        {/* Export / CTA */}
        <button className="btn-primary text-[12.5px] px-4 py-[7px]">
          Export
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5
              hover:bg-slate-50 transition-colors"
          >
            <div
              className="h-[30px] w-[30px] rounded-full bg-gradient-to-br
              from-indigo-500 to-purple-600 flex items-center justify-center"
            >
              <span className="text-[11px] font-bold text-white">AU</span>
            </div>
            <span className="hidden md:block text-[13px] font-medium text-slate-700">
              {user?.name || "Admin"}
            </span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {open && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 10 }}
                onClick={() => setOpen(false)}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "48px",
                  zIndex: 20,
                  width: "220px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                }}
              >
                {/* User info */}
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {user?.name}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginTop: "3px",
                    }}
                  >
                    {user?.email}
                  </p>
                </div>

                {/* Nav items */}
                <div style={{ padding: "6px 8px" }}>
                  {[
                    { icon: User, label: "Profile", to: "/profile" },
                    { icon: Settings, label: "Settings", to: "/settings" },
                  ].map(({ icon: Icon, label, to }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setOpen(false);
                        navigate(to);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "10px 12px",
                        border: "none",
                        background: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "13.5px",
                        fontWeight: 500,
                        color: "#374151",
                        transition: "background 0.15s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f8fafc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <Icon size={15} color="#64748b" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Sign out */}
                <div
                  style={{ padding: "6px 8px", borderTop: "1px solid #f1f5f9" }}
                >
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "10px 12px",
                      border: "none",
                      background: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13.5px",
                      fontWeight: 500,
                      color: "#ef4444",
                      transition: "background 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fef2f2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    <LogOut size={15} color="#ef4444" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
