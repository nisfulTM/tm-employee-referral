import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import ReferralForm from "./pages/ReferralForm";
import AdminPage from "./pages/HRView"; // ✅ Import your new Admin/HR page
import { Toaster } from "@/components/ui/toaster"; // ✅ Import ShadCN Toaster
import { QueryProvider } from "./providers/QueryProvider";
import "./index.css";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          {/* Default App or Home */}
          <Route path="/" element={<App />} />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Protected Referral Form */}
          <Route
            path="/referral-form"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <ReferralForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr-view"
            element={
              <ProtectedRoute allowedRoles={["hr"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* ✅ ShadCN Toast System */}
        <Toaster />
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>
);
