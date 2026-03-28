import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  BarChart3,
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (!res.success) setError(res.message);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ════ LEFT — Dark branding panel ════ */}
      <div
        style={{
          width: "45%",
          maxWidth: "560px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(155deg, #0f172a 0%, #1a1040 100%)",
          padding: "40px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            height: "380px",
            width: "380px",
            borderRadius: "50%",
            background: "rgba(79,70,229,0.22)",
            filter: "blur(90px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-120px",
            height: "380px",
            width: "380px",
            borderRadius: "50%",
            background: "rgba(124,58,237,0.18)",
            filter: "blur(90px)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              height: "42px",
              width: "42px",
              borderRadius: "13px",
              background: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(79,70,229,0.55)",
            }}
          >
            <Sparkles size={19} color="white" />
          </div>
          <span
            style={{
              fontSize: "19px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Corelystic
          </span>
        </div>

        {/* Hero copy */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "52px",
            paddingBottom: "52px",
          }}
        >
          {/* Pill badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(79,70,229,0.22)",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: "99px",
              padding: "5px 14px",
              marginBottom: "28px",
              width: "fit-content",
            }}
          >
            <span
              style={{
                height: "7px",
                width: "7px",
                borderRadius: "50%",
                background: "#818cf8",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#a5b4fc",
                letterSpacing: "0.03em",
              }}
            >
              Premium SaaS Dashboard
            </span>
          </div>

          <h1
            style={{
              fontSize: "38px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.13,
              marginBottom: "20px",
              letterSpacing: "-0.025em",
            }}
          >
            Manage your
            <br />
            <span style={{ color: "#818cf8" }}>entire business</span>
            <br />
            in one place.
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#94a3b8",
              lineHeight: 1.75,
              maxWidth: "320px",
            }}
          >
            Clients, subscriptions, analytics & tickets — everything beautifully
            organized just for you.
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
          }}
        >
          {[
            { icon: Users, val: "2,450+", label: "Active Users" },
            { icon: Zap, val: "99.9%", label: "Uptime" },
            { icon: BarChart3, val: "1.2M+", label: "Tasks Done" },
          ].map(({ icon: Icon, val, label }) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
                padding: "16px 12px",
              }}
            >
              <Icon
                size={16}
                color="#818cf8"
                style={{ display: "block", marginBottom: "10px" }}
              />
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: "3px",
                }}
              >
                {val}
              </p>
              <p style={{ fontSize: "11px", color: "#64748b" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ════ RIGHT — Form panel ════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          padding: "48px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "430px" }}>
          {/* Card */}
          <div
            style={{
              background: "white",
              borderRadius: "22px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 8px 40px rgba(15,23,42,0.10), 0 1px 3px rgba(15,23,42,0.06)",
              padding: "40px 38px 34px",
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "6px",
                letterSpacing: "-0.025em",
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "30px",
              }}
            >
              Sign in to your admin dashboard
            </p>

            {error && (
              <div
                style={{
                  marginBottom: "20px",
                  borderRadius: "12px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  padding: "12px 16px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#dc2626",
                    fontWeight: 500,
                  }}
                >
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: "18px" }}>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="admin@saas.com"
                  className="input-base"
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <label className="label" style={{ margin: 0 }}>
                    Password
                  </label>
                  <a
                    href="#"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#4f46e5",
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Enter your password"
                    className="input-base"
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: "absolute",
                      right: "13px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      padding: "2px",
                    }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "22px",
                }}
              >
                <input
                  type="checkbox"
                  id="remember"
                  style={{
                    accentColor: "#4f46e5",
                    cursor: "pointer",
                    width: "15px",
                    height: "15px",
                  }}
                />
                <label
                  htmlFor="remember"
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  height: "46px",
                  fontSize: "15px",
                  borderRadius: "12px",
                }}
              >
                {loading ? (
                  <div
                    style={{
                      height: "18px",
                      width: "18px",
                      borderRadius: "50%",
                      border: "2.5px solid rgba(255,255,255,0.35)",
                      borderTopColor: "white",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                ) : (
                  <>
                    <span>Sign In</span>&nbsp;
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo credentials */}
          <div
            style={{
              marginTop: "16px",
              borderRadius: "16px",
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              padding: "18px 22px",
            }}
          >
            <p
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                color: "#4f46e5",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "12px",
              }}
            >
              Demo Credentials
            </p>
            <div style={{ display: "flex", gap: "32px" }}>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    marginBottom: "3px",
                  }}
                >
                  Email
                </p>
                <code
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#3730a3",
                  }}
                >
                  admin@saas.com
                </code>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    marginBottom: "3px",
                  }}
                >
                  Password
                </p>
                <code
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#3730a3",
                  }}
                >
                  admin123
                </code>
              </div>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#94a3b8",
              marginTop: "22px",
            }}
          >
            © 2026 Corelystic Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
