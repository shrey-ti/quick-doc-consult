# AI Chat Integration Update

## Overview
The patient chat feature has been upgraded to use Google's Gemini API for intelligent symptom analysis and doctor recommendations. The system now provides dynamic, AI-powered responses instead of hardcoded conversations.

## Key Changes
1. Replaced hardcoded conversation flows with dynamic AI responses via Gemini API
2. Implemented a progressive chat flow that:
   - Analyzes initial symptom input
   - Asks 2-4 relevant follow-up questions
   - Recommends a single appropriate medical specialist
3. Added environment variable support for securely storing the API key
4. Implemented retry logic to ensure API reliability

## Setup Instructions

### 1. Get a Google Gemini API Key
1. Visit the [Google AI Studio](https://ai.google.dev/) and sign up/log in
2. Create a new API key from the API Keys section
3. Copy your API key

### 2. Configure Environment Variables
1. Create a `.env` file in the project root directory
2. Add the following line to the file, replacing `your_actual_api_key` with your Google Gemini API key:
   ```
   VITE_GOOGLE_GEMINI_API_KEY=your_actual_api_key
   ```
3. Restart the development server after adding the API key

## Implementation Details

### Conversation Flow
The AI chat follows this pattern:
1. Patient enters initial symptoms
2. AI analyzes the symptoms and asks follow-up questions (one at a time)
3. After 2-4 questions, AI analyzes the full conversation
4. AI provides a final recommendation: "Based on your responses, you should consult: [Specialist]"

### API Reliability Features
- Multiple retry attempts for failed API calls
- Exponential backoff strategy to handle rate limits
- Detailed error handling with user-friendly messages
- Debug panel for troubleshooting API issues

### Medical Specialist Recommendations
The AI recommends one of these specializations:
- General Physician / Family Medicine
- Dermatologist
- Pediatrician
- Gynecologist
- Psychiatrist / Psychologist
- ENT Specialist
- Cardiologist
- Gastroenterologist
- Orthopedic
- Neurologist
- Pulmonologist
- Urologist
- Endocrinologist
- Ophthalmologist
- Dentist

## Usage Notes
- The AI-powered chat provides a natural, responsive experience
- All communication happens within the existing chat UI
- The API requires an internet connection to function properly
- Patient information remains private and is not stored beyond the session 