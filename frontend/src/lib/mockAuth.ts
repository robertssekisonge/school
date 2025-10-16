import { User } from '../types';

interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
  token?: string;
}

// Mock admin user (fallback)
const mockAdmin: User = {
  id: '1',
  email: 'robs@school.com',
  full_name: 'Administrator',
  role: 'admin',
  avatar_url: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=400',
  phone: '+256 123 456 789'
};

// Real backend authentication - NO LOCAL STORAGE
export const realLogin = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Store token in localStorage for persistence across page refreshes
      localStorage.setItem('authToken', data.token);
      return { 
        success: true, 
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name || 'Administrator',
          role: data.user.role,
          avatar_url: data.user.avatar_url || 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=400',
          phone: data.user.phone || '+256 123 456 789'
        }, 
        token: data.token 
      };
    } else {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.error || 'Login failed' 
      };
    }
  } catch (error) {
    console.error('Backend login failed:', error);
    return { 
      success: false, 
      message: 'Connection to backend failed. Please ensure the backend server is running.' 
    };
  }
};

export const mockLogin = async (email: string, password: string): Promise<LoginResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check credentials - support both old and new credentials
  if ((email === 'robs@school.com' && password === 'hub h@11') || 
      (email === 'admin@school.com' && password === 'password')) {
    // NO localStorage - return user data directly
    return { success: true, user: mockAdmin, token: 'mock-jwt-token-' + Date.now() };
  }

  return { success: false, message: 'Invalid credentials' };
};

// Get current user from backend - use localStorage for persistence
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check if we have a token in localStorage for persistence
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return null;
    }

    const response = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    } else {
      // Token is invalid, clear it
      localStorage.removeItem('authToken');
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const mockLogout = (): void => {
  // Clear localStorage for persistence
  localStorage.removeItem('authToken');
};