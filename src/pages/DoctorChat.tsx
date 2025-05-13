import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

// Mock conversation data
const mockConversations: { [key: string]: any[] } = {
  "1": [
    {
      id: 1,
      sender: "patient",
      message: "Hello doctor, I've been having a severe headache since yesterday.",
      timestamp: "2024-03-20T10:00:00"
    },
    {
      id: 2,
      sender: "doctor",
      message: "Hello! I'm sorry to hear that. Can you tell me more about the headache? Where exactly is the pain located?",
      timestamp: "2024-03-20T10:01:00"
    },
    {
      id: 3,
      sender: "patient",
      message: "It's mostly on the right side of my head, and it's a throbbing pain.",
      timestamp: "2024-03-20T10:02:00"
    },
    {
      id: 4,
      sender: "doctor",
      message: "Are you experiencing any other symptoms like nausea or sensitivity to light?",
      timestamp: "2024-03-20T10:03:00"
    }
  ],
  "2": [
    {
      id: 1,
      sender: "patient",
      message: "Hi doctor, I have a question about my medication.",
      timestamp: "2024-03-20T09:00:00"
    },
    {
      id: 2,
      sender: "doctor",
      message: "Hello! Of course, I'm here to help. What would you like to know?",
      timestamp: "2024-03-20T09:01:00"
    }
  ],
  "3": [
    {
      id: 1,
      sender: "patient",
      message: "Doctor, my symptoms have improved significantly after taking the prescribed medicine.",
      timestamp: "2024-03-19T16:00:00"
    },
    {
      id: 2,
      sender: "doctor",
      message: "That's great to hear! Are you still experiencing any discomfort?",
      timestamp: "2024-03-19T16:01:00"
    },
    {
      id: 3,
      sender: "patient",
      message: "No, I'm feeling much better now. Thank you for your help!",
      timestamp: "2024-03-19T16:02:00"
    }
  ]
};

// Mock patient data
const mockPatients = {
  "1": { name: "John Doe", avatar: "JD" },
  "2": { name: "Jane Smith", avatar: "JS" },
  "3": { name: "Mike Johnson", avatar: "MJ" }
};

const DoctorChat = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [currentDoctor, setCurrentDoctor] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const patient = mockPatients[patientId as keyof typeof mockPatients];

  useEffect(() => {
    // Check if doctor is logged in
    const doctorMobile = localStorage.getItem("currentDoctor");
    if (!doctorMobile) {
      navigate("/login");
      return;
    }
    setCurrentDoctor(doctorMobile);

    // Load mock conversation
    if (patientId && mockConversations[patientId]) {
      setMessages(mockConversations[patientId]);
    }
  }, [patientId, navigate]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: "doctor",
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/doctor/dashboard")}>
              ← Back
            </Button>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{patient.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">{patient.name}</h1>
                <p className="text-sm text-gray-500">Patient</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "doctor" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === "doctor"
                        ? "bg-primary text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "doctor"
                          ? "text-primary-foreground/70"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </main>
    </div>
  );
};

export default DoctorChat; 