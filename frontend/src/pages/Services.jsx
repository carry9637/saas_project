import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Server,
  Layers,
  Zap,
  Globe,
  Shield,
  Database,
  Box,
} from "lucide-react";
import { serviceService } from "../services/mockData";

/* ── Icon list + colors for cards ── */
const SERVICE_ICONS = [Server, Layers, Zap, Globe, Shield, Database, Box];

const CARD_THEMES = [
  {
    grad: "from-indigo-500 to-indigo-700",
    light: "bg-indigo-50 text-indigo-700",
  },
  {
    grad: "from-violet-500 to-purple-700",
    light: "bg-violet-50 text-violet-700",
  },
  {
    grad: "from-emerald-500 to-teal-700",
    light: "bg-emerald-50 text-emerald-700",
  },
  { grad: "from-amber-500 to-orange-600", light: "bg-amber-50 text-amber-700" },
  { grad: "from-rose-500 to-red-700", light: "bg-rose-50 text-rose-700" },
  { grad: "from-sky-500 to-blue-700", light: "bg-sky-50 text-sky-700" },
];

const getTheme = (id) => CARD_THEMES[(id - 1) % CARD_THEMES.length];
const getIcon = (id) => SERVICE_ICONS[(id - 1) % SERVICE_ICONS.length];

/* ── ServiceModal ── */
const ServiceModal = ({ service, onClose, onSave }) => {
  const [form, setForm] = useState(
    service
      ? { ...service }
      : { name: "", description: "", price: "", status: "Active" },
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
            {service ? "Edit Service" : "Add New Service"}
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
            <label className="label">Service Name</label>
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Analytics Pro"
              className="input-base"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={set("description")}
              placeholder="Brief description of the service…"
              className="w-full px-3.5 py-2.5 text-[13.5px] border border-slate-200 rounded-[10px]
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
                placeholder:text-slate-400 text-slate-900 resize-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (USD/mo)</label>
              <input
                type="number"
                value={form.price}
                onChange={set("price")}
                placeholder="49"
                className="input-base"
              />
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
            {service ? "Save Changes" : "Add Service"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Delete modal ── */
const DeleteModal = ({ service, onClose, onConfirm }) => (
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
            Delete Service
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
          Delete{" "}
          <span className="font-semibold text-slate-900">{service.name}</span>?
          This will affect all active subscriptions for this plan.
        </p>
      </div>
      <div className="modal-footer">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm(service.id);
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

/* ── Service card ── */
const ServiceCard = ({ service, onEdit, onDelete }) => {
  const theme = getTheme(service.id);
  const Icon = getIcon(service.id);

  return (
    <div className="card card-hover flex flex-col overflow-hidden group">
      {/* Gradient header */}
      <div
        className={`bg-gradient-to-r ${theme.grad} relative overflow-hidden`}
        style={{ padding: "28px 24px 28px 24px", minHeight: "110px" }}
      >
        <div
          className="absolute right-0 top-0 h-28 w-28 rounded-full
          bg-white/10 -translate-y-1/2 translate-x-1/2"
        />
        <div className="relative z-10 flex items-center justify-between">
          <div
            className="h-13 w-13 rounded-2xl bg-white/20 backdrop-blur-sm
            flex items-center justify-center border border-white/30"
            style={{ height: "52px", width: "52px" }}
          >
            <Icon size={24} className="text-white" />
          </div>
          <span
            className={`text-[13px] font-bold rounded-full border ${
              service.status === "Active"
                ? "bg-white/20 text-white border-white/40"
                : "bg-black/20 text-white/70 border-white/20"
            }`}
            style={{ padding: "7px 16px" }}
          >
            {service.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1" style={{ padding: "24px 24px 24px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "8px",
          }}
        >
          {service.name}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "#64748b",
            lineHeight: 1.6,
            marginBottom: "18px",
            minHeight: "40px",
          }}
        >
          {service.description}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            ${service.price}
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
            / month
          </span>
        </div>
      </div>

      {/* Footer actions */}
      <div
        className="border-t border-slate-100 px-6 py-4 flex gap-3
        opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          onClick={() => onEdit(service)}
          className="flex-1 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100
            text-indigo-600 text-[12.5px] font-semibold flex items-center
            justify-center gap-1.5 transition-colors"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={() => onDelete(service)}
          className="flex-1 h-8 rounded-lg bg-red-50 hover:bg-red-100
            text-red-500 text-[12.5px] font-semibold flex items-center
            justify-center gap-1.5 transition-colors"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
};

export default function Services() {
  const [all, setAll] = useState([]);
  const [addModal, setAdd] = useState(false);
  const [editService, setEdit] = useState(null);
  const [delService, setDel] = useState(null);

  useEffect(() => {
    setAll(serviceService.getAll());
  }, []);

  const handleSaveNew = (data) => {
    serviceService.create(data);
    setAll(serviceService.getAll());
  };
  const handleSaveEdit = (data) => {
    serviceService.update(data.id, data);
    setAll(serviceService.getAll());
  };
  const handleDelete = (id) => {
    serviceService.delete(id);
    setAll(serviceService.getAll());
  };

  const active = all.filter((s) => s.status === "Active").length;
  const inactive = all.filter((s) => s.status === "Inactive").length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingBottom: "40px",
        paddingLeft: "8px",
        paddingRight: "8px",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-extrabold text-slate-900">
            Services
          </h1>
          <p className="text-[13px] text-slate-400 mt-0.5">
            {active} active, {inactive} inactive
          </p>
        </div>
        <button onClick={() => setAdd(true)} className="btn-primary">
          <Plus size={15} /> Add Service
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3" style={{ gap: "16px" }}>
        {[
          {
            label: "Total Services",
            val: all.length,
            dotColor: "#94a3b8",
            numColor: "#0f172a",
            cardBg: "#f8fafc",
          },
          {
            label: "Active",
            val: active,
            dotColor: "#4ade80",
            numColor: "#15803d",
            cardBg: "#f0fdf4",
          },
          {
            label: "Inactive",
            val: inactive,
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

      {/* Cards grid */}
      {all.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-slate-400">
          <Server size={40} className="mb-4 opacity-25" />
          <p className="text-[14px] font-medium">No services yet</p>
          <button
            onClick={() => setAdd(true)}
            className="btn-primary mt-4 text-[13px]"
          >
            <Plus size={14} /> Add First Service
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: "20px" }}
        >
          {all.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              onEdit={setEdit}
              onDelete={setDel}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {addModal && (
        <ServiceModal onClose={() => setAdd(false)} onSave={handleSaveNew} />
      )}
      {editService && (
        <ServiceModal
          service={editService}
          onClose={() => setEdit(null)}
          onSave={handleSaveEdit}
        />
      )}
      {delService && (
        <DeleteModal
          service={delService}
          onClose={() => setDel(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
