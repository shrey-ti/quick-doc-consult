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

// Define the form schema based on the database schema
const doctorFormSchema = z.object({
  phone_number: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category_id: z.number({
    required_error: "Please select a specialization.",
  }),
  photo_url: z.any().optional(),
  experience_years: z.string().transform((val) => parseInt(val, 10)),
  about: z.string().min(20, {
    message: "About section must be at least 20 characters.",
  }),
  consultation_types: z.array(z.object({
    type: z.enum(['video', 'audio', 'chat', 'in_person', 'whatsapp']),
    price: z.string().transform((val) => parseFloat(val)),
    selected: z.boolean()
  })),
  // Additional fields that might not be in schema but are useful for UI
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional(),
  degree: z.string().min(2, {
    message: "Degree must be at least 2 characters.",
  }).optional(),
  institution: z.string().min(2, {
    message: "Institution name must be at least 2 characters.",
  }).optional(),
  graduationYear: z.string().regex(/^\d{4}$/, {
    message: "Please enter a valid graduation year (e.g., 2020).",
  }).optional(),
  licenseNumber: z.string().min(4, {
    message: "License number must be at least 4 characters.",
  }).optional(),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

// Doctor categories mapping to match category_id in the database
const doctorCategories = [
  { id: 1, label: "General Physician / Family Medicine" },
  { id: 2, label: "Dermatologist" },
  { id: 3, label: "Pediatrician" },
  { id: 4, label: "Gynecologist" },
  { id: 5, label: "Psychiatrist / Psychologist" },
  { id: 6, label: "ENT Specialist" },
  { id: 7, label: "Cardiologist" },
  { id: 8, label: "Gastroenterologist" },
  { id: 9, label: "Orthopedic" },
  { id: 10, label: "Neurologist" },
  { id: 11, label: "Pulmonologist" },
  { id: 12, label: "Urologist" },
  { id: 13, label: "Endocrinologist" },
  { id: 14, label: "Ophthalmologist" },
  { id: 15, label: "Dentist" }
];

// Consultation types as per enum in database schema
const consultationTypes = [
  { id: "video", label: "Video Call", value: "video" },
  { id: "audio", label: "Audio Call", value: "audio" },
  { id: "chat", label: "Chat/Messaging", value: "chat" },
  { id: "in_person", label: "In-person Visit", value: "in_person" },
  { id: "whatsapp", label: "WhatsApp Consultation", value: "whatsapp" },
];

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      category_id: undefined,
      experience_years: "",
      about: "",
      email: "",
      degree: "",
      institution: "",
      graduationYear: "",
      licenseNumber: "",
      consultation_types: consultationTypes.map(type => ({
        type: type.value as any,
        price: "500",
        selected: false
      }))
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
      // Prepare data according to the database schema
      const doctorData = {
        phone_number: data.phone_number,
        name: data.name,
        category_id: data.category_id,
        photo_url: selectedPhoto,
        experience_years: data.experience_years,
        consultation_count: 0, // Default for new doctors
        about: data.about,
        created_at: new Date().toISOString(),
        // Additional fields for UI display
        email: data.email,
        degree: data.degree,
        institution: data.institution,
        graduationYear: data.graduationYear,
        licenseNumber: data.licenseNumber,
      };
      
      // Filter selected consultation types and format them for the database
      const selectedConsultationTypes = data.consultation_types
        .filter(type => type.selected)
        .map(type => ({
          doctor_phone: data.phone_number,
          consultation_type: type.type,
          price: type.price
        }));
      
      // For development/demo purposes, store in localStorage
      // In production, this would be a backend API call
      const existingDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
      const newDoctor = {
        ...doctorData,
        consultation_types: selectedConsultationTypes
      };
      const updatedDoctors = [...existingDoctors, newDoctor];
      localStorage.setItem("doctors", JSON.stringify(updatedDoctors));
      
      // Store current doctor's phone number for immediate login
      localStorage.setItem("currentDoctor", data.phone_number);
      console.log("Doctor registered successfully:", newDoctor);
      
      toast.success("Registration successful! Redirecting to dashboard...");
      
      // Redirect to dashboard
      navigate("/doctor/dashboard");
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
                    name="name"
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
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+919876543210" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be used as your login identifier
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your specialization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {doctorCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.label}
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
                    name="experience_years"
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
                    <Label htmlFor="photo_url" className="mb-2 block">Upload your professional photo</Label>
                    <Input 
                      id="photo_url" 
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
              
              {/* Consultation Types */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Consultation Types & Pricing</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Select the consultation types you offer and set their prices.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultationTypes.map((type, index) => (
                    <div key={type.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start mb-3">
                        <Checkbox
                          id={`type-${type.id}`}
                          className="mt-1"
                          checked={form.watch(`consultation_types.${index}.selected`)}
                          onCheckedChange={(checked) => {
                            form.setValue(`consultation_types.${index}.selected`, checked === true);
                          }}
                        />
                        <div className="ml-3">
                          <Label htmlFor={`type-${type.id}`} className="font-medium text-base">
                            {type.label}
                          </Label>
                          <input
                            type="hidden"
                            {...form.register(`consultation_types.${index}.type`)}
                            value={type.value}
                          />
                        </div>
                      </div>
                      
                      {form.watch(`consultation_types.${index}.selected`) && (
                        <div className="mt-2 pl-7">
                          <Label htmlFor={`price-${type.id}`} className="block text-sm mb-1">
                            Consultation Fee ($)
                          </Label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <Input
                              id={`price-${type.id}`}
                              type="number"
                              placeholder="50"
                              className="pl-8"
                              {...form.register(`consultation_types.${index}.price`)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="consultation_types"
                  render={() => (
                    <FormItem>
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
                  name="about"
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