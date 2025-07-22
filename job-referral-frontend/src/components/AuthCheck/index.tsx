import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, getUserRole } from "@/utils/token";

interface AuthCheckProps {
  children: React.ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    const role = getUserRole();

    if (token && role) {
      if (role === 'employee') {
        navigate("/referral-form");
      } else if (role === 'hr') {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  return <>{children}</>;
}
