import { useState } from "react";
import {
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  CreditCard,
  Moon,
  Sun,
  Check,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
} from "lucide-react";

const Toggle = ({ on, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    style={{
      width: "42px",
      height: "24px",
      borderRadius: "99px",
      border: "none",
      cursor: "pointer",
      background: on ? "#4f46e5" : "#e2e8f0",
      transition: "background 0.2s",
      position: "relative",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "3px",
        left: on ? "calc(100% - 21px)" : "3px",
        height: "18px",
        width: "18px",
        borderRadius: "50%",
        background: "#fff",
        transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }}
    />
  </button>
);

const SettingRow = ({ label, description, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 0",
      borderBottom: "1px solid #f1f5f9",
    }}
  >
    <div style={{ flex: 1, paddingRight: "24px" }}>
      <p style={{ fontSize: "13.5px", fontWeight: 600, color: "#1e293b" }}>
        {label}
      </p>
      {description && (
        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
          {description}
        </p>
      )}
    </div>
    {children}
  </div>
);

const SectionCard = ({ icon: Icon, iconBg, iconColor, title, children }) => (
  <div className="card" style={{ padding: "24px 28px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "6px",
      }}
    >
      <div
        style={{
          height: "36px",
          width: "36px",
          borderRadius: "10px",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} color={iconColor} />
      </div>
      <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
        {title}
      </h2>
    </div>
    <div style={{ marginTop: "8px" }}>{children}</div>
  </div>
);

export default function Settings() {
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    ticketUpdates: true,
    subscriptionExpiry: true,
    newClients: false,
    weeklyReport: true,
    marketing: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: true,
    loginAlerts: true,
  });
  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
  });
  const [saved, setSaved] = useState(false);

  const setN = (k) => (v) => setNotifs((s) => ({ ...s, [k]: v }));
  const setSec = (k) => (v) => setSecurity((s) => ({ ...s, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        paddingBottom: "40px",
        maxWidth: "780px",
      }}
    >
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>
          Settings
        </h1>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>
          Configure your preferences and account behaviour
        </p>
      </div>

      {/* Notifications */}
      <SectionCard
        icon={Bell}
        iconBg="#eff6ff"
        iconColor="#3b82f6"
        title="Notifications"
      >
        <SettingRow
          label="Email Alerts"
          description="Receive important alerts via email"
        >
          <Toggle on={notifs.emailAlerts} onChange={setN("emailAlerts")} />
        </SettingRow>
        <SettingRow
          label="Ticket Updates"
          description="Get notified when ticket status changes"
        >
          <Toggle on={notifs.ticketUpdates} onChange={setN("ticketUpdates")} />
        </SettingRow>
        <SettingRow
          label="Subscription Expiry"
          description="Alerts before subscriptions expire"
        >
          <Toggle
            on={notifs.subscriptionExpiry}
            onChange={setN("subscriptionExpiry")}
          />
        </SettingRow>
        <SettingRow
          label="New Client Registration"
          description="Notify when a new client signs up"
        >
          <Toggle on={notifs.newClients} onChange={setN("newClients")} />
        </SettingRow>
        <SettingRow
          label="Weekly Summary Report"
          description="Receive weekly business report every Monday"
        >
          <Toggle on={notifs.weeklyReport} onChange={setN("weeklyReport")} />
        </SettingRow>
        <SettingRow
          label="Marketing Emails"
          description="Product updates and feature announcements"
        >
          <Toggle on={notifs.marketing} onChange={setN("marketing")} />
        </SettingRow>
      </SectionCard>

      {/* Security */}
      <SectionCard
        icon={Shield}
        iconBg="#f0fdf4"
        iconColor="#16a34a"
        title="Security"
      >
        <SettingRow
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        >
          <Toggle on={security.twoFactor} onChange={setSec("twoFactor")} />
        </SettingRow>
        <SettingRow
          label="Auto Session Timeout"
          description="Automatically log out after 30 minutes of inactivity"
        >
          <Toggle
            on={security.sessionTimeout}
            onChange={setSec("sessionTimeout")}
          />
        </SettingRow>
        <SettingRow
          label="Login Alerts"
          description="Email me when a new device signs in"
        >
          <Toggle on={security.loginAlerts} onChange={setSec("loginAlerts")} />
        </SettingRow>
        <div style={{ paddingTop: "14px" }}>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#4f46e5",
              background: "#eef2ff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            View Active Sessions <ChevronRight size={13} />
          </button>
        </div>
      </SectionCard>

      {/* Appearance & Locale */}
      <SectionCard
        icon={Palette}
        iconBg="#fdf4ff"
        iconColor="#9333ea"
        title="Appearance & Locale"
      >
        {/* Theme */}
        <div
          style={{ paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}
        >
          <p
            style={{
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#1e293b",
              marginBottom: "10px",
            }}
          >
            Theme
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { val: "light", Icon: Sun, label: "Light" },
              { val: "dark", Icon: Moon, label: "Dark" },
            ].map(({ val, Icon, label }) => {
              const active = appearance.theme === val;
              return (
                <button
                  key={val}
                  onClick={() => setAppearance((a) => ({ ...a, theme: val }))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "9px 16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: `2px solid ${active ? "#4f46e5" : "#e5e7eb"}`,
                    background: active ? "#eef2ff" : "#fff",
                    color: active ? "#4f46e5" : "#64748b",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language & timezone */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            paddingTop: "16px",
          }}
        >
          <div>
            <label className="label">Language</label>
            <select
              value={appearance.language}
              onChange={(e) =>
                setAppearance((a) => ({ ...a, language: e.target.value }))
              }
              className="input-base"
              style={{ background: "#fff", cursor: "pointer" }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="label">Date Format</label>
            <select
              value={appearance.dateFormat}
              onChange={(e) =>
                setAppearance((a) => ({ ...a, dateFormat: e.target.value }))
              }
              className="input-base"
              style={{ background: "#fff", cursor: "pointer" }}
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label">Timezone</label>
            <select
              value={appearance.timezone}
              onChange={(e) =>
                setAppearance((a) => ({ ...a, timezone: e.target.value }))
              }
              className="input-base"
              style={{ background: "#fff", cursor: "pointer" }}
            >
              {[
                "America/New_York",
                "America/Los_Angeles",
                "Europe/London",
                "Europe/Paris",
                "Asia/Kolkata",
                "Asia/Tokyo",
              ].map((tz) => (
                <option key={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Save button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          className="btn-primary"
          style={{ minWidth: "150px" }}
        >
          {saved ? (
            <>
              <Check size={14} /> Saved!
            </>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    </div>
  );
}
