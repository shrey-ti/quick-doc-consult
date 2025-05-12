import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for patients
const mockPatients = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "I'm feeling better now, thank you doctor!",
    timestamp: "2024-03-20T10:30:00",
    avatar: "JD"
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "When should I take the next dose?",
    timestamp: "2024-03-20T09:15:00",
    avatar: "JS"
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastMessage: "The symptoms have reduced significantly",
    timestamp: "2024-03-19T16:45:00",
    avatar: "MJ"
  }
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [currentDoctor, setCurrentDoctor] = useState<string>("");
  const [patients, setPatients] = useState(mockPatients);

  useEffect(() => {
    // Check if doctor is logged in
    const doctorMobile = localStorage.getItem("currentDoctor");
    if (!doctorMobile) {
      navigate("/doctor-login");
      return;
    }
    setCurrentDoctor(doctorMobile);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentDoctor");
    navigate("/doctor-login");
  };

  const handlePatientClick = (patientId: number) => {
    navigate(`/doctor/chat/${patientId}`);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Doctor Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Mobile: {currentDoctor}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Patients</h2>
          <Button onClick={() => navigate("/doctor/add-patient")}>
            Add New Patient
          </Button>
        </div>

        {patients.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">
                No patients yet. Click "Add New Patient" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {patients.map((patient) => (
              <Card
                key={patient.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handlePatientClick(patient.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{patient.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {patient.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {patient.lastMessage}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimestamp(patient.timestamp)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard; 