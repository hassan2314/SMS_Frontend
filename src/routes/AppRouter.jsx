import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import UserProfile from "../pages/admin/UserProfile";
import AddUser from "../pages/admin/AddUser";
import AdminTeachers from "../pages/admin/Teacher";
import AdminStudents from "../pages/admin/Students";
import AdminSubjects from "../pages/admin/Subjects";
import AdminClasses from "../pages/admin/Classes";
import AdminAttendance from "../pages/admin/Attendance";

const adminPage = (element) => (
  <ProtectedRoute allowedRoles={["ADMIN"]}>
    <AdminLayout>{element}</AdminLayout>
  </ProtectedRoute>
);

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/dashboard" element={adminPage(<AdminDashboard />)} />
      <Route path="/admin/users" element={adminPage(<AdminUsers />)} />
      <Route path="/admin/add-user" element={adminPage(<AddUser />)} />
      <Route path="/admin/AddUser" element={<Navigate to="/admin/add-user" replace />} />
      <Route path="/admin/addUser" element={<Navigate to="/admin/add-user" replace />} />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout>
              <UserProfile />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/admin/teachers" element={adminPage(<AdminTeachers />)} />
      <Route path="/admin/students" element={adminPage(<AdminStudents />)} />
      <Route path="/admin/subjects" element={adminPage(<AdminSubjects />)} />
      <Route path="/admin/classes" element={adminPage(<AdminClasses />)} />
      <Route path="/admin/attendance" element={adminPage(<AdminAttendance />)} />

      <Route
        path="*"
        element={
          <TypographyFallback />
        }
      />
    </Routes>
  );
};

function TypographyFallback() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Page not found</h1>
      <p>That address is not part of the school console.</p>
    </div>
  );
}

export default AppRouter;
