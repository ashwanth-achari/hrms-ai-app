import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/layout/Layout";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ManagerDashboard from "./components/dashboard/ManagerDashboard";
import RecruiterDashboard from "./components/dashboard/RecruiterDashboard";
import EmployeeDashboard from "./components/dashboard/EmployeeDashboard";



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ✅ Login route (no protection) */}
          <Route path="/login" element={<LoginPage />} />

          {/* ✅ Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute>
                <Layout>
                  <ManagerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute>
                <Layout>
                  <RecruiterDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <Layout>
                  <EmployeeDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

         
          

          {/* ✅ Redirect to dashboard by default */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
