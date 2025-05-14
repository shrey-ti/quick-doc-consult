const API_BASE_URL = 'http://localhost:5000/api';

// Interface for authentication responses
interface AuthResponse {
  phone_number: string;
  user_type: 'doctor' | 'patient';
  created_at: string;
  exists: boolean;
}

// User authentication functions
export const authenticateUser = async (phoneNumber: string, userType: 'doctor' | 'patient'): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        user_type: userType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Authentication failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during authentication:', error);
    throw error;
  }
}; 