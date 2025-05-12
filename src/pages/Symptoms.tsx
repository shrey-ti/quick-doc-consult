
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

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
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [suggestedSymptoms, setSuggestedSymptoms] = useState<string[]>([]);

  // Common symptoms database for suggestions
  const symptomDatabase = [
    "Headache", "Fever", "Cough", "Sore Throat", "Runny Nose",
    "Fatigue", "Nausea", "Dizziness", "Back Pain", "Chest Pain", 
    "Shortness of Breath", "Joint Pain", "Muscle Ache", "Rash",
    "Abdominal Pain", "Diarrhea", "Loss of Appetite", "Insomnia"
  ];

  // Add initial symptom if provided
  useEffect(() => {
    if (initialSymptom && !symptoms.includes(initialSymptom)) {
      setSymptoms([initialSymptom]);
      toast.success(`Added symptom: ${initialSymptom}`);
    }
  }, [initialSymptom]);

  // Update suggestions based on input
  useEffect(() => {
    if (inputValue.length > 1) {
      const filtered = symptomDatabase.filter(
        symptom => 
          symptom.toLowerCase().includes(inputValue.toLowerCase()) && 
          !symptoms.includes(symptom)
      );
      setSuggestedSymptoms(filtered.slice(0, 5));
    } else {
      setSuggestedSymptoms([]);
    }
  }, [inputValue, symptoms]);

  const addSymptom = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
      setInputValue("");
      toast.success(`Added symptom: ${symptom}`);
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      addSymptom(inputValue);
    } else if (symptoms.length > 0) {
      navigate("/patient-info", { state: { symptoms } });
    } else {
      toast.error("Please add at least one symptom");
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
          
          <div className="space-y-6">
            {/* Common symptoms suggestions displayed prominently */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3 text-gray-700">Common symptoms:</h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableCommonSymptoms().map((symptom, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="px-3 py-1.5 text-base cursor-pointer hover:bg-primary hover:text-white transition-colors"
                    onClick={() => addSymptom(symptom)}
                  >
                    + {symptom}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Symptoms entry */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {symptoms.map((symptom, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-3 py-1 text-base bg-blue-50 hover:bg-blue-100"
                  >
                    {symptom}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-800"
                      onClick={() => removeSymptom(symptom)}
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Type your symptoms..."
                    className="w-full p-4 text-lg focus-visible:ring-primary"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  {inputValue && (
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setInputValue("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {/* Suggested symptoms */}
                {suggestedSymptoms.length > 0 && (
                  <div className="bg-white shadow-lg rounded-lg border p-3 space-y-2">
                    <p className="text-sm text-gray-500">Suggested symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSymptoms.map((suggestion, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                          onClick={() => addSymptom(suggestion)}
                        >
                          + {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={symptoms.length === 0 && !inputValue}
                  >
                    {inputValue ? "Add Symptom" : "Continue"}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Chat Assistance */}
            <Card className="mt-8 border-dashed border-2 border-gray-200">
              <CardContent className="p-6 flex items-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Need help describing your symptoms?</h3>
                  <p className="text-gray-600">Our virtual assistant can help you identify and describe your symptoms.</p>
                </div>
                <Button variant="outline" className="ml-auto whitespace-nowrap">Start Chat</Button>
              </CardContent>
            </Card>
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
