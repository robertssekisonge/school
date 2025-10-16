import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { contentAPI } from '../lib/api';

// Content types
interface Branding {
  schoolName: string;
  logo: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
}

interface HeroContent {
  headline: string;
  subHeadline: string;
  description: string;
  backgroundImage: string;
  slides?: string[];
  slideIntervalMs?: number;
  slideDirection?: 'left' | 'right';
  slideMode?: 'fade' | 'marquee';
}

interface AboutContent {
  title: string;
  content: string;
  image: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
}

interface Teacher {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  image_url: string;
}

interface Facility {
  id: number;
  name: string;
  category: string;
  image: string;
  capacity: number;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image_url: string;
  rating: number;
}

interface News {
  id: number;
  title: string;
  date: string;
  image: string;
}

interface SponsorshipContent {
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  slideMode?: 'fade' | 'continuous';
  slideIntervalMs?: number;
  slideDirection?: 'left' | 'right';
  additionalSlides?: string[];
  applyButtonText?: string;
  sponsorButtonText?: string;
  sukropLink?: string;
  impactStats?: {
    studentsSponsored: string;
    activeSponsors: string;
    yearsOfProgram: string;
    successRate: string;
  };
  successStories?: Array<{
    name: string;
    age: string;
    before: { image: string; description: string };
    after: { image: string; description: string };
    story: string;
  }>;
  sponsorshipLevels?: Array<{
    name: string;
    amount: string;
    benefits: string[];
  }>;
}

interface ParentsContent {
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  slideMode?: 'fade' | 'continuous';
  slideIntervalMs?: number;
  slideDirection?: 'left' | 'right';
  additionalSlides?: string[];
  quickActions?: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  upcomingEvents?: Array<{
    title: string;
    date: string;
    time: string;
    location: string;
  }>;
  resources?: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  contactInfo?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

// Header action buttons customization
export interface ButtonStyleConfig {
  bgColorClass: string;
  hoverBgColorClass: string;
  textColorClass: string;
  paddingXClass: string;
  paddingYClass: string;
  roundedClass: string;
  textSizeClass: string;
  fontWeightClass: string;
  iconSizeClass: string;
  customBgColor?: string; // For color wheel
  customHoverColor?: string; // For color wheel
  customTextColor?: string; // For color wheel
}

export interface ButtonSettings {
  spacingXClass: string; // spacing between buttons container
  brandingTextColor: string;
  brandingTextSize: string;
  brandingFontWeight: string;
  customBrandingColor?: string; // For color wheel
  brandingTaglineColor: string;
  brandingTaglineSize: string;
  customTaglineColor?: string;
  logoSize: string;
  logoBackgroundColor: string;
  customLogoBgColor?: string;
  sponsorship: ButtonStyleConfig;
  parents: ButtonStyleConfig;
  admin: ButtonStyleConfig;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

interface ContentContextType {
  // Content state
  branding: Branding;
  heroContent: HeroContent;
  aboutContent: AboutContent;
  contactInfo: ContactInfo;
  activities: Activity[];
  teachers: Teacher[];
  facilities: Facility[];
  testimonials: Testimonial[];
  news: News[];
  users: User[];
  
  // Sponsorship and Parents Portal content
  sponsorshipContent: SponsorshipContent;
  parentsContent: ParentsContent;
  
  // Loading states
  loading: boolean;
  error: string | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  
  // State setters
  setBranding: React.Dispatch<React.SetStateAction<Branding>>;
  setHeroContent: React.Dispatch<React.SetStateAction<HeroContent>>;
  setAboutContent: React.Dispatch<React.SetStateAction<AboutContent>>;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
  
  // Sponsorship and Parents Portal setters
  setSponsorshipContent: React.Dispatch<React.SetStateAction<SponsorshipContent>>;
  setParentsContent: React.Dispatch<React.SetStateAction<ParentsContent>>;
  
  // Media management
  media: any[];
  uploadMedia: (file: File, sectionId?: number) => Promise<void>;
  deleteMedia: (id: number) => Promise<void>;
  
  // Update functions
  updateBranding: (branding: Branding) => Promise<void>;
  updateHero: (hero: HeroContent) => Promise<void>;
  updateAbout: (about: AboutContent) => Promise<void>;
  updateContact: (contact: ContactInfo) => Promise<void>;
  
  // Sponsorship and Parents Portal updates
  updateSponsorship: (sponsorship: SponsorshipContent) => Promise<void>;
  updateParents: (parents: ParentsContent) => Promise<void>;
  
  // CRUD operations
  createActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  updateActivity: (id: number, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
  
  createTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: number, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: number) => Promise<void>;
  
  createFacility: (facility: Omit<Facility, 'id'>) => Promise<void>;
  updateFacility: (id: number, facility: Partial<Facility>) => Promise<void>;
  deleteFacility: (id: number) => Promise<void>;
  
  createTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: number, testimonial: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: number) => Promise<void>;
  
  createNews: (news: Omit<News, 'id'>) => Promise<void>;
  updateNews: (id: number, news: Partial<News>) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
  
  createUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, user: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  
  // Refresh data
  refreshContent: () => Promise<void>;
  forceRefreshContent: () => Promise<void>;

  // Header buttons customization
  buttonSettings: ButtonSettings;
  updateButtonSettings: (settings: ButtonSettings) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Default content - ONLY used if backend fails completely
const defaultBranding: Branding = {
  schoolName: 'Loading...', // Changed from hardcoded default
  logo: '',
  tagline: 'Loading...', // Changed from hardcoded default
  primaryColor: '#2563eb',
  secondaryColor: '#7c3aed'
};

const defaultHeroContent: HeroContent = {
  headline: 'Holistic Development',
  subHeadline: 'Beyond Academic Excellence',
  description: 'We nurture not just academic growth but also character, creativity, and leadership skills.',
  backgroundImage: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=1920',
  slides: [
    'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/8199564/pexels-photo-8199564.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/8199565/pexels-photo-8199565.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/8199566/pexels-photo-8199566.jpeg?auto=compress&cs=tinysrgb&w=1920'
  ],
  slideIntervalMs: 5000,
  slideDirection: 'left',
  slideMode: 'marquee'
};

const defaultAboutContent: AboutContent = {
  title: 'About Our Academy',
  content: 'Excellence Academy is committed to providing quality education...',
  image: ''
};

const defaultContactInfo: ContactInfo = {
  address: '123 Education Street, City, State 12345',
  phone: '+1 (555) 123-4567',
  email: 'info@excellenceacademy.edu',
  hours: 'Monday - Friday: 8:00 AM - 4:00 PM'
};

const defaultButtonSettings: ButtonSettings = {
  spacingXClass: 'space-x-4',
  brandingTextColor: 'text-white',
  brandingTextSize: 'text-lg md:text-2xl',
  brandingFontWeight: 'font-extrabold',
  brandingTaglineColor: 'text-slate-300',
  brandingTaglineSize: 'text-[11px] md:text-xs',
  logoSize: 'h-9 w-9',
  logoBackgroundColor: 'bg-gradient-to-br from-blue-600 to-purple-600',
  sponsorship: {
    bgColorClass: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    hoverBgColorClass: 'hover:from-emerald-600 hover:to-teal-600',
    textColorClass: 'text-white',
    paddingXClass: 'px-4',
    paddingYClass: 'py-2',
    roundedClass: 'rounded-lg',
    textSizeClass: 'text-sm',
    fontWeightClass: 'font-semibold',
    iconSizeClass: 'h-4 w-4'
  },
  parents: {
    bgColorClass: 'bg-gradient-to-r from-indigo-500 to-sky-500',
    hoverBgColorClass: 'hover:from-indigo-600 hover:to-sky-600',
    textColorClass: 'text-white',
    paddingXClass: 'px-4',
    paddingYClass: 'py-2',
    roundedClass: 'rounded-lg',
    textSizeClass: 'text-sm',
    fontWeightClass: 'font-semibold',
    iconSizeClass: 'h-4 w-4'
  },
  admin: {
    bgColorClass: 'bg-gradient-to-r from-blue-600 to-purple-600',
    hoverBgColorClass: 'hover:from-blue-700 hover:to-purple-700',
    textColorClass: 'text-white',
    paddingXClass: 'px-4',
    paddingYClass: 'py-2',
    roundedClass: 'rounded-lg',
    textSizeClass: 'text-sm',
    fontWeightClass: 'font-semibold',
    iconSizeClass: 'h-4 w-4'
  }
};

const defaultSponsorshipContent: SponsorshipContent = {
  title: 'Transform Lives Through Education',
  subtitle: 'Every child deserves the opportunity to learn, grow, and dream. Join our sponsorship program and be part of their journey to success.',
  heroImage: '',
  description: 'Our sponsorship program provides educational opportunities for children in need. Through generous donations, we can offer scholarships, school supplies, and support to families who cannot afford quality education.',
  slideMode: 'fade',
  slideIntervalMs: 3000,
  slideDirection: 'left',
  additionalSlides: [],
  applyButtonText: 'Apply for Sponsorship',
  sponsorButtonText: 'Sponsor a Child',
  sukropLink: 'https://sukrop.org/',
  impactStats: {
    studentsSponsored: '150+',
    activeSponsors: '45',
    yearsOfProgram: '8',
    successRate: '95%'
  },
  successStories: [
    {
      name: 'Sarah M.',
      age: '12',
      before: {
        image: '',
        description: 'Sarah struggled to attend school due to financial constraints. Her family could barely afford basic necessities.'
      },
      after: {
        image: '',
        description: 'Now Sarah is a top-performing student with dreams of becoming a doctor. She\'s confident and full of hope.'
      },
      story: 'Sponsored student who graduated with honors and is now studying medicine at university.'
    }
  ],
  sponsorshipLevels: [
    {
      name: 'Basic Support',
      amount: '$50/month',
      benefits: ['School supplies', 'Basic healthcare', 'Regular updates']
    },
    {
      name: 'Comprehensive Care',
      amount: '$100/month',
      benefits: ['Full education costs', 'Healthcare coverage', 'Family support', 'Monthly reports']
    }
  ]
};

const defaultParentsContent: ParentsContent = {
  title: 'Parents Portal',
  subtitle: 'Stay connected with your child\'s education. Access important information, communicate with teachers, and track progress all in one place.',
  heroImage: '',
  description: 'Our parents portal provides easy access to your child\'s academic information, school events, and communication tools with teachers and administration.',
  slideMode: 'fade',
  slideIntervalMs: 3000,
  slideDirection: 'left',
  additionalSlides: [],
  quickActions: [
    {
      title: 'View Academic Calendar',
      description: 'Check important dates and school events',
      link: '#calendar'
    },
    {
      title: 'Access Report Cards',
      description: 'View your child\'s academic progress',
      link: '#reports'
    }
  ],
  upcomingEvents: [
    {
      title: 'Parent-Teacher Conference',
      date: 'March 15, 2024',
      time: '2:00 PM',
      location: 'School Auditorium'
    }
  ],
  resources: [
    {
      title: 'Parent Handbook',
      description: 'Complete guide to school policies and procedures',
      link: '#handbook'
    }
  ],
  contactInfo: [
    {
      title: 'School Office',
      description: '+256-7035-74-112',
      icon: 'phone'
    }
  ]
};

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<Branding>(defaultBranding);
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [buttonSettings, setButtonSettings] = useState<ButtonSettings>(defaultButtonSettings);
  
  // Sponsorship and Parents Portal content
  const [sponsorshipContent, setSponsorshipContent] = useState<SponsorshipContent>(defaultSponsorshipContent);
  const [parentsContent, setParentsContent] = useState<ParentsContent>(defaultParentsContent);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // Load initial content
  useEffect(() => {
    // Add a tiny delay to prevent flash loading screen
    const timer = setTimeout(() => {
      refreshContent();
    }, 10); // Only 10ms delay - nearly instant
    
    return () => clearTimeout(timer);
  }, []);

  const refreshContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading content from backend...');
      
      // Load critical content first (branding, hero, about) - these are needed immediately
      const [brandingData, buttonSettingsData, heroData, aboutData, contactData] = await Promise.all([
        contentAPI.getBranding().catch(err => {
          console.error('❌ Failed to load branding:', err);
          throw new Error('Failed to load branding data');
        }),
        contentAPI.getButtonSettings().catch(err => {
          console.error('❌ Failed to load button settings:', err);
          return null;
        }),
        contentAPI.getHero().catch(err => {
          console.error('❌ Failed to load hero:', err);
          return defaultHeroContent;
        }),
        contentAPI.getAbout().catch(err => {
          console.error('❌ Failed to load about:', err);
          return defaultAboutContent;
        }),
        contentAPI.getContact().catch(err => {
          console.error('❌ Failed to load contact:', err);
          return defaultContactInfo;
        })
      ]);

      // Set critical content immediately - branding MUST come from backend
      console.log('✅ Branding data loaded:', brandingData);
      setBranding(brandingData);
      setButtonSettings(buttonSettingsData || defaultButtonSettings);
      setHeroContent(heroData);
      setAboutContent(aboutData);
      setContactInfo(contactData);

      // Load non-critical content in parallel
      const [activitiesData, teachersData, facilitiesData, testimonialsData, newsData, mediaData] = await Promise.all([
        contentAPI.getActivities().catch(() => []),
        contentAPI.getTeachers().catch(() => []),
        contentAPI.getFacilities().catch(() => []),
        contentAPI.getTestimonials().catch(() => []),
        contentAPI.getNews().catch(() => []),
        contentAPI.getMedia().catch(err => {
          console.error('❌ Failed to load media:', err);
          return [];
        })
      ]);
      
      console.log('📁 Media data loaded:', mediaData);
      console.log('📁 Media data length:', mediaData.length);
      if (mediaData.length > 0) {
        console.log('📁 First media item:', mediaData[0]);
      }
      
      setActivities(activitiesData);
      setTeachers(teachersData);
      setFacilities(facilitiesData);
      setTestimonials(testimonialsData);
      setNews(newsData);
      setMedia(mediaData);

      // Load users only if authenticated
      const token = localStorage.getItem('authToken');
      if (token) {
        const users = await contentAPI.getUsers().catch(() => []);
        setUsers(users);
      }
      
      console.log('✅ All content loaded successfully from backend');
      
    } catch (err) {
      console.error('❌ Error loading content from backend:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content from backend');
      // Don't set defaults - let the user know there's an error
    } finally {
      setLoading(false);
    }
  };

  // Force refresh content from backend
  const forceRefreshContent = async () => {
    console.log('🔄 Force refreshing content from backend...');
    try {
      await refreshContent();
    } catch (error) {
      console.error('❌ Failed to refresh content:', error);
    }
  };

  // Update functions
  const updateBranding = async (newBranding: Branding) => {
    try {
      await contentAPI.updateBranding(newBranding);
      setBranding(newBranding);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update branding - backend connection required');
      throw err;
    }
  };

  const updateButtonSettings = async (newSettings: ButtonSettings) => {
    try {
      await contentAPI.updateButtonSettings(newSettings);
      setButtonSettings(newSettings);
    } catch (error) {
      console.error('Failed to update button settings:', error);
      throw error;
    }
  };

  const updateHero = async (newHero: HeroContent) => {
    try {
      await contentAPI.updateHero(newHero);
      setHeroContent(newHero);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update hero content - backend connection required');
      throw err;
    }
  };

  const updateAbout = async (newAbout: AboutContent) => {
    try {
      await contentAPI.updateAbout(newAbout);
      setAboutContent(newAbout);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update about content - backend connection required');
      throw err;
    }
  };

  const updateContact = async (newContact: ContactInfo) => {
    try {
      await contentAPI.updateContact(newContact);
      setContactInfo(newContact);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update contact info - backend connection required');
      throw err;
    }
  };

  const updateSponsorship = async (newSponsorship: SponsorshipContent) => {
    try {
      await contentAPI.updateSponsorshipContent(newSponsorship);
      setSponsorshipContent(newSponsorship);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update sponsorship content - backend connection required');
      throw err;
    }
  };

  const updateParents = async (newParents: ParentsContent) => {
    try {
      await contentAPI.updateParentsPortalContent(newParents);
      setParentsContent(newParents);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update parents content - backend connection required');
      throw err;
    }
  };

  // Activities CRUD
  const createActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      const newActivity = await contentAPI.createActivity(activity);
      setActivities(prev => [...prev, newActivity]);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to create activity - backend connection required');
      throw err;
    }
  };

  const updateActivity = async (id: number, activity: Partial<Activity>) => {
    try {
      await contentAPI.updateActivity(id, activity);
      setActivities(prev => prev.map(a => a.id === id ? { ...a, ...activity } : a));
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update activity - backend connection required');
      throw err;
    }
  };

  const deleteActivity = async (id: number) => {
    try {
      await contentAPI.deleteActivity(id);
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Backend delete failed:', err);
      setError('Failed to delete activity - backend connection required');
      throw err;
    }
  };

  // Teachers CRUD
  const createTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    try {
      const newTeacher = await contentAPI.createTeacher(teacher);
      setTeachers(prev => [...prev, newTeacher]);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to create teacher - backend connection required');
      throw err;
    }
  };

  const updateTeacher = async (id: number, teacher: Partial<Teacher>) => {
    try {
      await contentAPI.updateTeacher(id, teacher);
      setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...teacher } : t));
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update teacher - backend connection required');
      throw err;
    }
  };

  const deleteTeacher = async (id: number) => {
    try {
      await contentAPI.deleteTeacher(id);
      setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Backend delete failed:', err);
      setError('Failed to delete teacher - backend connection required');
      throw err;
    }
  };

  // Facilities CRUD
  const createFacility = async (facility: Omit<Facility, 'id'>) => {
    try {
      const newFacility = await contentAPI.createFacility(facility);
      setFacilities(prev => [...prev, newFacility]);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to create facility - backend connection required');
      throw err;
    }
  };

  const updateFacility = async (id: number, facility: Partial<Facility>) => {
    try {
      await contentAPI.updateFacility(id, facility);
      setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...facility } : f));
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update facility - backend connection required');
      throw err;
    }
  };

  const deleteFacility = async (id: number) => {
    try {
      await contentAPI.deleteFacility(id);
      setFacilities(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Backend delete failed:', err);
      setError('Failed to delete facility - backend connection required');
      throw err;
    }
  };

  // Testimonials CRUD
  const createTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      const newTestimonial = await contentAPI.createTestimonial(testimonial);
      setTestimonials(prev => [...prev, newTestimonial]);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to create testimonial - backend connection required');
      throw err;
    }
  };

  const updateTestimonial = async (id: number, testimonial: Partial<Testimonial>) => {
    try {
      await contentAPI.updateTestimonial(id, testimonial);
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...testimonial } : t));
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update testimonial - backend connection required');
      throw err;
    }
  };

  const deleteTestimonial = async (id: number) => {
    try {
      await contentAPI.deleteTestimonial(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Backend delete failed:', err);
      setError('Failed to delete testimonial - backend connection required');
      throw err;
    }
  };

  // News CRUD
  const createNews = async (news: Omit<News, 'id'>) => {
    try {
      const newNewsItem = await contentAPI.createNews(news);
      setNews(prev => [...prev, newNewsItem]);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to create news - backend connection required');
      throw err;
    }
  };

  const updateNews = async (id: number, news: Partial<News>) => {
    try {
      await contentAPI.updateNews(id, news);
      setNews(prev => prev.map(n => n.id === id ? { ...n, ...news } : n));
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update news - backend connection required');
      throw err;
    }
  };

  const deleteNews = async (id: number) => {
    try {
      await contentAPI.deleteNews(id);
      setNews(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Backend delete failed:', err);
      setError('Failed to delete news - backend connection required');
      throw err;
    }
  };

  // Users CRUD
  const createUser = async (user: Omit<User, 'id'>) => {
    try {
      const newUser = await contentAPI.createUser(user);
      setUsers(prev => [...prev, newUser]);
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to create user - backend connection required');
      throw err;
    }
  };

  const updateUser = async (id: number, user: Partial<User>) => {
    try {
      await contentAPI.updateUser(id, user);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u));
    } catch (err) {
      console.error('Backend save failed:', err);
      setError('Failed to update user - backend connection required');
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await contentAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Backend delete failed:', err);
      setError('Failed to delete user - backend connection required');
      throw err;
    }
  };

  // Media management
  const uploadMedia = async (file: File, sectionId?: number) => {
    try {
      console.log('Uploading media file:', file.name, 'to section:', sectionId);
      const result = await contentAPI.uploadMedia(file, sectionId);
      console.log('Upload result:', result);
      setMedia(prev => {
        console.log('Previous media:', prev);
        const newMedia = [result.media, ...prev];
        console.log('New media array:', newMedia);
        return newMedia;
      });
    } catch (err) {
      console.error('Backend upload failed:', err);
      setError('Failed to upload media - backend connection required');
      throw err;
    }
  };

  const deleteMedia = async (id: number) => {
    try {
      await contentAPI.deleteMedia(id);
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Backend delete failed:', err);
      setError('Failed to delete media - backend connection required');
      throw err;
    }
  };

  const value: ContentContextType = {
    branding,
    heroContent,
    aboutContent,
    contactInfo,
    activities,
    teachers,
    facilities,
    testimonials,
    news,
    users,
    sponsorshipContent,
    parentsContent,
    loading,
    error,
    setLoading,
    setError,
    setBranding,
    setHeroContent,
    setAboutContent,
    setContactInfo,
    setSponsorshipContent,
    setParentsContent,
    updateBranding,
    updateHero,
    updateAbout,
    updateContact,
    updateSponsorship,
    updateParents,
    createActivity,
    updateActivity,
    deleteActivity,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    createFacility,
    updateFacility,
    deleteFacility,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    createNews,
    updateNews,
    deleteNews,
    createUser,
    updateUser,
    deleteUser,
    media,
    uploadMedia,
    deleteMedia,
    refreshContent,
    forceRefreshContent,
    buttonSettings,
    updateButtonSettings,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
