import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, Phone, MessageCircle, Calendar as InPerson } from "lucide-react";

// Mock data for consultations
const mockConsultations = {
  upcoming: [
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      specialization: "General Physician",
      date: "2024-03-25",
      time: "10:00 AM",
      mode: "video",
      status: "Confirmed",
    },
    {
      id: 2,
      doctorName: "Dr. Michael Chen",
      specialization: "Orthopedic",
      date: "2024-03-26",
      time: "02:00 PM",
      mode: "in-person",
      status: "Confirmed",
    },
  ],
  past: [
    {
      id: 3,
      doctorName: "Dr. Emily Brown",
      specialization: "Pediatrician",
      date: "2024-03-15",
      time: "11:00 AM",
      mode: "video",
      status: "Completed",
      prescription: {
        date: "2024-03-15",
        medicines: [
          {
            name: "Paracetamol",
            dosage: "500mg",
            frequency: "1 tablet every 6 hours",
          },
          {
            name: "Vitamin C",
            dosage: "500mg",
            frequency: "1 tablet daily",
          },
        ],
        advice: "Rest well and stay hydrated. Avoid cold drinks.",
      },
    },
    {
      id: 4,
      doctorName: "Dr. James Wilson",
      specialization: "Dermatologist",
      date: "2024-03-10",
      time: "03:00 PM",
      mode: "whatsapp",
      status: "Completed",
      prescription: {
        date: "2024-03-10",
        medicines: [
          {
            name: "Antibiotic Cream",
            dosage: "1%",
            frequency: "Apply twice daily",
          },
        ],
        advice: "Keep the affected area clean and dry. Avoid scratching.",
      },
    },
  ],
};

const getModeIcon = (mode: string) => {
  switch (mode) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "audio":
      return <Phone className="h-4 w-4" />;
    case "whatsapp":
      return <MessageCircle className="h-4 w-4" />;
    case "in-person":
      return <InPerson className="h-4 w-4" />;
    default:
      return null;
  }
};

const getModeLabel = (mode: string) => {
  switch (mode) {
    case "video":
      return "Video Call";
    case "audio":
      return "Audio Call";
    case "whatsapp":
      return "WhatsApp";
    case "in-person":
      return "In-Person";
    default:
      return mode;
  }
};

const ConsultationHistory = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Consultation History</h1>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {mockConsultations.upcoming.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No upcoming consultations
                </CardContent>
              </Card>
            ) : (
              mockConsultations.upcoming.map((consultation) => (
                <Card key={consultation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{consultation.doctorName}</h3>
                        <p className="text-gray-600">{consultation.specialization}</p>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getModeIcon(consultation.mode)}
                        {getModeLabel(consultation.mode)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {consultation.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultation.time}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {mockConsultations.past.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No past consultations
                </CardContent>
              </Card>
            ) : (
              mockConsultations.past.map((consultation) => (
                <Card key={consultation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{consultation.doctorName}</h3>
                        <p className="text-gray-600">{consultation.specialization}</p>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getModeIcon(consultation.mode)}
                        {getModeLabel(consultation.mode)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {consultation.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultation.time}
                      </div>
                    </div>

                    {consultation.prescription && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Prescription</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">
                            Prescribed on: {consultation.prescription.date}
                          </p>
                          <div className="space-y-2">
                            {consultation.prescription.medicines.map((medicine, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{medicine.name}</span>
                                <span className="text-gray-600">
                                  {" "}
                                  ({medicine.dosage}) - {medicine.frequency}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Advice: </span>
                            {consultation.prescription.advice}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsultationHistory; 