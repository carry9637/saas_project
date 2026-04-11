import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Box,
  CreditCard,
  TicketCheck,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  Megaphone,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/services", label: "Services", icon: Box },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/tickets", label: "Tickets", icon: TicketCheck },
];

const TOOLS = [
  { label: "Goals & Targets", icon: Target },
  { label: "Sales Performance", icon: TrendingUp },
  { label: "Marketing", icon: Megaphone },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col
        bg-[#0f172a] border-r border-[#1e293b]
        transition-[width] duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-64"}`}
    >
      {/* ── Logo ── */}
      <div className="flex items-center h-16 px-4 border-b border-[#1e293b] shrink-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <Sparkles size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginLeft: "12px",
            }}
          >
            Corelystic
          </span>
        )}
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-[13px] top-[72px] z-40 flex h-6 w-6 items-center justify-center
          rounded-full bg-[#0f172a] border border-[#334155] text-slate-400
          hover:text-white hover:border-slate-500 shadow-md transition-all"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {/* ── Main nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-0.5">
        {!collapsed && (
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#475569",
              paddingLeft: "8px",
              paddingBottom: "8px",
            }}
          >
            Main Menu
          </p>
        )}
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Growth tools section */}
        <div className={`${collapsed ? "pt-2" : "pt-5"}`}>
          {!collapsed && (
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#475569",
                paddingLeft: "8px",
                paddingBottom: "8px",
              }}
            >
              Growth Tools
            </p>
          )}
          {TOOLS.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="nav-item opacity-50 cursor-not-allowed"
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </div>
          ))}
        </div>
      </nav>

      {/* ── Bottom links ── */}
      <div className="border-t border-[#1e293b] px-3 py-3 space-y-0.5 shrink-0">
        <div className="nav-item" title={collapsed ? "Help Center" : undefined}>
          <HelpCircle size={18} className="shrink-0" />
          {!collapsed && <span>Help Center</span>}
        </div>
        <div className="nav-item" title={collapsed ? "Settings" : undefined}>
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </div>
      </div>

      {/* ── User profile ── */}
      {!collapsed && (
        <div className="border-t border-[#1e293b] px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span
                style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}
              >
                AU
              </span>
            </div>
            <div className="min-w-0">
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#e2e8f0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Admin User
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                admin@saas.com
              </p>
            </div>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="border-t border-[#1e293b] px-3 py-3 shrink-0 flex justify-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>
              AU
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
