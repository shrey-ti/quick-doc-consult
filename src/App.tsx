import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Symptoms from "./pages/Symptoms";
import Doctors from "./pages/Doctors";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import DoctorRegistration from "./pages/DoctorRegistration";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorChat from "./pages/DoctorChat";
import ConsultationHistory from "./pages/ConsultationHistory";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor-login" element={<Navigate to="/login" replace />} />
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/chat/:patientId" element={<DoctorChat />} />
          <Route path="/consultation-history" element={<ConsultationHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
