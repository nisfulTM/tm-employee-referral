import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { removeAuthData, getUserName, getUserEmployeeId } from "@/utils/token";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = {
    name: getUserName() || "User",
    employeeId: getUserEmployeeId() || "N/A",
  };

  const logout = () => {
    removeAuthData();
    toast({
      title: "Logged out successfully",
      description: "You have been signed out.",
    });
    navigate("/login", { replace: true });
  };

  return { user, logout };
};
