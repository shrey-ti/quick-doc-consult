
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { Video, Phone, MessageCircle, Calendar } from "lucide-react";

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

interface LocationState {
  doctor: Doctor;
  patientData: any;
}

type ConsultationType = "video" | "audio" | "chat" | "in-person";

interface TimeSlot {
  time: string;
  available: boolean;
}

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, patientData } = (location.state as LocationState) || { 
    doctor: null, patientData: null 
  };
  
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // If no doctor or patient data, redirect to home
  if (!doctor || !patientData) {
    navigate("/");
    return null;
  }
  
  // Mock time slots for demonstration
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateTabs = [
    { date: today, label: "Today" },
    { date: tomorrow, label: "Tomorrow" },
    { date: new Date(today.setDate(today.getDate() + 2)), label: `${today.toLocaleDateString('en-US', { weekday: 'short' })}` },
    { date: new Date(today.setDate(today.getDate() + 1)), label: `${today.toLocaleDateString('en-US', { weekday: 'short' })}` },
  ];
  
  const mockTimeSlots: TimeSlot[] = [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "12:00 PM", available: true },
    { time: "01:00 PM", available: false },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: true },
    { time: "05:00 PM", available: false },
    { time: "06:00 PM", available: true },
  ];
  
  const handleTypeSelect = (type: ConsultationType) => {
    setSelectedType(type);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };
  
  const handleBooking = () => {
    if (!selectedType || !selectedTimeSlot) {
      toast.error("Please select a consultation type and time slot");
      return;
    }
    
    // In a real application, this would make an API call to create a booking
    const bookingDetails = {
      doctor,
      patientData,
      consultationType: selectedType,
      timeSlot: selectedTimeSlot,
      date: dateTabs[0].date.toISOString(), // Default to first tab (Today)
    };
    
    // For this demo, we'll just show a success toast and redirect to confirmation
    toast.success("Booking successful!");
    
    // Navigate to payment or confirmation page
    navigate("/confirmation", { state: { booking: bookingDetails } });
  };
  
  // Get type icon
  const getTypeIcon = (type: ConsultationType) => {
    switch(type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Phone className="h-5 w-5" />;
      case "chat":
        return <MessageCircle className="h-5 w-5" />;
      case "in-person":
        return <Calendar className="h-5 w-5" />;
    }
  };
  
  // Get type description
  const getTypeDescription = (type: ConsultationType) => {
    switch(type) {
      case "video":
        return "Face-to-face consultation via video call";
      case "audio":
        return "Voice-only consultation via phone call";
      case "chat":
        return "Text-based consultation via messaging";
      case "in-person":
        return "Visit the doctor at their clinic";
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
          <h1 className="text-2xl font-bold mb-6 text-center">Book Your Consultation</h1>
          
          <div className="mb-8 flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
              <div className="border-t-2 border-green-500 w-12"></div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
              <div className="border-t-2 border-green-500 w-12"></div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
              <div className="border-t-2 border-primary w-12"></div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">4</div>
            </div>
          </div>
          
          {/* Doctor Summary Card */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full overflow-hidden mr-4">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{doctor.name}</h2>
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
                  </div>
                </div>
                <div className="ml-auto">
                  <p className="text-2xl font-bold text-primary">${doctor.price}</p>
                  <p className="text-sm text-gray-500">per consultation</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Step 1: Choose Consultation Type */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">1. Choose Consultation Type</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {doctor.consultationTypes.map((type) => (
                <Card 
                  key={type} 
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedType === type ? "ring-2 ring-primary" : ""}`}
                  onClick={() => handleTypeSelect(type)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${selectedType === type ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>
                      {getTypeIcon(type)}
                    </div>
                    <h3 className="font-medium mb-1 capitalize">{type}</h3>
                    <p className="text-sm text-gray-500">{getTypeDescription(type)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Step 2: Choose Time Slot */}
          <div>
            <h2 className="text-lg font-semibold mb-4">2. Select Date & Time</h2>
            
            <Tabs defaultValue="today">
              <TabsList className="mb-4">
                {dateTabs.map((tab, index) => (
                  <TabsTrigger key={index} value={tab.label.toLowerCase()}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {dateTabs.map((tab, tabIndex) => (
                <TabsContent key={tabIndex} value={tab.label.toLowerCase()} className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {mockTimeSlots.map((slot, i) => (
                      <Button
                        key={i}
                        variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                        className={`h-auto py-2 ${!slot.available && "opacity-50 cursor-not-allowed"}`}
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Summary & Continue Button */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold mb-1">Consultation Summary</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedType && (
                    <Badge className="bg-primary">{selectedType} consultation</Badge>
                  )}
                  {selectedTimeSlot && (
                    <Badge variant="outline">{selectedTimeSlot}</Badge>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  {patientData.symptoms.slice(0, 3).join(", ")}
                  {patientData.symptoms.length > 3 ? "..." : ""}
                </p>
              </div>
              
              <Button
                onClick={handleBooking}
                disabled={!selectedType || !selectedTimeSlot}
                className="w-full md:w-auto"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
