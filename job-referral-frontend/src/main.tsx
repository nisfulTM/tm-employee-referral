import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "./providers/QueryProvider";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>
);
