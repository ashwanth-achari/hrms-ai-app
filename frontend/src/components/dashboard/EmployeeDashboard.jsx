import React from "react";
import { useAuth } from "../../context/AuthContext";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  // Basic derived values from auth (fallbacks for local dev)
  const displayName = user?.email?.split("@")[0] || "Employee";
  const email = user?.email || "employee@company.com";
  const department = user?.scope?.department || "Engineering";
  const team = user?.scope?.team || "Product Team";
  const role = user?.role?.replace(/_/g, " ") || "Software Engineer";

  // Static/mock leave balance
  const leaveBalance = {
    annualLeave: 18,
    sickLeave: 10,
    casualLeave: 6,
  };

  return (
    <div style={{ padding: "2rem", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Employee Profile Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "#ffffff",
          padding: "2rem",
          borderRadius: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            👤
          </div>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
              {displayName}
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                margin: "0.5rem 0 0 0",
                opacity: 0.9,
              }}
            >
              {email}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Department</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              {department}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Team</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{team}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Role</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{role}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #3b82f6",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            Attendance Rate
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}
          >
            95%
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9ca3af",
              marginTop: "0.5rem",
            }}
          >
            This month
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #10b981",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            Performance
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}
          >
            4.5/5
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9ca3af",
              marginTop: "0.5rem",
            }}
          >
            Last review
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            Projects
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}
          >
            3
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9ca3af",
              marginTop: "0.5rem",
            }}
          >
            Active projects
          </div>
        </div>
      </div>

      {/* Leave Balance (static) */}
      <div
        style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            margin: "0 0 1rem 0",
          }}
        >
          Leave Balance
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              background: "#f0fdf4",
              borderRadius: "0.5rem",
              border: "1px solid #dcfce7",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: "#166534",
                marginBottom: "0.5rem",
              }}
            >
              Annual Leave
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#166534",
              }}
            >
              {leaveBalance.annualLeave} days
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#fef3c7",
              borderRadius: "0.5rem",
              border: "1px solid #fde68a",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: "#92400e",
                marginBottom: "0.5rem",
              }}
            >
              Sick Leave
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#92400e",
              }}
            >
              {leaveBalance.sickLeave} days
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#dbeafe",
              borderRadius: "0.5rem",
              border: "1px solid #bfdbfe",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: "#1e40af",
                marginBottom: "0.5rem",
              }}
            >
              Casual Leave
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1e40af",
              }}
            >
              {leaveBalance.casualLeave} days
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div
        style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            margin: "0 0 1rem 0",
          }}
        >
          Recent Activities
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "0.5rem",
              borderLeft: "4px solid #3b82f6",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              ✓ Attendance Marked
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              Today at 09:00 AM
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "0.5rem",
              borderLeft: "4px solid #10b981",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              ✓ Performance Review Completed
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              Last month
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "0.5rem",
              borderLeft: "4px solid #f59e0b",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              📧 Leave Request Approved
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              2 weeks ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
