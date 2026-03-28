import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Mock admin credentials for frontend-only mode
const MOCK_ADMIN = {
  email: "admin@saas.com",
  password: "admin123",
  name: "Admin User",
  role: "Super Admin",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Frontend-only mock login — will be replaced with API call next week
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const userData = {
        name: MOCK_ADMIN.name,
        email: MOCK_ADMIN.email,
        role: MOCK_ADMIN.role,
      };
      const fakeToken = "mock-jwt-token-" + Date.now();
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
