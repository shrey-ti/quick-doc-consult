import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const DoctorLogin = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored doctors from localStorage
    const storedDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    console.log("Stored doctors:", storedDoctors); // Debug log
    
    // Check if mobile number exists in stored doctors
    const doctorExists = storedDoctors.some((doc: any) => {
      console.log("Comparing:", doc.phone, mobileNumber); // Debug log
      return doc.phone === mobileNumber;
    });

    if (doctorExists) {
      // Store the logged in doctor's mobile
      localStorage.setItem("currentDoctor", mobileNumber);
      toast.success("Login successful!");
      navigate("/doctor/dashboard");
    } else {
      // Redirect to registration if doctor doesn't exist
      toast.info("No account found. Please register first.");
      navigate("/doctor-registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Doctor Login</CardTitle>
          <CardDescription className="text-center">
            Enter your mobile number to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                pattern="[0-9]{10}"
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorLogin; 