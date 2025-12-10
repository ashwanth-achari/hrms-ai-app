import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

// Sidebar navigation items by role
const menuByRole = {
  MANAGEMENT_ADMIN: [
    { id: "ADMIN_DASHBOARD", label: "Dashboard" },
    {
      id: "ADMIN_EMPLOYEE_MGMT",
      label: "Employee Data Management",
      children: [
        { id: "ADMIN_ATTENDANCE", label: "Attendance" },
        { id: "ADMIN_PAYROLL", label: "Payroll" },
        { id: "ADMIN_PERFORMANCE", label: "Performance Tracking" },
        { id: "ADMIN_LEAVE", label: "Employee Leave" },
        { id: "ADMIN_RECRUITMENT", label: "Recruitment" },
      ],
    },
    { id: "ADMIN_SETTINGS", label: "Settings" },
  ],

  SENIOR_MANAGER: [
    { id: "MANAGER_DASHBOARD", label: "Dashboard" },
    {
      id: "MANAGER_TEAM_MGMT",
      label: "Team Management",
      children: [
        { id: "MANAGER_TEAM", label: "My Team" },
        { id: "MANAGER_ATTENDANCE", label: "Team Attendance" },
        { id: "MANAGER_PERFORMANCE", label: "Team Performance" },
        { id: "MANAGER_RECRUITMENT", label: "Recruitment (My Roles)" },
        { id: "MANAGER_APPROVALS", label: "Approvals" },
      ],
    },
  ],

  HR_RECRUITER: [
    { id: "RECRUITER_DASHBOARD", label: "Dashboard" },
    { id: "RECRUITER_JOBS", label: "Job Positions" },
    { id: "RECRUITER_CANDIDATES", label: "Candidates" },
    { id: "RECRUITER_AI", label: "Recruitment (AI)" },
    { id: "RECRUITER_PIPELINES", label: "Pipelines" },
    { id: "RECRUITER_REPORTS", label: "Reports" },
  ],

  EMPLOYEE: [
    { id: "EMPLOYEE_DASHBOARD", label: "Dashboard" },
    { id: "EMPLOYEE_ATTENDANCE", label: "My Attendance" },
    { id: "EMPLOYEE_LEAVE", label: "My Leave" },
    { id: "EMPLOYEE_PAYROLL", label: "My Payroll" },
    { id: "EMPLOYEE_PERFORMANCE", label: "My Performance" },
    { id: "EMPLOYEE_JOBS", label: "Internal Jobs" },
    { id: "EMPLOYEE_HELP", label: "Help / Chatbot" },
  ],
};

const Sidebar = ({ activeItem, onChange }) => {
  // ✅ Get user from AuthContext
  const { user } = useAuth();
  const [openDropdowns, setOpenDropdowns] = useState({});

  // ✅ Get menu based on authenticated user's role
  const menu = menuByRole[user?.role] || [];

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = (item) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    // Simple item
    if (!hasChildren) {
      const isActive = activeItem === item.id;
      return (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          style={{
            textAlign: "left",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            background: isActive ? "#1d4ed8" : "transparent",
            color: isActive ? "#ffffff" : "#374151",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: isActive ? 600 : 500,
            transition: "all 0.2s ease",
          }}
        >
          {item.label}
        </button>
      );
    }

    // Dropdown item
    const isOpen =
      openDropdowns[item.id] ||
      item.children.some((child) => child.id === activeItem);

    return (
      <div key={item.id} style={{ marginBottom: "0.25rem" }}>
        <button
          onClick={() => toggleDropdown(item.id)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            background: isOpen ? "#e5edff" : "transparent",
            color: "#374151",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.2s ease",
          }}
        >
          <span>{item.label}</span>
          <span style={{ fontSize: "0.7rem" }}>{isOpen ? "▾" : "▸"}</span>
        </button>

        {isOpen && (
          <div
            style={{
              marginTop: "0.25rem",
              paddingLeft: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.15rem",
            }}
          >
            {item.children.map((child) => {
              const isActive = activeItem === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => onChange(child.id)}
                  style={{
                    textAlign: "left",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    background: isActive ? "#1d4ed8" : "transparent",
                    color: isActive ? "#ffffff" : "#4b5563",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: isActive ? 600 : 500,
                    transition: "all 0.2s ease",
                  }}
                >
                  {child.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      style={{
        width: "260px",
        borderRight: "1px solid #e5e7eb",
        background: "#f9fafb",
        padding: "1rem 0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      {/* ✅ REMOVED user info card - now only in header */}

      <div
        style={{
          fontSize: "0.75rem",
          color: "#6b7280",
          marginBottom: "0.5rem",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Navigation
      </div>

      {/* ✅ Render menu items based on authenticated user's role */}
      {menu.length > 0 ? (
        menu.map((item) => renderItem(item))
      ) : (
        <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          No menu items available
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
