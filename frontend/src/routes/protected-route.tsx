import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { SpinnerCustom } from "@/components/ui/spinner";
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}
export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SpinnerCustom />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements if specified
  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
