import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Mail,
  Building2,
  Users,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";
import { clientService } from "../services/mockData";

const PLANS = ["All Plans", "Enterprise", "Pro", "Starter"];
const STATUSES = ["All Status", "Active", "Inactive"];

const planClass = (p) =>
  ({ Enterprise: "badge-purple", Pro: "badge-indigo", Starter: "badge-blue" })[
    p
  ] || "badge-gray";
const statusClass = (s) => (s === "Active" ? "badge-green" : "badge-gray");

/* ── Avatar initials ── */
const Avatar = ({ name, size = "md" }) => {
  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  const base = size === "sm" ? "h-8 w-8 text-[11px]" : "h-9 w-9 text-[12px]";
  return (
    <div
      className={`${base} ${colors[idx]}
      rounded-full font-bold flex items-center justify-center shrink-0`}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};

/* ── Modal ── */
const ClientModal = ({ client, onClose, onSave }) => {
  const [form, setForm] = useState(
    client
      ? { ...client }
      : { name: "", email: "", company: "", plan: "Pro", status: "Active" },
  );
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card w-full max-w-[480px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="text-[16px] font-bold text-slate-900">
            {client ? "Edit Client" : "Add New Client"}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Full Name</label>
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="Jane Doe"
                className="input-base"
              />
            </div>
            <div className="col-span-2">
              <label className="label">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="jane@company.com"
                className="input-base"
              />
            </div>
            <div className="col-span-2">
              <label className="label">Company</label>
              <input
                value={form.company}
                onChange={set("company")}
                placeholder="Acme Inc."
                className="input-base"
              />
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
            <div>
              <label className="label">Status</label>
              <select
                value={form.status}
                onChange={set("status")}
                className="input-base bg-white cursor-pointer"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
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
            {client ? "Save Changes" : "Add Client"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Delete confirmation ── */
const DeleteModal = ({ client, onClose, onConfirm }) => (
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
            Delete Client
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
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">{client.name}</span>?
          This action cannot be undone.
        </p>
      </div>
      <div className="modal-footer">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm(client.id);
            onClose();
          }}
          className="h-[38px] px-5 rounded-[10px] flex items-center gap-2
            text-[13.5px] font-semibold text-white
            bg-red-500 hover:bg-red-600 transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  </div>
);

export default function Clients() {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState("");
  const [planFilter, setPlan] = useState("All Plans");
  const [stFilter, setSt] = useState("All Status");
  const [addModal, setAdd] = useState(false);
  const [editClient, setEdit] = useState(null);
  const [delClient, setDel] = useState(null);

  useEffect(() => {
    setAll(clientService.getAll());
  }, []);

  const filtered = all.filter((c) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q);
    const matchP = planFilter === "All Plans" || c.plan === planFilter;
    const matchSt = stFilter === "All Status" || c.status === stFilter;
    return matchQ && matchP && matchSt;
  });

  const handleSaveNew = (data) => {
    const created = clientService.create(data);
    setAll(clientService.getAll());
  };

  const handleSaveEdit = (data) => {
    clientService.update(data.id, data);
    setAll(clientService.getAll());
  };

  const handleDelete = (id) => {
    clientService.delete(id);
    setAll(clientService.getAll());
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
          <h1 className="text-[20px] font-extrabold text-slate-900">Clients</h1>
          <p className="text-[13px] text-slate-400 mt-0.5">
            {all.length} total clients registered
          </p>
        </div>
        <button onClick={() => setAdd(true)} className="btn-primary">
          <Plus size={15} />
          Add Client
        </button>
      </div>

      {/* Filter bar */}
      <div
        className="card"
        style={{
          padding: "14px 18px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              pointerEvents: "none",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="input-base"
            style={{ paddingLeft: "38px", width: "100%" }}
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlan(e.target.value)}
          className="input-base w-[140px] bg-white cursor-pointer"
        >
          {PLANS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          value={stFilter}
          onChange={(e) => setSt(e.target.value)}
          className="input-base w-[140px] bg-white cursor-pointer"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {(search ||
          planFilter !== "All Plans" ||
          stFilter !== "All Status") && (
          <button
            onClick={() => {
              setSearch("");
              setPlan("All Plans");
              setSt("All Status");
            }}
            className="btn-secondary text-red-500 border-red-200 hover:bg-red-50"
          >
            <X size={13} /> Clear
          </button>
        )}
        <span
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            marginLeft: "auto",
            fontWeight: 500,
          }}
        >
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Users size={36} className="mb-3 opacity-30" />
            <p className="text-[14px] font-medium">No clients found</p>
            <p className="text-[12px] mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Plan</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} />
                      <div>
                        <p className="font-semibold text-slate-800 text-[13px]">
                          {c.name}
                        </p>
                        <p className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Mail size={10} /> {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building2 size={13} className="text-slate-400" />
                      <span className="text-[13px]">{c.company}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${planClass(c.plan)}`}>
                      {c.plan}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${statusClass(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEdit(c)}
                        className="h-8 w-8 rounded-lg bg-indigo-50 hover:bg-indigo-100
                          flex items-center justify-center text-indigo-600 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDel(c)}
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
      </div>

      {/* Modals */}
      {addModal && (
        <ClientModal onClose={() => setAdd(false)} onSave={handleSaveNew} />
      )}
      {editClient && (
        <ClientModal
          client={editClient}
          onClose={() => setEdit(null)}
          onSave={handleSaveEdit}
        />
      )}
      {delClient && (
        <DeleteModal
          client={delClient}
          onClose={() => setDel(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
