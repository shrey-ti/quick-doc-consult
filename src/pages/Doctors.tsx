import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface LocationState {
  patientData: PatientData;
}

interface Doctor {
  id: number;
  name: string;
  photo: string;
  specialty: string;
  experience: string;
  consultations: number;
  rating: number;
  availableToday: boolean;
  consultationTypes: Array<"video" | "audio" | "chat" | "in-person">;
  expertise: string[];
  price: number;
}

interface PatientData {
  symptoms: string[];
  age: string;
  gender: string;
  height: string;
  weight: string;
  recommendedSpecialties: string[];
}

const Doctors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData } = (location.state as LocationState) || { patientData: null };
  
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Mock doctors data - in a real app this would come from an API based on symptoms
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Emily Johnson",
      photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      specialty: "General Physician",
      experience: "8 years",
      consultations: 1240,
      rating: 4.9,
      availableToday: true,
      consultationTypes: ["video", "audio", "chat", "in-person"],
      expertise: ["Fever", "Cough", "Headache", "Respiratory Issues"],
      price: 40
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      specialty: "Cardiologist",
      experience: "12 years",
      consultations: 980,
      rating: 4.8,
      availableToday: true,
      consultationTypes: ["video", "audio", "in-person"],
      expertise: ["Chest Pain", "Palpitations", "Hypertension"],
      price: 65
    },
    {
      id: 3,
      name: "Dr. Sarah Williams",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      specialty: "Dermatologist",
      experience: "7 years",
      consultations: 860,
      rating: 4.7,
      availableToday: false,
      consultationTypes: ["video", "chat", "in-person"],
      expertise: ["Rash", "Skin Allergies", "Acne", "Eczema"],
      price: 55
    },
    {
      id: 4,
      name: "Dr. Robert Taylor",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      specialty: "Pediatrician",
      experience: "15 years",
      consultations: 1560,
      rating: 4.9,
      availableToday: true,
      consultationTypes: ["video", "audio", "in-person"],
      expertise: ["Child Health", "Fever", "Cough", "Growth Issues"],
      price: 50
    },
    {
      id: 5,
      name: "Dr. Lisa Martinez",
      photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      specialty: "Neurologist",
      experience: "9 years",
      consultations: 720,
      rating: 4.8,
      availableToday: true,
      consultationTypes: ["video", "in-person"],
      expertise: ["Headache", "Migraines", "Dizziness", "Stroke"],
      price: 70
    }
  ];

  // If no patient data, redirect to home
  if (!patientData) {
    navigate("/");
    return null;
  }

  // Filter doctors based on recommended specialties
  const filteredDoctors = doctors.filter(doctor => 
    patientData.recommendedSpecialties.includes(doctor.specialty)
  );

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigate("/booking", { 
      state: { 
        doctor,
        patientData
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <a href="/" className="text-primary font-bold text-2xl">MediConsult</a>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Recommended Doctors</h1>
          
          <div className="mb-8 flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
              <div className="border-t-2 border-green-500 w-12"></div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">2</div>
              <div className="border-t-2 border-primary w-12"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">3</div>
            </div>
          </div>

          {/* Symptoms Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Patient Information:</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Age: <span className="font-medium text-gray-900">{patientData.age} years</span></p>
                <p className="text-sm text-gray-600">Gender: <span className="font-medium text-gray-900">{patientData.gender}</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Height: <span className="font-medium text-gray-900">{patientData.height} cm</span></p>
                <p className="text-sm text-gray-600">Weight: <span className="font-medium text-gray-900">{patientData.weight} kg</span></p>
              </div>
            </div>
            <h2 className="text-sm font-medium text-gray-600 mb-2">Reported Symptoms:</h2>
            <div className="space-y-1">
              {patientData.symptoms.map((symptom: string, index: number) => (
                <div key={index} className="flex items-start">
                  <span className="text-gray-600 mr-2 min-w-[1.5rem]">{index + 1}.</span>
                  <p className="text-gray-900">{symptom}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Available Doctors</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Show available today only</label>
              <Switch
                checked={showAvailableOnly}
                onCheckedChange={setShowAvailableOnly}
              />
            </div>
          </div>

          {/* Doctors List */}
          <div className="space-y-4">
            {(showAvailableOnly ? filteredDoctors.filter(d => d.availableToday) : filteredDoctors).map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                      <img
                        src={doctor.photo}
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{doctor.name}</h3>
                      <p className="text-primary">{doctor.specialty}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">{doctor.rating}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{doctor.consultations}+ consultations</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${doctor.price}</p>
                      <p className="text-sm text-gray-500">per consultation</p>
                      <Button 
                        className="mt-2"
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Doctors;
