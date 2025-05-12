import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { toast } from "sonner";
import { MessageCircle, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Type for our location state
interface LocationState {
  initialSymptom?: string;
}

const commonSymptoms = [
  "Headache", "Fever", "Cough", "Sore Throat", 
  "Back Pain", "Stomach Pain", "Fatigue", "Dizziness"
];

const Symptoms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialSymptom } = (location.state as LocationState) || {};
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);

  // Common symptoms database for suggestions
  const symptomDatabase = [
    "Headache", "Fever", "Cough", "Sore Throat", "Runny Nose",
    "Fatigue", "Nausea", "Dizziness", "Back Pain", "Chest Pain", 
    "Shortness of Breath", "Joint Pain", "Muscle Ache", "Rash",
    "Abdominal Pain", "Diarrhea", "Loss of Appetite", "Insomnia"
  ];

  // Mock follow-up questions based on symptoms
  const followUpQuestions = {
    "headache": [
      "How long have you had the headache?",
      "Is it on one side or both sides?",
      "Rate your pain from 1-10",
      "Do you have any other symptoms like nausea or sensitivity to light?",
      "Have you taken any pain medication?",
    ],
    "fever": [
      "What's your temperature?",
      "Do you have any other symptoms?",
      "When did it start?",
      "Are you experiencing any chills or sweating?",
      "Have you taken any fever medication?",
    ],
    "cough": [
      "Is it a dry or wet cough?",
      "How long have you been coughing?",
      "Do you have any mucus?",
      "Is the cough worse at night?",
      "Do you have any chest pain when coughing?",
    ],
    "sore throat": [
      "How long have you had the sore throat?",
      "Is it painful to swallow?",
      "Do you have any white patches in your throat?",
      "Are you experiencing any fever?",
      "Have you tried any throat lozenges?",
    ],
    "back pain": [
      "Where exactly is the pain located?",
      "How long have you been experiencing it?",
      "Did you do any heavy lifting recently?",
      "Does the pain radiate to other areas?",
      "What makes the pain better or worse?",
    ],
    "dizziness": [
      "How long have you been feeling dizzy?",
      "Is it constant or does it come and go?",
      "Do you feel like the room is spinning?",
      "Have you had any falls?",
      "Are you experiencing any other symptoms?",
    ],
  };

  // Mock conversation flows for common scenarios
  const conversationFlows = {
    "severe headache": {
      initial: "I understand you're experiencing a severe headache. Let me ask you a few questions to better understand your condition.",
      followUps: [
        "How long have you had the headache?",
        "Is it on one side or both sides?",
        "Rate your pain from 1-10",
        "Do you have any other symptoms like nausea or sensitivity to light?",
        "Have you taken any pain medication?",
      ],
      final: "Based on your symptoms, I recommend consulting with a neurologist or general physician. Would you like to proceed with booking a consultation?"
    },
    "fever and body ache": {
      initial: "I see you're experiencing fever and body ache. Let's gather more information about your symptoms.",
      followUps: [
        "What's your temperature?",
        "When did the fever start?",
        "Are you experiencing any other symptoms?",
        "Have you taken any fever medication?",
        "Do you have any respiratory symptoms?",
      ],
      final: "Given your symptoms, I recommend seeing a general physician. Would you like to book a consultation?"
    },
    "persistent cough with sore throat": {
      initial: "I understand you have a persistent cough and sore throat. Let me ask you some questions to better assess your condition.",
      followUps: [
        "How long have you had these symptoms?",
        "Is it a dry or wet cough?",
        "Is it painful to swallow?",
        "Do you have any fever?",
        "Have you tried any over-the-counter medications?",
      ],
      final: "Based on your symptoms, I recommend consulting with an ENT specialist or general physician. Would you like to proceed with booking?"
    },
    "back pain": {
      initial: "I see you're experiencing back pain. Let's understand more about your condition.",
      followUps: [
        "Where exactly is the pain located?",
        "How long have you been experiencing it?",
        "Did you do any heavy lifting recently?",
        "Does the pain radiate to other areas?",
        "What makes the pain better or worse?",
      ],
      final: "Given your symptoms, I recommend seeing an orthopedic specialist. Would you like to book a consultation?"
    },
    "dizzy and nauseous": {
      initial: "I understand you're feeling dizzy and nauseous. Let me ask you some questions to better understand your condition.",
      followUps: [
        "How long have you been feeling this way?",
        "Is the dizziness constant or does it come and go?",
        "Have you had any falls?",
        "Are you experiencing any other symptoms?",
        "Have you eaten anything unusual recently?",
      ],
      final: "Based on your symptoms, I recommend consulting with a general physician. Would you like to proceed with booking a consultation?"
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm here to help you describe your symptoms. What brings you in today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Add initial symptom if provided
  useEffect(() => {
    if (initialSymptom) {
      handleUserMessage(initialSymptom);
    }
  }, [initialSymptom]);

  const handleUserMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot typing
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add symptoms to the list
    if (!symptoms.includes(message.toLowerCase())) {
      setSymptoms(prev => [...prev, message.toLowerCase()]);
    }

    // Generate bot response
    const botResponse = generateBotResponse(message.toLowerCase());
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleRedirectToDoctors = () => {
    // Mock doctor recommendations based on symptoms
    const doctorRecommendations = {
      "headache": ["Neurologist", "General Physician"],
      "fever": ["General Physician", "Infectious Disease Specialist"],
      "cough": ["Pulmonologist", "ENT Specialist"],
      "sore throat": ["ENT Specialist", "General Physician"],
      "back pain": ["Orthopedic Specialist", "Physiotherapist"],
      "dizziness": ["Neurologist", "General Physician"]
    };

    // Get unique recommendations based on all symptoms
    const recommendedSpecialties = new Set(
      symptoms.flatMap(symptom => 
        doctorRecommendations[symptom as keyof typeof doctorRecommendations] || ["General Physician"]
      )
    );

    navigate("/doctors", { 
      state: { 
        symptoms,
        recommendedSpecialties: Array.from(recommendedSpecialties)
      } 
    });
  };

  const generateBotResponse = (symptom: string): string => {
    // Check for specific conversation flows first
    for (const [key, flow] of Object.entries(conversationFlows)) {
      if (symptom.toLowerCase().includes(key)) {
        const currentSymptom = symptom.toLowerCase();
        const symptomCount = symptoms.length;
        
        if (symptomCount === 0) {
          return flow.initial;
        } else if (symptomCount <= flow.followUps.length) {
          return flow.followUps[symptomCount - 1];
        } else {
          // After all follow-ups, redirect to doctors page
          setTimeout(handleRedirectToDoctors, 1500);
          return "Thank you for providing all the information. I'll connect you with the most suitable doctors for your condition.";
        }
      }
    }

    // Check if we have follow-up questions for this symptom
    const questions = followUpQuestions[symptom as keyof typeof followUpQuestions];
    if (questions && questions.length > 0) {
      const questionIndex = Math.min(symptoms.length, questions.length - 1);
      if (questionIndex >= questions.length - 1) {
        // After all follow-ups, redirect to doctors page
        setTimeout(handleRedirectToDoctors, 1500);
        return "Thank you for providing all the information. I'll connect you with the most suitable doctors for your condition.";
      }
      return questions[questionIndex];
    }

    // Default responses
    if (symptoms.length >= 3) {
      // After collecting enough symptoms, redirect to doctors page
      setTimeout(handleRedirectToDoctors, 1500);
      return "Thank you for providing all the information. I'll connect you with the most suitable doctors for your condition.";
    }
    return "Could you tell me more about your symptoms? For example, how long have you been experiencing this?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleUserMessage(inputValue);
    }
  };

  const handleContinue = () => {
    if (symptoms.length > 0) {
      navigate("/patient-info", { state: { symptoms } });
    } else {
      toast.error("Please describe at least one symptom");
    }
  };

  // Get available common symptoms (exclude already selected ones)
  const getAvailableCommonSymptoms = () => {
    return commonSymptoms.filter(symptom => !symptoms.includes(symptom));
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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Describe Your Symptoms</h1>
          
          <div className="mb-8 flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">1</div>
              <div className="border-t-2 border-primary w-12"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">2</div>
              <div className="border-t-2 border-gray-300 w-12"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">3</div>
              <div className="border-t-2 border-gray-300 w-12"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">4</div>
            </div>
          </div>
          
          {/* Chat Interface */}
          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your symptoms..."
                className="flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button type="submit" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Back
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={symptoms.length === 0}
            >
              Continue
            </Button>
          </div>
        </div>
        
        {/* Tips Section */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3">Tips for describing symptoms effectively</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Be specific about the location of pain or discomfort</li>
            <li>Describe when the symptoms started</li>
            <li>Note if anything makes the symptoms better or worse</li>
            <li>Include the severity (mild, moderate, severe)</li>
            <li>Mention any related symptoms you're experiencing</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Symptoms;
