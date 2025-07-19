import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("role");

  // ✅ Redirect if not logged in
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Redirect if user role is not allowed
  if (!allowedRoles.includes(userRole || "")) {
    if (userRole === "employee") return <Navigate to="/referral-form" replace />;
    if (userRole === "hr") return <Navigate to="/hr-view" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
