import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/Toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import ProfilePage from "./pages/Profile";
import { HistoryPage } from "./pages/History";
import Index from "./pages/Index";
import LegalPage from "./pages/Legal";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/leadhunter/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/leadhunter/register" element={<RegisterPage />} />
          <Route path="/termos" element={<LegalPage />} />
          <Route path="/privacidade" element={<LegalPage />} />

          {/* Rotas Protegidas da Plataforma LeadHunter AI */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Index />} />
            <Route path="/leadhunter" element={<Index />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leadhunter/profile" element={<ProfilePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/leadhunter/history" element={<HistoryPage />} />
          </Route>

          {/* Fallback inteligente */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
