import React from "react";

const Recruitment = ({ role }) => {
  const roleLabel =
    role === "MANAGEMENT_ADMIN"
      ? "Company-wide Recruitment Overview"
      : role === "SENIOR_MANAGER"
      ? "Your Team's Roles & Candidates"
      : role === "HR_RECRUITER"
      ? "Recruitment Workspace"
      : "Recruitment";

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.75rem",
        background: "#ffffff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "1.1rem" }}>
        {roleLabel}
      </h2>

      <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
        This section will manage job postings, applications, AI resume screening, candidate
        pipelines and hiring decisions. The exact data and controls will be tailored per role.
      </p>

      <div
        style={{
          border: "1px dashed #d1d5db",
          borderRadius: "0.5rem",
          height: "180px",
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: "0.85rem",
        }}
      >
        [Recruitment Dashboard / Job Pipeline UI Placeholder]
      </div>
    </div>
  );
};

export default Recruitment;
