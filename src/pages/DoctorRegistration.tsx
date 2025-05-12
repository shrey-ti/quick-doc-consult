import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const specialties = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "ENT Specialist",
  "Ophthalmologist",
  "Psychiatrist",
  "Gynecologist"
];

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    specialty: "",
    experience: "",
    qualification: "",
    registrationNumber: "",
    clinicAddress: "",
    consultationFee: "",
    about: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.mobileNumber.match(/^[0-9]{10}$/)) {
      toast.error("Please enter a valid 10-digit mobile number");
      setIsLoading(false);
      return;
    }

    // Store doctor data in localStorage
    const doctors = JSON.parse(localStorage.getItem("mediconsult_doctors") || "{}");
    doctors[formData.mobileNumber] = {
      ...formData,
      id: Date.now().toString(),
      isVerified: false,
      rating: 0,
      totalConsultations: 0,
      availableSlots: generateMockSlots()
    };
    localStorage.setItem("mediconsult_doctors", JSON.stringify(doctors));

    // Store current doctor's mobile number
    localStorage.setItem("mediconsult_doctor_mobile", formData.mobileNumber);

    toast.success("Registration successful! Please wait for verification.");
    navigate("/doctor-profile");
  };

  const generateMockSlots = () => {
    const slots = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      slots.push({
        date: date.toISOString().split('T')[0],
        times: [
          { time: "09:00 AM", isAvailable: true },
          { time: "10:00 AM", isAvailable: true },
          { time: "11:00 AM", isAvailable: true },
          { time: "02:00 PM", isAvailable: true },
          { time: "03:00 PM", isAvailable: true },
          { time: "04:00 PM", isAvailable: true }
        ]
      });
    }
    return slots;
  };

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
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Doctor Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select
                    required
                    value={formData.specialty}
                    onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    required
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Medical Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    required
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicAddress">Clinic Address</Label>
                <Textarea
                  id="clinicAddress"
                  required
                  value={formData.clinicAddress}
                  onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  required
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DoctorRegistration;
