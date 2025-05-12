
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Symptoms from "./pages/Symptoms";
import PatientInfo from "./pages/PatientInfo";
import Doctors from "./pages/Doctors";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import DoctorRegistration from "./pages/DoctorRegistration";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/symptoms" element={<Symptoms />} />
                <Route path="/patient-info" element={<PatientInfo />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/doctor-registration" element={<DoctorRegistration />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
