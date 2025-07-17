import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import ReferralForm from "./pages/ReferralForm";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
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
            <ProtectedRoute>
              <ReferralForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
