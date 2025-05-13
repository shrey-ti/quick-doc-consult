import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, List } from "lucide-react";

// Mock data for patients
const mockPatients = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "I'm feeling better now, thank you doctor!",
    timestamp: "2024-03-20T10:30:00",
    avatar: "JD",
    prescriptions: []
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "When should I take the next dose?",
    timestamp: "2024-03-20T09:15:00",
    avatar: "JS",
    prescriptions: []
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastMessage: "The symptoms have reduced significantly",
    timestamp: "2024-03-19T16:45:00",
    avatar: "MJ",
    prescriptions: []
  }
];

interface Medicine {
  medicineName: string;
  frequency: string;
}

interface Prescription {
  medicines: Medicine[];
  date: string;
}

interface Patient {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  prescriptions: Prescription[];
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [currentDoctor, setCurrentDoctor] = useState<string>("");
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [showPrescriptionHistoryDialog, setShowPrescriptionHistoryDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([
    { medicineName: "", frequency: "" }
  ]);

  useEffect(() => {
    // Check if doctor is logged in
    const doctorMobile = localStorage.getItem("currentDoctor");
    if (!doctorMobile) {
      navigate("/doctor-login");
      return;
    }
    setCurrentDoctor(doctorMobile);

    // Load saved patients data from localStorage if exists
    const savedPatients = localStorage.getItem("patientsData");
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
  }, [navigate]);

  // Save patients data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("patientsData", JSON.stringify(patients));
  }, [patients]);

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

  const handleAddPrescription = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setSelectedPatient(patient);
    setMedicines([{ medicineName: "", frequency: "" }]);
    setShowPrescriptionDialog(true);
  };

  const handleViewPrescriptions = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setSelectedPatient(patient);
    setShowPrescriptionHistoryDialog(true);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { medicineName: "", frequency: "" }]);
  };

  const handleRemoveMedicine = (index: number) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleMedicineChange = (index: number, field: keyof Medicine, value: string) => {
    const updatedMedicines = medicines.map((medicine, i) => {
      if (i === index) {
        return { ...medicine, [field]: value };
      }
      return medicine;
    });
    setMedicines(updatedMedicines);
  };

  const handleSavePrescription = () => {
    if (selectedPatient && medicines.length > 0 && medicines.every(m => m.medicineName && m.frequency)) {
      const newPrescription: Prescription = {
        medicines: [...medicines],
        date: new Date().toISOString()
      };

      const updatedPatients = patients.map(patient => {
        if (patient.id === selectedPatient.id) {
          return {
            ...patient,
            prescriptions: [...patient.prescriptions, newPrescription]
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      setShowPrescriptionDialog(false);
    }
  };

  const getTotalMedicineCount = (patient: Patient) => {
    return patient.prescriptions.reduce((total, prescription) => 
      total + prescription.medicines.length, 0);
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
                      {patient.prescriptions.length > 0 && (
                        <p className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline" onClick={(e) => handleViewPrescriptions(patient, e)}>
                          {patient.prescriptions.length} Prescription(s) · {getTotalMedicineCount(patient)} Medicine(s)
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(patient.timestamp)}
                      </div>
                      <div className="flex gap-2">
                        {patient.prescriptions.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => handleViewPrescriptions(patient, e)}
                            className="text-xs"
                          >
                            <List className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => handleAddPrescription(patient, e)}
                          className="text-xs"
                        >
                          Add Prescription
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Prescription Dialog */}
        <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Prescription for {selectedPatient?.name}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {medicines.map((medicine, index) => (
                <div key={index} className="border p-3 rounded-md mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Medicine #{index + 1}</h4>
                    {medicines.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveMedicine(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor={`medicine-name-${index}`}>Medicine Name</Label>
                      <Input
                        id={`medicine-name-${index}`}
                        placeholder="Enter medicine name"
                        value={medicine.medicineName}
                        onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                      <Input
                        id={`frequency-${index}`}
                        placeholder="E.g., Twice daily, Before meals"
                        value={medicine.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center mt-2"
                onClick={handleAddMedicine}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Another Medicine
              </Button>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPrescriptionDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSavePrescription}
                disabled={!medicines.every(m => m.medicineName && m.frequency)}
              >
                Save Prescription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Prescription History Dialog */}
        <Dialog open={showPrescriptionHistoryDialog} onOpenChange={setShowPrescriptionHistoryDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Prescription History for {selectedPatient?.name}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {selectedPatient && selectedPatient.prescriptions.length > 0 ? (
                <div className="space-y-4">
                  {selectedPatient.prescriptions.map((prescription, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md">Prescription #{index + 1}</CardTitle>
                          <span className="text-xs text-gray-500">
                            {new Date(prescription.date).toLocaleString()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium">Medicine</th>
                              <th className="text-left py-2 font-medium">Frequency</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescription.medicines.map((medicine, medicineIndex) => (
                              <tr key={medicineIndex} className="border-b border-gray-100">
                                <td className="py-2">{medicine.medicineName}</td>
                                <td className="py-2">{medicine.frequency}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No prescription history available.</p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setShowPrescriptionHistoryDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DoctorDashboard; 