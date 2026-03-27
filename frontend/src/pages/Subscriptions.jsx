import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  CreditCard,
  Calendar,
  Clock,
} from "lucide-react";
import {
  subscriptionService,
  clientService,
  serviceService,
} from "../services/mockData";

/* ─── Status helpers ─── */
const getStatus = (expiry) => {
  const days = Math.ceil((new Date(expiry) - new Date()) / 86400000);
  if (days < 0) return { label: "Expired", cls: "badge-red", days };
  if (days <= 30) return { label: "Expiring Soon", cls: "badge-yellow", days };
  return { label: "Active", cls: "badge-green", days };
};

const planClass = (p) =>
  ({ Enterprise: "badge-purple", Pro: "badge-indigo", Starter: "badge-blue" })[
    p
  ] || "badge-gray";

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

/* ═══ Modal ═══ */
const SubModal = ({ sub, onClose, onSave }) => {
  const clients = clientService.getAll();
  const services = serviceService.getAll();

  const [form, setForm] = useState(
    sub
      ? { ...sub }
      : {
          clientName: clients[0]?.name || "",
          plan: "Pro",
          startDate: new Date().toISOString().split("T")[0],
          expiryDate: new Date(Date.now() + 365 * 86400000)
            .toISOString()
            .split("T")[0],
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
            {sub ? "Edit Subscription" : "New Subscription"}
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
            <label className="label">Client</label>
            <select
              value={form.clientName}
              onChange={set("clientName")}
              className="input-base bg-white cursor-pointer"
            >
              {clients.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Plan</label>
            <select
              value={form.plan}
              onChange={set("plan")}
              className="input-base bg-white cursor-pointer"
            >
              {["Enterprise", "Pro", "Starter"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={set("startDate")}
                className="input-base"
              />
            </div>
            <div>
              <label className="label">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={set("expiryDate")}
                className="input-base"
              />
            </div>
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
            {sub ? "Save Changes" : "Add Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══ Delete modal ═══ */
const DeleteModal = ({ sub, onClose, onConfirm }) => (
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
            Delete Subscription
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
          Remove subscription for{" "}
          <span className="font-semibold text-slate-900">{sub.clientName}</span>
          ?
        </p>
      </div>
      <div className="modal-footer">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm(sub.id);
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

export default function Subscriptions() {
  const [all, setAll] = useState([]);
  const [addModal, setAdd] = useState(false);
  const [editSub, setEdit] = useState(null);
  const [delSub, setDel] = useState(null);

  useEffect(() => {
    setAll(subscriptionService.getAll());
  }, []);

  const reload = () => setAll(subscriptionService.getAll());

  const stats = {
    active: all.filter((s) => getStatus(s.expiryDate).label === "Active")
      .length,
    soon: all.filter((s) => getStatus(s.expiryDate).label === "Expiring Soon")
      .length,
    expired: all.filter((s) => getStatus(s.expiryDate).label === "Expired")
      .length,
  };

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
            Subscriptions
          </h1>
          <p className="text-[13px] text-slate-400 mt-0.5">
            {all.length} total subscriptions
          </p>
        </div>
        <button onClick={() => setAdd(true)} className="btn-primary">
          <Plus size={15} /> New Subscription
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3" style={{ gap: "16px" }}>
        {[
          {
            label: "Active",
            val: stats.active,
            dotColor: "#4ade80",
            numColor: "#15803d",
            cardBg: "#f0fdf4",
          },
          {
            label: "Expiring Soon",
            val: stats.soon,
            dotColor: "#fbbf24",
            numColor: "#b45309",
            cardBg: "#fffbeb",
          },
          {
            label: "Expired",
            val: stats.expired,
            dotColor: "#f87171",
            numColor: "#dc2626",
            cardBg: "#fef2f2",
          },
        ].map(({ label, val, dotColor, numColor, cardBg }) => (
          <div
            key={label}
            className="card"
            style={{
              background: cardBg,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                height: "10px",
                width: "10px",
                borderRadius: "50%",
                background: dotColor,
                flexShrink: 0,
              }}
            />
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "8px" }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: numColor,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {val}
              </span>
              <span
                style={{ fontSize: "13px", fontWeight: 500, color: "#64748b" }}
              >
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <CreditCard size={36} className="mb-3 opacity-30" />
            <p className="text-[14px] font-medium">No subscriptions yet</p>
          </div>
        ) : (
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Client</th>
                <th>Plan</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {all.map((s) => {
                const st = getStatus(s.expiryDate);
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.clientName} />
                        <span className="font-semibold text-slate-800 text-[13px]">
                          {s.clientName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${planClass(s.plan)}`}>
                        {s.plan}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-[13px] text-slate-600">
                        <Calendar size={12} className="text-slate-400" />
                        {s.startDate}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-[13px] text-slate-600">
                        <Clock size={12} className="text-slate-400" />
                        {s.expiryDate}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className={`badge ${st.cls} mb-1`}>
                          {st.label}
                        </span>
                        {st.days >= 0 && st.days <= 60 && (
                          <span className="text-[10.5px] text-slate-400">
                            {st.days} days left
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEdit(s)}
                          className="h-8 w-8 rounded-lg bg-indigo-50 hover:bg-indigo-100
                            flex items-center justify-center text-indigo-600 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDel(s)}
                          className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100
                            flex items-center justify-center text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {addModal && (
        <SubModal
          onClose={() => setAdd(false)}
          onSave={(d) => {
            subscriptionService.create(d);
            reload();
          }}
        />
      )}
      {editSub && (
        <SubModal
          sub={editSub}
          onClose={() => setEdit(null)}
          onSave={(d) => {
            subscriptionService.update(d.id, d);
            reload();
          }}
        />
      )}
      {delSub && (
        <DeleteModal
          sub={delSub}
          onClose={() => setDel(null)}
          onConfirm={(id) => {
            subscriptionService.delete(id);
            reload();
          }}
        />
      )}
    </div>
  );
}
