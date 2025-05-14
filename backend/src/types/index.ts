export interface AnonymousPatient {
  full_name: string;
  phone_number: string;
  email?: string;
  symptoms: string;
}

export interface UserRequest {
  phone_number: string;
  user_type: 'doctor' | 'patient';
}

export interface UserResponse {
  phone_number: string;
  user_type: 'doctor' | 'patient';
  created_at: string;
  exists: boolean;
  // Doctor specific fields
  name?: string;
  category_id?: number | null;
  photo_url?: string;
  experience_years?: number;
  rating?: number;
  consultation_count?: number;
  price?: number;
  about?: string;
}

export interface AppointmentRequest {
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  consultation_type: 'video' | 'audio' | 'chat' | 'in_person';
  symptoms: string;
  patient?: {
    full_name: string;
    phone_number: string;
    email?: string;
  };
}

export interface DoctorAvailability {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Doctor {
  id: string;
  specialization: string;
  full_name: string;
  years_of_experience: number;
  consultation_fee: number;
  is_available: boolean;
  bio?: string;
  education?: any;
  languages?: string[];
  availability?: DoctorAvailability[];
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id?: string;
  anonymous_patient_id?: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  consultation_type: 'video' | 'audio' | 'chat' | 'in_person';
  symptoms: string;
  notes?: string;
} 