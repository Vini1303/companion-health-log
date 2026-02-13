import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sinais-vitais" element={<VitalSigns />} />
            <Route path="/medicamentos" element={<Medications />} />
            <Route path="/exames" element={<Exams />} />
            <Route path="/alergias" element={<Allergies />} />
            <Route path="/ligacoes" element={<Contacts />} />
            <Route path="/dados-idoso" element={<ElderInfo />} />
            <Route path="/nutricao" element={<Nutrition />} />
            <Route path="/perfil" element={<PatientProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
