// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast"; // ✅ importamos Toaster
import { ConfirmProvider } from "./components/ui/confirm";

import "./index.css";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import './i18n-config';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <CartProvider>
        <AuthProvider>
          <BrowserRouter>
            <ConfirmProvider>
              <App />
              <Toaster position="top-center" reverseOrder={false} /> {/* ✅ activamos Toaster */}
            </ConfirmProvider>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </HelmetProvider>
  </React.StrictMode>
);