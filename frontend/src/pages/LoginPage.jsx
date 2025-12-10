import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // ✅ This calls the backend login via AuthContext
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #eff6ff, #f9fafb)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        }}
      >
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#1d4ed8",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            H
          </div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>HRMS Login</h1>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.25rem" }}>
            Sign in with your corporate credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              htmlFor="email"
              style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                fontSize: "0.9rem",
              }}
              placeholder="admin@company.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                fontSize: "0.9rem",
              }}
              placeholder="password123"
            />
          </div>

          {(error || authError) && (
            <div
              style={{
                fontSize: "0.8rem",
                color: "#b91c1c",
                background: "#fee2e2",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.75rem",
              }}
            >
              {error || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.65rem 0.75rem",
              borderRadius: "999px",
              border: "none",
              background: submitting ? "#93c5fd" : "#1d4ed8",
              color: "#ffffff",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
            }}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Test Credentials Info */}
       
      </div>
    </div>
  );
};

export default LoginPage;