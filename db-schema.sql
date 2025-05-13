-- Database Schema for MediConsult's Doctor Selection and Booking Journey

-- Patients table (simple, only mobile number required)
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  mobile_number VARCHAR(15) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Specializations lookup table
CREATE TABLE specializations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Doctors table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization_id INTEGER REFERENCES specializations(id),
  photo_url TEXT,
  experience_years INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  consultation_count INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  available_for_booking BOOLEAN NOT NULL DEFAULT true,
  about TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation types lookup table
CREATE TYPE consultation_type AS ENUM ('video', 'audio', 'chat', 'in_person', 'whatsapp');

-- Map which doctors offer which consultation types
CREATE TABLE doctor_consultation_types (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  consultation_type consultation_type NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  UNIQUE(doctor_id, consultation_type)
);

-- Doctor expertise areas
CREATE TABLE doctor_expertise (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  expertise VARCHAR(100) NOT NULL,
  UNIQUE(doctor_id, expertise)
);

-- Doctor availability schedule
CREATE TABLE doctor_availability (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  CHECK (start_time < end_time)
);

-- Time slots table (pre-generated time slots)
CREATE TABLE time_slots (
  id SERIAL PRIMARY KEY,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE(start_time, end_time)
);

-- Bookings/Consultations table
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  time_slot_id INTEGER REFERENCES time_slots(id),
  consultation_type consultation_type NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
  symptoms TEXT,
  diagnosis TEXT,
  booking_reference VARCHAR(20) UNIQUE NOT NULL,
  session_id VARCHAR(50) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctor unavailability (for specific dates)
CREATE TABLE doctor_unavailable_dates (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  unavailable_date DATE NOT NULL,
  reason TEXT,
  UNIQUE(doctor_id, unavailable_date)
);

-- Booked time slots (to prevent double booking)
CREATE TABLE booked_slots (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  time_slot_id INTEGER REFERENCES time_slots(id),
  consultation_id INTEGER REFERENCES consultations(id) ON DELETE CASCADE,
  UNIQUE(doctor_id, booking_date, time_slot_id)
);

-- Prescriptions linked to consultations
CREATE TABLE prescriptions (
  id SERIAL PRIMARY KEY,
  consultation_id INTEGER REFERENCES consultations(id) ON DELETE CASCADE,
  prescribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Medicines in prescriptions
CREATE TABLE prescription_medicines (
  id SERIAL PRIMARY KEY,
  prescription_id INTEGER REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50),
  frequency VARCHAR(100),
  duration VARCHAR(50),
  notes TEXT
);

-- Seed basic time slots
INSERT INTO time_slots (start_time, end_time) VALUES 
('09:00:00', '09:30:00'),
('09:30:00', '10:00:00'),
('10:00:00', '10:30:00'),
('10:30:00', '11:00:00'),
('11:00:00', '11:30:00'),
('11:30:00', '12:00:00'),
('12:00:00', '12:30:00'),
('12:30:00', '13:00:00'),
('13:00:00', '13:30:00'),
('13:30:00', '14:00:00'),
('14:00:00', '14:30:00'),
('14:30:00', '15:00:00'),
('15:00:00', '15:30:00'),
('15:30:00', '16:00:00'),
('16:00:00', '16:30:00'),
('16:30:00', '17:00:00'),
('17:00:00', '17:30:00'),
('17:30:00', '18:00:00');

-- Indices for performance
CREATE INDEX idx_doctor_specialization ON doctors(specialization_id);
CREATE INDEX idx_doctor_rating ON doctors(rating);
CREATE INDEX idx_consultations_date ON consultations(booking_date);
CREATE INDEX idx_consultations_patient ON consultations(patient_id);
CREATE INDEX idx_consultations_doctor ON consultations(doctor_id);
CREATE INDEX idx_booked_slots_doctor_date ON booked_slots(doctor_id, booking_date); 