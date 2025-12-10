import api from "./api";

export const employeeService = {
  // Get employee profile
  getProfile: async () => {
    try {
      const response = await api.get("/api/employee/profile");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  // Get attendance
  getAttendance: async () => {
    try {
      const response = await api.get("/api/employee/attendance");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  },

  // Get leave balance
  getLeaveBalance: async () => {
    try {
      const response = await api.get("/api/employee/leave-balance");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      throw error;
    }
  },

  // Get payroll
  getPayroll: async () => {
    try {
      const response = await api.get("/api/employee/payroll");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching payroll:", error);
      throw error;
    }
  },

  // Get performance
  getPerformance: async () => {
    try {
      const response = await api.get("/api/employee/performance");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching performance:", error);
      throw error;
    }
  },

  // Request leave
  requestLeave: async (leaveData) => {
    try {
      const response = await api.post("/api/employee/leave-request", leaveData);
      return response.data;
    } catch (error) {
      console.error("Error requesting leave:", error);
      throw error;
    }
  },

  // Get internal jobs
  getInternalJobs: async () => {
    try {
      const response = await api.get("/api/employee/internal-jobs");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching internal jobs:", error);
      throw error;
    }
  }
};