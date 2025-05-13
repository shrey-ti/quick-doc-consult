import { useEffect, useState } from "react";
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
import { 
  Video, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Check, 
  ArrowRight, 
  Clock, 
  ArrowLeft, 
  DollarSign, 
  MapPin, 
  Download, 
  Copy, 
  CalendarPlus, 
  Printer, 
  Share2, 
  AlertCircle
} from "lucide-react";
import { addConsultationToHistory } from "@/types/consultation";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || { booking: null };
  const [bookingReference, setBookingReference] = useState("");
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // If no booking data, redirect to home
    if (!booking) {
      navigate("/");
    } else {
      // Generate a session ID and store in localStorage to retrieve consultation later
      const sessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("mediconsult_session_id", sessionId);
      
      // Generate booking reference
      const reference = generateBookingReference();
      setBookingReference(reference);
      
      // Store the consultation in history
      addConsultationToHistory({
        id: sessionId,
        mobileNumber: booking.patientData.mobileNumber,
        date: booking.date,
        doctor: {
          name: booking.doctor.name,
          specialty: booking.doctor.specialty,
          photo: booking.doctor.photo
        },
        consultationType: booking.consultationType,
        timeSlot: booking.timeSlot,
        symptoms: booking.patientData.symptoms,
        patientData: {
          age: booking.patientData.age,
          gender: booking.patientData.gender,
          height: booking.patientData.height,
          weight: booking.patientData.weight
        },
        status: "upcoming",
        bookingReference: reference
      });
    }
  }, [booking, navigate]);
  
  // Generate a booking reference
  const generateBookingReference = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omitting similar looking characters
    let result = 'MC-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
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

  // Get type title
  const getTypeTitle = (type: string) => {
    switch(type) {
      case "video":
        return "Video Consultation";
      case "audio":
        return "Audio Consultation";
      case "chat":
        return "Chat Consultation";
      case "in-person":
        return "In-Person Visit";
      default:
        return "Consultation";
    }
  };
  
  // Get connection instructions
  const getConnectionInstructions = (type: string) => {
    switch(type) {
      case "video":
        return "You will receive a link via email and SMS 15 minutes before your appointment. Ensure you have a stable internet connection and are in a quiet, well-lit space.";
      case "audio":
        return "You will receive a call at your provided phone number at the scheduled time. Please ensure you have good network coverage and are in a quiet place.";
      case "chat":
        return "Open the chat link from your confirmation email at the scheduled time. You'll receive an SMS notification when the doctor joins the chat.";
      case "in-person":
        return "Arrive at the clinic 15 minutes before your appointment time. Bring any relevant medical records or test results.";
      default:
        return "";
    }
  };
  
  // Get clinic address (for in-person)
  const getClinicAddress = () => {
    return "123 Medical Center Drive, Suite 456, New York, NY 10001";
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

  // Combine date and time
  const getFullDateTime = () => {
    const date = new Date(booking.date);
    return `${formatDate(booking.date)} at ${booking.timeSlot}`;
  };
  
  const copyReferenceToClipboard = () => {
    navigator.clipboard.writeText(bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Booking reference copied to clipboard");
  };
  
  const handleAddToCalendar = () => {
    const date = new Date(booking.date);
    const timeStart = booking.timeSlot;
    
    // Extract hours and minutes from the time string (e.g., "10:00 AM")
    const timeParts = timeStart.match(/(\d+):(\d+)\s*([AP]M)/i);
    if (timeParts) {
      let hours = parseInt(timeParts[1]);
      const minutes = parseInt(timeParts[2]);
      const ampm = timeParts[3].toUpperCase();
      
      // Convert to 24-hour format
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      // Set the time components
      date.setHours(hours, minutes, 0, 0);
      
      // Create end time (assuming 30-minute consultation)
      const endDate = new Date(date.getTime() + 30 * 60 * 1000);
      
      // Create calendar event (Google Calendar format)
      const event = {
        text: `${getTypeTitle(booking.consultationType)} with ${booking.doctor.name}`,
        dates: `${date.toISOString()}/${endDate.toISOString()}`,
        details: `Booking Reference: ${bookingReference}\nDoctor: ${booking.doctor.name} (${booking.doctor.specialty})\nConsultation Type: ${getTypeTitle(booking.consultationType)}\n${booking.consultationType === 'in-person' ? `Location: ${getClinicAddress()}` : ''}`,
      };
      
      // Encode the event data for the Google Calendar URL
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${encodeURIComponent(event.dates.replace(/[-:]/g, ''))}&details=${encodeURIComponent(event.details)}`;
      
      // Open Google Calendar in a new tab
      window.open(googleCalendarUrl, '_blank');
      
      toast.success("Event added to Google Calendar");
    }
  };
  
  const handleReschedule = () => {
    setShowRescheduleDialog(false);
    toast.info("A booking assistant will contact you shortly to reschedule your appointment");
  };
  
  const handleCancel = () => {
    setShowCancelDialog(false);
    toast.info("Your booking has been cancelled");
    navigate("/");
  };
  
  const handleDownloadConfirmation = () => {
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
          <Button variant="ghost" onClick={() => navigate("/consultation-history")}>
            View All Consultations
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center max-w-4xl">
        {/* Success Animation */}
        <div className="w-full max-w-xl mx-auto mb-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-center mb-6">
            Your appointment has been successfully scheduled.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-700 flex items-center mb-6 w-full max-w-md mx-auto">
            <div className="flex-1">
              <p className="font-medium">Booking Reference: {bookingReference}</p>
              <p className="text-sm">Please save this for your records</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={copyReferenceToClipboard}
              className="text-blue-700"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <Card className="w-full shadow-lg border-t-4 border-t-primary">
          <CardHeader className="bg-white pb-0">
            <CardTitle className="text-xl font-bold">Appointment Details</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Doctor Details */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <img
                    src={booking.doctor.photo}
                    alt={booking.doctor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{booking.doctor.name}</h3>
                  <p className="text-primary">{booking.doctor.specialty}</p>
                </div>
                <Badge className="ml-auto capitalize">
                  {booking.consultationType}
                </Badge>
              </div>
              
              <Separator />
              
              {/* Appointment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date & Time</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <p className="font-medium">{formatDate(booking.date)}</p>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <p className="font-medium">{booking.timeSlot}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Consultation Type</p>
                    <div className="flex items-center mt-1">
                      <div className="bg-primary/10 rounded-full p-1 mr-2">
                        {getTypeIcon(booking.consultationType)}
                      </div>
                      <p className="font-medium">{getTypeTitle(booking.consultationType)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {booking.consultationType === "in-person" && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Clinic Address</p>
                      <div className="flex items-start mt-1">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                        <p className="font-medium">{getClinicAddress()}</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Payment Details</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        <p>Consultation Fee</p>
                      </div>
                      <p className="font-medium">${booking.price || booking.doctor.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                      <p className="ml-6">Payment Status</p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Paid
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Connection Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-blue-700" />
                  <span className="text-blue-700">How to Connect</span>
                </h3>
                <p className="text-blue-700 text-sm">
                  {getConnectionInstructions(booking.consultationType)}
                </p>
              </div>
              
              {/* Patient Info */}
              <div>
                <h3 className="font-medium mb-2">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{booking.patientData.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{booking.patientData.gender}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Reason for Visit</p>
                  <p className="font-medium">{booking.patientData.symptoms.join(", ")}</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col pt-6 border-t space-y-4">
            <div className="flex gap-3 w-full flex-wrap">
              <Button 
                onClick={handleAddToCalendar}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <CalendarPlus className="h-4 w-4" />
                Add to Calendar
              </Button>
              
              <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Reschedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reschedule Appointment</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reschedule your appointment with {booking.doctor.name}?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-gray-500">
                      A booking assistant will contact you shortly to arrange a new time for your appointment.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleReschedule}>
                      Confirm Reschedule
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Cancel Booking
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Appointment</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your appointment with {booking.doctor.name}?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-gray-500">
                      This action cannot be undone. You will need to make a new booking if you change your mind.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                      Keep Appointment
                    </Button>
                    <Button variant="destructive" onClick={handleCancel}>
                      Cancel Appointment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex gap-3 w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Details
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4">
                  <div className="grid gap-4">
                    <Button variant="outline" onClick={handleDownloadConfirmation}>
                      <Download className="mr-2 h-4 w-4" />
                      Email Details
                    </Button>
                    <Button variant="outline" onClick={() => window.print()}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Details
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                onClick={handleHome}
                className="flex-1 flex items-center justify-center gap-2"
              >
                Return to Home
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Need help? Contact our support team at <span className="text-primary">support@mediconsult.com</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your booking reference: <span className="font-medium">{bookingReference}</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Confirmation;
