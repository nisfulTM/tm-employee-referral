import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ReferralForm from "./pages/ReferralForm";
import ProtectedRoute from "./pages/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/referral-form"
          element={
            <ProtectedRoute>
              <ReferralForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
