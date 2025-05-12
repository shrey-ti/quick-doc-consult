import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Phone, MessageCircle, Calendar, ChevronDown, ChevronUp, FileText, Clock, User } from "lucide-react";
import { toast } from "sonner";

interface LocationState {
  mobileNumber: string;
}

interface Consultation {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: "video" | "audio" | "chat" | "in-person";
  status: "completed" | "upcoming" | "cancelled";
  symptoms: string[];
  prescription?: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
    instructions: string[];
    followUpDate?: string;
  };
}

const getConsultationHistory = (mobileNumber: string): Consultation[] => {
  // Mock data - in real app, this would be an API call
  return [
    {
      id: "1",
      doctorName: "Dr. Sarah Williams",
      specialty: "General Physician",
      date: "2024-03-15",
      time: "10:00 AM",
      type: "video",
      status: "completed",
      symptoms: ["Fever", "Cough", "Sore throat"],
      prescription: {
        medications: [
          {
            name: "Paracetamol",
            dosage: "500mg",
            frequency: "Every 6 hours",
            duration: "3 days"
          },
          {
            name: "Azithromycin",
            dosage: "500mg",
            frequency: "Once daily",
            duration: "5 days"
          }
        ],
        instructions: [
          "Take medications after meals",
          "Rest well and stay hydrated",
          "Avoid cold drinks and spicy food"
        ],
        followUpDate: "2024-03-22"
      }
    },
    {
      id: "2",
      doctorName: "Dr. Michael Chen",
      specialty: "Cardiologist",
      date: "2024-03-20",
      time: "2:30 PM",
      type: "in-person",
      status: "upcoming",
      symptoms: ["Chest pain", "Shortness of breath"]
    },
    {
      id: "3",
      doctorName: "Dr. Emily Johnson",
      specialty: "Dermatologist",
      date: "2024-03-10",
      time: "11:00 AM",
      type: "chat",
      status: "completed",
      symptoms: ["Skin rash", "Itching"],
      prescription: {
        medications: [
          {
            name: "Cetirizine",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "7 days"
          },
          {
            name: "Hydrocortisone cream",
            dosage: "1%",
            frequency: "Apply twice daily",
            duration: "5 days"
          }
        ],
        instructions: [
          "Apply cream on affected areas",
          "Avoid scratching",
          "Use mild soap for bathing"
        ]
      }
    }
  ];
};

const ConsultationHistoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mobileNumber } = (location.state as LocationState) || {};
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [expandedConsultation, setExpandedConsultation] = useState<string | null>(null);

  useEffect(() => {
    if (!mobileNumber) {
      navigate("/");
      return;
    }
    const history = getConsultationHistory(mobileNumber);
    setConsultations(history);
  }, [mobileNumber, navigate]);

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
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleConsultation = (id: string) => {
    setExpandedConsultation(expandedConsultation === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!mobileNumber) {
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
        <h1 className="text-2xl font-bold mb-6">Consultation History</h1>
        
        {consultations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No consultation history found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card key={consultation.id} className="overflow-hidden">
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleConsultation(consultation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {getConsultationTypeIcon(consultation.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{consultation.doctorName}</h3>
                        <p className="text-sm text-gray-500">{consultation.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status}
                      </Badge>
                      {expandedConsultation === consultation.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedConsultation === consultation.id && (
                  <CardContent className="border-t p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(consultation.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{consultation.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{consultation.doctorName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-gray-500" />
                        <span className="capitalize">{consultation.type} Consultation</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {consultation.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {consultation.status === "completed" && consultation.prescription && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Prescription</h4>
                          <Button variant="outline" size="sm" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Medications</h5>
                            <div className="space-y-2">
                              {consultation.prescription.medications.map((med, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-md">
                                  <p className="font-medium">{med.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {med.dosage} - {med.frequency} for {med.duration}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Instructions</h5>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {consultation.prescription.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                              ))}
                            </ul>
                          </div>

                          {consultation.prescription.followUpDate && (
                            <div className="bg-blue-50 p-3 rounded-md">
                              <p className="text-sm text-blue-800">
                                Follow-up appointment scheduled for {formatDate(consultation.prescription.followUpDate)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {consultation.status === "upcoming" && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-4">Upcoming Consultation</h4>
                        <div className="space-y-4">
                          <p className="text-gray-600">
                            Your consultation is scheduled for {formatDate(consultation.date)} at {consultation.time}
                          </p>
                          <div className="flex gap-3">
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ConsultationHistoryPage; 