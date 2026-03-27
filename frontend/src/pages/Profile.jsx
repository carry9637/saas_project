import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Camera,
  Check,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "Admin User",
    email: user?.email || "admin@saas.com",
    phone: "+1 (555) 000-1234",
    company: "Corelystic Inc.",
    location: "San Francisco, CA",
    role: "Super Admin",
    bio: "Managing the SaaS platform and ensuring smooth operations across all client accounts.",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPw: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    newPw: false,
    confirm: false,
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const set = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));
  const setPw = (k) => (e) =>
    setPasswords((p) => ({ ...p, [k]: e.target.value }));

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSavePw = () => {
    if (
      !passwords.current ||
      !passwords.newPw ||
      passwords.newPw !== passwords.confirm
    )
      return;
    setPwSaved(true);
    setPasswords({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 2500);
  };

  const initials = profile.name.slice(0, 2).toUpperCase();

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
          Profile
        </h1>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>
          Manage your personal information and account settings
        </p>
      </div>

      {/* Avatar + identity card */}
      <div
        className="card"
        style={{
          padding: "28px 28px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              height: "80px",
              width: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {initials}
          </div>
          <button
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              height: "26px",
              width: "26px",
              borderRadius: "50%",
              background: "#4f46e5",
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Camera size={12} color="#fff" />
          </button>
        </div>

        <div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
            {profile.name}
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
            {profile.email}
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: "8px",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: "99px",
            }}
          >
            {profile.role}
          </span>
        </div>
      </div>

      {/* Personal info */}
      <div className="card" style={{ padding: "24px 28px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "20px",
          }}
        >
          Personal Information
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {/* Full Name */}
          <div>
            <label className="label">Full Name</label>
            <div style={{ position: "relative" }}>
              <User
                size={14}
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
                value={profile.name}
                onChange={set("name")}
                className="input-base"
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="label">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={14}
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
                value={profile.email}
                onChange={set("email")}
                type="email"
                className="input-base"
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>
          {/* Phone */}
          <div>
            <label className="label">Phone</label>
            <div style={{ position: "relative" }}>
              <Phone
                size={14}
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
                value={profile.phone}
                onChange={set("phone")}
                className="input-base"
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>
          {/* Location */}
          <div>
            <label className="label">Location</label>
            <div style={{ position: "relative" }}>
              <MapPin
                size={14}
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
                value={profile.location}
                onChange={set("location")}
                className="input-base"
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>
          {/* Company */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label">Company</label>
            <div style={{ position: "relative" }}>
              <Building2
                size={14}
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
                value={profile.company}
                onChange={set("company")}
                className="input-base"
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>
          {/* Bio */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label">Bio</label>
            <textarea
              value={profile.bio}
              onChange={set("bio")}
              rows={3}
              className="input-base"
              style={{
                height: "auto",
                padding: "10px 14px",
                resize: "vertical",
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleSaveProfile}
            className="btn-primary"
            style={{ gap: "6px", minWidth: "130px" }}
          >
            {profileSaved ? (
              <>
                <Check size={14} /> Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Change password */}
      <div className="card" style={{ padding: "24px 28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              height: "36px",
              width: "36px",
              borderRadius: "10px",
              background: "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={16} color="#7c3aed" />
          </div>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
            Change Password
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            maxWidth: "400px",
          }}
        >
          {[
            { key: "current", label: "Current Password" },
            { key: "newPw", label: "New Password" },
            { key: "confirm", label: "Confirm New Password" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw[key] ? "text" : "password"}
                  value={passwords[key]}
                  onChange={setPw(key)}
                  placeholder="••••••••"
                  className="input-base"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    display: "flex",
                  }}
                >
                  {showPw[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleSavePw}
            className="btn-primary"
            style={{ minWidth: "150px" }}
          >
            {pwSaved ? (
              <>
                <Check size={14} /> Updated!
              </>
            ) : (
              <>
                <Lock size={14} /> Update Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
