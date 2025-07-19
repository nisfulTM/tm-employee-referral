import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ReferralForm from "./pages/ReferralForm";
import ProtectedRoute from "./pages/ProtectedRoute"; // ✅ Make sure path is correct
import HRView from "./pages/HRView";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Employee Protected Route */}
        <Route
          path="/referral-form"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <ReferralForm />
            </ProtectedRoute>
          }
        />

        {/* ✅ HR Protected Route */}
        <Route
          path="/hr-view"
          element={
            <ProtectedRoute allowedRoles={["hr"]}>
              <HRView />
            </ProtectedRoute>
          }
        />

        {/* ✅ Catch-all → Redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
