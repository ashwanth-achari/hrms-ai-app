import api from "./api";

export const managerService = {
  // Get team members
  getTeam: async () => {
    try {
      const response = await api.get("/api/manager/team");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching team:", error);
      throw error;
    }
  },

  // Get team performance
  getTeamPerformance: async () => {
    try {
      const response = await api.get("/api/manager/team/performance");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching team performance:", error);
      throw error;
    }
  },

  // Get team attendance
  getTeamAttendance: async () => {
    try {
      const response = await api.get("/api/manager/team/attendance");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching team attendance:", error);
      throw error;
    }
  },

  // Get pending approvals
  getApprovals: async () => {
    try {
      const response = await api.get("/api/manager/approvals");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching approvals:", error);
      throw error;
    }
  },

  // Approve leave
  approveLeave: async (leaveRequestId, status) => {
    try {
      const response = await api.post(`/api/manager/leave/${leaveRequestId}/approve`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error("Error approving leave:", error);
      throw error;
    }
  },

  // Get recruitment roles for team
  getRecruitmentRoles: async () => {
    try {
      const response = await api.get("/api/manager/recruitment");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching recruitment roles:", error);
      throw error;
    }
  }
};