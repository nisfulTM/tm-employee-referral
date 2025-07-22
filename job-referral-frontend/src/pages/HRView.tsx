import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getUserRole } from "@/utils/token";
import AdminLayout from "@/components/hr/AdminLayout";
import AdminDashboard from "@/components/hr/AdminDashboard";

const AdminApp = () => {
  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
    if (role !== "hr") {
      navigate("/login", { replace: true });
    }
  }, [role, navigate]);

  if (role !== "hr") {
    return null; // Render nothing while redirecting
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminApp;
