import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  // ✅ Different header content based on role
  const getHeaderContent = () => {
    switch (user?.role) {
      case "MANAGEMENT_ADMIN":
        return {
          title: "Admin Dashboard",
          subtitle: "System Management & Controls",
          bgColor: "#1e293b",
          accent: "#ef4444",
        };
      case "SENIOR_MANAGER":
        return {
          title: "Manager Dashboard",
          subtitle: "Team & Performance Management",
          bgColor: "#1e40af",
          accent: "#3b82f6",
        };
      case "HR_RECRUITER":
        return {
          title: "Recruiter Dashboard",
          subtitle: "Recruitment & Candidate Pipeline",
          bgColor: "#7c3aed",
          accent: "#a78bfa",
        };
      case "EMPLOYEE":
        return {
          title: "Employee Dashboard",
          subtitle: "Personal Data & Leave Management",
          bgColor: "#059669",
          accent: "#10b981",
        };
      default:
        return {
          title: "HRMS",
          subtitle: "Human Resource Management System",
          bgColor: "#1d4ed8",
          accent: "#3b82f6",
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <header
      style={{
        background: `linear-gradient(135deg, ${headerContent.bgColor} 0%, ${headerContent.accent} 100%)`,
        color: "#ffffff",
        padding: "1.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left side - Title & Subtitle */}
      <div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
          {headerContent.title}
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            margin: "0.25rem 0 0 0",
            opacity: 0.9,
          }}
        >
          {headerContent.subtitle}
        </p>
      </div>

      {/* Right side - User Info & Logout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* User Info */}
        <div
          style={{
            textAlign: "right",
            borderRight: "1px solid rgba(255,255,255,0.3)",
            paddingRight: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: "0.25rem",
            }}
          >
            {user?.email}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              opacity: 0.85,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {user?.role?.replace(/_/g, " ")}
          </div>
          {user?.scope?.department && (
            <div
              style={{
                fontSize: "0.75rem",
                opacity: 0.75,
                marginTop: "0.25rem",
              }}
            >
              {user.scope.department}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#ffffff",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(255,255,255,0.3)";
            e.target.style.borderColor = "rgba(255,255,255,0.5)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(255,255,255,0.2)";
            e.target.style.borderColor = "rgba(255,255,255,0.3)";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
