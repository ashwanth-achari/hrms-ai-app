import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch team members
        const teamRes = await api.get("/api/manager/team");
        setTeam(teamRes.data.data || []);

        // ✅ Fetch team performance
        const perfRes = await api.get("/api/manager/team/performance");
        setPerformance(perfRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading team data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          background: "#fee2e2",
          color: "#991b1b",
          borderRadius: "0.5rem",
          margin: "1rem",
        }}
      >
        ❌ Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Manager Info */}
      <div
        style={{
          background: "#eff6ff",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          borderLeft: "4px solid #3b82f6",
          marginBottom: "2rem",
        }}
      >
        <div style={{ fontSize: "0.85rem", color: "#1e40af", marginBottom: "0.5rem" }}>
          👤 Your Team Info
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1f2937" }}>
          Department: {user?.scope?.department || "N/A"}
        </div>
        <div style={{ fontSize: "0.9rem", color: "#4b5563", marginTop: "0.5rem" }}>
          Team: {user?.scope?.team || "N/A"} • {team.length} members
        </div>
      </div>

      {/* Team Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
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
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>
            Team Size
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {team.length}
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
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>
            Present Today
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {Math.floor(team.length * 0.9)}
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
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>
            On Leave
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {Math.ceil(team.length * 0.1)}
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "0.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
            My Team Members
          </h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                  Name
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                  Email
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                  Role
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr
                  key={member._id}
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <td style={{ padding: "1rem" }}>{member.name || "N/A"}</td>
                  <td style={{ padding: "1rem" }}>{member.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {member.role?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        background: "#d1fae5",
                        color: "#065f46",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.8rem",
                      }}
                    >
                      ✓ Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {team.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>
            No team members found
          </div>
        )}
      </div>

      {/* Performance Section */}
      {performance.length > 0 && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
              Team Performance
            </h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Employee
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Performance
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {performance.map((emp) => (
                  <tr
                    key={emp._id}
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                  >
                    <td style={{ padding: "1rem" }}>{emp.name || "N/A"}</td>
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{
                          background: "#e5e7eb",
                          borderRadius: "9999px",
                          height: "8px",
                          width: "100px",
                        }}
                      >
                        <div
                          style={{
                            background: "#10b981",
                            height: "100%",
                            borderRadius: "9999px",
                            width: `${(emp.performance || 75) * 1.33}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          background: "#d1fae5",
                          color: "#065f46",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {emp.performance || 75}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
