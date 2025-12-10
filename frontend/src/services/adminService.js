import api from "./api";

export const adminService = {
  // Get all employees
  getAllEmployees: async () => {
    try {
      const response = await api.get("/api/admin/all-employees");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  // Get system analytics
  getAnalytics: async () => {
    try {
      const response = await api.get("/api/admin/analytics");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },

  // Get all departments
  getDepartments: async () => {
    try {
      const response = await api.get("/api/admin/departments");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  },

  // Get attendance records
  getAttendance: async (filters = {}) => {
    try {
      const response = await api.get("/api/admin/attendance", { params: filters });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  },

  // Get payroll data
  getPayroll: async (filters = {}) => {
    try {
      const response = await api.get("/api/admin/payroll", { params: filters });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching payroll:", error);
      throw error;
    }
  },

  // Get performance reviews
  getPerformance: async (filters = {}) => {
    try {
      const response = await api.get("/api/admin/performance", { params: filters });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching performance:", error);
      throw error;
    }
  },

  // Get leave requests
  getLeaveRequests: async (filters = {}) => {
    try {
      const response = await api.get("/api/admin/leave-requests", { params: filters });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      throw error;
    }
  }
};