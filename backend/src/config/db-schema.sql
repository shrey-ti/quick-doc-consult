-- Simplified Database Schema for MediConsult's Doctor Selection and Booking Journey (First Prototype)

-- Patients table with phone number as primary key
CREATE TABLE patients (
  mobile_number VARCHAR(15) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctor categories (specializations)
CREATE TABLE doctor_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Doctors table with phone number as primary key
CREATE TABLE doctors (
  phone_number VARCHAR(15) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id INTEGER REFERENCES doctor_categories(id),
  photo_url TEXT,
  experience_years INTEGER NOT NULL DEFAULT 0,
  consultation_count INTEGER NOT NULL DEFAULT 0,
  about TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
);

-- Consultation types as enum
CREATE TYPE consultation_type AS ENUM ('video', 'audio', 'chat', 'in_person', 'whatsapp');

-- Map which doctors offer which consultation types
CREATE TABLE doctor_consultation_types (
  id SERIAL PRIMARY KEY,
  doctor_phone VARCHAR(15) REFERENCES doctors(phone_number) ON DELETE CASCADE,
  consultation_type consultation_type NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  UNIQUE(doctor_phone, consultation_type)
);

-- Bookings/Consultations table
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  patient_mobile VARCHAR(15) REFERENCES patients(mobile_number) ON DELETE SET NULL,
  doctor_phone VARCHAR(15) REFERENCES doctors(phone_number) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  consultation_type consultation_type NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- scheduled, completed, cancelled
  symptoms TEXT,
  booking_reference VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple prescriptions table
CREATE TABLE prescriptions (
  id SERIAL PRIMARY KEY,
  consultation_id INTEGER REFERENCES consultations(id) ON DELETE CASCADE,
  medicine TEXT,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX idx_doctor_category ON doctors(category_id);
CREATE INDEX idx_consultations_date ON consultations(booking_date);
CREATE INDEX idx_consultations_patient ON consultations(patient_mobile);
CREATE INDEX idx_consultations_doctor ON consultations(doctor_phone); 