import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Video,
  Phone,
  MessageCircle,
  Calendar,
  ChevronDown,
  Clock,
  Stethoscope,
  Star,
  DollarSign,
  Award,
  Loader2
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("rating");
  const [expandedDoctor, setExpandedDoctor] = useState<number | null>(null);

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

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // If no patient data, redirect to home
  if (!patientData) {
    navigate("/");
    return null;
  }

  // Get all available specialties for filtering
  const allSpecialties = ["all", ...new Set(doctors.map(doctor => doctor.specialty))];
  
  // Get price range for slider
  const minPrice = Math.min(...doctors.map(doctor => doctor.price));
  const maxPrice = Math.max(...doctors.map(doctor => doctor.price));

  // Filter doctors based on all criteria
  const filteredDoctors = doctors
    .filter(doctor => 
      // Filter by recommended specialties
      patientData.recommendedSpecialties.includes(doctor.specialty) &&
      // Filter by availability if toggled
      (!showAvailableOnly || doctor.availableToday) &&
      // Filter by price range
      doctor.price >= priceRange[0] && doctor.price <= priceRange[1] &&
      // Filter by specialty if not "all"
      (selectedSpecialty === "all" || doctor.specialty === selectedSpecialty)
    );

  // Sort the filtered doctors
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    switch(sortOption) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "experience":
        return parseInt(b.experience) - parseInt(a.experience);
      default:
        return b.rating - a.rating;
    }
  });

  // Function to get consultation type icon
  const getConsultationTypeIcon = (type: string) => {
    switch(type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Phone className="h-4 w-4" />;
      case "chat":
        return <MessageCircle className="h-4 w-4" />;
      case "in-person":
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigate("/booking", { 
      state: { 
        doctor,
        patientData
      }
    });
  };

  const toggleExpandDoctor = (doctorId: number) => {
    if (expandedDoctor === doctorId) {
      setExpandedDoctor(null);
    } else {
      setExpandedDoctor(doctorId);
    }
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

          {/* Filters Section */}
          <div className="mb-6 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2" />
              Filter Doctors
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Filter Row */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Show Available Today</label>
                  <div className="flex items-center">
                    <Switch
                      checked={showAvailableOnly}
                      onCheckedChange={setShowAvailableOnly}
                    />
                    <span className="text-sm ml-2">{showAvailableOnly ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Specialization</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSpecialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty === "all" ? "All Specialties" : specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Second Filter Row */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    min={minPrice}
                    max={maxPrice}
                    step={5}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Sort By</label>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="experience">Most Experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-gray-500">Finding the best doctors for you...</p>
            </div>
          ) : sortedDoctors.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No doctors found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No doctors match your current filters. Try adjusting your filters or broadening your search.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setShowAvailableOnly(false);
                  setSelectedSpecialty("all");
                  setPriceRange([minPrice, maxPrice]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden border-2 hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row">
                      {/* Doctor Photo and Rating */}
                      <div className="flex-shrink-0 mb-4 md:mb-0 flex md:flex-col items-center md:items-start">
                        <div className="h-20 w-20 rounded-full overflow-hidden mr-4 md:mr-0 md:mb-3">
                          <img
                            src={doctor.photo}
                            alt={doctor.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="md:text-center">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{doctor.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{doctor.consultations}+ consultations</p>
                        </div>
                      </div>
                      
                      {/* Doctor Info */}
                      <div className="flex-1 md:ml-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{doctor.name}</h3>
                            <p className="text-primary">{doctor.specialty}</p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1" /> 
                              {doctor.experience} experience
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">${doctor.price}</p>
                            <p className="text-sm text-gray-500">per consultation</p>
                            <Badge 
                              variant={doctor.availableToday ? "default" : "outline"}
                              className={`mt-1 ${doctor.availableToday ? "bg-green-100 text-green-800 hover:bg-green-100" : "text-gray-500"}`}
                            >
                              {doctor.availableToday ? "Available Today" : "Not Available Today"}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Expertise Tags */}
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Expertise:</p>
                          <div className="flex flex-wrap gap-2">
                            {doctor.expertise.map((item, i) => (
                              <Badge 
                                key={i} 
                                variant="secondary"
                                className="bg-blue-50 text-blue-800 hover:bg-blue-100"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Consultation Types */}
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Consultation Options:</p>
                          <div className="flex space-x-3">
                            {doctor.consultationTypes.map((type, i) => (
                              <TooltipProvider key={i}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer">
                                      {getConsultationTypeIcon(type)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="capitalize">{type} Consultation</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                    <button 
                      onClick={() => toggleExpandDoctor(doctor.id)} 
                      className="text-sm text-primary font-medium flex items-center"
                    >
                      {expandedDoctor === doctor.id ? "Show Less" : "Show More"}
                      <ChevronDown className={`h-4 w-4 ml-1 ${expandedDoctor === doctor.id ? "transform rotate-180" : ""}`} />
                    </button>
                    
                    <Button 
                      className="px-6"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      Select Doctor
                    </Button>
                  </CardFooter>
                  
                  {/* Expanded Info */}
                  {expandedDoctor === doctor.id && (
                    <div className="p-4 border-t">
                      <p className="text-gray-700 mb-3">
                        Dr. {doctor.name.split(' ')[1]} is a specialized {doctor.specialty} with {doctor.experience} of experience treating patients with various conditions including {doctor.expertise.join(', ')}.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="h-4 w-4 mr-1" />
                          <span>Top rated doctor for {doctor.expertise[0]}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>Consultation starts at ${doctor.price}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Doctors;
