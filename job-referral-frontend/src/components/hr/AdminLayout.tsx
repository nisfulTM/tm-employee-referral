import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { removeAuthData } from "@/utils/token";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    removeAuthData();
    toast({
      title: "Logged out successfully",
      description: "You have been signed out.",
    });
    navigate("/login", { replace: true });
  };

  const hrName = localStorage.getItem("hrName") || "HR User";
  const hrEmployeeId = localStorage.getItem("hrEmployeeId") || "N/A";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-[#FF5D1D]" />
            <h1 className="text-xl font-bold">HR Referral Management</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-medium">{hrName}</p>
              <p className="text-xs text-muted-foreground">{hrEmployeeId}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
