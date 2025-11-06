import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { AuthProvider } from "./contexts/auth-context";
import { ProtectedRoute } from "./routes/protected-route";
import { useAuthLoad } from "./hooks/useAuthLoad";
import EmployeesPage from "./pages/admin/EmployeesPage";
import PageLayout from "./layouts/PageLayout";
import ProjectManagersPage from "./pages/admin/ProjectManagersPage";
function AuthLoader() {
  useAuthLoad(); // fetch current user via cookie
  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Initialize auth state */}
        <AuthLoader />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes with layout */}
          <Route
            element={
              <ProtectedRoute>
                <PageLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Admin */}
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute requiredRole={["admin"]}>
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/project-managers"
              element={
                <ProtectedRoute requiredRole={["admin"]}>
                  <ProjectManagersPage />
                </ProtectedRoute>
              }
            />
            {/* PM */}
            <Route
              path="/pm/projects"
              element={
                <ProtectedRoute requiredRole={["pm"]}>
                  <div>PM Project Dashboard</div>
                </ProtectedRoute>
              }
            />

            {/* Employee */}
            <Route
              path="/employee/tasks"
              element={
                <ProtectedRoute requiredRole={["employee"]}>
                  <div>Employee Task Board</div>
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Role-specific redirects */}
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/pm" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/employee"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
