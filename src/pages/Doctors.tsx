
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

interface LocationState {
  patientData: {
    age: string;
    gender: string;
    symptoms: string[];
    [key: string]: any;
  };
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

const Doctors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData } = (location.state as LocationState) || { 
    patientData: { age: "", gender: "", symptoms: [] } 
  };
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filter, setFilter] = useState("all");
  
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

  const filteredDoctors = filter === "available" 
    ? doctors.filter(doctor => doctor.availableToday)
    : doctors;

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    toast.success(`Selected ${doctor.name}`);
    // In a real app, we'd scroll to the next section or navigate
    setTimeout(() => {
      navigate("/booking", { state: { doctor, patientData } });
    }, 500);
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
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
              <div className="border-t-2 border-primary w-12"></div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">3</div>
              <div className="border-t-2 border-gray-300 w-12"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">4</div>
            </div>
          </div>
          
          {/* Summary of symptoms */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Consultation for</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {patientData.symptoms.map((symptom, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="px-3 py-1 text-base bg-white"
                >
                  {symptom}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {patientData.age} year old {patientData.gender}
            </p>
          </div>
          
          {/* Filter options */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                onClick={() => setFilter("all")}
                className="text-sm"
              >
                All Doctors
              </Button>
              <Button 
                variant={filter === "available" ? "default" : "outline"} 
                onClick={() => setFilter("available")}
                className="text-sm"
              >
                Available Today
              </Button>
            </div>
            <span className="text-sm text-gray-500">{filteredDoctors.length} doctors found</span>
          </div>
          
          {/* Doctor List */}
          <div className="space-y-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={`overflow-hidden transition-all ${
                    selectedDoctor?.id === doctor.id
                      ? "ring-2 ring-primary"
                      : "hover:shadow-md"
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Doctor Photo */}
                      <div className="w-full md:w-1/4 h-48 md:h-auto overflow-hidden">
                        <img
                          src={doctor.photo}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Doctor Info */}
                      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">{doctor.name}</h3>
                            {doctor.availableToday && (
                              <Badge className="bg-green-500 text-white">Available Today</Badge>
                            )}
                          </div>
                          
                          <p className="text-primary font-medium">{doctor.specialty}</p>
                          
                          <div className="flex items-center mt-2 mb-3">
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
                            <span className="ml-2 text-sm text-gray-600">{doctor.rating}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-600">{doctor.experience} experience</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-600">{doctor.consultations}+ consultations</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {doctor.expertise.map((item, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="bg-blue-50 border-blue-100 text-gray-800"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t">
                          <div className="flex items-center mb-3 sm:mb-0">
                            <TooltipProvider>
                              <div className="flex space-x-2">
                                {doctor.consultationTypes.includes("video") && (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <polygon points="23 7 16 12 23 17 23 7"/>
                                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                        </svg>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Video consultation available</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                                
                                {doctor.consultationTypes.includes("audio") && (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                          <line x1="12" y1="19" x2="12" y2="23"/>
                                          <line x1="8" y1="23" x2="16" y2="23"/>
                                        </svg>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Audio consultation available</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                                
                                {doctor.consultationTypes.includes("chat") && (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                        </svg>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Chat consultation available</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                                
                                {doctor.consultationTypes.includes("in-person") && (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                          <circle cx="8.5" cy="7" r="4"/>
                                          <line x1="20" y1="8" x2="20" y2="14"/>
                                          <line x1="23" y1="11" x2="17" y2="11"/>
                                        </svg>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>In-person consultation available</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </TooltipProvider>
                          </div>
                          
                          <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">${doctor.price}</p>
                              <p className="text-sm text-gray-500">per consultation</p>
                            </div>
                            <Button
                              onClick={() => handleSelectDoctor(doctor)}
                              className="whitespace-nowrap"
                            >
                              Select Doctor
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No doctors found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Doctors;
