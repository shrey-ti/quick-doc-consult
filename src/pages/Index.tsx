import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, Video, Phone, Calendar, Send, History, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Index = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  
  // Check if user is logged in
  const isPatientLoggedIn = localStorage.getItem("mediconsult_mobile");
  const isDoctorLoggedIn = localStorage.getItem("currentDoctor");
  
  const handleLogout = () => {
    // Clear both patient and doctor logins
    localStorage.removeItem("mediconsult_mobile");
    localStorage.removeItem("currentDoctor");
    toast.success("Logged out successfully");
    // Refresh current page
    window.location.reload();
  };

  const handleSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Check if mobile number exists in localStorage
      const savedMobile = localStorage.getItem("mediconsult_mobile");
      if (!savedMobile) {
        setShowMobileModal(true);
        return;
      }
      navigate("/symptoms", { 
        state: { 
          initialSymptom: searchInput,
          mobileNumber: savedMobile 
        } 
      });
    }
  };

  const handleSuggestedSymptom = (symptom: string) => {
    // Check if mobile number exists in localStorage
    const savedMobile = localStorage.getItem("mediconsult_mobile");
    if (!savedMobile) {
      setShowMobileModal(true);
      return;
    }
    navigate("/symptoms", { 
      state: { 
        initialSymptom: symptom,
        mobileNumber: savedMobile 
      } 
    });
  };

  const suggestedPrompts = [
    "I have a severe headache that started this morning",
    "I'm experiencing fever and body ache",
    "I have a persistent cough with sore throat",
    "I'm having back pain for the last few days",
    "I feel dizzy and nauseous"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    
    // Store mobile number in localStorage
    localStorage.setItem("mediconsult_mobile", mobileNumber);
    
    // Navigate to symptoms page
    navigate("/symptoms", { 
      state: { mobileNumber }
    });
  };

  const handleViewHistory = () => {
    const savedMobile = localStorage.getItem("mediconsult_mobile");
    if (savedMobile) {
      navigate("/consultation-history", { 
        state: { mobileNumber: savedMobile }
      });
    } else {
      setShowMobileModal(true);
    }
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    // Store mobile number in localStorage
    localStorage.setItem("mediconsult_mobile", mobileNumber);
    setShowMobileModal(false);
    
    // If there's a pending symptom, navigate to symptoms page
    if (searchInput.trim()) {
      navigate("/symptoms", { 
        state: { 
          initialSymptom: searchInput,
          mobileNumber 
        } 
      });
    } else {
      // Otherwise navigate to history page
      navigate("/consultation-history", { 
        state: { mobileNumber }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center">
            <div className="text-primary font-bold text-2xl">MediConsult</div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How it works</a>
            <a href="#services" className="text-gray-600 hover:text-primary transition-colors">Services</a>
            <a href="#doctors" className="text-gray-600 hover:text-primary transition-colors">Doctors</a>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button className="md:hidden" variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
            
            {isPatientLoggedIn || isDoctorLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={handleViewHistory}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  View History
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 md:bg-primary md:text-white md:hover:bg-primary/90"
              >
                <User className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Number Modal */}
      <Dialog open={showMobileModal} onOpenChange={setShowMobileModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Mobile Number</DialogTitle>
            <DialogDescription>
              Please enter your mobile number to view your consultation history.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMobileSubmit} className="space-y-4">
            <div>
              <Input
                type="tel"
                placeholder="10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full"
                maxLength={10}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll use this to retrieve your consultation history
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMobileModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                View History
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow px-4 py-12 md:py-20 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Quick Medical Consultations <span className="text-primary">Without Login</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Describe your symptoms and get matched with the right doctor in minutes. No registration required.
          </p>

          {/* Chat-like Interface */}
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">Hello! I'm here to help you get medical advice. How can I assist you today?</p>
                </div>
              </div>
              
              <form onSubmit={handleSymptomSubmit} className="relative">
                <Input
                  type="text"
                  placeholder="Describe your symptoms or health concern..."
                  className="w-full py-4 px-4 text-lg rounded-xl shadow-sm border-gray-200 focus-visible:ring-2 focus-visible:ring-primary"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg h-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Suggested Prompts */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-2">Try saying:</p>
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedSymptom(prompt)}
                  className="w-full text-left p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:bg-gray-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="p-6 bg-white rounded-xl shadow-sm card-hover">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Chat</h3>
              <p className="text-gray-600 text-sm">Natural conversation to understand your symptoms</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm card-hover">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">Get matched with the right specialist</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm card-hover">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Flexible Consultations</h3>
              <p className="text-gray-600 text-sm">Video, audio, chat or in-person</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm card-hover">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quick Response</h3>
              <p className="text-gray-600 text-sm">Connect with doctors in minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">1</div>
              <h3 className="text-xl font-semibold mb-2">Describe Your Symptoms</h3>
              <p className="text-gray-600">Tell us what's bothering you in your own words. Our system will understand and guide you.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">2</div>
              <h3 className="text-xl font-semibold mb-2">Match with Specialists</h3>
              <p className="text-gray-600">We'll recommend the right doctors based on your symptoms and medical needs.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">3</div>
              <h3 className="text-xl font-semibold mb-2">Consult Your Way</h3>
              <p className="text-gray-600">Choose how you want to connect - video, audio, WhatsApp, or schedule an in-person visit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Preview */}
      <section id="doctors" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Specialists</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Connect with licensed medical professionals specialized in various fields
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Dr. Emily Johnson", specialty: "General Physician", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
              { name: "Dr. Michael Chen", specialty: "Cardiologist", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
              { name: "Dr. Sarah Williams", specialty: "Dermatologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
              { name: "Dr. Robert Taylor", specialty: "Pediatrician", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
            ].map((doctor, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover">
                <div className="h-48 overflow-hidden">
                  <img
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    src={doctor.image}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg">{doctor.name}</h3>
                  <p className="text-primary">{doctor.specialty}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-2">(120+ consultations)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button className="px-8" onClick={() => navigate("/symptoms")}>
              Find Specialists Now
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-100 rounded-xl p-6 shadow-sm card-hover">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Consultations</h3>
              <p className="text-gray-600">Face-to-face interaction with your doctor from the comfort of your home.</p>
            </div>
            
            <div className="border border-gray-100 rounded-xl p-6 shadow-sm card-hover">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Audio Calls</h3>
              <p className="text-gray-600">Quick and convenient voice consultations with specialist doctors.</p>
            </div>
            
            <div className="border border-gray-100 rounded-xl p-6 shadow-sm card-hover">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat Consultations</h3>
              <p className="text-gray-600">Text-based consultations for non-urgent medical advice and follow-ups.</p>
            </div>
            
            <div className="border border-gray-100 rounded-xl p-6 shadow-sm card-hover">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">In-Person Bookings</h3>
              <p className="text-gray-600">Schedule face-to-face appointments at clinic locations near you.</p>
            </div>
            
            <div className="border border-gray-100 rounded-xl p-6 shadow-sm card-hover">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">E-Prescriptions</h3>
              <p className="text-gray-600">Get digital prescriptions sent directly to your preferred pharmacy.</p>
            </div>
            
            <div className="border border-gray-100 rounded-xl p-6 shadow-sm card-hover">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Follow-up Care</h3>
              <p className="text-gray-600">Schedule follow-up consultations with the same doctor for continuity of care.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MediConsult</h3>
              <p className="text-gray-400">Quick medical consultations without the hassle of registration.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Video Consultations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Audio Calls</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chat Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">In-Person Visits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Doctors</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 MediConsult. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
