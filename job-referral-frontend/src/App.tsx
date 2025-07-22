import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthCheck from "@/components/AuthCheck";
import Login from "./pages/Login";
import ReferralForm from "./pages/ReferralForm";
import ProtectedRoute from "./pages/ProtectedRoute";
import HRView from "./pages/HRView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <AuthCheck>
            <Login />
          </AuthCheck>
        }
      />

      {/* Employee Protected Route */}
      <Route
        path="/referral-form"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <ReferralForm />
          </ProtectedRoute>
        }
      />

      {/* HR Protected Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRView />
          </ProtectedRoute>
        }
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
