import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  mobileNumber: string;
}

// List of specializations for the doctor recommendations
const specializations = [
  "General Physician / Family Medicine",
  "Dermatologist",
  "Pediatrician",
  "Gynecologist",
  "Psychiatrist / Psychologist",
  "ENT Specialist",
  "Cardiologist",
  "Gastroenterologist",
  "Orthopedic",
  "Neurologist",
  "Pulmonologist",
  "Urologist",
  "Endocrinologist",
  "Ophthalmologist",
  "Dentist"
];

const commonSymptoms = [
  "Headache", "Fever", "Cough", "Sore Throat", 
  "Back Pain", "Stomach Pain", "Fatigue", "Dizziness"
];

// Define a form schema for patient information
const patientInfoSchema = z.object({
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) < 120, {
    message: "Please enter a valid age between 1 and 120",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  height: z.string().refine((val) => val === "" || (!isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) < 300), {
    message: "Please enter a valid height in centimeters",
  }),
  weight: z.string().refine((val) => val === "" || (!isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) < 500), {
    message: "Please enter a valid weight in kilograms",
  }),
});

type PatientInfoValues = z.infer<typeof patientInfoSchema>;

const Symptoms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialSymptom, mobileNumber } = (location.state as LocationState) || {};
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  
  // Add this new state near the other state variables
  const [debugMode, setDebugMode] = useState(false);
  
  // AI chat state
  const [chatContext, setChatContext] = useState<{
    followUpCount: number;
    initialSymptomAnalyzed: boolean;
    conversationComplete: boolean;
    finalSpecialist: string | null;
  }>({
    followUpCount: 0,
    initialSymptomAnalyzed: false,
    conversationComplete: false,
    finalSpecialist: null
  });

  const [showPatientInfoForm, setShowPatientInfoForm] = useState(false);
  
  // Initialize form
  const patientInfoForm = useForm<PatientInfoValues>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: {
      age: "",
      gender: undefined,
      height: "",
      weight: "",
    },
  });

  // Get API key from environment
  const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

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

  // Add this retry function before the fetchGeminiResponse function
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 2, delay = 1000): Promise<Response> => {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // If we got a 429 (rate limit) or 5xx (server error), retry
      if ((response.status === 429 || response.status >= 500) && retries > 0) {
        console.log(`Retrying API call. Attempts left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      
      return response; // Return the error response if we can't retry
    } catch (error) {
      // Retry network errors (like connection issues)
      if (retries > 0) {
        console.log(`Network error, retrying. Attempts left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  // Fetch response from Gemini API
  const fetchGeminiResponse = async (conversationHistory: Message[]) => {
    try {
      // Check if API key is properly set
      if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
        console.error("Gemini API key is not properly configured");
        throw new Error("API_KEY_MISSING");
      }

      // Prepare the messages for the API request
      const prompt = createPrompt(conversationHistory);
      
      // Log the API call without revealing the full key (for debugging)
      console.log(`Calling Gemini API with prompt length: ${prompt.length}`);
      console.log(`API Key configured: ${GEMINI_API_KEY ? "Yes" : "No"}`);
      
      // Use fetchWithRetry instead of fetch
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        },
        2, // Number of retries
        1000 // Initial delay in ms
      );
      
      // If response is not OK, get more detailed error information
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API Error Response:", errorData);
        
        // Handle specific error types
        if (response.status === 403) {
          throw new Error("API_AUTH_ERROR");
        } else if (response.status === 429) {
          throw new Error("API_RATE_LIMIT");
        } else {
          throw new Error(`API_ERROR_${response.status}`);
        }
      }

      const data = await response.json();
      
      // Process the response
      if (data.candidates && data.candidates.length > 0) {
        const textResponse = data.candidates[0].content.parts[0].text;
        console.log("Received successful response from Gemini API");
        
        // Check if this is a final recommendation
        if (textResponse.includes("Based on your responses, you should consult:")) {
          // Extract the specialist recommendation
          const recommendationMatch = textResponse.match(/Based on your responses, you should consult: (.*?)($|\n)/);
          if (recommendationMatch && recommendationMatch[1]) {
            const specialist = recommendationMatch[1].trim();
            
            // Update chat context
            setChatContext(prev => ({
              ...prev,
              conversationComplete: true,
              finalSpecialist: specialist
            }));
            
            // After a delay, navigate to the doctors page
            setTimeout(() => handleRedirectToDoctors(specialist), 2000);
          }
        } else {
          // It's a follow-up question, update the context
          setChatContext(prev => ({
            ...prev,
            followUpCount: prev.followUpCount + 1,
            initialSymptomAnalyzed: true
          }));
        }
        
        return textResponse;
      }
      
      throw new Error("NO_RESPONSE_DATA");
    } catch (error) {
      // Log the specific error
      console.error("Error fetching from Gemini API:", error);
      
      // Handle different error types with appropriate messages
      const errorMessage = error instanceof Error ? error.message : "UNKNOWN_ERROR";
      
      // Show specific toast messages based on error type
      if (errorMessage === "API_KEY_MISSING") {
        toast.error("API key is missing or invalid. Please check your environment setup.");
      } else if (errorMessage === "API_AUTH_ERROR") {
        toast.error("API authentication failed. Please check your API key.");
      } else if (errorMessage === "API_RATE_LIMIT") {
        toast.error("You've exceeded the API rate limit. Please try again later.");
      } else if (errorMessage.startsWith("API_ERROR_")) {
        toast.error("There was an issue connecting to the AI service.");
      }
      
      // Return a generic error message if the API fails
      return "I'm sorry, I'm having trouble analyzing your symptoms right now. Please try again in a moment.";
    }
  };

  // Create the prompt for Gemini based on the conversation history
  const createPrompt = (conversationHistory: Message[]): string => {
    // Extract just the user messages for initial symptoms
    const userMessages = conversationHistory.filter(msg => msg.sender === 'user');
    
    // Base prompt for initial symptom analysis
    if (userMessages.length === 1) {
      return `
You are a medical assistant helping users identify which doctor specialist they should consult based on their symptoms. 
I need you to analyze symptoms and ask 2-4 relevant follow-up questions to determine the appropriate medical specialist.

Initial symptom from the patient: "${userMessages[0].text}"

Based on this initial symptom, ask ONE follow-up question to better understand the patient's condition. 
Keep your response brief and focused on a single question.
`;
    } 
    // Prompt for follow-up questions
    else if (!chatContext.conversationComplete) {
      // Create a transcript of the conversation so far
      const transcript = conversationHistory
        .map(msg => `${msg.sender === 'user' ? 'Patient' : 'Assistant'}: ${msg.text}`)
        .join('\n\n');
        
      // Determine if we should ask another follow-up or make a recommendation
      if (chatContext.followUpCount < 3) {
        return `
You are a medical assistant helping users identify which doctor specialist they should consult based on their symptoms.
Here is the conversation so far:

${transcript}

Based on this conversation, ask ONE more follow-up question to better understand the patient's condition.
Keep your response brief and focused on a single question.
`;
      } else {
        // Final prompt to make a recommendation
        return `
You are a medical assistant helping users identify which doctor specialist they should consult based on their symptoms.
Here is the conversation so far:

${transcript}

Based on the patient's symptoms and responses, identify the most appropriate medical specialist from ONLY this list:
${specializations.join(', ')}

IMPORTANT: Select exactly ONE specialist from the list above.
Format your response as: "Based on your responses, you should consult: [Specialist Name]"
`;
      }
    }
    
    // Default prompt if none of the above conditions are met
    return `Continue the conversation with the patient based on their symptoms and provide a helpful response.`;
  };

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

    // If this is the first message, add it to symptoms
    if (messages.length <= 1) {
      setSymptoms([message]);
    }

    // Create updated messages array with the new user message
    const updatedMessages = [...messages, userMessage];
    
    // Get response from Gemini API
    const botResponse = await fetchGeminiResponse(updatedMessages);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleRedirectToDoctors = (specialist: string = "") => {
    // If we have a final specialist recommendation from the AI
    if (chatContext.finalSpecialist || specialist) {
      const recommendedSpecialist = specialist || chatContext.finalSpecialist;
      
      // Show patient info form instead of redirecting immediately
      setShowPatientInfoForm(true);
    } else {
      // Fallback if no specialist was determined
      toast.error("Could not determine an appropriate specialist. Please try again.");
    }
  };

  // New function to handle patient info form submission
  const handlePatientInfoSubmit = (values: PatientInfoValues) => {
    const recommendedSpecialist = chatContext.finalSpecialist || "";
    
    // Extract patient information
    const patientData = {
      symptoms,
      recommendedSpecialties: recommendedSpecialist ? [recommendedSpecialist] : specializations.slice(0, 1),
      mobileNumber,
      age: values.age,
      gender: values.gender,
      height: values.height,
      weight: values.weight
    };

    // Navigate to the doctors page with the recommendation
    navigate("/doctors", { 
      state: { patientData } 
    });
    toast.success("Information submitted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleUserMessage(inputValue);
    }
  };

  // If no mobile number, redirect to home
  if (!mobileNumber) {
    navigate("/");
    return null;
  }

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
        {!showPatientInfoForm ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Describe Your Symptoms</h1>
            
            <div className="mb-8 flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">1</div>
                <div className="border-t-2 border-primary w-16 mx-1"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">2</div>
                <div className="border-t-2 border-gray-300 w-16 mx-1"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">3</div>
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
                <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="flex justify-start items-center pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/")}
              >
                Back
              </Button>
            </div>

            {/* Add this debug button to the JSX, right before the Tips Section div */}
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDebugMode(!debugMode)}
                  className="text-xs"
                >
                  {debugMode ? "Hide Debug Info" : "Show Debug Info"}
                </Button>
                
                {debugMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Reload the page to reset the chat
                      window.location.reload();
                    }}
                    className="text-xs"
                  >
                    Reset Chat
                  </Button>
                )}
              </div>
              
              {debugMode && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                  <p>API Key configured: {GEMINI_API_KEY ? "Yes" : "No"}</p>
                  <p>API Key value: {GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 5)}...${GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 3)}` : "Not set"}</p>
                  <p>Follow-up count: {chatContext.followUpCount}</p>
                  <p>Conversation complete: {chatContext.conversationComplete ? "Yes" : "No"}</p>
                  <p>Final specialist: {chatContext.finalSpecialist || "None yet"}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Patient Information</h1>
            
            <div className="mb-8 flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                <div className="border-t-2 border-green-500 w-16 mx-1"></div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">2</div>
                <div className="border-t-2 border-gray-300 w-16 mx-1"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">3</div>
              </div>
            </div>
            
            {/* Symptom Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Your Symptoms</h2>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-3 py-1 text-base bg-blue-50"
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Specialist Recommendation */}
            {chatContext.finalSpecialist && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Recommended Specialist</h2>
                <p className="text-primary font-medium">{chatContext.finalSpecialist}</p>
              </div>
            )}
            
            {/* Patient Information Form */}
            <Form {...patientInfoForm}>
              <form onSubmit={patientInfoForm.handleSubmit(handlePatientInfoSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={patientInfoForm.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (years)<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your age"
                            type="number"
                            min="1"
                            max="120"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={patientInfoForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender<span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={patientInfoForm.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter height in cm"
                            type="number"
                            min="1"
                            max="300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={patientInfoForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter weight in kg"
                            type="number"
                            min="1"
                            max="500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPatientInfoForm(false)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                  >
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
            
            {/* Debug section */}
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDebugMode(!debugMode)}
                  className="text-xs"
                >
                  {debugMode ? "Hide Debug Info" : "Show Debug Info"}
                </Button>
                
                {debugMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Reload the page to reset the chat
                      window.location.reload();
                    }}
                    className="text-xs"
                  >
                    Reset Chat
                  </Button>
                )}
              </div>
              
              {debugMode && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                  <p>API Key configured: {GEMINI_API_KEY ? "Yes" : "No"}</p>
                  <p>API Key value: {GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 5)}...${GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 3)}` : "Not set"}</p>
                  <p>Follow-up count: {chatContext.followUpCount}</p>
                  <p>Conversation complete: {chatContext.conversationComplete ? "Yes" : "No"}</p>
                  <p>Final specialist: {chatContext.finalSpecialist || "None yet"}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
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