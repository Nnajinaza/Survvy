import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { DashboardProvider } from "./context/DashboardContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <App />
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
