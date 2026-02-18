import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import VitalSigns from "@/pages/VitalSigns";
import Medications from "@/pages/Medications";
import Exams from "@/pages/Exams";
import Allergies from "@/pages/Allergies";
import Nutrition from "@/pages/Nutrition";
import PatientProfile from "@/pages/PatientProfile";
import Contacts from "@/pages/Contacts";
import ElderInfo from "@/pages/ElderInfo";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { AUTH_SESSION_KEY } from "@/lib/auth";

const queryClient = new QueryClient();

type ProtectedRouteProps = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_SESSION_KEY);
    setIsAuthenticated(saved === "true");
  }, []);

  const handleLogin = () => {
    localStorage.setItem(AUTH_SESSION_KEY, "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.setItem(AUTH_SESSION_KEY, "false");
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dados-idoso" replace /> : <Login onLoginSuccess={handleLogin} />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AppLayout onLogout={handleLogout}>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sinais-vitais"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AppLayout onLogout={handleLogout}>
                    <VitalSigns />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicamentos"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AppLayout onLogout={handleLogout}>
                    <Medications />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exames"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AppLayout onLogout={handleLogout}>
                    <Exams />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/alergias"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AppLayout onLogout={handleLogout}>
                    <Allergies />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ligacoes"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AppLayout onLogout={handleLogout}>
                    <Contacts />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dados-idoso"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AppLayout onLogout={handleLogout}>
                    <ElderInfo />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutricao"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AppLayout onLogout={handleLogout}>
                    <Nutrition />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AppLayout onLogout={handleLogout}>
                    <PatientProfile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={isAuthenticated ? <NotFound /> : <Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
