# MediConsult: Quick Medical Consultations Without Login

MediConsult is a web application designed to provide quick digital medical consultations without requiring users to create an account or log in. This application enables patients to describe their symptoms through a chat-like interface, receive doctor recommendations based on their symptoms, and book consultations with appropriate medical professionals.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Patient Experience](#patient-experience)
  - [Doctor Experience](#doctor-experience)
- [Technical Implementation](#technical-implementation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)

## Overview

MediConsult streamlines the process of seeking medical advice by eliminating the need for account creation. Users can access healthcare services by simply providing their mobile number, describing their symptoms, and selecting a consultation method that works best for them.

The application uses a symptom classification system to match patients with appropriate specialists and provides flexible consultation options including video calls, audio calls, WhatsApp, and in-person visits.

## Features

### Patient Experience

#### 1. No-Login Required
- Users can access the system by just providing their mobile number
- Session-based identification for tracking consultations
- Mobile number serves as the primary identifier

#### 2. Symptom Description via Chat Interface
- Interactive chat-like interface to describe health concerns
- Pre-defined suggested prompts for common symptoms
- Natural conversation flow to understand symptoms

#### 3. Symptom Classification
- AI-powered symptom analysis (currently mock data for prototype)
- Follow-up questions based on initial symptoms
- Classification of symptoms into medical specialties

#### 4. Doctor Recommendations
- Matching algorithm to suggest appropriate specialists
- Filters for availability and consultation types
- Doctor profiles with ratings, experience, and specializations

#### 5. Flexible Consultation Booking
- Multiple consultation types:
  - Video calls
  - Audio calls
  - Chat/messaging
  - In-person visits
  - WhatsApp consultations
- Calendar integration for scheduling
- Available time slot selection

#### 6. Consultation History
- View past consultations
- Access previous prescriptions and medical advice
- Track upcoming appointments
- All tied to the mobile number for easy retrieval

#### 7. Confirmation System
- Booking confirmations with details
- Consultation instructions based on type
- Session IDs for future reference
- Email confirmation option

### Doctor Experience

#### 1. Doctor Registration
- Comprehensive registration form
- Professional details capture:
  - Personal information
  - Specializations
  - Experience
  - Qualifications
  - Areas of expertise
  - Consultation types offered
- Profile photo upload

#### 2. Doctor Dashboard
- View upcoming consultations
- Manage schedule and availability
- Patient information access
- Consultation history

#### 3. Doctor-Patient Communication
- Dedicated chat interface for each patient
- Ability to provide consultations through chosen medium
- Prescription creation capabilities

## Technical Implementation

The application is built using modern web technologies:

- **Frontend**: React with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Routing**: React Router for navigation
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Local React state with localStorage persistence
- **Notifications**: Toast notifications using Sonner

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── ui/             # Base UI components from shadcn/ui
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── pages/              # Application pages
│   ├── Index.tsx                # Landing page
│   ├── Symptoms.tsx             # Symptom input and classification
│   ├── Doctors.tsx              # Doctor recommendations
│   ├── Booking.tsx              # Consultation booking
│   ├── Confirmation.tsx         # Booking confirmation
│   ├── ConsultationHistory.tsx  # Past consultations view
│   ├── DoctorLogin.tsx          # Doctor login
│   ├── DoctorRegistration.tsx   # Doctor registration
│   ├── DoctorDashboard.tsx      # Doctor dashboard
│   ├── DoctorChat.tsx           # Doctor-patient chat
│   ├── DoctorProfile.tsx        # Doctor profile management
│   └── PatientInfo.tsx          # Patient information collection
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component with routing
```

## Database Schema

The application is designed to work with the following database schema:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  specialization VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation types enum
CREATE TYPE consultation_type AS ENUM ('audio', 'video', 'chat', 'in_person');

-- Consultations table
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  consultation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type consultation_type NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescriptions table
CREATE TABLE prescriptions (
  id SERIAL PRIMARY KEY,
  consultation_id INTEGER REFERENCES consultations(id) ON DELETE CASCADE,
  medicine TEXT,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
cd quick-doc-consult
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

## Development

The application currently uses mock data for demonstration purposes. In a production environment, you would:

1. Connect to a real database (PostgreSQL recommended)
2. Implement proper authentication and security
3. Add actual AI for symptom analysis
4. Develop a proper backend API
5. Implement video/audio call functionality

## Deployment

For deployment to production, build the application using:

```
npm run build
```

This will create optimized production files in the `dist` directory, which can be served from any static file server or deployed to platforms like Vercel, Netlify, or AWS S3.
