import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema
const doctorFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  specialization: z.string({
    required_error: "Please select a specialization.",
  }),
  experience: z.string({
    required_error: "Please enter your years of experience.",
  }),
  degree: z.string().min(2, {
    message: "Degree must be at least 2 characters.",
  }),
  institution: z.string().min(2, {
    message: "Institution name must be at least 2 characters.",
  }),
  graduationYear: z.string().regex(/^\d{4}$/, {
    message: "Please enter a valid graduation year (e.g., 2020).",
  }),
  bio: z.string().min(20, {
    message: "Bio must be at least 20 characters.",
  }),
  consultationTypes: z.array(z.string()).min(1, {
    message: "Please select at least one consultation type.",
  }),
  expertiseAreas: z.array(z.string()).min(1, {
    message: "Please select at least one area of expertise.",
  }),
  licenseNumber: z.string().min(4, {
    message: "License number must be at least 4 characters.",
  }),
  profilePhoto: z.any().optional(),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

// Available specializations
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

// Disease categories
const diseaseCategories = [
  { 
    id: "general_physician", 
    label: "General Physician / Family Medicine", 
    symptoms: ["Common colds", "fever", "fatigue", "minor infections", "headache"] 
  },
  { 
    id: "dermatologist", 
    label: "Dermatologist", 
    symptoms: ["Acne", "rashes", "skin infections", "hair loss", "fungal issues"] 
  },
  { 
    id: "pediatrician", 
    label: "Pediatrician", 
    symptoms: ["Child-specific issues", "cough", "growth", "infections in kids"] 
  },
  { 
    id: "gynecologist", 
    label: "Gynecologist", 
    symptoms: ["Menstrual issues", "pregnancy", "PCOS", "fertility"] 
  },
  { 
    id: "psychiatrist", 
    label: "Psychiatrist / Psychologist", 
    symptoms: ["Anxiety", "depression", "sleep problems", "behavioral concerns"] 
  },
  { 
    id: "ent", 
    label: "ENT Specialist", 
    symptoms: ["Earache", "sore throat", "sinus", "dizziness"] 
  },
  { 
    id: "cardiologist", 
    label: "Cardiologist", 
    symptoms: ["Chest pain", "palpitations", "high BP", "heart health"] 
  },
  { 
    id: "gastroenterologist", 
    label: "Gastroenterologist", 
    symptoms: ["Indigestion", "stomach pain", "acid reflux", "IBS"] 
  },
  { 
    id: "orthopedic", 
    label: "Orthopedic", 
    symptoms: ["Joint pain", "back pain", "fractures", "arthritis"] 
  },
  { 
    id: "neurologist", 
    label: "Neurologist", 
    symptoms: ["Seizures", "migraines", "numbness", "memory issues"] 
  },
  { 
    id: "pulmonologist", 
    label: "Pulmonologist", 
    symptoms: ["Breathlessness", "cough", "asthma", "post-COVID care"] 
  },
  { 
    id: "urologist", 
    label: "Urologist", 
    symptoms: ["Urination issues", "UTIs", "kidney pain", "male fertility"] 
  },
  { 
    id: "endocrinologist", 
    label: "Endocrinologist", 
    symptoms: ["Diabetes", "thyroid issues", "hormonal disorders"] 
  },
  { 
    id: "ophthalmologist", 
    label: "Ophthalmologist", 
    symptoms: ["Eye strain", "blurry vision", "infections", "injury"] 
  },
  { 
    id: "dentist", 
    label: "Dentist", 
    symptoms: ["Toothache", "gum swelling", "cavity", "braces"] 
  }
];

// Consultation types
const consultationTypes = [
  { id: "video", label: "Video Call" },
  { id: "audio", label: "Audio Call" },
  { id: "chat", label: "Chat/Messaging" },
  { id: "inperson", label: "In-person Visit" },
  { id: "whatsapp", label: "WhatsApp Consultation" },
];

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      degree: "",
      institution: "",
      graduationYear: "",
      bio: "",
      consultationTypes: [],
      expertiseAreas: [],
      licenseNumber: "",
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      // In a real app, you would upload this file to your server or cloud storage
    }
  };

  const onSubmit = async (data: DoctorFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to register doctor
      console.log("Doctor registration data:", data);
      console.log("Photo:", selectedPhoto);
      
      // In a real app, you would send this data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Registration submitted successfully! We'll review your application and get back to you.");
      
      // Redirect to a confirmation page
      navigate("/");
    } catch (error) {
      toast.error("Failed to submit registration. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <a href="/" className="text-primary font-bold text-2xl">MediConsult</a>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Doctor Registration</h1>
          
          <div className="mb-8 text-center">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our network of qualified medical professionals to provide consultations 
              to patients seeking medical advice. Please complete the form below to get started.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="doctor@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234 567 8900" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your specialization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {specializations.map((specialization) => (
                              <SelectItem key={specialization} value={specialization}>
                                {specialization}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="ML12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Profile Photo */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100">
                    {selectedPhoto ? (
                      <img 
                        src={selectedPhoto} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No photo</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="profilePhoto" className="mb-2 block">Upload your professional photo</Label>
                    <Input 
                      id="profilePhoto" 
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Please upload a professional-looking photo. This will be visible to patients.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Educational Qualifications */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Educational Qualifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Degree</FormLabel>
                        <FormControl>
                          <Input placeholder="MBBS, MD, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input placeholder="University or Medical School" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of Graduation</FormLabel>
                        <FormControl>
                          <Input placeholder="2010" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Expertise Areas */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Areas of Expertise</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Select all disease categories you specialize in. This helps us match you with patients who have symptoms related to these conditions.
                </p>
                
                <FormField
                  control={form.control}
                  name="expertiseAreas"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {diseaseCategories.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="expertiseAreas"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={category.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(category.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, category.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== category.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-normal">
                                      {category.label}
                                    </FormLabel>
                                    <FormDescription>
                                      {category.symptoms.join(", ")}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Consultation Types */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Consultation Types</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Select all the consultation types you are willing to provide.
                </p>
                
                <FormField
                  control={form.control}
                  name="consultationTypes"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {consultationTypes.map((type) => (
                          <FormField
                            key={type.id}
                            control={form.control}
                            name="consultationTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={type.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(type.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, type.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== type.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-normal">
                                      {type.label}
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Professional Bio */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Professional Bio</h2>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief Description of Your Practice</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell patients about your practice, approach, and experience..." 
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default DoctorRegistration;
