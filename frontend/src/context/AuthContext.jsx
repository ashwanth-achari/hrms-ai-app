import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Check if user is already logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  // ✅ Login using backend API (NOT Firebase)
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log("🔄 Attempting login with:", email); // Debug

      // ✅ Call YOUR backend login endpoint
      const response = await api.post("/api/auth/login", {
        email,
        password
      });

      console.log("✅ Login response:", response.data); // Debug

      // ✅ Extract token and user from backend response
      const { token, user: backendUser } = response.data;

      if (!token || !backendUser) {
        throw new Error("Invalid response from backend");
      }

      // ✅ Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(backendUser));

      // ✅ Update state
      setUser(backendUser);

      return response.data;
    } catch (err) {
      console.error("❌ Login error:", err); // Debug
      const errorMsg = err.response?.data?.error || err.message || "Login failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
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
    user,              // Backend user object { id, email, role, scope }
    role: user?.role,  // User's role from backend
    loading,
    error,
    login,
    logout,
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
