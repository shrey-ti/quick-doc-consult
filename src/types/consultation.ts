export interface ConsultationHistory {
  id: string;
  mobileNumber: string;
  date: string;
  doctor: {
    name: string;
    specialty: string;
    photo: string;
  };
  consultationType: "video" | "audio" | "chat" | "in-person";
  timeSlot: string;
  symptoms: string[];
  patientData: {
    age: number;
    gender: string;
    height?: string;
    weight?: string;
  };
  status: "completed" | "upcoming" | "cancelled";
  prescription?: string;
  notes?: string;
}

export interface ConsultationStorage {
  [mobileNumber: string]: ConsultationHistory[];
}

// Utility functions for consultation history
export const getConsultationHistory = (mobileNumber: string): ConsultationHistory[] => {
  const history = localStorage.getItem('mediconsult_history');
  if (!history) return [];
  
  const allHistory: ConsultationStorage = JSON.parse(history);
  return allHistory[mobileNumber] || [];
};

export const addConsultationToHistory = (consultation: ConsultationHistory): void => {
  const history = localStorage.getItem('mediconsult_history');
  const allHistory: ConsultationStorage = history ? JSON.parse(history) : {};
  
  if (!allHistory[consultation.mobileNumber]) {
    allHistory[consultation.mobileNumber] = [];
  }
  
  allHistory[consultation.mobileNumber].push(consultation);
  localStorage.setItem('mediconsult_history', JSON.stringify(allHistory));
};

export const updateConsultationStatus = (
  mobileNumber: string,
  consultationId: string,
  status: ConsultationHistory['status'],
  prescription?: string,
  notes?: string
): void => {
  const history = localStorage.getItem('mediconsult_history');
  if (!history) return;
  
  const allHistory: ConsultationStorage = JSON.parse(history);
  const userHistory = allHistory[mobileNumber];
  
  if (!userHistory) return;
  
  const consultationIndex = userHistory.findIndex(c => c.id === consultationId);
  if (consultationIndex === -1) return;
  
  userHistory[consultationIndex] = {
    ...userHistory[consultationIndex],
    status,
    prescription: prescription || userHistory[consultationIndex].prescription,
    notes: notes || userHistory[consultationIndex].notes
  };
  
  localStorage.setItem('mediconsult_history', JSON.stringify(allHistory));
}; 