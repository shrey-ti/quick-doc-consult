const LOGIN_URL = `https://n3v6q2bq7hxl4gbxfousrxuh240shhec.lambda-url.us-east-1.on.aws/`;
const REGISTER_URL = `https://53horw45zbw4ba3czz57mgqnkm0llynn.lambda-url.us-east-1.on.aws/`;

// Interface for authentication responses
interface AuthResponse {
  phone_number: string;
  user_type: 'doctor' | 'patient';
  created_at: string;
  exists?: boolean;
  success?: boolean;
}

// User authentication functions
export const authenticateUser = async (phoneNumber: string, userType: 'doctor' | 'patient'): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${LOGIN_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        user_type: userType,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error during authentication:', error);
  }
}; 

// Interface for doctor registration data
interface DoctorRegistrationData {
  phone_number: string;
  name: string;
  category_id: number;
  photo_url?: string;
  experience_years: string | number;
  about?: string;
  email?: string;
  degree?: string;
  institution?: string;
  graduationYear?: string;
  licenseNumber?: string;
  consultation_types: {
    consultation_type: string;
    price: string;
    doctor_phone: string;
  }[];
}

export const registerDoctor = async (doctorData: DoctorRegistrationData): Promise<AuthResponse> => {
  try {
    // console.log(doctorData);

    const response = await fetch(`${REGISTER_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        ...doctorData,
        user_type: 'doctor',
        consultation_count: 0,
        created_at: new Date().toISOString()
      }),
    });

    // console.log("response.body", await response.json());

    return await response.json();
  } catch (error) {
    console.error('Error during doctor registration:', error);
  }
};
