import { useState, useEffect } from "react";
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
import { ticketService, clientService } from "../services/mockData";

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

/* ═══ Ticket Modal ═══ */
const TicketModal = ({ ticket, onClose, onSave }) => {
  const clients = clientService.getAll();
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card w-full max-w-[460px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="text-[16px] font-bold text-slate-900">
            {ticket ? "Edit Ticket" : "Create Ticket"}
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200
              flex items-center justify-center transition-colors text-slate-600"
          >
            <X size={15} />
          </button>
        </div>
        <div className="modal-body space-y-4">
          <div>
            <label className="label">Ticket Title</label>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="Describe the issue briefly…"
              className="input-base"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Client</label>
              <select
                value={form.client}
                onChange={set("client")}
                className="input-base bg-white cursor-pointer"
              >
                {clients.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={form.status}
                onChange={set("status")}
                className="input-base bg-white cursor-pointer"
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
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="btn-primary"
          >
            <Check size={14} />
            {ticket ? "Save Changes" : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══ Delete modal ═══ */
const DeleteModal = ({ ticket, onClose, onConfirm }) => (
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
          <h3 className="text-[15px] font-bold text-slate-900">Close Ticket</h3>
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
          <span className="font-semibold text-slate-900">"{ticket.title}"</span>
          ?
        </p>
      </div>
      <div className="modal-footer">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm(ticket.id);
            onClose();
          }}
          className="h-[38px] px-5 rounded-[10px] flex items-center gap-2
            text-[13.5px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  </div>
);

export default function Tickets() {
  const [all, setAll] = useState([]);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [addModal, setAdd] = useState(false);
  const [editTicket, setEdit] = useState(null);
  const [delTicket, setDel] = useState(null);

  useEffect(() => {
    setAll(ticketService.getAll());
  }, []);

  const reload = () => setAll(ticketService.getAll());

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
      t.client.toLowerCase().includes(q);
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
                <tr key={t.id}>
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
                    <span className={`badge ${statusClass(t.status)}`}>
                      {t.status}
                    </span>
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
          onClose={() => setAdd(false)}
          onSave={(d) => {
            ticketService.create(d);
            reload();
          }}
        />
      )}
      {editTicket && (
        <TicketModal
          ticket={editTicket}
          onClose={() => setEdit(null)}
          onSave={(d) => {
            ticketService.update(d.id, d);
            reload();
          }}
        />
      )}
      {delTicket && (
        <DeleteModal
          ticket={delTicket}
          onClose={() => setDel(null)}
          onConfirm={(id) => {
            ticketService.delete(id);
            reload();
          }}
        />
      )}
    </div>
  );
}
