const API_BASE_URL = '/api';
const BACKEND_BASE_URL = '';

// Export the backend base URL for use in other components
export { BACKEND_BASE_URL, API_BASE_URL };

// Get auth token from localStorage for persistence across page refreshes
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Generic API functions
export const api = {
  // GET request
  get: async (endpoint: string) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🔍 Making GET request to:', `${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers
    });
    console.log('🔍 GET response status:', response.status);
    console.log('🔍 GET response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ GET request failed:', errorText);
      throw new Error(`GET ${endpoint} failed: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ GET request successful:', data);
    return data;
  },

  // POST request
  post: async (endpoint: string, data: any) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`POST ${endpoint} failed`);
    return response.json();
  },

  // PUT request
  put: async (endpoint: string, data: any) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error(`PUT ${endpoint} failed`);
    return response.json();
  },

  // DELETE request
  delete: async (endpoint: string) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error(`DELETE ${endpoint} failed`);
    return response.json();
  },
};

// Content management API functions
export const contentAPI = {
  // Branding
  getBranding: async () => {
    return api.get('/branding');
  },
  updateBranding: async (branding: any) => {
    return api.put('/branding', branding);
  },

  // Hero section
  getHero: async () => {
    return api.get('/hero-content');
  },
  updateHero: async (hero: any) => {
    return api.put('/hero-content', hero);
  },

  // About section
  getAbout: async () => {
    return api.get('/about-content');
  },
  updateAbout: async (about: any) => {
    return api.put('/about-content', about);
  },

  // Contact information
  getContact: async () => {
    return api.get('/contact-content');
  },
  updateContact: async (contact: any) => {
    return api.put('/contact-content', contact);
  },

  // Media files
  getMedia: async (sectionId?: number) => {
    const endpoint = sectionId ? `/media?section_id=${sectionId}` : '/media';
    console.log('🔍 Calling media API:', `${API_BASE_URL}${endpoint}`);
    try {
      const result = await api.get(endpoint);
      console.log('✅ Media API response:', result);
      return result;
    } catch (error) {
      console.error('❌ Media API error:', error);
      throw error;
    }
  },
  uploadMedia: async (file: File, sectionId?: number) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    if (sectionId) {
      formData.append('section_id', sectionId.toString());
    }
    
    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) throw new Error(`Upload failed`);
    return response.json();
  },
  deleteMedia: async (id: number) => {
    return api.delete(`/media/${id}`);
  },
  updateMediaFileSection: async (id: number, sectionId: number | null) => {
    return api.put(`/media/${id}`, { section_id: sectionId });
  },

  // Media sections
  getMediaSections: async () => {
    return api.get('/media/sections');
  },
  createMediaSection: async (section: any) => {
    return api.post('/media/sections', section);
  },
  updateMediaSection: async (id: number, section: any) => {
    return api.put(`/media/sections/${id}`, section);
  },
  deleteMediaSection: async (id: number) => {
    return api.delete(`/media/sections/${id}`);
  },

  // Activities
  getActivities: async () => {
    return api.get('/activities');
  },

  createActivity: async (activity: any) => {
    return api.post('/activities', activity);
  },

  updateActivity: async (id: number, activity: any) => {
    return api.put(`/activities/${id}`, activity);
  },

  deleteActivity: async (id: number) => {
    return api.delete(`/activities/${id}`);
  },

  // Teachers
  getTeachers: async () => {
    return api.get('/teachers');
  },

  createTeacher: async (teacher: any) => {
    return api.post('/teachers', teacher);
  },

  updateTeacher: async (id: number, teacher: any) => {
    return api.put(`/teachers/${id}`, teacher);
  },

  deleteTeacher: async (id: number) => {
    return api.delete(`/teachers/${id}`);
  },

  // Facilities
  getFacilities: async () => {
    return api.get('/facilities');
  },

  createFacility: async (facility: any) => {
    return api.post('/facilities', facility);
  },

  updateFacility: async (id: number, facility: any) => {
    return api.put(`/facilities/${id}`, facility);
  },

  deleteFacility: async (id: number) => {
    return api.delete(`/facilities/${id}`);
  },

  // Testimonials
  getTestimonials: async () => {
    return api.get('/testimonials');
  },

  createTestimonial: async (testimonial: any) => {
    return api.post('/testimonials', testimonial);
  },

  updateTestimonial: async (id: number, testimonial: any) => {
    return api.put(`/testimonials/${id}`, testimonial);
  },

  deleteTestimonial: async (id: number) => {
    return api.delete(`/testimonials/${id}`);
  },

  // News
  getNews: async () => {
    return api.get('/news');
  },

  createNews: async (news: any) => {
    return api.post('/news', news);
  },

  updateNews: async (id: number, news: any) => {
    return api.put(`/news/${id}`, news);
  },

  deleteNews: async (id: number) => {
    return api.delete(`/news/${id}`);
  },

  // Button settings
  getButtonSettings: async () => {
    return api.get('/button-settings');
  },
  updateButtonSettings: async (settings: any) => {
    return api.put('/button-settings', settings);
  },

  // Sponsorship content
  getSponsorshipContent: async () => {
    return api.get('/sponsorship-content');
  },
  updateSponsorshipContent: async (content: any) => {
    return api.put('/sponsorship-content', content);
  },

  // Parents portal content
  getParentsPortalContent: async () => {
    return api.get('/parents-portal-content');
  },
  updateParentsPortalContent: async (content: any) => {
    return api.put('/parents-portal-content', content);
  },
  getUsers: async () => {
    return api.get('/users');
  },

  createUser: async (user: any) => {
    return api.post('/users', user);
  },

  updateUser: async (id: number, user: any) => {
    return api.put(`/users/${id}`, user);
  },

  deleteUser: async (id: number) => {
    return api.delete(`/users/${id}`);
  },
};

// Form submission API functions
export const formsAPI = {
  // Sponsorship Application
  submitSponsorshipApplication: async (data: {
    name: string;
    email: string;
    phone?: string;
    sponsorship_level: string;
    message?: string;
  }) => {
    return api.post('/forms/sponsorship-application', data);
  },

  // Child Sponsorship Request
  submitChildSponsorship: async (data: {
    sponsor_name: string;
    sponsor_email: string;
    sponsor_phone?: string;
    child_name?: string;
    sponsorship_type: string;
    amount?: number;
    message?: string;
  }) => {
    return api.post('/forms/child-sponsorship', data);
  },

  // Newsletter Subscription
  subscribeToNewsletter: async (data: {
    email: string;
    name?: string;
  }) => {
    return api.post('/forms/newsletter-subscription', data);
  },

  // Parent Portal Registration
  registerParent: async (data: {
    parent_name: string;
    email: string;
    phone?: string;
    child_name?: string;
    child_grade?: string;
  }) => {
    return api.post('/forms/parent-registration', data);
  },

  // Get all form submissions (admin only)
  getSubmissions: async () => {
    return api.get('/forms/submissions');
  },

  // Get admin notifications
  getNotifications: async () => {
    return api.get('/forms/notifications');
  },

  // Mark notification as read
  markNotificationAsRead: async (id: number) => {
    return api.put(`/forms/notifications/${id}/read`, {});
  },
};
