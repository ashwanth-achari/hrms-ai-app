// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api"; // ✅ axios instance with baseURL = VITE_API_URL

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // { id, email, role, scope }
  const [loading, setLoading] = useState(true);  // for initial load + login
  const [error, setError] = useState(null);      // auth-level error message

  // ✅ Load user from localStorage on first render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("authToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Error parsing stored user:", e);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Login using backend API
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log("🔄 Attempting login with:", email);

      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Login response:", response.data);

      const { token, user: backendUser } = response.data;

      if (!token || !backendUser) {
        throw new Error("Invalid response from backend");
      }

      // ✅ Persist in localStorage for session restore
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(backendUser));

      setUser(backendUser);
      return response.data;
    } catch (err) {
      console.error("❌ Login error (AuthContext):", err);

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed";

      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout: clear local storage + tell backend (optional)
  const logout = async () => {
    try {
      // Optional: tell backend (you already have /api/auth/logout)
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    }
  };

  const value = {
    user,
    role: user?.role || null,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
