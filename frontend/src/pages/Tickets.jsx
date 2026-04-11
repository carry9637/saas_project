import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  LifeBuoy,
  Search,
  Clock,
  Filter,
} from "lucide-react";
import {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  fetchClients,
} from "../services/api";

const STATUS_TABS = ["All", "Open", "In Progress", "Resolved"];

const statusClass = (s) =>
  ({
    Open: "badge-red",
    "In Progress": "badge-yellow",
    Resolved: "badge-green",
  })[s] || "badge-gray";

const Avatar = ({ name }) => {
  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`h-8 w-8 rounded-full ${colors[idx]}
      text-[11px] font-bold flex items-center justify-center shrink-0`}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};

/* ═══ Quick Status Dropdown ═══ */
const STATUS_OPTIONS = [
  { value: "Open", dot: "#f87171", bg: "#fef2f2", color: "#dc2626" },
  { value: "In Progress", dot: "#fbbf24", bg: "#fffbeb", color: "#d97706" },
  { value: "Resolved", dot: "#4ade80", bg: "#f0fdf4", color: "#16a34a" },
];

const StatusDropdown = ({ ticket, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const portalRef = useRef(null);
  const current =
    STATUS_OPTIONS.find((s) => s.value === ticket.status) || STATUS_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const insideBtn = btnRef.current && btnRef.current.contains(e.target);
      const insidePortal =
        portalRef.current && portalRef.current.contains(e.target);
      if (!insideBtn && !insidePortal) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      // open upward if too close to bottom
      const dropdownH = 130;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow < dropdownH + 10
          ? rect.top + window.scrollY - dropdownH - 6
          : rect.bottom + window.scrollY + 6;
      setPos({ top, left: rect.left + window.scrollX });
    }
    setOpen((p) => !p);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        title="Click to change status"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px 4px 8px",
          borderRadius: "99px",
          border: "none",
          background: current.bg,
          color: current.color,
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "opacity 0.15s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: current.dot,
            flexShrink: 0,
          }}
        />
        {ticket.status}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginLeft: 2 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            ref={portalRef}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              zIndex: 99999,
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
              padding: "6px",
              minWidth: "155px",
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onStatusChange(ticket._id || ticket.id, opt.value);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background:
                    ticket.status === opt.value ? opt.bg : "transparent",
                  color: ticket.status === opt.value ? opt.color : "#374151",
                  fontSize: "13px",
                  fontWeight: ticket.status === opt.value ? 600 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (ticket.status !== opt.value)
                    e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  if (ticket.status !== opt.value)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: opt.dot,
                    flexShrink: 0,
                  }}
                />
                {opt.value}
                {ticket.status === opt.value && (
                  <svg
                    style={{ marginLeft: "auto" }}
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};

/* ═══ Ticket Modal ═══ */
const TicketModal = ({ ticket, onClose, onSave, clients = [] }) => {
  const [form, setForm] = useState(
    ticket
      ? { ...ticket }
      : {
          title: "",
          client: clients[0]?.name || "",
          status: "Open",
          createdAt: new Date().toISOString().split("T")[0],
        },
  );
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card w-full"
        style={{ maxWidth: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            borderRadius: "20px 20px 0 0",
            padding: "22px 26px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              <LifeBuoy size={22} color="#fff" />
            </div>
            <div>
              <p
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                {ticket ? "Edit Ticket" : "New Ticket"}
              </p>
              <h3
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {ticket ? ticket.title : "Create a Support Ticket"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.28)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
            }
          >
            <X size={15} color="#fff" />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "24px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          <div>
            <label className="label">Ticket Title</label>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="Describe the issue briefly..."
              className="input-base"
              style={{ height: 44 }}
            />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label className="label">Client</label>
              <select
                value={form.client}
                onChange={set("client")}
                className="input-base"
                style={{ height: 44, background: "#fff", cursor: "pointer" }}
              >
                <option value="">-- Select Client --</option>
                {clients.map((cl) => (
                  <option key={cl._id || cl.id} value={cl.name}>
                    {cl.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={form.status}
                onChange={set("status")}
                className="input-base"
                style={{ height: 44, background: "#fff", cursor: "pointer" }}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={form.createdAt}
              onChange={set("createdAt")}
              className="input-base"
              style={{ height: 44 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
            padding: "14px 26px 20px",
            borderTop: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="btn-primary"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
              boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
            }}
          >
            <Check size={14} />
            {ticket ? "Save Changes" : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* ═══ Delete modal ═══ */
const DeleteModal = ({ ticket, onClose, onConfirm }) =>
  createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card w-full max-w-[380px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle size={17} className="text-red-600" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-900">
              Close Ticket
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200
            flex items-center justify-center transition-colors text-slate-600"
          >
            <X size={15} />
          </button>
        </div>
        <div className="modal-body">
          <p className="text-[14px] text-slate-600 leading-relaxed">
            Permanently delete ticket:{" "}
            <span className="font-semibold text-slate-900">
              "{ticket.title}"
            </span>
            ?
          </p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(ticket._id || ticket.id);
              onClose();
            }}
            className="h-[38px] px-5 rounded-[10px] flex items-center gap-2
            text-[13.5px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );

export default function Tickets() {
  const [all, setAll] = useState([]);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [addModal, setAdd] = useState(false);
  const [editTicket, setEdit] = useState(null);
  const [delTicket, setDel] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTicket(id, { status: newStatus });
      setAll((prev) =>
        prev.map((t) =>
          t._id === id || t.id === id ? { ...t, status: newStatus } : t,
        ),
      );
    } catch {
      setError("Failed to update status.");
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clientsList, setClientsList] = useState([]);

  const reload = async () => {
    try {
      setLoading(true);
      const { data } = await fetchTickets();
      setAll(data);
      setError("");
    } catch {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    fetchClients()
      .then((r) => setClientsList(r.data))
      .catch(() => {});
  }, []);

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] =
      t === "All" ? all.length : all.filter((x) => x.status === t).length;
    return acc;
  }, {});

  const filtered = all.filter((t) => {
    const matchTab = tab === "All" || t.status === tab;
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (t.client || "").toLowerCase().includes(q);
    return matchTab && matchQ;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingBottom: "40px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-extrabold text-slate-900">
            Support Tickets
          </h1>
          <p className="text-[13px] text-slate-400 mt-0.5">
            {counts["Open"]} open, {counts["In Progress"]} in progress
          </p>
        </div>
        <button onClick={() => setAdd(true)} className="btn-primary">
          <Plus size={15} /> Create Ticket
        </button>
      </div>

      {/* Filter tabs + search */}
      <div
        className="card"
        style={{
          padding: "10px 14px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "#f1f5f9",
            borderRadius: "12px",
            padding: "4px",
          }}
        >
          {STATUS_TABS.map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  background: isActive ? "#ffffff" : "transparent",
                  color: isActive ? "#0f172a" : "#64748b",
                  boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {t}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "20px",
                    height: "18px",
                    padding: "0 5px",
                    borderRadius: "99px",
                    fontSize: "10px",
                    fontWeight: 700,
                    lineHeight: 1,
                    background: isActive ? "#4f46e5" : "#e2e8f0",
                    color: isActive ? "#ffffff" : "#64748b",
                  }}
                >
                  {counts[t]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <Search
            size={13}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets…"
            className="input-base"
            style={{ paddingLeft: "36px", width: "210px" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <LifeBuoy size={36} className="mb-3 opacity-30" />
            <p className="text-[14px] font-medium">No tickets found</p>
            <p className="text-[12px] mt-1">
              {tab !== "All"
                ? `No "${tab}" tickets`
                : "Create your first ticket"}
            </p>
          </div>
        ) : (
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Client</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id || t.id}>
                  <td>
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full shrink-0
                        ${
                          t.status === "Open"
                            ? "bg-red-400"
                            : t.status === "In Progress"
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                        }`}
                      />
                      <span className="text-[13.5px] font-medium text-slate-800 leading-snug">
                        {t.title}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={t.client} />
                      <span className="text-[13px] text-slate-600">
                        {t.client}
                      </span>
                    </div>
                  </td>
                  <td>
                    <StatusDropdown
                      ticket={t}
                      onStatusChange={handleStatusChange}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                      <Clock size={11} className="text-slate-400" />
                      {t.createdAt}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEdit(t)}
                        className="h-8 w-8 rounded-lg bg-indigo-50 hover:bg-indigo-100
                          flex items-center justify-center text-indigo-600 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDel(t)}
                        className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100
                          flex items-center justify-center text-red-600 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Table footer */}
        {filtered.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #f1f5f9",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#94a3b8",
            }}
          >
            <span>
              Showing {filtered.length} of {all.length} tickets
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {[
                { label: "Open", color: "#f87171" },
                { label: "In Progress", color: "#fbbf24" },
                { label: "Resolved", color: "#4ade80" },
              ].map(({ label, color }) => (
                <span
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      height: "8px",
                      width: "8px",
                      borderRadius: "50%",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  {counts[label]} {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {addModal && (
        <TicketModal
          clients={clientsList}
          onClose={() => setAdd(false)}
          onSave={async (d) => {
            try {
              await createTicket(d);
              await reload();
              setAdd(false);
            } catch (e) {
              setError(e.response?.data?.message || "Failed to create ticket.");
            }
          }}
        />
      )}
      {editTicket && (
        <TicketModal
          clients={clientsList}
          ticket={editTicket}
          onClose={() => setEdit(null)}
          onSave={async (d) => {
            try {
              await updateTicket(d._id || d.id, d);
              await reload();
              setEdit(null);
            } catch (e) {
              setError(e.response?.data?.message || "Failed to update ticket.");
            }
          }}
        />
      )}
      {delTicket && (
        <DeleteModal
          ticket={delTicket}
          onClose={() => setDel(null)}
          onConfirm={async (id) => {
            try {
              await deleteTicket(id);
              await reload();
              setDel(null);
            } catch {
              setError("Failed to delete ticket.");
            }
          }}
        />
      )}
    </div>
  );
}
