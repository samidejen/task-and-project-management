import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { AuthProvider } from "./contexts/auth-context";
import { ProtectedRoute } from "./components/auth/protected-route";
import { useAuthLoad } from "./hooks/useAuthLoad";

function AuthLoader() {
  useAuthLoad(); // fetches current user from backend via httpOnly cookie
  return null;
}

function App() {
  return (
    <AuthProvider>
      {/* Run the auth loader to populate current user */}
      <AuthLoader />

      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin-only route example */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole={["admin"]}>
                <div>Admin Users Management</div>
              </ProtectedRoute>
            }
          />

          {/* Role-specific redirects */}
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/manager"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/employee"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
