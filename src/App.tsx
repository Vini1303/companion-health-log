import { ReactNode, useEffect, useState } from "react";
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
import AccessDenied from "@/pages/AccessDenied";
import {
  AuthPermission,
  AuthSession,
  clearAuthSession,
  getAuthSession,
  hasPermission,
} from "@/lib/auth";

const queryClient = new QueryClient();

type ProtectedRouteProps = {
  session: AuthSession | null;
  permission: AuthPermission;
  children: ReactNode;
};

function ProtectedRoute({ session, permission, children }: ProtectedRouteProps) {
  if (!session?.isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasPermission(session, permission)) return <AccessDenied />;
  return <>{children}</>;
}

const App = () => {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getAuthSession());
  }, []);

  const handleLogin = () => {
    setSession(getAuthSession());
  };

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {session?.isAuthenticated ? (
            <AppLayout onLogout={handleLogout}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute session={session} permission="dashboard:read">
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sinais-vitais"
                  element={
                    <ProtectedRoute session={session} permission="vitals:read">
                      <VitalSigns />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/medicamentos"
                  element={
                    <ProtectedRoute session={session} permission="medications:read">
                      <Medications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exames"
                  element={
                    <ProtectedRoute session={session} permission="exams:read">
                      <Exams />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alergias"
                  element={
                    <ProtectedRoute session={session} permission="allergies:read">
                      <Allergies />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ligacoes"
                  element={
                    <ProtectedRoute session={session} permission="contacts:read">
                      <Contacts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dados-idoso"
                  element={
                    <ProtectedRoute session={session} permission="elder-info:read">
                      <ElderInfo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nutricao"
                  element={
                    <ProtectedRoute session={session} permission="nutrition:read">
                      <Nutrition />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute session={session} permission="profile:read">
                      <PatientProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          ) : (
            <Routes>
              <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
