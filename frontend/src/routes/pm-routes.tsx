// routes/PMRoutes.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

export default function PMRoutes({ children }: { children: JSX.Element }) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "pm") return <Navigate to="/unauthorized" replace />;

  return children;
}
