import api from "./api";

export const recruiterService = {
  // Get assigned candidates
  getCandidates: async (filters = {}) => {
    try {
      const response = await api.get("/api/recruiter/candidates", { params: filters });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching candidates:", error);
      throw error;
    }
  },

  // Get job openings
  getJobs: async (filters = {}) => {
    try {
      const response = await api.get("/api/recruiter/jobs", { params: filters });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  // Get pipelines
  getPipelines: async () => {
    try {
      const response = await api.get("/api/recruiter/pipelines");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching pipelines:", error);
      throw error;
    }
  },

  // Update candidate status
  updateCandidateStatus: async (candidateId, status) => {
    try {
      const response = await api.put(`/api/recruiter/candidates/${candidateId}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error("Error updating candidate status:", error);
      throw error;
    }
  },

  // Get recruitment reports
  getReports: async (filters = {}) => {
    try {
      const response = await api.get("/api/recruiter/reports", { params: filters });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  }
};