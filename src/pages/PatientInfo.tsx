
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

interface LocationState {
  symptoms: string[];
}

const formSchema = z.object({
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) < 120, {
    message: "Please enter a valid age between 1 and 120",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  weight: z.string().optional(),
  height: z.string().optional(),
  previousConditions: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PatientInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { symptoms } = (location.state as LocationState) || { symptoms: [] };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      gender: undefined,
      weight: "",
      height: "",
      previousConditions: "",
      medications: "",
      allergies: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Convert form values to the format needed for the next page
    const patientData = {
      ...values,
      symptoms,
    };
    
    navigate("/doctors", { state: { patientData } });
    toast.success("Information submitted successfully");
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
          <h1 className="text-2xl font-bold mb-6 text-center">Your Information</h1>
          
          <div className="mb-8 flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
              <div className="border-t-2 border-primary w-12"></div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">2</div>
              <div className="border-t-2 border-gray-300 w-12"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">3</div>
              <div className="border-t-2 border-gray-300 w-12"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">4</div>
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
          
          {/* Patient Information Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age<span className="text-red-500">*</span></FormLabel>
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
                  control={form.control}
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
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Optional"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Optional"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Medical History <span className="text-gray-500 text-sm font-normal">(Optional)</span></h3>
                
                <FormField
                  control={form.control}
                  name="previousConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pre-existing medical conditions</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="E.g. diabetes, hypertension, asthma..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current medications</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Any medications you're currently taking"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Any allergies you have"
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
                  onClick={() => navigate("/symptoms", { state: { initialSymptom: symptoms[0] } })}
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
        </div>
        
        {/* Privacy Information */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3">Your privacy matters</h3>
          <p className="text-gray-700 mb-4">
            We don't store your personal information permanently. Your details are only used to match 
            you with the most suitable doctor and will be deleted after your consultation.
          </p>
          <p className="text-gray-700">
            No account or login required. We use anonymous session IDs to keep track of your consultations.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PatientInfo;
