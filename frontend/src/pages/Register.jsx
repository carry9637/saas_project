import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Sparkles, UserPlus } from "lucide-react";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "admin",
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ════ LEFT ════ */}
      <div
        style={{
          width: "40%",
          maxWidth: "500px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(155deg, #0f172a 0%, #1a1040 100%)",
          padding: "40px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "-120px", right: "-120px", height: "380px", width: "380px", borderRadius: "50%", background: "rgba(79,70,229,0.22)", filter: "blur(90px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-120px", left: "-120px", height: "380px", width: "380px", borderRadius: "50%", background: "rgba(124,58,237,0.18)", filter: "blur(90px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div style={{ height: "42px", width: "42px", borderRadius: "13px", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(79,70,229,0.55)" }}>
            <Sparkles size={19} color="white" />
          </div>
          <span style={{ fontSize: "19px", fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>Corelystic</span>
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(79,70,229,0.22)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: "99px", padding: "5px 14px", marginBottom: "28px" }}>
            <UserPlus size={13} color="#818cf8" />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#a5b4fc", letterSpacing: "0.03em" }}>Create your account</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: "16px", letterSpacing: "-0.025em" }}>
            Start managing
            <br />
            <span style={{ color: "#818cf8" }}>your SaaS</span>
            <br />
            today.
          </h1>
          <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.75 }}>
            Join thousands of businesses using Corelystic to run their operations smoothly.
          </p>
        </div>
      </div>

      {/* ════ RIGHT — Form ════ */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: "430px" }}>
          <div style={{ background: "white", borderRadius: "22px", border: "1px solid #e2e8f0", boxShadow: "0 8px 40px rgba(15,23,42,0.10), 0 1px 3px rgba(15,23,42,0.06)", padding: "40px 38px 34px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", marginBottom: "6px", letterSpacing: "-0.025em" }}>Create account</h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "28px" }}>Fill in your details to get started</p>

            {error && (
              <div style={{ marginBottom: "18px", borderRadius: "12px", background: "#fef2f2", border: "1px solid #fecaca", padding: "12px 16px" }}>
                <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div style={{ marginBottom: "16px" }}>
                <label className="label">Full Name</label>
                <input type="text" required value={form.name} onChange={set("name")} placeholder="Your name" className="input-base" />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label className="label">Email Address</label>
                <input type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" className="input-base" />
              </div>

              {/* Password */}
              <div style={{ marginBottom: "16px" }}>
                <label className="label">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Min 6 characters"
                    className="input-base"
                    style={{ paddingRight: "44px" }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: "22px" }}>
                <label className="label">Confirm Password</label>
                <input type="password" required value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter password" className="input-base" />
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", height: "46px", fontSize: "15px", borderRadius: "12px" }}>
                {loading ? (
                  <div style={{ height: "18px", width: "18px", borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "white", animation: "spin 0.7s linear infinite" }} />
                ) : (
                  <><span>Create Account</span>&nbsp;<ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
          <p style={{ textAlign: "center", fontSize: "11px", color: "#cbd5e1", marginTop: "10px" }}>
            © 2026 Corelystic Inc.
          </p>
        </div>
      </div>
    </div>
  );
}
