import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // ✅ Fetch analytics and employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Fetching admin analytics...");
        const analyticsRes = await api.get("/api/admin/analytics");
        console.log("✅ Analytics response:", analyticsRes.data);
        setAnalytics(analyticsRes.data.data);

        console.log("🔄 Fetching employees...");
        const employeesRes = await api.get(`/api/admin/all-employees?page=${currentPage}&limit=10`);
        console.log("✅ Employees response:", employeesRes.data);
        setEmployees(employeesRes.data.data);
        setFilteredEmployees(employeesRes.data.data);
        setTotalPages(employeesRes.data.pagination?.pages || 1);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError(err.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // ✅ Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/api/admin/employees/search?query=${searchQuery}&department=${departmentFilter}`);
      console.log("✅ Search results:", res.data);
      setFilteredEmployees(res.data.data);
    } catch (err) {
      console.error("❌ Search error:", err);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle edit
  const handleEdit = (employee) => {
    setEditingId(employee._id);
    setEditData({ ...employee });
  };

  // ✅ Handle update
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await api.put(`/api/admin/employees/${editingId}`, editData);
      console.log("✅ Update response:", res.data);

      // Refresh list
      const employeesRes = await api.get(`/api/admin/all-employees?page=${currentPage}&limit=10`);
      setEmployees(employeesRes.data.data);
      setFilteredEmployees(employeesRes.data.data);
      setEditingId(null);
    } catch (err) {
      console.error("❌ Update error:", err);
      setError("Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      setLoading(true);
      await api.delete(`/api/admin/employees/${id}`);
      console.log("✅ Employee deleted");

      // Refresh list
      const employeesRes = await api.get(`/api/admin/all-employees?page=${currentPage}&limit=10`);
      setEmployees(employeesRes.data.data);
      setFilteredEmployees(employeesRes.data.data);
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError("Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error && !analytics) {
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
      {/* Analytics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Total Employees */}
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
            Total Employees
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {analytics?.totalEmployees || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem" }}>
            ✓ From MongoDB
          </div>
        </div>

        {/* Departments */}
        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #8b5cf6",
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>
            Departments
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {analytics?.totalDepartments || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem" }}>
            Active departments
          </div>
        </div>

        {/* Active Users */}
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
            Total Candidates
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {analytics?.totalCandidates || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem" }}>
            In recruitment pipeline
          </div>
        </div>

        {/* Open Jobs */}
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
            Open Jobs
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>
            {analytics?.openJobs || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem" }}>
            Active job openings
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div
        style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", margin: 0 }}>
          🔍 Search & Filter Employees
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "0.6rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "0.9rem",
            }}
          />

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "0.9rem",
            }}
          >
            <option value="">All Departments</option>
            {analytics?.departments?.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: "0.6rem 1.5rem",
              background: "#3b82f6",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <button
            onClick={() => {
              setSearchQuery("");
              setDepartmentFilter("");
              setFilteredEmployees(employees);
            }}
            style={{
              padding: "0.6rem 1.5rem",
              background: "#e5e7eb",
              color: "#374151",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Employees Table */}
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
            All Employees
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0.5rem 0 0 0" }}>
            Total: {filteredEmployees.length} employees (Page {currentPage} of {totalPages})
          </p>
        </div>

        {filteredEmployees.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
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
                    Employee ID
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Department
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Position
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Salary
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>
                    Status
                  </th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp._id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      background: editingId === emp._id ? "#f0fdf4" : "transparent",
                    }}
                  >
                    {editingId === emp._id ? (
                      <>
                        <td style={{ padding: "1rem" }}>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                            }}
                          />
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) =>
                              setEditData({ ...editData, email: e.target.value })
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                            }}
                          />
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <input
                            type="text"
                            value={editData.employeeId}
                            onChange={(e) =>
                              setEditData({ ...editData, employeeId: e.target.value })
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                            }}
                          />
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <input
                            type="text"
                            value={editData.department}
                            onChange={(e) =>
                              setEditData({ ...editData, department: e.target.value })
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                            }}
                          />
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <input
                            type="text"
                            value={editData.position}
                            onChange={(e) =>
                              setEditData({ ...editData, position: e.target.value })
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                            }}
                          />
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <input
                            type="number"
                            value={editData.salary}
                            onChange={(e) =>
                              setEditData({ ...editData, salary: parseInt(e.target.value) })
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                            }}
                          />
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <select
                            value={editData.status}
                            onChange={(e) =>
                              setEditData({ ...editData, status: e.target.value })
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                            }}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="On Leave">On Leave</option>
                          </select>
                        </td>
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          <button
                            onClick={handleUpdate}
                            disabled={loading}
                            style={{
                              padding: "0.4rem 0.8rem",
                              background: "#10b981",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "0.25rem",
                              cursor: loading ? "not-allowed" : "pointer",
                              marginRight: "0.25rem",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              padding: "0.4rem 0.8rem",
                              background: "#ef4444",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "1rem" }}>{emp.name || "N/A"}</td>
                        <td style={{ padding: "1rem" }}>{emp.email}</td>
                        <td style={{ padding: "1rem" }}>{emp.employeeId || "N/A"}</td>
                        <td style={{ padding: "1rem" }}>{emp.department || "N/A"}</td>
                        <td style={{ padding: "1rem" }}>{emp.position || "N/A"}</td>
                        <td style={{ padding: "1rem" }}>
                          ${emp.salary ? emp.salary.toLocaleString() : "N/A"}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              background:
                                emp.status === "Active"
                                  ? "#d1fae5"
                                  : emp.status === "On Leave"
                                  ? "#fef3c7"
                                  : "#fee2e2",
                              color:
                                emp.status === "Active"
                                  ? "#065f46"
                                  : emp.status === "On Leave"
                                  ? "#92400e"
                                  : "#991b1b",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            {emp.status || "Active"}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          <button
                            onClick={() => handleEdit(emp)}
                            style={{
                              padding: "0.4rem 0.8rem",
                              background: "#3b82f6",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              marginRight: "0.25rem",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            disabled={loading}
                            style={{
                              padding: "0.4rem 0.8rem",
                              background: "#ef4444",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "0.25rem",
                              cursor: loading ? "not-allowed" : "pointer",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>
            No employees found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{
            padding: "0.5rem 1rem",
            background: currentPage === 1 ? "#e5e7eb" : "#3b82f6",
            color: currentPage === 1 ? "#9ca3af" : "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: "0.5rem 1rem",
              background: currentPage === page ? "#3b82f6" : "#e5e7eb",
              color: currentPage === page ? "#ffffff" : "#374151",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={{
            padding: "0.5rem 1rem",
            background: currentPage === totalPages ? "#e5e7eb" : "#3b82f6",
            color: currentPage === totalPages ? "#9ca3af" : "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;