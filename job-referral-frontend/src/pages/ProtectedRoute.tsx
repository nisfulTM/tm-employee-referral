import { Navigate } from "react-router-dom";
import { getAccessToken, getUserRole } from "@/utils/token";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = getAccessToken();
  const userRole = getUserRole();

  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  // If the user's role is not allowed, redirect them to their default page
  if (userRole === "employee") {
    return <Navigate to="/referral-form" replace />;
  }

  if (userRole === "hr") {
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback redirect to login if the role is unknown
  return <Navigate to="/login" replace />;
}
