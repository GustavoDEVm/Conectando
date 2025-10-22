import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/Layout/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inicio from "./pages/Inicio";
import Servicos from "./pages/Servicos";
import MeusAgendamentos from "./pages/MeusAgendamentos";
import Historico from "./pages/Historico";
import Perfil from "./pages/Perfil";
import MeusServicos from "./pages/MeusServicos";
import NovoServico from "./pages/NovoServico";
import Agendamentos from "./pages/Agendamentos";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes - User */}
          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <Inicio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servicos"
            element={
              <ProtectedRoute>
                <Servicos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meus-agendamentos"
            element={
              <ProtectedRoute>
                <MeusAgendamentos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historico"
            element={
              <ProtectedRoute>
                <Historico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Organizer */}
          <Route
            path="/meus-servicos"
            element={
              <ProtectedRoute organizerOnly>
                <MeusServicos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/novo-servico"
            element={
              <ProtectedRoute organizerOnly>
                <NovoServico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamentos"
            element={
              <ProtectedRoute organizerOnly>
                <Agendamentos />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
