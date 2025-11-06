// routes/AdminRoutes.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import type { JSX } from "react/jsx-runtime";
export default function AdminRoutes({ children }: { children: JSX.Element }) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/unauthorized" replace />;

  return children;
}
