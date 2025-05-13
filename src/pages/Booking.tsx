import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Video, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Info, 
  Wifi, 
  Clock4, 
  DollarSign,
  AlertCircle
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

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

interface ConsultationTypeOption {
  type: ConsultationType;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  preparation: string;
  priceMultiplier: number;
}

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, patientData } = (location.state as LocationState) || { 
    doctor: null, patientData: null 
  };
  
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hoveredType, setHoveredType] = useState<ConsultationType | null>(null);
  
  // If no doctor or patient data, redirect to home
  if (!doctor || !patientData) {
    navigate("/");
    return null;
  }

  // Define consultation type options with more details
  const consultationTypeOptions: Record<ConsultationType, ConsultationTypeOption> = {
    "video": {
      type: "video",
      title: "Video Call",
      description: "Face-to-face video consultation with the doctor via our secure platform. Best for visual symptoms and detailed discussions.",
      icon: <Video className="h-5 w-5" />,
      duration: "20-30 minutes",
      preparation: "Ensure you have a stable internet connection and a quiet, well-lit space.",
      priceMultiplier: 1.0
    },
    "audio": {
      type: "audio",
      title: "Audio Call",
      description: "Voice-only consultation via phone call. Good for follow-ups and non-visual conditions.",
      icon: <Phone className="h-5 w-5" />,
      duration: "15-20 minutes",
      preparation: "Ensure you're in a quiet place with good network coverage.",
      priceMultiplier: 0.8
    },
    "chat": {
      type: "chat",
      title: "Chat Consultation",
      description: "Text-based consultation via secure messaging. Ideal for non-urgent issues and documentation of symptoms.",
      icon: <MessageCircle className="h-5 w-5" />,
      duration: "Typically spans 24 hours",
      preparation: "Prepare clear descriptions of your symptoms and any photos if relevant.",
      priceMultiplier: 0.7
    },
    "in-person": {
      type: "in-person",
      title: "In-Person Visit",
      description: "Traditional in-clinic consultation. Recommended for conditions requiring physical examination.",
      icon: <Calendar className="h-5 w-5" />,
      duration: "30-45 minutes",
      preparation: "Arrive 15 minutes before your appointment and bring any relevant medical records.",
      priceMultiplier: 1.2
    }
  };
  
  // Create an array of available dates (next 14 days)
  const availableDates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    availableDates.push(date);
  }
  
  // Disable weekends in the calendar (just as an example)
  const disabledDays = [
    { from: new Date(0, 0, 0), to: new Date(today.setDate(today.getDate() - 1)) }, // Past dates
    { daysOfWeek: doctor.availableToday ? [] : [0, 6] } // Weekends if doctor not available today
  ];
  
  // Generate morning and afternoon time slots
  const morningSlots: TimeSlot[] = [
    { time: "08:00 AM", available: Math.random() > 0.3 },
    { time: "08:30 AM", available: Math.random() > 0.3 },
    { time: "09:00 AM", available: Math.random() > 0.3 },
    { time: "09:30 AM", available: Math.random() > 0.3 },
    { time: "10:00 AM", available: Math.random() > 0.3 },
    { time: "10:30 AM", available: Math.random() > 0.3 },
    { time: "11:00 AM", available: Math.random() > 0.3 },
    { time: "11:30 AM", available: Math.random() > 0.3 },
  ];
  
  const afternoonSlots: TimeSlot[] = [
    { time: "12:00 PM", available: Math.random() > 0.3 },
    { time: "12:30 PM", available: Math.random() > 0.3 },
    { time: "01:00 PM", available: Math.random() > 0.3 },
    { time: "01:30 PM", available: Math.random() > 0.3 },
    { time: "02:00 PM", available: Math.random() > 0.3 },
    { time: "02:30 PM", available: Math.random() > 0.3 },
    { time: "03:00 PM", available: Math.random() > 0.3 },
    { time: "03:30 PM", available: Math.random() > 0.3 },
    { time: "04:00 PM", available: Math.random() > 0.3 },
    { time: "04:30 PM", available: Math.random() > 0.3 },
    { time: "05:00 PM", available: Math.random() > 0.3 },
    { time: "05:30 PM", available: Math.random() > 0.3 },
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
      date: selectedDate.toISOString(),
      price: calculatePrice()
    };
    
    // For this demo, we'll just show a success toast and redirect to confirmation
    toast.success("Booking successful!");
    
    // Navigate to payment or confirmation page
    navigate("/confirmation", { state: { booking: bookingDetails } });
  };
  
  // Calculate price based on consultation type
  const calculatePrice = () => {
    if (!selectedType) return doctor.price;
    
    const option = consultationTypeOptions[selectedType];
    return Math.round(doctor.price * option.priceMultiplier);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <a href="/" className="text-primary font-bold text-2xl">MediConsult</a>
          <Button variant="ghost" onClick={() => navigate("/doctors", { state: { patientData } })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Doctors
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
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">3</div>
              <div className="border-t-2 border-gray-300 w-12"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">4</div>
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
                  <p className="text-sm text-gray-500">base price</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Step 1: Choose Consultation Type */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span>
              Choose Consultation Type
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctor.consultationTypes.map((type) => {
                const option = consultationTypeOptions[type];
                const typePrice = Math.round(doctor.price * option.priceMultiplier);
                
                return (
                  <Card 
                    key={type} 
                    className={`cursor-pointer transition-all hover:shadow-md overflow-hidden ${selectedType === type ? "ring-2 ring-primary" : "border"}`}
                    onClick={() => handleTypeSelect(type)}
                    onMouseEnter={() => setHoveredType(type)}
                    onMouseLeave={() => setHoveredType(null)}
                  >
                    <div className={`h-1 ${selectedType === type ? "bg-primary" : "bg-transparent"}`}></div>
                    <CardContent className="p-0">
                      <div className="p-4 flex gap-4">
                        <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${selectedType === type ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>
                          {option.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{option.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">${typePrice}</p>
                              {option.priceMultiplier !== 1 && (
                                <p className="text-xs text-gray-500">
                                  {option.priceMultiplier < 1 ? "-" : "+"}
                                  {Math.abs(Math.round((option.priceMultiplier - 1) * 100))}% from base
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center text-sm text-gray-600">
                            <Clock4 className="h-4 w-4 mr-1" />
                            <span>{option.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {(selectedType === type || hoveredType === type) && (
                        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 text-sm text-blue-700 flex items-start">
                          <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{option.preparation}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Step 2: Choose Date & Time */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span>
              Select Date & Time
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              {/* Date Selection Calendar */}
              <div className="md:col-span-2 bg-white p-4 rounded-lg border">
                <h3 className="font-medium mb-3 flex items-center"><Calendar className="h-4 w-4 mr-2" />Choose Date</h3>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={disabledDays}
                  className="rounded-md border"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Selected date: <span className="font-medium">{formatDate(selectedDate)}</span>
                </p>
              </div>
              
              {/* Time Slots */}
              <div className="md:col-span-3 bg-white p-4 rounded-lg border">
                <h3 className="font-medium mb-3 flex items-center"><Clock className="h-4 w-4 mr-2" />Choose Time Slot</h3>
                
                {/* Time slots legend */}
                <div className="flex gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
                    <span>Unavailable</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Selected</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Morning slots */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Morning</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {morningSlots.map((slot, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className={`h-auto py-2 ${
                            selectedTimeSlot === slot.time 
                              ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:text-white" 
                              : slot.available 
                                ? "bg-white hover:bg-primary hover:text-white" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Afternoon slots */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Afternoon</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {afternoonSlots.map((slot, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className={`h-auto py-2 ${
                            selectedTimeSlot === slot.time 
                              ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:text-white" 
                              : slot.available 
                                ? "bg-white hover:bg-primary hover:text-white" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Alert for time slot selection */}
            {selectedType && !selectedTimeSlot && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Select a time slot</AlertTitle>
                <AlertDescription>
                  Please select your preferred appointment time to proceed.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Summary & Continue Button */}
          <div className="mt-8 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Consultation Summary</h3>
                <Card className="bg-gray-50">
                  <CardContent className="p-4 space-y-3">
                    {selectedType ? (
                      <>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {consultationTypeOptions[selectedType].icon}
                            <span className="ml-2 font-medium">{consultationTypeOptions[selectedType].title}</span>
                          </div>
                          <Badge className="bg-primary">{consultationTypeOptions[selectedType].title}</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Appointment Date</span>
                          </div>
                          <span className="font-medium">{formatDate(selectedDate)}</span>
                        </div>
                        
                        {selectedTimeSlot && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>Appointment Time</span>
                            </div>
                            <span className="font-medium">{selectedTimeSlot}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>Consultation Fee</span>
                          </div>
                          <span className="font-medium">${calculatePrice()}</span>
                        </div>
                        
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm text-gray-600">
                            <strong>Reason for visit:</strong> {patientData.symptoms.slice(0, 3).join(", ")}
                            {patientData.symptoms.length > 3 ? "..." : ""}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p>Please select a consultation type and time slot</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold mb-3">Payment Information</h3>
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        You will be redirected to our secure payment gateway after confirming this booking.
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Wifi className="h-4 w-4 mr-2" />
                        <span>Secure payment processing</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button
                  onClick={handleBooking}
                  disabled={!selectedType || !selectedTimeSlot}
                  className="w-full mt-4 h-12"
                  size="lg"
                >
                  {selectedType && selectedTimeSlot ? (
                    <>
                      Confirm Booking <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Complete Selection to Continue"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
