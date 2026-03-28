import { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  CreditCard,
  LifeBuoy,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  Star,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  dashboardService,
  clientService,
  ticketService,
} from "../services/mockData";

/* ─── Trend badge ─── */
const Trend = ({ val }) => {
  const up = val >= 0;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "12px",
        fontWeight: 600,
        color: up ? "#16a34a" : "#dc2626",
      }}
    >
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? "+" : ""}
      {val}%
    </span>
  );
};

/* ─── Stat card ─── */
const StatCard = ({ icon: Icon, label, value, trend, sub, iconBg }) => (
  <div className="card card-hover" style={{ padding: "22px 24px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "14px",
      }}
    >
      <p style={{ fontSize: "13px", fontWeight: 500, color: "#64748b" }}>
        {label}
      </p>
      <div
        style={{
          height: "40px",
          width: "40px",
          borderRadius: "12px",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color="white" />
      </div>
    </div>
    <p
      style={{
        fontSize: "30px",
        fontWeight: 800,
        color: "#0f172a",
        lineHeight: 1,
        marginBottom: "10px",
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </p>
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Trend val={trend} />
      <span style={{ fontSize: "12px", color: "#94a3b8" }}>{sub}</span>
    </div>
  </div>
);

/* ─── Bar chart (pixel heights — no % issues) ─── */
const BAR_MAX_H = 110; // px
const REV_DATA = [
  { label: "Jan", val: 62 },
  { label: "Feb", val: 80 },
  { label: "Mar", val: 55 },
  { label: "Apr", val: 95 },
  { label: "May", val: 71 },
  { label: "Jun", val: 88 },
  { label: "Jul", val: 100 },
];
const BarChart = () => (
  <div>
    {/* bars */}
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "10px",
        height: `${BAR_MAX_H}px`,
      }}
    >
      {REV_DATA.map(({ label, val }, i) => {
        const h = Math.round((val / 100) * BAR_MAX_H);
        const isLast = i === REV_DATA.length - 1;
        return (
          <div key={label} style={{ flex: 1, position: "relative" }}>
            <div
              title={`${val}%`}
              style={{
                width: "100%",
                height: `${h}px`,
                background: isLast
                  ? "linear-gradient(to top, #4f46e5, #818cf8)"
                  : "linear-gradient(to top, #c7d2fe, #e0e7ff)",
                borderRadius: "6px 6px 0 0",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            />
          </div>
        );
      })}
    </div>
    {/* divider */}
    <div style={{ height: "1px", background: "#f1f5f9", margin: "0" }} />
    {/* labels */}
    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
      {REV_DATA.map(({ label }) => (
        <div
          key={label}
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "11px",
            color: "#94a3b8",
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      ))}
    </div>
  </div>
);

/* ─── Badge helpers ─── */
const planBadge = (p) =>
  ({ Enterprise: "badge-purple", Pro: "badge-indigo", Starter: "badge-blue" })[
    p
  ] || "badge-gray";
const ticketBadge = (s) =>
  ({
    Open: "badge-red",
    "In Progress": "badge-yellow",
    Resolved: "badge-green",
  })[s] || "badge-gray";

/* ─── Avatar ─── */
const Avatar = ({ name }) => {
  const colors = [
    "#e0e7ff:#4338ca",
    "#f0fdf4:#16a34a",
    "#fef3c7:#d97706",
    "#fce7f3:#be185d",
    "#e0f2fe:#0369a1",
  ];
  const [bg, fg] = colors[name.charCodeAt(0) % colors.length].split(":");
  return (
    <div
      style={{
        height: "34px",
        width: "34px",
        borderRadius: "50%",
        background: bg,
        color: fg,
        fontSize: "12px",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};

/* ═══════════════════════════════════════════ */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setStats(dashboardService.getStats());
    setClients(clientService.getAll().slice(0, 5));
    setTickets(ticketService.getAll().slice(0, 4));
  }, []);

  if (!stats) return null;

  return (
    /* NOTE: DashboardLayout already adds px-6 py-7 + page-enter — no extra padding here */
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        paddingBottom: "40px",
      }}
    >
      {/* ── Welcome banner ── */}
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          background: "linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)",
          padding: "28px 32px",
          color: "white",
        }}
      >
        {/* decorative circles */}
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-40px",
            height: "200px",
            width: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "80px",
            bottom: "-60px",
            height: "160px",
            width: "160px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "99px",
              padding: "4px 12px",
              fontSize: "11px",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            <Activity size={11} /> Live Dashboard
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              marginBottom: "6px",
              letterSpacing: "-0.02em",
            }}
          >
            Good morning, Admin 👋
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)" }}>
            Here's what's happening with your business today.
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <StatCard
          icon={Users}
          label="Total Clients"
          value={stats.totalClients.toLocaleString()}
          trend={stats.clientGrowth}
          sub="vs last month"
          iconBg="#6366f1"
        />
        <StatCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          trend={stats.revenueGrowth}
          sub="vs last month"
          iconBg="#10b981"
        />
        <StatCard
          icon={CreditCard}
          label="Active Subscriptions"
          value={stats.activeSubscriptions}
          trend={4.1}
          sub="vs last month"
          iconBg="#8b5cf6"
        />
        <StatCard
          icon={LifeBuoy}
          label="Open Tickets"
          value={stats.openTickets}
          trend={-8.3}
          sub="vs last month"
          iconBg="#f59e0b"
        />
      </div>

      {/* ── Charts row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)",
          gap: "16px",
        }}
      >
        {/* Revenue bar chart */}
        <div className="card" style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: "3px",
                }}
              >
                Revenue Overview
              </h3>
              <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                Monthly performance — 2026
              </p>
            </div>
            <span className="badge badge-green" style={{ fontSize: "11px" }}>
              +12.5% this year
            </span>
          </div>
          <BarChart />
        </div>

        {/* Performance progress bars */}
        <div className="card" style={{ padding: "24px" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "20px",
            }}
          >
            Performance
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {[
              {
                label: "Ticket Resolution",
                val: stats.ticketResolution,
                bg: "#10b981",
              },
              { label: "Client Retention", val: 87, bg: "#6366f1" },
              { label: "Sub. Renewals", val: 73, bg: "#8b5cf6" },
              { label: "Revenue Growth", val: 65, bg: "#f59e0b" },
            ].map(({ label, val, bg }) => (
              <div key={label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#475569",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {val}%
                  </span>
                </div>
                <div
                  style={{
                    height: "7px",
                    background: "#f1f5f9",
                    borderRadius: "99px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${val}%`,
                      background: bg,
                      borderRadius: "99px",
                      transition: "width 0.7s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent data row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)",
          gap: "16px",
        }}
      >
        {/* Recent clients */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 24px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
              Recent Clients
            </h3>
            <a
              href="/clients"
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#4f46e5",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View all <ArrowRight size={13} />
            </a>
          </div>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Client</th>
                <th>Plan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Avatar name={c.name} />
                      <div>
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#1e293b",
                          }}
                        >
                          {c.name}
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            marginTop: "1px",
                          }}
                        >
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${planBadge(c.plan)}`}>
                      {c.plan}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${c.status === "Active" ? "badge-green" : "badge-gray"}`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent tickets */}
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
              Recent Tickets
            </h3>
            <a
              href="/tickets"
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#4f46e5",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View all <ArrowRight size={13} />
            </a>
          </div>
          <ul style={{ flex: 1, listStyle: "none", padding: 0, margin: 0 }}>
            {tickets.map((t) => (
              <li
                key={t.id}
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid #f8fafc",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "8px",
                    marginBottom: "5px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1e293b",
                      lineHeight: 1.4,
                    }}
                  >
                    {t.title}
                  </p>
                  <span
                    className={`badge ${ticketBadge(t.status)}`}
                    style={{ flexShrink: 0, fontSize: "11px" }}
                  >
                    {t.status}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Clock size={10} /> {t.createdAt} · {t.client}
                </p>
              </li>
            ))}
          </ul>
          {/* footer */}
          <div
            style={{
              borderTop: "1px solid #f1f5f9",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#16a34a",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <CheckCircle2 size={13} /> {stats.ticketResolution}% resolved
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#f59e0b",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Star size={12} style={{ fill: "#f59e0b", color: "#f59e0b" }} />{" "}
              4.8
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
