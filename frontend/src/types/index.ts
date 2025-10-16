export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  avatar_url?: string;
  phone?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  category: string;
  location: string;
  created_at: string;
}

export interface Teacher {
  id: string;
  subject: string;
  bio: string;
  experience_years: number;
  qualifications: string[];
  image_url: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  category: string;
  capacity: number;
  features: string[];
  image_url: string;
  available: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image_url: string;
  rating: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}