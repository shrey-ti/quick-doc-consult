import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Video, Phone, MessageCircle, Star, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Doctor {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  specialty: string;
  experience: string;
  qualification: string;
  registrationNumber: string;
  clinicAddress: string;
  consultationFee: string;
  about: string;
  isVerified: boolean;
  rating: number;
  totalConsultations: number;
  availableSlots: Array<{
    date: string;
    times: Array<{
      time: string;
      isAvailable: boolean;
    }>;
  }>;
}

interface Appointment {
  id: string;
  patientName: string;
  patientMobile: string;
  date: string;
  time: string;
  type: "video" | "audio" | "chat" | "in-person";
  status: "scheduled" | "completed" | "cancelled";
  symptoms: string[];
}

const getMockAppointments = (): Appointment[] => {
  return [
    {
      id: "1",
      patientName: "John Doe",
      patientMobile: "9876543210",
      date: "2024-03-20",
      time: "10:00 AM",
      type: "video",
      status: "scheduled",
      symptoms: ["Fever", "Cough"]
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientMobile: "9876543211",
      date: "2024-03-20",
      time: "11:00 AM",
      type: "in-person",
      status: "scheduled",
      symptoms: ["Back pain"]
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      patientMobile: "9876543212",
      date: "2024-03-19",
      time: "02:00 PM",
      type: "chat",
      status: "completed",
      symptoms: ["Skin rash"]
    }
  ];
};

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const doctorMobile = localStorage.getItem("mediconsult_doctor_mobile");
    if (!doctorMobile) {
      navigate("/doctor-registration");
      return;
    }

    const doctors = JSON.parse(localStorage.getItem("mediconsult_doctors") || "{}");
    const doctorData = doctors[doctorMobile];
    
    if (!doctorData) {
      navigate("/doctor-registration");
      return;
    }

    setDoctor(doctorData);
    setAppointments(getMockAppointments());
  }, [navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!doctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <a href="/" className="text-primary font-bold text-2xl">MediConsult</a>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile</CardTitle>
                <Badge variant={doctor.isVerified ? "default" : "secondary"}>
                  {doctor.isVerified ? "Verified" : "Pending Verification"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-gray-500">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium">{doctor.experience} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span className="font-medium">₹{doctor.consultationFee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium">{doctor.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Consultations</span>
                  <span className="font-medium">{doctor.totalConsultations}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-gray-600">{doctor.about}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Clinic Address</h4>
                <p className="text-gray-600">{doctor.clinicAddress}</p>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {appointments
                  .filter(apt => apt.status === "scheduled")
                  .map(appointment => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                              {getConsultationTypeIcon(appointment.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{appointment.patientName}</h3>
                              <p className="text-sm text-gray-500">{appointment.patientMobile}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Symptoms</h4>
                          <div className="flex flex-wrap gap-2">
                            {appointment.symptoms.map((symptom, index) => (
                              <Badge key={index} variant="secondary">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            Cancel
                          </Button>
                          <Button size="sm">
                            Start Consultation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {appointments
                  .filter(apt => apt.status !== "scheduled")
                  .map(appointment => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                              {getConsultationTypeIcon(appointment.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{appointment.patientName}</h3>
                              <p className="text-sm text-gray-500">{appointment.patientMobile}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Symptoms</h4>
                          <div className="flex flex-wrap gap-2">
                            {appointment.symptoms.map((symptom, index) => (
                              <Badge key={index} variant="secondary">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile; 