import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut, User, UserCog } from "lucide-react";

// Define a type for the doctor object
interface Doctor {
  phone: string;
  name: string;
  specialization?: string;
  experience?: number;
  rating?: number;
  photo?: string;
  consultationCount?: number;
  price?: number;
  about?: string;
}

const Login = () => {
  const [patientPhone, setPatientPhone] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const [activeTab, setActiveTab] = useState("patient");
  const navigate = useNavigate();

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic phone validation
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(patientPhone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Store in localStorage (in real app, would check against database)
    localStorage.setItem("mediconsult_mobile", patientPhone);
    toast.success("Logged in successfully");
    navigate("/");
  };

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic phone validation
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(doctorPhone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Get stored doctors from localStorage (mimicking database)
    const storedDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    
    // Check if doctor exists
    const doctorExists = storedDoctors.some((doc: Doctor) => doc.phone === doctorPhone);

    if (doctorExists) {
      // Store logged in doctor
      localStorage.setItem("currentDoctor", doctorPhone);
      toast.success("Doctor login successful");
      navigate("/doctor/dashboard");
    } else {
      // Redirect to registration
      toast.info("No account found. Please register first.");
      navigate("/doctor-registration");
    }
  };

  const handleLogout = () => {
    // Clear both patient and doctor logins
    localStorage.removeItem("mediconsult_mobile");
    localStorage.removeItem("currentDoctor");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Check if user is already logged in
  const isPatientLoggedIn = localStorage.getItem("mediconsult_mobile");
  const isDoctorLoggedIn = localStorage.getItem("currentDoctor");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center">
            <div className="text-primary font-bold text-2xl" onClick={() => navigate("/")}>MediConsult</div>
          </div>
          <nav className="flex items-center gap-4">
            {(isPatientLoggedIn || isDoctorLoggedIn) && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </nav>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to MediConsult</CardTitle>
            <CardDescription className="text-center">
              Login to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Show logged in status or login form */}
            {isPatientLoggedIn ? (
              <div className="text-center space-y-4">
                <div className="bg-green-100 p-4 rounded-lg flex flex-col items-center">
                  <User className="h-12 w-12 text-green-600 mb-2" />
                  <p className="font-medium">You are logged in as a patient</p>
                  <p className="text-sm text-gray-600">Phone: {isPatientLoggedIn}</p>
                </div>
                <Button 
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Go to Home
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            ) : isDoctorLoggedIn ? (
              <div className="text-center space-y-4">
                <div className="bg-blue-100 p-4 rounded-lg flex flex-col items-center">
                  <UserCog className="h-12 w-12 text-blue-600 mb-2" />
                  <p className="font-medium">You are logged in as a doctor</p>
                  <p className="text-sm text-gray-600">Phone: {isDoctorLoggedIn}</p>
                </div>
                <Button 
                  onClick={() => navigate("/doctor/dashboard")}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="patient" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="patient">Patient</TabsTrigger>
                  <TabsTrigger value="doctor">Doctor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="patient">
                  <form onSubmit={handlePatientLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-phone">Phone Number</Label>
                      <Input
                        id="patient-phone"
                        type="tel"
                        placeholder="+919876543210"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">We'll use this to identify you in our system</p>
                    </div>
                    <Button type="submit" className="w-full">
                      Login as Patient
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="doctor">
                  <form onSubmit={handleDoctorLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-phone">Phone Number</Label>
                      <Input
                        id="doctor-phone"
                        type="tel"
                        placeholder="+919876543210"
                        value={doctorPhone}
                        onChange={(e) => setDoctorPhone(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">If you don't have an account, you'll be redirected to register</p>
                    </div>
                    <Button type="submit" className="w-full">
                      Login as Doctor
                    </Button>
                    <div className="text-center mt-2">
                      <Button 
                        variant="link" 
                        onClick={() => navigate("/doctor-registration")}
                        className="text-sm"
                      >
                        Not registered? Sign up as a doctor
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 