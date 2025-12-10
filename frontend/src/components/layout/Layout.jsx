import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "../dashboard/AdminDashboard";
import ManagerDashboard from "../dashboard/ManagerDashboard";
import RecruiterDashboard from "../dashboard/RecruiterDashboard";
import EmployeeDashboard from "../dashboard/EmployeeDashboard";
import Recruitment from "../recruitment/Recruitment";
import RecruitmentAI from "../recruitment/RecruitmentAI";





const getDefaultNavId = (role) => {
  if (role === "MANAGEMENT_ADMIN") return "ADMIN_DASHBOARD";
  if (role === "SENIOR_MANAGER") return "MANAGER_DASHBOARD";
  if (role === "HR_RECRUITER") return "RECRUITER_DASHBOARD";
  return "EMPLOYEE_DASHBOARD";
};

const Layout = () => {
  const { role } = useAuth();
  const [activeNav, setActiveNav] = useState(() => getDefaultNavId(role));

  // Reset active nav whenever role changes (e.g. login or "View As")
  useEffect(() => {
    setActiveNav(getDefaultNavId(role));
  }, [role]);

  const renderContent = () => {
    if (role === "MANAGEMENT_ADMIN") {
      switch (activeNav) {
        case "ADMIN_DASHBOARD":
          return <AdminDashboard />;
        case "ADMIN_EMPLOYEES":
          return <div>[Admin – Employee Data Management Placeholder]</div>;
        case "ADMIN_ATTENDANCE":
          return <div>[Admin – Company-wide Attendance Analytics Placeholder]</div>;
        case "ADMIN_PAYROLL":
          return <div>[Admin – Payroll Overview Placeholder]</div>;
        case "ADMIN_PERFORMANCE":
          return <div>[Admin – Performance Tracking Placeholder]</div>;
        case "ADMIN_LEAVE":
          return <div>[Admin – Leave Analytics Placeholder]</div>;
        case "ADMIN_RECRUITMENT":
          return <Recruitment role={role} />;
        case "ADMIN_SETTINGS":
          return <div>[Admin – Organization Settings Placeholder]</div>;
        default:
          return <AdminDashboard />;
      }
    }

    if (role === "SENIOR_MANAGER") {
      switch (activeNav) {
        case "MANAGER_DASHBOARD":
          return <ManagerDashboard />;
        case "MANAGER_TEAM":
          return <div>[Manager – My Team Overview Placeholder]</div>;
        case "MANAGER_ATTENDANCE":
          return <div>[Manager – Team Attendance Placeholder]</div>;
        case "MANAGER_PERFORMANCE":
          return <div>[Manager – Team Performance Reviews Placeholder]</div>;
        case "MANAGER_RECRUITMENT":
          return <Recruitment role={role} />;
        case "MANAGER_APPROVALS":
          return <div>[Manager – Approvals (Leave / Reviews) Placeholder]</div>;
        default:
          return <ManagerDashboard />;
      }
    }

    if (role === "HR_RECRUITER") {
      switch (activeNav) {
        case "RECRUITER_DASHBOARD":
          return <RecruiterDashboard />;
        case "RECRUITER_JOBS":
          return <div>[Recruiter – Job Positions Management Placeholder]</div>;
        case "RECRUITER_CANDIDATES":
          return <div>[Recruiter – Candidates List Placeholder]</div>;
        case "RECRUITER_AI":
          return <RecruitmentAI />;
        case "RECRUITER_PIPELINES":
          return <div>[Recruiter – Pipelines / Kanban Placeholder]</div>;
        case "RECRUITER_REPORTS":
          return <div>[Recruiter – Recruitment Reports Placeholder]</div>;
        default:
          return <RecruiterDashboard />;
      }
    }

    // Default: EMPLOYEE
    switch (activeNav) {
      case "EMPLOYEE_DASHBOARD":
        return <EmployeeDashboard />;
      case "EMPLOYEE_ATTENDANCE":
        return <div>[Employee – My Attendance Placeholder]</div>;
      case "EMPLOYEE_LEAVE":
        return <div>[Employee – My Leave Requests Placeholder]</div>;
      case "EMPLOYEE_PAYROLL":
        return <div>[Employee – My Payroll / Payslips Placeholder]</div>;
      case "EMPLOYEE_PERFORMANCE":
        return <div>[Employee – My Performance & Goals Placeholder]</div>;
      case "EMPLOYEE_JOBS":
        return <div>[Employee – Internal Job Openings Placeholder]</div>;
      case "EMPLOYEE_HELP":
        return <div>[Employee – HR Chatbot / Help Center Placeholder]</div>;
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f3f4f6",
      }}
    >
      <Header />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar role={role} activeItem={activeNav} onChange={setActiveNav} />
        <main
          style={{
            flex: 1,
            padding: "1rem 1.5rem",
            overflowY: "auto",
          }}
        >
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
