# Implementation Roadmap: Doctor Selection to Booking Confirmation

This document outlines the implementation plan for the end-to-end journey from doctor selection through booking confirmation in the MediConsult application.

## Phase 1: Mock Data Creation

Since we're working with a prototype using mock data, first create comprehensive mock datasets:

1. **Doctors Data**
   - Create a collection of doctor profiles with:
     - Name, photo, specialization, experience
     - Rating and number of consultations
     - Available consultation types
     - Expertise areas
     - Pricing

2. **Time Slots Data**
   - Create mock availability schedules
   - Define time slots (30-minute increments)
   - Mark some slots as unavailable for realistic testing

## Phase 2: Page Development

### 1. Doctors Page Enhancement

Update `src/pages/Doctors.tsx` to include:
- Improved doctor cards with consistent styling
- Clear "Select Doctor" button on each card
- Filter options (available today, specialization, etc.)
- Sort options (rating, experience, price)
- Loading states and empty state handling

### 2. Booking Page Enhancement

Update `src/pages/Booking.tsx` to include:
- Clear consultation type selection with visual icons
- Pricing display per consultation type
- Dynamic time slot selection based on doctor availability
- Calendar component for date selection
- Selected slot highlighting
- Validation to prevent proceeding without selections

### 3. Confirmation Page Enhancement

Update `src/pages/Confirmation.tsx` to:
- Display comprehensive booking summary
- Include all doctor details and selected options
- Add calendar integration options
- Provide clear navigation for what's next
- Include options to modify booking or cancel

## Phase 3: Data Flow & State Management

1. **Local Storage Persistence**
   - Enhance local storage to save booking details
   - Create consistent data structure for consultation history

2. **Navigation State**
   - Ensure proper state passing between pages
   - Implement navigation guards to prevent skipping steps

3. **Session Management**
   - Generate and store session IDs
   - Implement booking reference generation

## Phase 4: Component Development

1. **UI Components**
   - Enhance existing or create new components:
     - DoctorCard
     - ConsultationTypeSelector 
     - TimeSlotPicker
     - DatePicker
     - BookingSummary

2. **Form Validation**
   - Implement validation at each step
   - Prevent submission with incomplete data

## Phase 5: API Integration (Future)

For future enhancement beyond the prototype:

1. **Endpoint Design**
   - `/api/doctors` - List doctors with filtering
   - `/api/doctors/:id/availability` - Get doctor availability
   - `/api/bookings` - Create booking

2. **Service Implementations**
   - DoctorService
   - BookingService
   - AvailabilityService

## Implementation Steps

### Step 1: Doctor Selection Page

1. Update the doctor card component to include:
   - Professional photo
   - Name and specialization
   - Experience years and rating
   - Consultation count
   - "Select Doctor" button
   - Base price display

2. Enhance doctor filtering:
   - Available today toggle
   - Specialization filter
   - Price range filter

### Step 2: Consultation Mode Selection

1. Create a visually appealing mode selection interface:
   - Card layout for each mode
   - Icons for each mode type
   - Brief descriptions
   - Unavailable modes grayed out

2. Implement mode-specific logic:
   - Display pricing by mode
   - Show estimated duration
   - Indicate preparation requirements

### Step 3: Time Slot Selection

1. Implement date selection:
   - Calendar component for date picking
   - Disable unavailable dates
   - Show availability at a glance

2. Create time slot grid:
   - Display slots in a grid or list
   - Clear indication of available/unavailable slots
   - Selected slot highlighting
   - Mobile-friendly touch interactions

### Step 4: Booking Confirmation

1. Create comprehensive summary view:
   - Doctor information with photo
   - Consultation details (date, time, mode)
   - Pricing breakdown
   - Cancellation policy

2. Add action buttons:
   - Add to calendar integration
   - Reschedule option
   - Cancel option
   - Return to home

3. Implement booking reference system:
   - Generate unique references
   - Display prominently
   - Save to local storage history

## Testing Recommendations

1. Test the complete flow with various:
   - Doctors selections
   - Consultation types
   - Date and time slot combinations

2. Test edge cases:
   - No available time slots
   - Doctor unavailable after selection
   - Back navigation and data persistence

3. Mobile responsiveness:
   - Test on various screen sizes
   - Ensure touch targets are appropriate size
   - Test calendar and time slot selection on mobile 