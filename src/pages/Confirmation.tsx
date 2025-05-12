
import { useEffect } from "react";
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
import { toast } from "sonner";
import { Video, Phone, MessageCircle, Calendar, Check } from "lucide-react";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || { booking: null };
  
  useEffect(() => {
    // If no booking data, redirect to home
    if (!booking) {
      navigate("/");
    } else {
      // Generate a session ID and store in localStorage to retrieve consultation later
      const sessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("mediconsult_session_id", sessionId);
      localStorage.setItem("mediconsult_last_booking", JSON.stringify({
        doctor: booking.doctor.name,
        type: booking.consultationType,
        time: booking.timeSlot,
        date: booking.date,
        sessionId
      }));
    }
  }, [booking, navigate]);
  
  if (!booking) {
    return null;
  }
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Phone className="h-5 w-5" />;
      case "chat":
        return <MessageCircle className="h-5 w-5" />;
      case "in-person":
        return <Calendar className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  // Get connection instructions
  const getConnectionInstructions = (type: string) => {
    switch(type) {
      case "video":
        return "Click the link in your confirmation email 5 minutes before your appointment to join the video call.";
      case "audio":
        return "You will receive a call at your provided phone number at the scheduled time.";
      case "chat":
        return "Open the chat link from your confirmation email at the scheduled time.";
      case "in-person":
        return "Arrive at the clinic 15 minutes before your appointment time.";
      default:
        return "";
    }
  };
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  const handleDownload = () => {
    toast.success("Confirmation email has been sent");
  };
  
  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <a href="/" className="text-primary font-bold text-2xl">MediConsult</a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center max-w-3xl">
        <Card className="w-full">
          <CardHeader className="text-center bg-primary text-white rounded-t-lg">
            <div className="mx-auto bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Booking Confirmed!</CardTitle>
            <p className="text-primary-foreground">Your consultation has been scheduled successfully</p>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Booking Details */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="font-semibold mb-3">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(booking.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{booking.timeSlot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Consultation Type</p>
                    <div className="flex items-center mt-1">
                      <div className="bg-blue-100 rounded-full p-1 mr-2">
                        {getTypeIcon(booking.consultationType)}
                      </div>
                      <span className="font-medium capitalize">{booking.consultationType}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Session ID</p>
                    <p className="font-medium text-primary">
                      {localStorage.getItem("mediconsult_session_id")}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Doctor Details */}
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Your Doctor</h3>
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                    <img
                      src={booking.doctor.photo}
                      alt={booking.doctor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{booking.doctor.name}</p>
                    <p className="text-primary">{booking.doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(booking.doctor.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Connection Instructions */}
              <div className="rounded-lg border bg-blue-50 p-4">
                <h3 className="font-semibold mb-2">How to Connect</h3>
                <p className="text-gray-700">
                  {getConnectionInstructions(booking.consultationType)}
                </p>
              </div>
              
              {/* Patient Details */}
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Consultation For</h3>
                <div className="mb-2">
                  <span className="text-gray-500 text-sm mr-2">Age:</span>
                  <span>{booking.patientData.age} years</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500 text-sm mr-2">Gender:</span>
                  <span className="capitalize">{booking.patientData.gender}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm mr-2">Symptoms:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {booking.patientData.symptoms.map((symptom: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="px-2 py-1 bg-blue-50"
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button 
              onClick={handleDownload}
              className="w-full sm:w-auto"
              variant="outline"
            >
              Email Confirmation
            </Button>
            <Button 
              onClick={handleHome}
              className="w-full sm:w-auto"
            >
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Need help? Contact our support team at <span className="text-primary">support@mediconsult.com</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your session ID: <span className="font-medium">{localStorage.getItem("mediconsult_session_id")}</span> (Save this for future reference)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Confirmation;
