import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch assigned candidates
        const candidatesRes = await api.get("/api/recruiter/candidates");
        setCandidates(candidatesRes.data.data || []);

        // ✅ Fetch job openings
        const jobsRes = await api.get("/api/recruiter/jobs");
        setJobs(jobsRes.data.data || []);
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
        <p>Loading recruitment data...</p>
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

  // Get candidate status stats
  const statusStats = {
    applied: candidates.filter((c) => c.status === "APPLIED").length,
    interview: candidates.filter((c) => c.status === "INTERVIEW").length,
    selected: candidates.filter((c) => c.status === "SELECTED").length,
    rejected: candidates.filter((c) => c.status === "REJECTED").length,
  };

  return (
    <div style={{ padding: "2rem", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Recruiter Info */}
      <div
        style={{
          background: "#faf5ff",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          borderLeft: "4px solid #a78bfa",
          marginBottom: "2rem",
        }}
      >
        <div style={{ fontSize: "0.85rem", color: "#6b21a8", marginBottom: "0.5rem" }}>
          📋 Your Recruitment Info
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1f2937" }}>
          Department: {user?.scope?.department || "N/A"}
        </div>
        <div style={{ fontSize: "0.9rem", color: "#4b5563", marginTop: "0.5rem" }}>
          Team: {user?.scope?.team || "N/A"} • Managing {candidates.length} candidates
        </div>
      </div>

      {/* Pipeline Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
            Applied
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {statusStats.applied}
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
            Interview
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {statusStats.interview}
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
            Selected
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {statusStats.selected}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #ef4444",
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>
            Rejected
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {statusStats.rejected}
          </div>
        </div>
      </div>

      {/* Candidates Table */}
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
            My Candidates
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0.5rem 0 0 0" }}>
            Total: {candidates.length} candidates
          </p>
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
                  Candidate Name
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                  Email
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                  Position
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.slice(0, 15).map((candidate) => {
                const statusColors = {
                  APPLIED: { bg: "#dbeafe", color: "#1d4ed8" },
                  INTERVIEW: { bg: "#fef3c7", color: "#92400e" },
                  SELECTED: { bg: "#d1fae5", color: "#065f46" },
                  REJECTED: { bg: "#fee2e2", color: "#991b1b" },
                };
                const statusStyle =
                  statusColors[candidate.status] ||
                  statusColors.APPLIED;

                return (
                  <tr
                    key={candidate._id}
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                  >
                    <td style={{ padding: "1rem" }}>
                      {candidate.name || "N/A"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {candidate.email || "N/A"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {candidate.position || "N/A"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        {candidate.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {candidates.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>
            No candidates assigned yet
          </div>
        )}
      </div>

      {/* Open Positions */}
      {jobs.length > 0 && (
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
              Open Positions
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
                    Position
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Department
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                  >
                    <td style={{ padding: "1rem" }}>{job.title || "N/A"}</td>
                    <td style={{ padding: "1rem" }}>
                      {job.department || "N/A"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          background: "#d1fae5",
                          color: "#065f46",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Open
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

export default RecruiterDashboard;
