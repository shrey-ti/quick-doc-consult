-- Sample data for MediConsult first prototype

-- Insert doctor categories
INSERT INTO doctor_categories (name, description) VALUES
('Cardiologist', 'Heart specialists'),
('Dermatologist', 'Skin specialists'),
('Pediatrician', 'Child health specialists'),
('Orthopedic Surgeon', 'Bone and joint specialists'),
('General Physician', 'Primary care doctors');

-- Insert patients
INSERT INTO patients (mobile_number) VALUES
('+919876543210'),
('+919876543211'),
('+919876543212');

-- Insert doctors
INSERT INTO doctors (phone_number, name, category_id, photo_url, experience_years, rating, consultation_count, price, about) VALUES
('+919123456780', 'Dr. Anil Kumar', 1, 'https://example.com/doctors/anil.jpg', 12, 4.5, 245, 800, 'Experienced cardiologist with specialization in interventional cardiology'),
('+919123456781', 'Dr. Priya Singh', 2, 'https://example.com/doctors/priya.jpg', 8, 4.2, 186, 700, 'Dermatologist specialized in cosmetic dermatology and skin treatments'),
('+919123456782', 'Dr. Rajesh Sharma', 3, 'https://example.com/doctors/rajesh.jpg', 15, 4.8, 320, 900, 'Senior pediatrician with expertise in childhood development'),
('+919123456783', 'Dr. Meena Patel', 4, 'https://example.com/doctors/meena.jpg', 10, 4.3, 210, 850, 'Orthopedic surgeon specializing in sports injuries'),
('+919123456784', 'Dr. Sanjay Gupta', 5, 'https://example.com/doctors/sanjay.jpg', 6, 4.1, 150, 600, 'General physician with holistic approach to treatment');

-- Insert doctor consultation types
INSERT INTO doctor_consultation_types (doctor_phone, consultation_type, price) VALUES
('+919123456780', 'video', 800),
('+919123456780', 'audio', 600),
('+919123456780', 'in_person', 1000),
('+919123456781', 'video', 700),
('+919123456781', 'whatsapp', 500),
('+919123456782', 'video', 900),
('+919123456782', 'in_person', 1200),
('+919123456783', 'video', 850),
('+919123456783', 'in_person', 1100),
('+919123456784', 'video', 600),
('+919123456784', 'audio', 400),
('+919123456784', 'chat', 300);

-- Insert some sample consultations
INSERT INTO consultations (patient_mobile, doctor_phone, booking_date, booking_time, consultation_type, status, symptoms, booking_reference) VALUES
('+919876543210', '+919123456780', '2023-06-15', '10:00:00', 'video', 'completed', 'Chest pain and shortness of breath', 'REF12345'),
('+919876543211', '+919123456781', '2023-06-16', '11:30:00', 'video', 'completed', 'Skin rash on face', 'REF12346'),
('+919876543212', '+919123456782', '2023-06-18', '09:30:00', 'in_person', 'completed', 'Fever and cold in 5-year-old', 'REF12347'),
('+919876543210', '+919123456784', '2023-06-20', '14:00:00', 'audio', 'completed', 'Headache and mild fever', 'REF12348'),
('+919876543211', '+919123456783', '2023-07-02', '15:30:00', 'video', 'scheduled', 'Knee pain after sports injury', 'REF12349');

-- Insert some sample prescriptions
INSERT INTO prescriptions (consultation_id, medicine, instructions) VALUES
(1, 'Aspirin 75mg, Atorvastatin 10mg', 'Take Aspirin once daily after breakfast. Take Atorvastatin at night before sleeping. Avoid fatty foods and engage in light exercise.'),
(2, 'Hydrocortisone cream 1%, Cetirizine 10mg', 'Apply cream on affected area twice daily. Take Cetirizine once daily at night if itching persists.'),
(3, 'Paracetamol syrup 250mg/5ml, Cetirizine syrup 5mg/5ml', 'Give 5ml of Paracetamol every 6 hours if fever persists. Give 2.5ml of Cetirizine at night for 3 days.'),
(4, 'Paracetamol 500mg, Domperidone 10mg', 'Take Paracetamol every 6 hours. Take Domperidone before meals twice daily.'); 