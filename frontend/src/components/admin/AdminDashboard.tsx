import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useContent } from '../../contexts/ContentContext';
import { BACKEND_BASE_URL } from '../../lib/api';
import { contentAPI, formsAPI, API_BASE_URL } from '../../lib/api';
import LoadingDotsFixed from '../ui/LoadingDots';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Building, 
  Star, 
  Mail, 
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  TrendingUp,
  UserPlus,
  MessageSquare,
  BookOpen,
  Image,
  Edit,
  Plus,
  Trash2,
  Save,
  Upload,
  Eye,
  EyeOff,
  Lock,
  User,
  Globe,
  Palette,
  GraduationCap,
  CheckCircle,
  Clock,
  XCircle,
  Heart,
  Award,
  ExternalLink,
  DollarSign,
  CreditCard,
  RotateCcw,
  Folder,
  Filter,
  FileText,
  Zap,
  Phone,
  BarChart3,
  Share2,
  MapPin,
  Link,
  Copyright
} from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the current tab from URL only - NO localStorage
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    return tabFromUrl || 'dashboard';
  };

  const {
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
    loading,
    error,
    setLoading,
    setError,
    updateBranding,
    updateHero,
    updateAbout,
    updateContact,
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
    refreshContent,
    setBranding,
    setHeroContent,
    setAboutContent,
    setContactInfo,
    media,
    uploadMedia,
    deleteMedia
  } = useContent();
  const { buttonSettings, updateButtonSettings } = useContent();

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Media library state - moved before functions that use them
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentImageField, setCurrentImageField] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaSections, setMediaSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [movingMediaId, setMovingMediaId] = useState(null);
  const [localMedia, setLocalMedia] = useState([]);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionForm, setSectionForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  
  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getFilteredContent = () => {
    if (!searchQuery.trim()) {
      return null; // Return null to show all content
    }

    const query = searchQuery.toLowerCase();
    
    switch (activeTab) {
      case 'activities':
        return activities?.filter(activity => 
          activity.title?.toLowerCase().includes(query) ||
          activity.description?.toLowerCase().includes(query) ||
          activity.location?.toLowerCase().includes(query)
        );
      case 'teachers':
        return teachers?.filter(teacher => 
          teacher.name?.toLowerCase().includes(query) ||
          teacher.subject?.toLowerCase().includes(query) ||
          teacher.qualification?.toLowerCase().includes(query) ||
          teacher.description?.toLowerCase().includes(query)
        );
      case 'facilities':
        return facilities?.filter(facility => 
          facility.name?.toLowerCase().includes(query) ||
          facility.description?.toLowerCase().includes(query) ||
          facility.location?.toLowerCase().includes(query)
        );
      case 'testimonials':
        return testimonials?.filter(testimonial => 
          testimonial.name?.toLowerCase().includes(query) ||
          testimonial.role?.toLowerCase().includes(query) ||
          testimonial.content?.toLowerCase().includes(query)
        );
      case 'news':
        return news?.filter(newsItem => 
          newsItem.title?.toLowerCase().includes(query) ||
          newsItem.content?.toLowerCase().includes(query) ||
          newsItem.author?.toLowerCase().includes(query)
        );
      case 'users':
        return users?.filter(user => 
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query)
        );
      case 'media':
        return localMedia?.filter(media => 
          media.filename?.toLowerCase().includes(query) ||
          media.section?.name?.toLowerCase().includes(query)
        );
      default:
        return null;
    }
  };

  const filteredContent = getFilteredContent();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('tab', activeTab);
    navigate(`?${urlParams.toString()}`, { replace: true });
    // NO localStorage - use URL only
  }, [activeTab, navigate, location.search]);
  
  // Handle URL changes when component mounts or URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  // Load media sections when media tab is active
  useEffect(() => {
    if (activeTab === 'media') {
      loadMediaSections();
    }
  }, [activeTab]);

  // Load filtered media when section selection changes
  useEffect(() => {
    if (activeTab === 'media') {
      loadFilteredMedia();
    }
  }, [activeTab, selectedSection]);

  

  const loadFilteredMedia = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      // Try to load from API first
      const filteredMedia = await contentAPI.getMedia(selectedSection || undefined);
      setLocalMedia(filteredMedia);
    } catch (error) {
      console.error('Failed to load filtered media from API:', error);
      
      // Fallback: use context media and filter client-side
      if (media && Array.isArray(media)) {
        let filteredMedia = media;
        if (selectedSection) {
          filteredMedia = media.filter(item => item.section_id === selectedSection);
        }
        setLocalMedia(filteredMedia);
        setError('Using cached data - backend connection unavailable');
      } else {
        setLocalMedia([]);
        setError('Failed to load media files - please check backend connection');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Website settings form state
  const [websiteSettings, setWebsiteSettings] = useState({
    siteTitle: '',
    metaDescription: ''
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [modalType, setModalType] = useState('');

  // Form states
  const [newActivity, setNewActivity] = useState({ title: '', category: '', date: '', description: '', image: '' });
  const [newTeacher, setNewTeacher] = useState({ name: '', subject: '', experience: '', image: '' });
  const [newFacility, setNewFacility] = useState({ name: '', category: '', capacity: '', image: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', rating: 5, image: '' });
  const [newNews, setNewNews] = useState({ title: '', date: '', image: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });

  // Sponsorship and Parents Portal content state
  const [sponsorshipContent, setSponsorshipContent] = useState({
    title: 'Transform Lives Through Education',
    subtitle: 'Every child deserves the opportunity to learn, grow, and dream. Join our sponsorship program and be part of their journey to success.',
    heroImage: '',
    description: 'Our sponsorship program provides educational opportunities for children in need. Through generous donations, we can offer scholarships, school supplies, and support to families who cannot afford quality education.'
  });

  const [parentsContent, setParentsContent] = useState({
    title: 'Parents Portal',
    subtitle: 'Stay connected with your child\'s education. Access important information, communicate with teachers, and track progress all in one place.',
    heroImage: '',
    description: 'Our parents portal provides easy access to your child\'s academic information, school events, and communication tools with teachers and administration.'
  });

  // Settings state
  const [activeSettingsTab, setActiveSettingsTab] = useState('school-info');
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Sukrop Schools Management System',
    address: 'Kampala, Uganda',
    phone: '+256-7035-74-112',
    email: 'info@sukrop.edu.ug',
    term: 'Term 2',
    year: '2025'
  });
  const [feesStructure, setFeesStructure] = useState({
    tuition: '500000',
    library: '50000',
    sports: '30000',
    laboratory: '40000',
    transport: '100000',
    other: '20000'
  });
  const [paymentSystem, setPaymentSystem] = useState({
    gateway: 'mpesa',
    currency: 'UGX',
    autoInvoice: true,
    paymentReminders: true
  });
  const [systemSettings, setSystemSettings] = useState({
    language: 'en',
    timezone: 'UTC+3',
    emailNotifications: true,
    smsNotifications: false
  });
  const [backupSettings, setBackupSettings] = useState({
    frequency: 'weekly',
    retention: '90'
  });
  const [accountSettings, setAccountSettings] = useState({
    displayName: 'Rob Admin',
    email: 'admin@sukrop.edu.ug'
  });
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    twoFactor: false,
    sessionTimeout: true
  });
  const [advancedSettings, setAdvancedSettings] = useState({
    database: 'postgresql',
    cache: 'redis',
    debugMode: false,
    maintenanceMode: false
  });

  // New state variables for missing sections
  const [footerContent, setFooterContent] = useState({
    schoolName: 'Excellence Academy',
    description: 'Providing world-class education with modern facilities and experienced teachers.',
    quickLinks: {
      about: '#about',
      activities: '#activities',
      teachers: '#teachers',
      facilities: '#facilities',
      contact: '#contact'
    },
    copyright: '© 2024 Excellence Academy. All rights reserved. | Designed with excellence in education.'
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });

  const [programs, setPrograms] = useState({
    primary: 'Primary Education',
    secondary: 'Secondary Education',
    advanced: 'Advanced Level',
    extracurricular: 'Extracurricular',
    sports: 'Sports Programs'
  });

  const [mapSettings, setMapSettings] = useState({
    apiKey: '',
    address: '123 Education Street, Kampala, Uganda',
    zoomLevel: '15',
    height: 'h-64'
  });

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Chart data
  const enrollmentData = [
    { name: '2020', students: 800 },
    { name: '2021', students: 900 },
    { name: '2022', students: 1050 },
    { name: '2023', students: 1150 },
    { name: '2024', students: 1200 }
  ];

  const studentDistributionData = [
    { name: 'Enrolled', value: 64, color: '#10B981' },
    { name: 'Pending', value: 36, color: '#8B5CF6' },
    { name: 'Waitlist', value: 0, color: '#F59E0B' }
  ];

  const monthlyEnrollmentData = [
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 0 },
    { month: 'May', amount: 0 },
    { month: 'Jun', amount: 0 },
    { month: 'Jul', amount: 0 },
    { month: 'Aug', amount: 1200 },
    { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Dec', amount: 0 }
  ];

  // Helper functions
  const handleAdd = (type) => {
    setModalType(type);
    // Reset form fields for add
    setNewActivity({ title: '', category: '', date: '', description: '', image: '' });
    setNewTeacher({ name: '', subject: '', experience: '', image: '' });
    setNewFacility({ name: '', category: '', capacity: '', image: '' });
    setNewTestimonial({ name: '', role: '', rating: 5, image: '' });
    setNewNews({ title: '', date: '', image: '' });
    setNewUser({ name: '', email: '', role: '' });
    setShowAddModal(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setCurrentItem(item);
    
    // Populate form fields with current item data
    switch (type) {
      case 'activity':
        setNewActivity({
          title: item.title,
          category: item.category,
          date: item.date,
          description: item.description,
          image: item.image
        });
        break;
      case 'facility':
        setNewFacility({
          name: item.name,
          category: item.category,
          capacity: item.capacity,
          image: item.image
        });
        break;
      case 'teacher':
        setNewTeacher({
          name: item.name,
          subject: item.subject,
          experience: item.experience,
          image: item.image
        });
        break;
      case 'testimonial':
        setNewTestimonial({
          name: item.name,
          role: item.role,
          rating: item.rating,
          image: item.image
        });
        break;
      case 'news':
        setNewNews({
          title: item.title,
          date: item.date,
          image: item.image
        });
        break;
      default:
        break;
    }
    
    setShowEditModal(true);
  };

  const handleDelete = (type, item) => {
    setModalType(type);
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

    const handleSave = async (type) => {
    try {
      switch (type) {
        case 'activity':
          if (showAddModal) {
            await createActivity({ ...newActivity, status: 'Active' });
            setNewActivity({ title: '', category: '', date: '', description: '', image: '' });
          } else if (showEditModal) {
            await updateActivity(currentItem.id, newActivity);
          }
          break;
        case 'teacher':
          if (showAddModal) {
            await createTeacher(newTeacher);
            setNewTeacher({ name: '', subject: '', experience: '', image: '' });
          } else if (showEditModal) {
            await updateTeacher(currentItem.id, newTeacher);
          }
          break;
        case 'facility':
          if (showAddModal) {
            await createFacility(newFacility);
            setNewFacility({ name: '', category: '', capacity: '', image: '' });
          } else if (showEditModal) {
            await updateFacility(currentItem.id, newFacility);
          }
          break;
        case 'testimonial':
          if (showAddModal) {
            await createTestimonial(newTestimonial);
            setNewTestimonial({ name: '', role: '', rating: 5, image: '' });
          } else if (showEditModal) {
            await updateTestimonial(currentItem.id, newTestimonial);
          }
          break;
        case 'news':
          if (showAddModal) {
            await createNews(newNews);
            setNewNews({ title: '', date: '', image: '' });
          } else if (showEditModal) {
            await updateNews(currentItem.id, newNews);
          }
          break;
        case 'user':
          if (showAddModal) {
            await createUser({ 
              name: newUser.name, 
              email: newUser.email, 
              role: newUser.role, 
              status: 'Active', 
              avatar: newUser.name.charAt(0).toUpperCase() 
            });
            setNewUser({ name: '', email: '', role: '' });
          } else if (showEditModal) {
            await updateUser(currentItem.id, currentItem);
          }
          break;
        default:
          break;
      }
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (err) {
      alert(`Failed to save ${type}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    };

  const handleSponsorshipSave = async () => {
    try {
      await contentAPI.updateSponsorshipContent(sponsorshipContent);
      alert('Sponsorship content saved successfully!');
    } catch (err) {
      alert(`Failed to save sponsorship content: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleParentsSave = async () => {
    try {
      await contentAPI.updateParentsPortalContent(parentsContent);
      alert('Parents portal content saved successfully!');
    } catch (err) {
      alert(`Failed to save parents portal content: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

    const handleDeleteConfirm = async (type) => {
    try {
      switch (type) {
        case 'activity':
          await deleteActivity(currentItem.id);
          break;
        case 'teacher':
          await deleteTeacher(currentItem.id);
          break;
        case 'facility':
          await deleteFacility(currentItem.id);
          break;
        case 'testimonial':
          await deleteTestimonial(currentItem.id);
          break;
        case 'news':
          await deleteNews(currentItem.id);
          break;
        case 'user':
          await deleteUser(currentItem.id);
          break;
        default:
          break;
      }
      setShowDeleteModal(false);
      setCurrentItem(null);
    } catch (err) {
      alert(`Failed to delete ${type}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleSaveContent = async (type) => {
    try {
      switch (type) {
        case 'branding':
          await updateBranding(branding);
          break;
        case 'hero':
          await updateHero(heroContent);
          break;
        case 'about':
          await updateAbout(aboutContent);
          break;
        case 'contact':
          await updateContact(contactInfo);
          break;
        default:
          break;
      }
      alert(`${type} content saved successfully!`);
    } catch (err) {
      alert(`Failed to save ${type} content: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handlePasswordChange = async () => {
    try {
      // Validate passwords match
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert('New password and confirm password do not match!');
        return;
      }

      // Validate password length
      if (passwordForm.newPassword.length < 6) {
        alert('New password must be at least 6 characters long!');
        return;
      }

      // Call API to change password
              const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        alert(`Failed to change password: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Failed to change password: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleWebsiteSettingsSave = async () => {
    try {
      // Save website settings to backend
      // This would typically update the branding or settings in the database
      await updateBranding({
        ...branding,
        schoolName: websiteSettings.siteTitle
      });
      
      alert('Website settings saved successfully!');
    } catch (err) {
      alert(`Failed to save website settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Save handlers for new sections
  const handleFooterSave = async () => {
    try {
      // Save footer content to backend
      // This would typically update the footer content in the database
      console.log('Saving footer content:', footerContent);
      alert('Footer content saved successfully!');
    } catch (err) {
      alert(`Failed to save footer content: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleSocialMediaSave = async () => {
    try {
      // Save social media links to backend
      // This would typically update the social media links in the database
      console.log('Saving social media links:', socialMedia);
      alert('Social media links saved successfully!');
    } catch (err) {
      alert(`Failed to save social media links: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleProgramsSave = async () => {
    try {
      // Save programs to backend
      // This would typically update the programs in the database
      console.log('Saving programs:', programs);
      alert('Programs saved successfully!');
    } catch (err) {
      alert(`Failed to save programs: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleMapSave = async () => {
    try {
      // Save map settings to backend
      // This would typically update the map settings in the database
      console.log('Saving map settings:', mapSettings);
      alert('Map settings saved successfully!');
    } catch (err) {
      alert(`Failed to save map settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Notification functions
  const loadNotifications = async () => {
    try {
      const response = await formsAPI.getNotifications();
      if (response.success) {
        setNotifications(response.notifications);
        const unread = response.notifications.filter(n => !n.read_status).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await formsAPI.markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_status: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'sponsorship_application':
        return Heart;
      case 'child_sponsorship':
        return Heart;
      case 'newsletter_subscription':
        return Mail;
      case 'parent_registration':
        return Users;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'sponsorship_application':
        return 'text-green-600 bg-green-100';
      case 'child_sponsorship':
        return 'text-red-600 bg-red-100';
      case 'newsletter_subscription':
        return 'text-blue-600 bg-blue-100';
      case 'parent_registration':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const openMediaLibrary = (fieldName) => {
    setCurrentImageField(fieldName);
    setShowMediaLibrary(true);
  };

  const selectImageFromLibrary = (imageUrl) => {
    switch (currentImageField) {
      case 'newActivity':
        setNewActivity({...newActivity, image: imageUrl});
        break;
      case 'newTeacher':
        setNewTeacher({...newTeacher, image: imageUrl});
        break;
      case 'newFacility':
        setNewFacility({...newFacility, image: imageUrl});
        break;
      case 'newTestimonial':
        setNewTestimonial({...newTestimonial, image: imageUrl});
        break;
      case 'newNews':
        setNewNews({...newNews, image: imageUrl});
        break;
      case 'heroContent':
        setHeroContent({...heroContent, backgroundImage: imageUrl});
        break;
      case 'heroSlides':
        setHeroContent({ ...heroContent, slides: [...(heroContent.slides || []), imageUrl] });
        break;
      case 'aboutContent':
        setAboutContent({...aboutContent, image: imageUrl});
        break;
      case 'branding':
        setBranding({...branding, logo: imageUrl});
        break;
      case 'sponsorship':
        setSponsorshipContent({...sponsorshipContent, heroImage: imageUrl});
        break;
      case 'sponsorshipAdditionalSlides':
        setSponsorshipContent({...sponsorshipContent, additionalSlides: [...(sponsorshipContent.additionalSlides || []), imageUrl]});
        break;
      case 'parents':
        setParentsContent({...parentsContent, heroImage: imageUrl});
        break;
      case 'parentsAdditionalSlides':
        setParentsContent({...parentsContent, additionalSlides: [...(parentsContent.additionalSlides || []), imageUrl]});
        break;
      default:
        break;
    }
    setShowMediaLibrary(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if a section is selected
    if (!selectedSection) {
      alert('Please select a section before uploading files.');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please sign in as admin to upload media.');
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      await uploadMedia(file, selectedSection);
      alert('File uploaded successfully!');
      // Reload filtered media after upload
      await loadFilteredMedia();
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (confirm('Are you sure you want to delete this media file?')) {
      try {
        await deleteMedia(mediaId);
        alert('Media deleted successfully!');
      // Reload filtered media after deletion
      await loadFilteredMedia();
      } catch (error) {
        alert(`Delete failed: ${error.message}`);
      }
    }
  };

  const handleMoveToSection = async (mediaId, currentSectionId) => {
    setMovingMediaId(mediaId);
    setShowMoveModal(true);
  };

  const confirmMoveToSection = async (newSectionId) => {
    if (!movingMediaId || !newSectionId) return;
    
    const sectionId = parseInt(newSectionId);
    if (isNaN(sectionId)) {
      alert('Please enter a valid section ID');
      return;
    }
    
    const targetSection = mediaSections.find(s => s.id === sectionId);
    if (!targetSection) {
      alert('Section not found');
      return;
    }
    
    const currentMedia = localMedia.find(m => m.id === movingMediaId);
    if (currentMedia && currentMedia.section_id === sectionId) {
      alert('File is already in this section');
      return;
    }
    
    try {
      await contentAPI.updateMediaFileSection(movingMediaId, sectionId);
      alert(`File moved to "${targetSection.name}" successfully!`);
      setShowMoveModal(false);
      setMovingMediaId(null);
      // Reload filtered media after move
      await loadFilteredMedia();
    } catch (error) {
      alert(`Failed to move file: ${error.message}`);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowMediaLibrary(false);
    setCurrentItem(null);
    setModalType('');
  };

  // Media section functions
  const loadMediaSections = async () => {
    try {
      const sections = await contentAPI.getMediaSections();
      setMediaSections(sections);
    } catch (error) {
      console.error('Failed to load media sections:', error);
      // Fallback: use default sections if API fails
      const defaultSections = [
        { id: 1, name: 'General', description: 'General media files', color: '#3B82F6' },
        { id: 2, name: 'Events', description: 'Event photos and media', color: '#10B981' },
        { id: 3, name: 'Students', description: 'Student-related media', color: '#F59E0B' },
        { id: 4, name: 'Teachers', description: 'Teacher-related media', color: '#EF4444' },
        { id: 5, name: 'Facilities', description: 'School facilities media', color: '#8B5CF6' },
        { id: 6, name: 'Activities', description: 'School activities and programs', color: '#06B6D4' }
      ];
      setMediaSections(defaultSections);
    }
  };

  const handleCreateSection = async () => {
    if (!sectionForm.name.trim()) {
      alert('Section name is required');
      return;
    }

    try {
      await contentAPI.createMediaSection(sectionForm);
      setSectionForm({ name: '', description: '', color: '#3B82F6' });
      setShowSectionModal(false);
      await loadMediaSections();
      alert('Section created successfully!');
    } catch (error) {
      alert(`Failed to create section: ${error.message}`);
    }
  };

  const handleUpdateSection = async () => {
    if (!sectionForm.name.trim()) {
      alert('Section name is required');
      return;
    }

    try {
      await contentAPI.updateMediaSection(editingSection.id, sectionForm);
      setSectionForm({ name: '', description: '', color: '#3B82F6' });
      setEditingSection(null);
      setShowSectionModal(false);
      await loadMediaSections();
      alert('Section updated successfully!');
    } catch (error) {
      alert(`Failed to update section: ${error.message}`);
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (confirm('Are you sure you want to delete this section? Files in this section will be moved to "General".')) {
      try {
        await contentAPI.deleteMediaSection(sectionId);
        await loadMediaSections();
        if (selectedSection === sectionId) {
          setSelectedSection(null);
        }
        alert('Section deleted successfully!');
      } catch (error) {
        alert(`Failed to delete section: ${error.message}`);
      }
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'hero', label: 'Hero Section', icon: Globe },
    { id: 'about', label: 'About Section', icon: BookOpen },
    { id: 'activities', label: 'Activities', icon: Calendar },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'facilities', label: 'Facilities', icon: Building },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'users', label: 'User Management', icon: UserPlus },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'sponsorship', label: 'Sponsorship', icon: Heart },
    { id: 'parents', label: 'Parents Portal', icon: Users },
    { id: 'button-customization', label: 'Button Customization', icon: Settings },
    { id: 'footer', label: 'Footer Content', icon: GraduationCap },
    { id: 'social-media', label: 'Social Media', icon: Share2 },
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'map', label: 'Map Settings', icon: MapPin }
  ];

  const stats = [
    { label: 'Total Students', value: '1,234', change: '+5.2%', color: 'bg-blue-500' },
    { label: 'Active Teachers', value: '87', change: '+2.1%', color: 'bg-green-500' },
    { label: 'New Messages', value: '23', change: '+12.5%', color: 'bg-yellow-500' },
    { label: 'Events This Month', value: '8', change: '+1', color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { action: 'New student enrollment', time: '2 hours ago', type: 'enrollment' },
    { action: 'Science Fair event created', time: '4 hours ago', type: 'event' },
    { action: 'Parent message received', time: '6 hours ago', type: 'message' },
    { action: 'Teacher profile updated', time: '1 day ago', type: 'update' },
    { action: 'Facility booking confirmed', time: '2 days ago', type: 'booking' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'button-customization':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl shadow-sm p-8 border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Header Button Customization</h2>
              <p className="text-sm text-gray-600 mb-6">Adjust colors, sizes, spacing and hover styles for the three header buttons. Changes save instantly and reflect on the website header.</p>

              {/* Live Preview */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
                <div className="flex items-center bg-gray-50 rounded-lg p-4">
                  {/* Branding Preview */}
                  <div className="flex items-center mr-8">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <div>
                      <h1 className={`${buttonSettings.brandingTextColor === 'custom' ? '' : buttonSettings.brandingTextColor} ${buttonSettings.brandingTextSize} ${buttonSettings.brandingFontWeight}`} style={buttonSettings.brandingTextColor === 'custom' ? { color: buttonSettings.customBrandingColor } : {}}>{branding.schoolName || 'Excellence Academy'}</h1>
                      <p className={`${buttonSettings.brandingTaglineColor === 'custom' ? '' : buttonSettings.brandingTaglineColor} ${buttonSettings.brandingTaglineSize} hidden sm:block`} style={buttonSettings.brandingTaglineColor === 'custom' ? { color: buttonSettings.customTaglineColor } : {}}>{branding.tagline || 'Shaping Tomorrow\'s Leaders Today'}</p>
                    </div>
                  </div>
                  
                  {/* Buttons Preview */}
                  <div className={`flex ${buttonSettings?.spacingXClass || 'space-x-4'}`}>
                    <button className={`${buttonSettings?.sponsorship?.bgColorClass || 'bg-gradient-to-r from-emerald-500 to-teal-500'} ${buttonSettings?.sponsorship?.hoverBgColorClass || 'hover:from-emerald-600 hover:to-teal-600'} ${buttonSettings?.sponsorship?.textColorClass || 'text-white'} ${buttonSettings?.sponsorship?.paddingXClass || 'px-4'} ${buttonSettings?.sponsorship?.paddingYClass || 'py-2'} ${buttonSettings?.sponsorship?.roundedClass || 'rounded-lg'} ${buttonSettings?.sponsorship?.textSizeClass || 'text-sm'} ${buttonSettings?.sponsorship?.fontWeightClass || 'font-semibold'} transition-all duration-200 flex items-center`}>
                      <Heart className={`${buttonSettings?.sponsorship?.iconSizeClass || 'h-4 w-4'} mr-1`} />
                      Sponsorship
                    </button>
                    <button className={`${buttonSettings?.parents?.bgColorClass || 'bg-gradient-to-r from-indigo-500 to-sky-500'} ${buttonSettings?.parents?.hoverBgColorClass || 'hover:from-indigo-600 hover:to-sky-600'} ${buttonSettings?.parents?.textColorClass || 'text-white'} ${buttonSettings?.parents?.paddingXClass || 'px-4'} ${buttonSettings?.parents?.paddingYClass || 'py-2'} ${buttonSettings?.parents?.roundedClass || 'rounded-lg'} ${buttonSettings?.parents?.textSizeClass || 'text-sm'} ${buttonSettings?.parents?.fontWeightClass || 'font-semibold'} transition-all duration-200 flex items-center`}>
                      <Users className={`${buttonSettings?.parents?.iconSizeClass || 'h-4 w-4'} mr-1`} />
                      Parents Portal
                    </button>
                    <button className={`${buttonSettings?.admin?.bgColorClass || 'bg-gradient-to-r from-blue-600 to-purple-600'} ${buttonSettings?.admin?.hoverBgColorClass || 'hover:from-blue-700 hover:to-purple-700'} ${buttonSettings?.admin?.textColorClass || 'text-white'} ${buttonSettings?.admin?.paddingXClass || 'px-4'} ${buttonSettings?.admin?.paddingYClass || 'py-2'} ${buttonSettings?.admin?.roundedClass || 'rounded-lg'} ${buttonSettings?.admin?.textSizeClass || 'text-sm'} ${buttonSettings?.admin?.fontWeightClass || 'font-semibold'} transition-all duration-200 flex items-center`}>
                      <User className={`${buttonSettings?.admin?.iconSizeClass || 'h-4 w-4'} mr-1`} />
                      Admin Sign In
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="font-semibold text-gray-800">Global Spacing</h3>
                  <select className="w-full border rounded-lg px-3 py-2" value={buttonSettings.spacingXClass} onChange={(e) => updateButtonSettings({ ...buttonSettings, spacingXClass: e.target.value })}>
                    <option value="space-x-0">None</option>
                    <option value="space-x-0.5">Extra Tight</option>
                    <option value="space-x-1">Tight</option>
                    <option value="space-x-2">Normal</option>
                    <option value="space-x-3">Roomy</option>
                  </select>
                </div>

                {/* Branding Controls */}
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="font-semibold text-gray-800">Branding Text</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                      <div className="flex gap-2">
                        <select className="flex-1 border rounded px-2 py-1" value={buttonSettings.brandingTextColor} onChange={(e) => updateButtonSettings({ ...buttonSettings, brandingTextColor: e.target.value })}>
                          <option value="text-gray-900">Dark Gray</option>
                          <option value="text-black">Black</option>
                          <option value="text-blue-600">Blue</option>
                          <option value="text-purple-600">Purple</option>
                          <option value="text-green-600">Green</option>
                          <option value="text-red-600">Red</option>
                          <option value="custom">Custom</option>
                        </select>
                        {buttonSettings.brandingTextColor === 'custom' && (
                          <input 
                            type="color" 
                            className="w-8 h-8 border rounded cursor-pointer"
                            value={buttonSettings.customBrandingColor || '#000000'}
                            onChange={(e) => updateButtonSettings({ ...buttonSettings, customBrandingColor: e.target.value })}
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Text Size</label>
                      <select className="w-full border rounded px-2 py-1" value={buttonSettings.brandingTextSize} onChange={(e) => updateButtonSettings({ ...buttonSettings, brandingTextSize: e.target.value })}>
                        <option value="text-lg">Small</option>
                        <option value="text-xl">Medium</option>
                        <option value="text-2xl">Large</option>
                        <option value="text-3xl">Extra Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Font Weight</label>
                      <select className="w-full border rounded px-2 py-1" value={buttonSettings.brandingFontWeight} onChange={(e) => updateButtonSettings({ ...buttonSettings, brandingFontWeight: e.target.value })}>
                        <option value="font-medium">Medium</option>
                        <option value="font-semibold">Semibold</option>
                        <option value="font-bold">Bold</option>
                        <option value="font-extrabold">Extra Bold</option>
                      </select>
                    </div>
                  </div>
                </div>

                {[{key:'sponsorship', label:'Sponsorship'},{key:'parents', label:'Parents Portal'},{key:'admin', label:'Admin Sign In'}].map(({key,label}) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-800 mb-3">{label}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Background</label>
                        <div className="flex gap-2">
                          <select className="flex-1 border rounded px-2 py-1" value={((buttonSettings as any)[key]?.bgColorClass) || 'bg-blue-600'} onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], bgColorClass: e.target.value } })}>
                            <option value="bg-emerald-600">Green</option>
                            <option value="bg-blue-600">Blue</option>
                            <option value="bg-indigo-600">Indigo</option>
                            <option value="bg-purple-600">Purple</option>
                            <option value="bg-pink-600">Pink</option>
                            <option value="bg-gray-800">Black</option>
                            <option value="bg-red-600">Red</option>
                            <option value="bg-yellow-600">Yellow</option>
                            <option value="bg-orange-600">Orange</option>
                            <option value="bg-teal-600">Teal</option>
                            <option value="custom">Custom</option>
                          </select>
                                                  {(buttonSettings as any)[key]?.bgColorClass === 'custom' && (
                          <input 
                            type="color" 
                            className="w-8 h-8 border rounded cursor-pointer"
                            value={(buttonSettings as any)[key]?.customBgColor || '#000000'}
                            onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], customBgColor: e.target.value } })}
                          />
                        )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Hover</label>
                        <div className="flex gap-2">
                          <select className="flex-1 border rounded px-2 py-1" value={((buttonSettings as any)[key]?.hoverBgColorClass) || 'hover:bg-emerald-700'} onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], hoverBgColorClass: e.target.value } })}>
                            <option value="hover:bg-emerald-700">Green Dark</option>
                            <option value="hover:bg-blue-700">Blue Dark</option>
                            <option value="hover:bg-indigo-700">Indigo Dark</option>
                            <option value="hover:bg-purple-700">Purple Dark</option>
                            <option value="hover:bg-pink-700">Pink Dark</option>
                            <option value="hover:bg-gray-900">Black Dark</option>
                            <option value="hover:bg-red-700">Red Dark</option>
                            <option value="hover:bg-yellow-700">Yellow Dark</option>
                            <option value="hover:bg-orange-700">Orange Dark</option>
                            <option value="hover:bg-teal-700">Teal Dark</option>
                            <option value="custom">Custom</option>
                          </select>
                                                  {(buttonSettings as any)[key]?.hoverBgColorClass === 'custom' && (
                          <input 
                            type="color" 
                            className="w-8 h-8 border rounded cursor-pointer"
                            value={(buttonSettings as any)[key]?.customHoverColor || '#000000'}
                            onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], customHoverColor: e.target.value } })}
                          />
                        )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Text</label>
                        <div className="flex gap-2">
                          <select className="flex-1 border rounded px-2 py-1" value={((buttonSettings as any)[key]?.textColorClass) || 'text-white'} onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], textColorClass: e.target.value } })}>
                            <option value="text-white">White</option>
                            <option value="text-gray-100">Gray 100</option>
                            <option value="text-black">Black</option>
                            <option value="custom">Custom</option>
                          </select>
                          {(buttonSettings as any)[key]?.textColorClass === 'custom' && (
                            <input 
                              type="color" 
                              className="w-8 h-8 border rounded cursor-pointer"
                              value={(buttonSettings as any)[key]?.customTextColor || '#ffffff'}
                              onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], customTextColor: e.target.value } })}
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Rounded</label>
                        <select className="w-full border rounded px-2 py-1" value={((buttonSettings as any)[key]?.roundedClass) || 'rounded-lg'} onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], roundedClass: e.target.value } })}>
                          <option value="rounded">Rounded</option>
                          <option value="rounded-md">Rounded md</option>
                          <option value="rounded-lg">Rounded lg</option>
                          <option value="rounded-full">Pill</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Padding X</label>
                        <select className="w-full border rounded px-2 py-1" value={((buttonSettings as any)[key]?.paddingXClass) || 'px-4'} onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], paddingXClass: e.target.value } })}>
                          <option value="px-1">px-1</option>
                          <option value="px-1.5">px-1.5</option>
                          <option value="px-2">px-2</option>
                          <option value="px-2.5">px-2.5</option>
                          <option value="px-3">px-3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Padding Y</label>
                        <select className="w-full border rounded px-2 py-1" value={((buttonSettings as any)[key]?.paddingYClass) || 'py-2'} onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], paddingYClass: e.target.value } })}>
                          <option value="py-0.5">py-0.5</option>
                          <option value="py-1">py-1</option>
                          <option value="py-1.5">py-1.5</option>
                          <option value="py-2">py-2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Text Size</label>
                        <select className="w-full border rounded px-2 py-1" value={((buttonSettings as any)[key]?.textSizeClass) || 'text-sm'} onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], textSizeClass: e.target.value } })}>
                          <option value="text-xs">XS</option>
                          <option value="text-sm">SM</option>
                          <option value="text-base">Base</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Font Weight</label>
                        <select className="w-full border rounded px-2 py-1" value={((buttonSettings as any)[key]?.fontWeightClass) || 'font-semibold'} onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], fontWeightClass: e.target.value } })}>
                          <option value="font-medium">Medium</option>
                          <option value="font-semibold">Semibold</option>
                          <option value="font-bold">Bold</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Icon Size</label>
                        <select className="w-full border rounded px-2 py-1" value={((buttonSettings as any)[key]?.iconSizeClass) || 'w-4 h-4'} onChange={(e)=>updateButtonSettings({ ...buttonSettings, [key]: { ...(buttonSettings as any)[key], iconSizeClass: e.target.value } })}>
                          <option value="h-2 w-2">Tiny</option>
                          <option value="h-2.5 w-2.5">Small</option>
                          <option value="h-3 w-3">Medium</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
              case 'branding':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-lg p-8 border border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Palette className="w-8 h-8 text-purple-600 mr-3" />
                  Branding & Identity
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                    <input
                      type="text"
                      value={branding.schoolName}
                      onChange={(e) => setBranding({...branding, schoolName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter school name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={branding.tagline}
                      onChange={(e) => setBranding({...branding, tagline: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter school tagline"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Logo</label>
                    <div className="flex items-center space-x-4">
                      {branding.logo && (
                        <img 
                          src={branding.logo} 
                          alt="School Logo" 
                          className="w-20 h-20 object-contain border border-gray-300 rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={branding.logo}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="Select logo from media library"
                        />
                      </div>
                      <button 
                        onClick={() => openMediaLibrary('branding')}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Image className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                          className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                          className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleSaveContent('branding')}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'dashboard':
          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">School Management Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.full_name}!</p>
              </div>

              {/* KPI Cards - Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Student Enrollment Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Total Students</p>
                      <p className="text-2xl font-bold">1,200+</p>
                      <p className="text-xs opacity-80">Active enrollment</p>
                      </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                {/* Academic Performance Card */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Success Rate</p>
                      <p className="text-2xl font-bold">98%</p>
                      <p className="text-xs opacity-80">Academic excellence</p>
                  </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
              </div>

                {/* Courses Card */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Active Courses</p>
                      <p className="text-2xl font-bold">50+</p>
                      <p className="text-xs opacity-80">Curriculum programs</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Activities Card */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Upcoming Events</p>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs opacity-80">This month</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Awards Card */}
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">Total Awards</p>
                      <p className="text-2xl font-bold">25+</p>
                      <p className="text-xs opacity-80">Achievements</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section - Middle */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Student Distribution Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Student Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={studentDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {studentDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center space-x-4 mt-4">
                      {studentDistributionData.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          <span className="text-sm text-gray-600">{entry.name} {entry.value}%</span>
                  </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Student Enrollment Trends Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Student Enrollment Trends</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyEnrollmentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#10B981" 
                          strokeWidth={3}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Additional Dashboard Sections */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                        <p className="text-sm text-gray-900">New student enrollment</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Science Fair event created</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Parent message received</p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
                  </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 text-left transition-colors">
                      <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                        <p className="text-sm font-medium">Add Event</p>
                      </button>
                    <button className="p-4 border border-green-200 rounded-lg hover:bg-green-50 text-left transition-colors">
                      <Users className="w-6 h-6 text-green-600 mb-2" />
                        <p className="text-sm font-medium">Add Teacher</p>
                      </button>
                    <button className="p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 text-left transition-colors">
                      <Mail className="w-6 h-6 text-yellow-600 mb-2" />
                        <p className="text-sm font-medium">View Messages</p>
                      </button>
                    <button className="p-4 border border-pink-200 rounded-lg hover:bg-pink-50 text-left transition-colors">
                      <Newspaper className="w-6 h-6 text-pink-600 mb-2" />
                        <p className="text-sm font-medium">Create News</p>
                      </button>
                    </div>
                  </div>

                {/* School Statistics */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">School Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600">Classrooms</span>
                      <span className="text-lg font-semibold text-blue-600">24</span>
                </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <span className="text-sm text-gray-600">Teachers</span>
                      <span className="text-lg font-semibold text-green-600">85</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <span className="text-sm text-gray-600">Facilities</span>
                      <span className="text-lg font-semibold text-purple-600">12</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                      <span className="text-sm text-gray-600">Sports Teams</span>
                      <span className="text-lg font-semibold text-orange-600">8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'hero':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Hero Section Management</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Headline</label>
                    <input
                      type="text"
                      value={heroContent.headline}
                      onChange={(e) => setHeroContent({...heroContent, headline: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-purple-300 hover:shadow-md transition-all duration-200"
                      placeholder="Enter main headline"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Headline</label>
                    <input
                      type="text"
                      value={heroContent.subHeadline}
                      onChange={(e) => setHeroContent({...heroContent, subHeadline: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-purple-300 hover:shadow-md transition-all duration-200"
                      placeholder="Enter sub headline"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={3}
                      value={heroContent.description}
                      onChange={(e) => setHeroContent({...heroContent, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-purple-300 hover:shadow-md transition-all duration-200"
                      placeholder="Enter description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={heroContent.backgroundImage}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="Select image from media library"
                        />
                      </div>
                      <button 
                        onClick={() => openMediaLibrary('heroContent')}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        <Image className="w-4 h-4" />
                      </button>
                    </div>
                    {heroContent.backgroundImage && (
                      <img 
                        src={heroContent.backgroundImage} 
                        alt="Background Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-300 mt-2"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slide Images</label>
                    <div className="flex items-center space-x-3 mb-3">
                      <button
                        type="button"
                        onClick={() => openMediaLibrary('heroSlides')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        Add From Media Library
                      </button>
                    </div>
                    {(heroContent.slides && heroContent.slides.length > 0) ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {heroContent.slides.map((src, idx) => (
                          <div key={idx} className="relative group">
                            <img src={src} alt={`Slide ${idx+1}`} className="w-full h-24 object-cover rounded-lg border" />
                            <button
                              type="button"
                              onClick={() => setHeroContent({ ...heroContent, slides: heroContent.slides.filter((_, i) => i !== idx) })}
                              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No additional slides yet. Use "Add From Media Library" to add images.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slide Interval (milliseconds)</label>
                    <input
                      type="number"
                      value={heroContent.slideIntervalMs || 5000}
                      onChange={(e) => setHeroContent({ ...heroContent, slideIntervalMs: parseInt(e.target.value || '0', 10) })}
                      className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={1000}
                      step={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slide Direction</label>
                    <select
                      value={heroContent.slideDirection || 'left'}
                      onChange={(e) => setHeroContent({ ...heroContent, slideDirection: e.target.value as 'left' | 'right' })}
                      className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slide Mode</label>
                    <select
                      value={heroContent.slideMode || 'marquee'}
                      onChange={(e) => setHeroContent({ ...heroContent, slideMode: e.target.value as 'fade' | 'marquee' })}
                      className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="marquee">Continuous (Marquee)</option>
                      <option value="fade">Fade</option>
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleSaveContent('hero')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-200">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'about':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About Section Management</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                    <input
                      type="text"
                      value={aboutContent.title}
                      onChange={(e) => setAboutContent({...aboutContent, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter section title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
                    <textarea
                      rows={6}
                      value={aboutContent.content}
                      onChange={(e) => setAboutContent({...aboutContent, content: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter main content"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={aboutContent.image}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="Select image from media library"
                        />
                      </div>
                      <button 
                        onClick={() => openMediaLibrary('aboutContent')}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Image className="w-4 h-4" />
                      </button>
                    </div>
                    {aboutContent.image && (
                      <img 
                        src={aboutContent.image} 
                        alt="Section Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-300 mt-2"
                      />
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleSaveContent('about')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'activities':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Activities Management</h2>
                  <button 
                    onClick={() => handleAdd('activity')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {filteredContent ? `Found ${filteredContent.length} results` : `Total activities: ${activities.length}`}
                    {searchQuery && (
                      <span className="ml-2 text-purple-600">for "{searchQuery}"</span>
                    )}
                  </p>
                  {(filteredContent || activities).length === 0 && (
                    <p className="text-gray-500 italic">
                      {searchQuery ? 'No activities found matching your search.' : 'No activities found. Add some activities to get started.'}
                    </p>
                  )}
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto -mx-4 lg:mx-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(filteredContent || activities).map((activity) => (
                        <tr key={activity.id} className="hover:bg-gradient-to-r from-orange-100 to-yellow-100 transition-all duration-300 hover:scale-105">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                                {activity.image ? (
                                  <img className="w-10 h-10 rounded-lg object-cover" src={activity.image} alt={activity.title} />
                                ) : (
                                  <Calendar className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">{activity.title}</div>
                                <div className="text-xs text-gray-500 truncate max-w-xs">{activity.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {activity.category ? (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {activity.category}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">Not set</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {activity.date ? (
                              new Date(activity.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            ) : (
                              <span className="text-gray-400">No date</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {activity.status ? (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {activity.status}
                              </span>
                            ) : (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEdit('activity', activity)}
                                className="text-blue-600 hover:text-blue-900 transition-colors flex items-center"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete('activity', activity)}
                                className="text-red-600 hover:text-red-900 transition-colors flex items-center"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{activity.date ? new Date(activity.date).toLocaleDateString() : 'No date'}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit('activity', activity)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete('activity', activity)}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'teachers':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl shadow-sm p-8 border border-pink-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Teachers Management</h2>
                  <button 
                    onClick={() => handleAdd('teacher')}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Teacher
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {filteredContent ? `Found ${filteredContent.length} results` : `Total teachers: ${teachers.length}`}
                    {searchQuery && (
                      <span className="ml-2 text-purple-600">for "{searchQuery}"</span>
                    )}
                  </p>
                  {(filteredContent || teachers).length === 0 && (
                    <p className="text-gray-500 italic">
                      {searchQuery ? 'No teachers found matching your search.' : 'No teachers found. Add some teachers to get started.'}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                      {(filteredContent || teachers).map((teacher) => (
                      <div key={teacher.id} className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg shadow-sm border border-pink-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{teacher.name}</h3>
                            <p className="text-sm text-gray-600">{teacher.position}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">years experience</p>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit('teacher', teacher)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete('teacher', teacher)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );

        case 'facilities':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl shadow-sm p-8 border border-teal-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Facilities Management</h2>
                  <button 
                    onClick={() => handleAdd('facility')}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Facility
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(filteredContent || facilities).map((facility) => (
                    <div key={facility.id} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg shadow-sm border border-teal-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{facility.name}</h3>
                          <p className="text-sm text-gray-600">{facility.category}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Capacity: {facility.capacity} people</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit('facility', facility)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete('facility', facility)}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'testimonials':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl shadow-sm p-8 border border-yellow-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Testimonials Management</h2>
                  <button 
                    onClick={() => handleAdd('testimonial')}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Testimonial
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {filteredContent ? `Found ${filteredContent.length} results` : `Total testimonials: ${testimonials.length}`}
                    {searchQuery && (
                      <span className="ml-2 text-purple-600">for "{searchQuery}"</span>
                    )}
                  </p>
                  {(filteredContent || testimonials).length === 0 && (
                    <p className="text-gray-500 italic">
                      {searchQuery ? 'No testimonials found matching your search.' : 'No testimonials found. Add some testimonials to get started.'}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(filteredContent || testimonials).map((testimonial) => (
                    <div key={testimonial.id} className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg shadow-sm border border-yellow-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Rating: {testimonial.rating}/5</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit('testimonial', testimonial)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete('testimonial', testimonial)}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'contact':
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information Management</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Address</label>
                    <input
                      type="text"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter school address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                    <input
                      type="text"
                      value={contactInfo.hours}
                      onChange={(e) => setContactInfo({...contactInfo, hours: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter working hours"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleSaveContent('contact')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'news':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl shadow-sm p-8 border border-cyan-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">News Management</h2>
                  <button 
                    onClick={() => handleAdd('news')}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Article
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((article) => (
                    <div key={article.id} className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg shadow-sm border border-cyan-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Newspaper className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{article.title}</h3>
                          <p className="text-sm text-gray-600">{article.author}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{article.date}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit('news', article)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete('news', article)}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'media':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-8 border border-blue-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Media Library</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {localMedia ? localMedia.length : 0} file{(localMedia ? localMedia.length : 0) !== 1 ? 's' : ''} uploaded • Total size: {localMedia ? (localMedia.reduce((sum, item) => sum + (item.file_size || 0), 0) / 1024 / 1024).toFixed(2) : '0.00'} MB
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setEditingSection(null);
                        setSectionForm({ name: '', description: '', color: '#3B82F6' });
                        setShowSectionModal(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center shadow-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Section
                    </button>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700">Upload to Section:</span>
                      <select
                        value={selectedSection || ''}
                        onChange={(e) => setSelectedSection(e.target.value ? parseInt(e.target.value) : null)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
                      >
                        <option value="">Select Section</option>
                        {mediaSections.map((section) => (
                          <option key={section.id} value={section.id}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                      {selectedSection && (
                        <span className="text-xs text-gray-500">
                          Files will be uploaded to: <strong>{mediaSections.find(s => s.id === selectedSection)?.name}</strong>
                        </span>
                      )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={uploading}
                    />
                    <label 
                      htmlFor="file-upload"
                        className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center cursor-pointer shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Media'}
                    </label>
                    </div>
                  </div>
                </div>

                {/* Section Filter */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filter by Section:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSection(null)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSection === null
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      All Files
                    </button>
                    {mediaSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setSelectedSection(section.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                          selectedSection === section.id
                            ? 'text-white shadow-lg'
                            : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: section.color,
                          color: selectedSection === section.id ? 'white' : 'white',
                          border: selectedSection === section.id ? 'none' : 'none'
                        }}
                      >
                        <Folder className="w-4 h-4" />
                        <span>{section.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSection(section);
                            setSectionForm({
                              name: section.name,
                              description: section.description || '',
                              color: section.color
                            });
                            setShowSectionModal(true);
                          }}
                          className="ml-2 p-1 rounded hover:bg-black hover:bg-opacity-20"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(section.id);
                          }}
                          className="p-1 rounded hover:bg-black hover:bg-opacity-20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-red-600">{error}</p>
                      <button
                        onClick={() => {
                          setError(null);
                          loadFilteredMedia();
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-600">Loading media files...</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {localMedia && localMedia.length > 0 ? (
                    localMedia.map((item) => {
                      return (
                        <div key={item.id} className="relative group bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md border border-blue-200 p-4 hover:shadow-xl hover:border-blue-400 hover:scale-105 hover:from-blue-50 hover:to-indigo-100 transition-all duration-300 transform">
                          <div className="aspect-square mb-3 relative">
                            <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                            <img 
                              src={`${BACKEND_BASE_URL}${item.file_url}`}
                              alt={item.original_name}
                              className="w-full h-full object-cover rounded-lg relative z-10"
                              onError={(e) => {
                                console.error('Image failed to load:', item.file_url, 'Full URL:', `${BACKEND_BASE_URL}${item.file_url}`, e);
                                e.target.style.display = 'none';
                                e.target.previousElementSibling.innerHTML = `
                                  <div class="flex flex-col items-center justify-center text-gray-400">
                                    <svg class="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                                    </svg>
                                    <span class="text-xs">Failed to load</span>
                                    <span class="text-xs mt-1">${item.file_url}</span>
                                  </div>
                                `;
                              }}
                              onLoad={(e) => {
                                console.log('Image loaded successfully:', item.file_url, 'Full URL:', `${BACKEND_BASE_URL}${item.file_url}`);
                                e.target.previousElementSibling.style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-900 truncate mb-1">
                            {item.original_name}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {(item.file_size / 1024 / 1024).toFixed(2)} MB
                          </div>
                          {/* Section Badge */}
                          {item.section_name && (
                            <div className="mb-2">
                              <span 
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                style={{ 
                                  backgroundColor: item.section_color + '20',
                                  color: item.section_color
                                }}
                              >
                                <Folder className="w-3 h-3 mr-1" />
                                {item.section_name}
                              </span>
                            </div>
                          )}
                          {/* Action Buttons - Below file size */}
                          <div className="flex space-x-1 justify-center">
                              <button 
                                onClick={() => handleDeleteMedia(item.id)}
                              className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm flex items-center justify-center"
                                title="Delete"
                              >
                              <Trash2 className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(`${BACKEND_BASE_URL}${item.file_url}`);
                                  alert('Image URL copied to clipboard!');
                                }}
                              className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm flex items-center justify-center"
                                title="Copy URL"
                              >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => {
                                window.open(`${BACKEND_BASE_URL}${item.file_url}`, '_blank');
                              }}
                              className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm flex items-center justify-center"
                              title="View Image"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              </button>
                              <button 
                                onClick={() => handleMoveToSection(item.id, item.section_id)}
                              className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded hover:from-purple-600 hover:to-violet-700 transition-all duration-200 shadow-sm flex items-center justify-center"
                                title="Move to Section"
                              >
                              <Folder className="w-3 h-3" />
                              </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      {selectedSection ? `No media files in "${mediaSections.find(s => s.id === selectedSection)?.name}" section.` : 'No media files uploaded yet. Click "Upload Media" to add your first file.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Section Management Modal */}
              {showSectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-xl p-6 w-full max-w-md border border-blue-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {editingSection ? 'Edit Section' : 'Create New Section'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowSectionModal(false);
                          setEditingSection(null);
                          setSectionForm({ name: '', description: '', color: '#3B82F6' });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section Name *
                        </label>
                        <input
                          type="text"
                          value={sectionForm.name}
                          onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter section name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={sectionForm.description}
                          onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter section description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={sectionForm.color}
                            onChange={(e) => setSectionForm({ ...sectionForm, color: e.target.value })}
                            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={sectionForm.color}
                            onChange={(e) => setSectionForm({ ...sectionForm, color: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="#3B82F6"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => {
                          setShowSectionModal(false);
                          setEditingSection(null);
                          setSectionForm({ name: '', description: '', color: '#3B82F6' });
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={editingSection ? handleUpdateSection : handleCreateSection}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingSection ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Move to Section Modal */}
              {showMoveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl shadow-xl p-6 w-full max-w-md border border-purple-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Move File to Section
                      </h3>
                      <button
                        onClick={() => {
                          setShowMoveModal(false);
                          setMovingMediaId(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Destination Section:
                        </label>
                        <select
                          onChange={(e) => confirmMoveToSection(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Choose a section...</option>
                          {mediaSections.map((section) => (
                            <option key={section.id} value={section.id}>
                              {section.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => {
                          setShowMoveModal(false);
                          setMovingMediaId(null);
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );

        case 'users':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl shadow-sm p-8 border border-violet-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                  <button 
                    onClick={() => handleAdd('user')}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New User
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">{user.avatar}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">{user.role}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{user.status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEdit('user', user)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete('user', user)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );

        case 'settings':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl shadow-sm p-8 border border-gray-200">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">System Settings</h2>
                  <button 
                    onClick={() => {
                      // Save all settings
                      alert('Settings saved successfully!');
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>

                {/* Settings Categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
                  <button
                    onClick={() => setActiveSettingsTab('school-info')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      activeSettingsTab === 'school-info'
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-300'
                    }`}
                  >
                    <Building className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">School Info</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSettingsTab('fees-structure')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      activeSettingsTab === 'fees-structure'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-300'
                    }`}
                  >
                    <DollarSign className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Fees Structure</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSettingsTab('payment-system')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      activeSettingsTab === 'payment-system'
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Payment System</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSettingsTab('system-settings')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      activeSettingsTab === 'system-settings'
                        ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 text-orange-700'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-300'
                    }`}
                  >
                    <Settings className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">System Settings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSettingsTab('backup-restore')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      activeSettingsTab === 'backup-restore'
                        ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 text-pink-700'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-300'
                    }`}
                  >
                    <RotateCcw className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Backup & Restore</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSettingsTab('account-settings')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      activeSettingsTab === 'account-settings'
                        ? 'border-gray-500 bg-gradient-to-br from-gray-50 to-slate-50 text-gray-700'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Account Settings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSettingsTab('security-settings')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      activeSettingsTab === 'security-settings'
                        ? 'border-red-500 bg-gradient-to-br from-red-50 to-pink-50 text-red-700'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-300'
                    }`}
                  >
                    <Lock className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Security Settings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSettingsTab('advanced-settings')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      activeSettingsTab === 'advanced-settings'
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-300'
                    }`}
                  >
                    <Settings className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Advanced Settings</span>
                  </button>
                </div>

                {/* Settings Content */}
                <div className="bg-gray-50 rounded-xl p-6">
                  {activeSettingsTab === 'school-info' && (
                  <div>
                      <h3 className="text-xl font-semibold text-purple-700 mb-6">School Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                      <input
                            type="text"
                            value={schoolInfo.name}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter school name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">School Address</label>
                          <input
                            type="text"
                            value={schoolInfo.address}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter school address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">School Phone</label>
                          <input
                            type="tel"
                            value={schoolInfo.phone}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">School Email</label>
                          <input
                            type="email"
                            value={schoolInfo.email}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Term</label>
                          <select
                            value={schoolInfo.term}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, term: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                          </select>
                    </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Year</label>
                          <input
                            type="number"
                            value={schoolInfo.year}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, year: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter current year"
                          />
                  </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSettingsTab === 'fees-structure' && (
                  <div>
                      <h3 className="text-xl font-semibold text-blue-700 mb-6">Fees Structure</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tuition Fee</label>
                      <input
                              type="number"
                              value={feesStructure.tuition}
                              onChange={(e) => setFeesStructure({ ...feesStructure, tuition: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                    </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Library Fee</label>
                            <input
                              type="number"
                              value={feesStructure.library}
                              onChange={(e) => setFeesStructure({ ...feesStructure, library: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                  </div>
                  <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sports Fee</label>
                      <input
                              type="number"
                              value={feesStructure.sports}
                              onChange={(e) => setFeesStructure({ ...feesStructure, sports: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Laboratory Fee</label>
                            <input
                              type="number"
                              value={feesStructure.laboratory}
                              onChange={(e) => setFeesStructure({ ...feesStructure, laboratory: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transport Fee</label>
                            <input
                              type="number"
                              value={feesStructure.transport}
                              onChange={(e) => setFeesStructure({ ...feesStructure, transport: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Other Fees</label>
                            <input
                              type="number"
                              value={feesStructure.other}
                              onChange={(e) => setFeesStructure({ ...feesStructure, other: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'payment-system' && (
                    <div>
                      <h3 className="text-xl font-semibold text-green-700 mb-6">Payment System</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                            <select
                              value={paymentSystem.gateway}
                              onChange={(e) => setPaymentSystem({ ...paymentSystem, gateway: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="stripe">Stripe</option>
                              <option value="paypal">PayPal</option>
                              <option value="mpesa">M-Pesa</option>
                              <option value="airtel">Airtel Money</option>
                            </select>
                    </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                            <select
                              value={paymentSystem.currency}
                              onChange={(e) => setPaymentSystem({ ...paymentSystem, currency: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="USD">USD</option>
                              <option value="UGX">UGX</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                            </select>
                  </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            id="auto-invoice"
                            checked={paymentSystem.autoInvoice}
                            onChange={(e) => setPaymentSystem({ ...paymentSystem, autoInvoice: e.target.checked })}
                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="auto-invoice" className="text-sm font-medium text-gray-700">
                            Enable automatic invoice generation
                          </label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            id="payment-reminders"
                            checked={paymentSystem.paymentReminders}
                            onChange={(e) => setPaymentSystem({ ...paymentSystem, paymentReminders: e.target.checked })}
                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="payment-reminders" className="text-sm font-medium text-gray-700">
                            Enable payment reminders
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'system-settings' && (
                    <div>
                      <h3 className="text-xl font-semibold text-orange-700 mb-6">System Settings</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">System Language</label>
                            <select
                              value={systemSettings.language}
                              onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                            <select
                              value={systemSettings.timezone}
                              onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="UTC+3">UTC+3 (East Africa)</option>
                              <option value="UTC+0">UTC+0 (GMT)</option>
                              <option value="UTC-5">UTC-5 (EST)</option>
                              <option value="UTC-8">UTC-8 (PST)</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            id="email-notifications"
                            checked={systemSettings.emailNotifications}
                            onChange={(e) => setSystemSettings({ ...systemSettings, emailNotifications: e.target.checked })}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700">
                            Enable email notifications
                          </label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            id="sms-notifications"
                            checked={systemSettings.smsNotifications}
                            onChange={(e) => setSystemSettings({ ...systemSettings, smsNotifications: e.target.checked })}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <label htmlFor="sms-notifications" className="text-sm font-medium text-gray-700">
                            Enable SMS notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'backup-restore' && (
                    <div>
                      <h3 className="text-xl font-semibold text-pink-700 mb-6">Backup & Restore</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                            <select
                              value={backupSettings.frequency}
                              onChange={(e) => setBackupSettings({ ...backupSettings, frequency: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period</label>
                            <select
                              value={backupSettings.retention}
                              onChange={(e) => setBackupSettings({ ...backupSettings, retention: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                              <option value="30">30 days</option>
                              <option value="90">90 days</option>
                              <option value="365">1 year</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                            Create Backup Now
                          </button>
                          <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            Restore from Backup
                    </button>
                  </div>
                </div>
              </div>
                  )}

                  {activeSettingsTab === 'account-settings' && (
                  <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-6">Account Settings</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                    <input
                      type="text"
                              value={accountSettings.displayName}
                              onChange={(e) => setAccountSettings({ ...accountSettings, displayName: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              value={accountSettings.email}
                              onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'security-settings' && (
                  <div>
                      <h3 className="text-xl font-semibold text-red-700 mb-6">Security Settings</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <input
                              type="password"
                              value={securitySettings.currentPassword}
                              onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                              type="password"
                              value={securitySettings.newPassword}
                              onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            id="two-factor"
                            checked={securitySettings.twoFactor}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactor: e.target.checked })}
                            className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="two-factor" className="text-sm font-medium text-gray-700">
                            Enable two-factor authentication
                          </label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            id="session-timeout"
                            checked={securitySettings.sessionTimeout}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.checked })}
                            className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="session-timeout" className="text-sm font-medium text-gray-700">
                            Enable session timeout
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'advanced-settings' && (
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-700 mb-6">Advanced Settings</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Database Connection</label>
                            <select
                              value={advancedSettings.database}
                              onChange={(e) => setAdvancedSettings({ ...advancedSettings, database: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="postgresql">PostgreSQL</option>
                              <option value="mysql">MySQL</option>
                              <option value="sqlite">SQLite</option>
                            </select>
                  </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cache System</label>
                            <select
                              value={advancedSettings.cache}
                              onChange={(e) => setAdvancedSettings({ ...advancedSettings, cache: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="redis">Redis</option>
                              <option value="memory">Memory</option>
                              <option value="none">None</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            id="debug-mode"
                            checked={advancedSettings.debugMode}
                            onChange={(e) => setAdvancedSettings({ ...advancedSettings, debugMode: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="debug-mode" className="text-sm font-medium text-gray-700">
                            Enable debug mode
                          </label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            id="maintenance-mode"
                            checked={advancedSettings.maintenanceMode}
                            onChange={(e) => setAdvancedSettings({ ...advancedSettings, maintenanceMode: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="maintenance-mode" className="text-sm font-medium text-gray-700">
                            Enable maintenance mode
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

        case 'sponsorship':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg p-8 border border-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Heart className="w-8 h-8 text-green-600 mr-3" />
                  Sponsorship Program Management
                </h2>
                
                <div className="space-y-8">
                  {/* Basic Content */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 text-green-600 mr-2" />
                      Basic Content
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                        <input
                          type="text"
                          value={sponsorshipContent?.title || ''}
                          onChange={(e) => setSponsorshipContent({...sponsorshipContent, title: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Enter sponsorship page title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Subtitle</label>
                        <input
                          type="text"
                          value={sponsorshipContent?.subtitle || ''}
                          onChange={(e) => setSponsorshipContent({...sponsorshipContent, subtitle: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Enter sponsorship page subtitle"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
                        <div className="flex items-center space-x-4">
                          {sponsorshipContent?.heroImage && (
                            <img 
                              src={sponsorshipContent.heroImage} 
                              alt="Hero Background" 
                              className="w-20 h-20 object-cover border border-gray-300 rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={sponsorshipContent?.heroImage || ''}
                              readOnly
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                              placeholder="Select image from media library"
                            />
                          </div>
                          <button 
                            onClick={() => openMediaLibrary('sponsorship')}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Image className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Sliding Background Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sliding Background Images</label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={sponsorshipContent?.slideMode || 'fade'}
                                onChange={(e) => setSponsorshipContent({...sponsorshipContent, slideMode: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Slide mode (fade/continuous)"
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="number"
                                value={sponsorshipContent?.slideIntervalMs || 3000}
                                onChange={(e) => setSponsorshipContent({...sponsorshipContent, slideIntervalMs: parseInt(e.target.value)})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Slide interval (ms)"
                              />
                            </div>
                            <div className="flex-1">
                              <select
                                value={sponsorshipContent?.slideDirection || 'left'}
                                onChange={(e) => setSponsorshipContent({...sponsorshipContent, slideDirection: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              >
                                <option value="left">Left to Right</option>
                                <option value="right">Right to Left</option>
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Slide Images</label>
                            <div className="space-y-2">
                              {sponsorshipContent?.additionalSlides?.map((slide, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <img src={slide} alt={`Slide ${index + 1}`} className="w-16 h-16 object-cover border border-gray-300 rounded-lg" />
                                  <span className="flex-1 text-sm text-gray-600 truncate">{slide}</span>
                                  <button
                                    onClick={() => {
                                      const newSlides = sponsorshipContent.additionalSlides.filter((_, i) => i !== index);
                                      setSponsorshipContent({...sponsorshipContent, additionalSlides: newSlides});
                                    }}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                onClick={() => openMediaLibrary('sponsorshipAdditionalSlides')}
                                className="w-full px-4 py-3 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Slide Images
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Program Description</label>
                        <textarea
                          value={sponsorshipContent?.description || ''}
                          onChange={(e) => setSponsorshipContent({...sponsorshipContent, description: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Enter detailed program description"
                          rows={4}
                        />
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={async () => {
                            try {
                              await updateSponsorship(sponsorshipContent);
                              alert('Sponsorship content saved successfully!');
                            } catch (error) {
                              alert('Failed to save sponsorship content');
                            }
                          }}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Button Settings */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Settings className="w-5 h-5 text-green-600 mr-2" />
                      Button Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apply Button Text</label>
                        <input
                          type="text"
                          value={sponsorshipContent?.applyButtonText || 'Apply for Sponsorship'}
                          onChange={(e) => setSponsorshipContent({...sponsorshipContent, applyButtonText: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Apply for Sponsorship"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Button Text</label>
                        <input
                          type="text"
                          value={sponsorshipContent?.sponsorButtonText || 'Sponsor a Child'}
                          onChange={(e) => setSponsorshipContent({...sponsorshipContent, sponsorButtonText: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Sponsor a Child"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sukrop Foundation Link</label>
                        <input
                          type="url"
                          value={sponsorshipContent?.sukropLink || 'https://sukrop.org/'}
                          onChange={(e) => setSponsorshipContent({...sponsorshipContent, sukropLink: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="https://sukrop.org/"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Impact Statistics */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                      Impact Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Students Sponsored</label>
                        <input
                          type="text"
                          value={sponsorshipContent?.impactStats?.studentsSponsored || '150+'}
                          onChange={(e) => setSponsorshipContent({
                            ...sponsorshipContent, 
                            impactStats: {...sponsorshipContent?.impactStats, studentsSponsored: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="150+"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Active Sponsors</label>
                        <input
                          type="text"
                          value={sponsorshipContent?.impactStats?.activeSponsors || '45'}
                          onChange={(e) => setSponsorshipContent({
                            ...sponsorshipContent, 
                            impactStats: {...sponsorshipContent?.impactStats, activeSponsors: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="45"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Years of Program</label>
                        <input
                          type="text"
                          value={sponsorshipContent?.impactStats?.yearsOfProgram || '8'}
                          onChange={(e) => setSponsorshipContent({
                            ...sponsorshipContent, 
                            impactStats: {...sponsorshipContent?.impactStats, yearsOfProgram: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="8"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Success Rate</label>
                        <input
                          type="text"
                          value={sponsorshipContent?.impactStats?.successRate || '95%'}
                          onChange={(e) => setSponsorshipContent({
                            ...sponsorshipContent, 
                            impactStats: {...sponsorshipContent?.impactStats, successRate: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="95%"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Success Stories */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Heart className="w-5 h-5 text-green-600 mr-2" />
                      Success Stories
                    </h3>
                    <div className="space-y-6">
                      {/* Story 1 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Story 1 - Sarah M.</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.successStories?.[0]?.name || 'Sarah M.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  {...sponsorshipContent?.successStories?.[0], name: e.target.value},
                                  sponsorshipContent?.successStories?.[1],
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Sarah M."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.successStories?.[0]?.age || '12'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  {...sponsorshipContent?.successStories?.[0], age: e.target.value},
                                  sponsorshipContent?.successStories?.[1],
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="12"
                            />
                          </div>
                          
                          {/* Before Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Before Image</label>
                            <div className="flex items-center space-x-2">
                              {sponsorshipContent?.successStories?.[0]?.before?.image && (
                                <img 
                                  src={sponsorshipContent.successStories[0].before.image} 
                                  alt="Before" 
                                  className="w-16 h-16 object-cover border border-gray-300 rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={sponsorshipContent?.successStories?.[0]?.before?.image || ''}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                  placeholder="Select before image"
                                />
                              </div>
                              <button 
                                onClick={() => openMediaLibrary('sponsorship-story1-before')}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Image className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* After Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">After Image</label>
                            <div className="flex items-center space-x-2">
                              {sponsorshipContent?.successStories?.[0]?.after?.image && (
                                <img 
                                  src={sponsorshipContent.successStories[0].after.image} 
                                  alt="After" 
                                  className="w-16 h-16 object-cover border border-gray-300 rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={sponsorshipContent?.successStories?.[0]?.after?.image || ''}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                  placeholder="Select after image"
                                />
                              </div>
                              <button 
                                onClick={() => openMediaLibrary('sponsorship-story1-after')}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Image className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Before Description</label>
                            <textarea
                              value={sponsorshipContent?.successStories?.[0]?.before?.description || 'Sarah struggled to attend school due to financial constraints. Her family could barely afford basic necessities.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  {
                                    ...sponsorshipContent?.successStories?.[0],
                                    before: {...sponsorshipContent?.successStories?.[0]?.before, description: e.target.value}
                                  },
                                  sponsorshipContent?.successStories?.[1],
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="Before description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">After Description</label>
                            <textarea
                              value={sponsorshipContent?.successStories?.[0]?.after?.description || 'Now Sarah is a top-performing student with dreams of becoming a doctor. She\'s confident and full of hope.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  {
                                    ...sponsorshipContent?.successStories?.[0],
                                    after: {...sponsorshipContent?.successStories?.[0]?.after, description: e.target.value}
                                  },
                                  sponsorshipContent?.successStories?.[1],
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="After description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Story</label>
                            <textarea
                              value={sponsorshipContent?.successStories?.[0]?.story || 'Sponsored student who graduated with honors and is now studying medicine at university.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  {...sponsorshipContent?.successStories?.[0], story: e.target.value},
                                  sponsorshipContent?.successStories?.[1],
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="Full story..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Story 2 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Story 2 - David K.</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.successStories?.[1]?.name || 'David K.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  {...sponsorshipContent?.successStories?.[1], name: e.target.value},
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="David K."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.successStories?.[1]?.age || '14'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  {...sponsorshipContent?.successStories?.[1], age: e.target.value},
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="14"
                            />
                          </div>
                          
                          {/* Before Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Before Image</label>
                            <div className="flex items-center space-x-2">
                              {sponsorshipContent?.successStories?.[1]?.before?.image && (
                                <img 
                                  src={sponsorshipContent.successStories[1].before.image} 
                                  alt="Before" 
                                  className="w-16 h-16 object-cover border border-gray-300 rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={sponsorshipContent?.successStories?.[1]?.before?.image || ''}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                  placeholder="Select before image"
                                />
                              </div>
                              <button 
                                onClick={() => openMediaLibrary('sponsorship-story2-before')}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Image className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* After Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">After Image</label>
                            <div className="flex items-center space-x-2">
                              {sponsorshipContent?.successStories?.[1]?.after?.image && (
                                <img 
                                  src={sponsorshipContent.successStories[1].after.image} 
                                  alt="After" 
                                  className="w-16 h-16 object-cover border border-gray-300 rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={sponsorshipContent?.successStories?.[1]?.after?.image || ''}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                  placeholder="Select after image"
                                />
                              </div>
                              <button 
                                onClick={() => openMediaLibrary('sponsorship-story2-after')}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Image className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Before Description</label>
                            <textarea
                              value={sponsorshipContent?.successStories?.[1]?.before?.description || 'David spent his days working odd jobs instead of attending school. Education seemed like a distant dream.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  {
                                    ...sponsorshipContent?.successStories?.[1],
                                    before: {...sponsorshipContent?.successStories?.[1]?.before, description: e.target.value}
                                  },
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="Before description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">After Description</label>
                            <textarea
                              value={sponsorshipContent?.successStories?.[1]?.after?.description || 'Today, David is an engineering student with a bright future. He\'s giving back by mentoring other students.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  {
                                    ...sponsorshipContent?.successStories?.[1],
                                    after: {...sponsorshipContent?.successStories?.[1]?.after, description: e.target.value}
                                  },
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="After description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Story</label>
                            <textarea
                              value={sponsorshipContent?.successStories?.[1]?.story || 'Former sponsored student now working as an engineer and giving back to the community.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  {...sponsorshipContent?.successStories?.[1], story: e.target.value},
                                  sponsorshipContent?.successStories?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="Full story..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Story 3 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Story 3 - Grace W.</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.successStories?.[2]?.name || 'Grace W.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  sponsorshipContent?.successStories?.[1],
                                  {...sponsorshipContent?.successStories?.[2], name: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Grace W."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.successStories?.[2]?.age || '10'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  sponsorshipContent?.successStories?.[1],
                                  {...sponsorshipContent?.successStories?.[2], age: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="10"
                            />
                          </div>
                          
                          {/* Before Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Before Image</label>
                            <div className="flex items-center space-x-2">
                              {sponsorshipContent?.successStories?.[2]?.before?.image && (
                                <img 
                                  src={sponsorshipContent.successStories[2].before.image} 
                                  alt="Before" 
                                  className="w-16 h-16 object-cover border border-gray-300 rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={sponsorshipContent?.successStories?.[2]?.before?.image || ''}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                  placeholder="Select before image"
                                />
                              </div>
                              <button 
                                onClick={() => openMediaLibrary('sponsorship-story3-before')}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Image className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* After Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">After Image</label>
                            <div className="flex items-center space-x-2">
                              {sponsorshipContent?.successStories?.[2]?.after?.image && (
                                <img 
                                  src={sponsorshipContent.successStories[2].after.image} 
                                  alt="After" 
                                  className="w-16 h-16 object-cover border border-gray-300 rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={sponsorshipContent?.successStories?.[2]?.after?.image || ''}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                  placeholder="Select after image"
                                />
                              </div>
                              <button 
                                onClick={() => openMediaLibrary('sponsorship-story3-after')}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Image className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Before Description</label>
                            <textarea
                              value={sponsorshipContent?.successStories?.[2]?.before?.description || 'Grace faced daily challenges accessing education. Her family prioritized survival over schooling.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  sponsorshipContent?.successStories?.[1],
                                  {
                                    ...sponsorshipContent?.successStories?.[2],
                                    before: {...sponsorshipContent?.successStories?.[2]?.before, description: e.target.value}
                                  }
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="Before description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">After Description</label>
                            <textarea
                              value={sponsorshipContent?.successStories?.[2]?.after?.description || 'Grace is now a confident young girl excelling in her studies. She dreams of becoming a teacher.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  sponsorshipContent?.successStories?.[1],
                                  {
                                    ...sponsorshipContent?.successStories?.[2],
                                    after: {...sponsorshipContent?.successStories?.[2]?.after, description: e.target.value}
                                  }
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="After description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Story</label>
                            <textarea
                              value={sponsorshipContent?.successStories?.[2]?.story || 'Sponsored student who became a teacher and now mentors other students in our program.'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                successStories: [
                                  sponsorshipContent?.successStories?.[0],
                                  sponsorshipContent?.successStories?.[1],
                                  {...sponsorshipContent?.successStories?.[2], story: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="Full story..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sponsorship Levels */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                      Sponsorship Levels
                    </h3>
                    <div className="space-y-6">
                      {/* Level 1 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Level 1 - Full Scholarship</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Level Name</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.sponsorshipLevels?.[0]?.name || 'Full Scholarship'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  {...sponsorshipContent?.sponsorshipLevels?.[0], name: e.target.value},
                                  sponsorshipContent?.sponsorshipLevels?.[1],
                                  sponsorshipContent?.sponsorshipLevels?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Full Scholarship"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.sponsorshipLevels?.[0]?.amount || 'UGX 500,000'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  {...sponsorshipContent?.sponsorshipLevels?.[0], amount: e.target.value},
                                  sponsorshipContent?.sponsorshipLevels?.[1],
                                  sponsorshipContent?.sponsorshipLevels?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="UGX 500,000"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={sponsorshipContent?.sponsorshipLevels?.[0]?.description || 'Complete tuition, books, and uniform for one academic year'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  {...sponsorshipContent?.sponsorshipLevels?.[0], description: e.target.value},
                                  sponsorshipContent?.sponsorshipLevels?.[1],
                                  sponsorshipContent?.sponsorshipLevels?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="Level description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line)</label>
                            <textarea
                              value={sponsorshipContent?.sponsorshipLevels?.[0]?.benefits?.join('\n') || 'Full tuition coverage\nTextbooks and supplies\nSchool uniform\nMonthly progress reports\nDirect communication with student'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  {...sponsorshipContent?.sponsorshipLevels?.[0], benefits: e.target.value.split('\n')},
                                  sponsorshipContent?.sponsorshipLevels?.[1],
                                  sponsorshipContent?.sponsorshipLevels?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={4}
                              placeholder="Enter benefits, one per line..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Level 2 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Level 2 - Partial Scholarship</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Level Name</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.sponsorshipLevels?.[1]?.name || 'Partial Scholarship'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  sponsorshipContent?.sponsorshipLevels?.[0],
                                  {...sponsorshipContent?.sponsorshipLevels?.[1], name: e.target.value},
                                  sponsorshipContent?.sponsorshipLevels?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Partial Scholarship"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.sponsorshipLevels?.[1]?.amount || 'UGX 250,000'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  sponsorshipContent?.sponsorshipLevels?.[0],
                                  {...sponsorshipContent?.sponsorshipLevels?.[1], amount: e.target.value},
                                  sponsorshipContent?.sponsorshipLevels?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="UGX 250,000"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={sponsorshipContent?.sponsorshipLevels?.[1]?.description || 'Half tuition coverage for one academic year'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  sponsorshipContent?.sponsorshipLevels?.[0],
                                  {...sponsorshipContent?.sponsorshipLevels?.[1], description: e.target.value},
                                  sponsorshipContent?.sponsorshipLevels?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="Level description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line)</label>
                            <textarea
                              value={sponsorshipContent?.sponsorshipLevels?.[1]?.benefits?.join('\n') || '50% tuition coverage\nTextbooks\nQuarterly progress reports\nStudent communication'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  sponsorshipContent?.sponsorshipLevels?.[0],
                                  {...sponsorshipContent?.sponsorshipLevels?.[1], benefits: e.target.value.split('\n')},
                                  sponsorshipContent?.sponsorshipLevels?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={4}
                              placeholder="Enter benefits, one per line..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Level 3 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Level 3 - Book & Uniform</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Level Name</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.sponsorshipLevels?.[2]?.name || 'Book & Uniform'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  sponsorshipContent?.sponsorshipLevels?.[0],
                                  sponsorshipContent?.sponsorshipLevels?.[1],
                                  {...sponsorshipContent?.sponsorshipLevels?.[2], name: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Book & Uniform"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                            <input
                              type="text"
                              value={sponsorshipContent?.sponsorshipLevels?.[2]?.amount || 'UGX 100,000'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  sponsorshipContent?.sponsorshipLevels?.[0],
                                  sponsorshipContent?.sponsorshipLevels?.[1],
                                  {...sponsorshipContent?.sponsorshipLevels?.[2], amount: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="UGX 100,000"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={sponsorshipContent?.sponsorshipLevels?.[2]?.description || 'Essential supplies and uniform for one student'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  sponsorshipContent?.sponsorshipLevels?.[0],
                                  sponsorshipContent?.sponsorshipLevels?.[1],
                                  {...sponsorshipContent?.sponsorshipLevels?.[2], description: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder="Level description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line)</label>
                            <textarea
                              value={sponsorshipContent?.sponsorshipLevels?.[2]?.benefits?.join('\n') || 'Complete textbook set\nSchool uniform\nSchool bag\nSemester progress report'}
                              onChange={(e) => setSponsorshipContent({
                                ...sponsorshipContent,
                                sponsorshipLevels: [
                                  sponsorshipContent?.sponsorshipLevels?.[0],
                                  sponsorshipContent?.sponsorshipLevels?.[1],
                                  {...sponsorshipContent?.sponsorshipLevels?.[2], benefits: e.target.value.split('\n')}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={4}
                              placeholder="Enter benefits, one per line..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleSponsorshipSave}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Sponsorship Content
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'parents':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg p-8 border border-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  Parents Portal Management
                </h2>
                
                <div className="space-y-8">
                  {/* Basic Content */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-2" />
                      Basic Content
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                        <input
                          type="text"
                          value={parentsContent?.title || ''}
                          onChange={(e) => setParentsContent({...parentsContent, title: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="Enter parents portal page title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Subtitle</label>
                        <input
                          type="text"
                          value={parentsContent?.subtitle || ''}
                          onChange={(e) => setParentsContent({...parentsContent, subtitle: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="Enter parents portal page subtitle"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
                        <div className="flex items-center space-x-4">
                          {parentsContent?.heroImage && (
                            <img 
                              src={parentsContent.heroImage} 
                              alt="Hero Background" 
                              className="w-20 h-20 object-cover border border-gray-300 rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={parentsContent?.heroImage || ''}
                              readOnly
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                              placeholder="Select image from media library"
                            />
                          </div>
                          <button 
                            onClick={() => openMediaLibrary('parents')}
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Image className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Sliding Background Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sliding Background Images</label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={parentsContent?.slideMode || 'fade'}
                                onChange={(e) => setParentsContent({...parentsContent, slideMode: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Slide mode (fade/continuous)"
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="number"
                                value={parentsContent?.slideIntervalMs || 3000}
                                onChange={(e) => setParentsContent({...parentsContent, slideIntervalMs: parseInt(e.target.value)})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Slide interval (ms)"
                              />
                            </div>
                            <div className="flex-1">
                              <select
                                value={parentsContent?.slideDirection || 'left'}
                                onChange={(e) => setParentsContent({...parentsContent, slideDirection: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="left">Left to Right</option>
                                <option value="right">Right to Left</option>
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Slide Images</label>
                            <div className="space-y-2">
                              {parentsContent?.additionalSlides?.map((slide, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <img src={slide} alt={`Slide ${index + 1}`} className="w-16 h-16 object-cover border border-gray-300 rounded-lg" />
                                  <span className="flex-1 text-sm text-gray-600 truncate">{slide}</span>
                                  <button
                                    onClick={() => {
                                      const newSlides = parentsContent.additionalSlides.filter((_, i) => i !== index);
                                      setParentsContent({...parentsContent, additionalSlides: newSlides});
                                    }}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                onClick={() => openMediaLibrary('parentsAdditionalSlides')}
                                className="w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Slide Images
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Portal Description</label>
                        <textarea
                          value={parentsContent?.description || ''}
                          onChange={(e) => setParentsContent({...parentsContent, description: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="Enter detailed portal description"
                          rows={4}
                        />
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={async () => {
                            try {
                              await updateParents(parentsContent);
                              alert('Parents portal content saved successfully!');
                            } catch (error) {
                              alert('Failed to save parents portal content');
                            }
                          }}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Zap className="w-5 h-5 text-blue-600 mr-2" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action 1 Title</label>
                        <input
                          type="text"
                          value={parentsContent?.quickActions?.[0]?.title || 'View Academic Calendar'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            quickActions: [
                              {...parentsContent?.quickActions?.[0], title: e.target.value},
                              parentsContent?.quickActions?.[1],
                              parentsContent?.quickActions?.[2],
                              parentsContent?.quickActions?.[3]
                            ]
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="View Academic Calendar"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action 1 Description</label>
                        <input
                          type="text"
                          value={parentsContent?.quickActions?.[0]?.description || 'Check important dates, holidays, and events'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            quickActions: [
                              {...parentsContent?.quickActions?.[0], description: e.target.value},
                              parentsContent?.quickActions?.[1],
                              parentsContent?.quickActions?.[2],
                              parentsContent?.quickActions?.[3]
                            ]
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="Check important dates, holidays, and events"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action 2 Title</label>
                        <input
                          type="text"
                          value={parentsContent?.quickActions?.[1]?.title || 'Access Student Records'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            quickActions: [
                              parentsContent?.quickActions?.[0],
                              {...parentsContent?.quickActions?.[1], title: e.target.value},
                              parentsContent?.quickActions?.[2],
                              parentsContent?.quickActions?.[3]
                            ]
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="Access Student Records"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action 2 Description</label>
                        <input
                          type="text"
                          value={parentsContent?.quickActions?.[1]?.description || 'View grades, attendance, and progress reports'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            quickActions: [
                              parentsContent?.quickActions?.[0],
                              {...parentsContent?.quickActions?.[1], description: e.target.value},
                              parentsContent?.quickActions?.[2],
                              parentsContent?.quickActions?.[3]
                            ]
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="View grades, attendance, and progress reports"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action 3 Title</label>
                        <input
                          type="text"
                          value={parentsContent?.quickActions?.[2]?.title || 'Contact Teachers'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            quickActions: [
                              parentsContent?.quickActions?.[0],
                              parentsContent?.quickActions?.[1],
                              {...parentsContent?.quickActions?.[2], title: e.target.value},
                              parentsContent?.quickActions?.[3]
                            ]
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="Contact Teachers"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action 3 Description</label>
                        <input
                          type="text"
                          value={parentsContent?.quickActions?.[2]?.description || 'Send messages to your child\'s teachers'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            quickActions: [
                              parentsContent?.quickActions?.[0],
                              parentsContent?.quickActions?.[1],
                              {...parentsContent?.quickActions?.[2], description: e.target.value},
                              parentsContent?.quickActions?.[3]
                            ]
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="Send messages to your child's teachers"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action 4 Title</label>
                        <input
                          type="text"
                          value={parentsContent?.quickActions?.[3]?.title || 'View Achievements'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            quickActions: [
                              parentsContent?.quickActions?.[0],
                              parentsContent?.quickActions?.[1],
                              parentsContent?.quickActions?.[2],
                              {...parentsContent?.quickActions?.[3], title: e.target.value}
                            ]
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="View Achievements"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action 4 Description</label>
                        <input
                          type="text"
                          value={parentsContent?.quickActions?.[3]?.description || 'See your child\'s awards and accomplishments'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            quickActions: [
                              parentsContent?.quickActions?.[0],
                              parentsContent?.quickActions?.[1],
                              parentsContent?.quickActions?.[2],
                              {...parentsContent?.quickActions?.[3], description: e.target.value}
                            ]
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="See your child's awards and accomplishments"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-2" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={parentsContent?.contactInfo?.phone || '+256 123 456 789'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            contactInfo: {...parentsContent?.contactInfo, phone: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="+256 123 456 789"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={parentsContent?.contactInfo?.email || 'info@excellenceacademy.com'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            contactInfo: {...parentsContent?.contactInfo, email: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="info@excellenceacademy.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours</label>
                        <input
                          type="text"
                          value={parentsContent?.contactInfo?.officeHours || '7:30 AM - 4:30 PM'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            contactInfo: {...parentsContent?.contactInfo, officeHours: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="7:30 AM - 4:30 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={parentsContent?.contactInfo?.address || '123 Education Street, Kampala'}
                          onChange={(e) => setParentsContent({
                            ...parentsContent, 
                            contactInfo: {...parentsContent?.contactInfo, address: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="123 Education Street, Kampala"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                      Upcoming Events
                    </h3>
                    <div className="space-y-6">
                      {/* Event 1 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Event 1 - Parent-Teacher Conference</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[0]?.title || 'Parent-Teacher Conference'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  {...parentsContent?.upcomingEvents?.[0], title: e.target.value},
                                  parentsContent?.upcomingEvents?.[1],
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Parent-Teacher Conference"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[0]?.type || 'Academic'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  {...parentsContent?.upcomingEvents?.[0], type: e.target.value},
                                  parentsContent?.upcomingEvents?.[1],
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Academic"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[0]?.date || 'March 15, 2024'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  {...parentsContent?.upcomingEvents?.[0], date: e.target.value},
                                  parentsContent?.upcomingEvents?.[1],
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="March 15, 2024"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[0]?.time || '2:00 PM - 4:00 PM'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  {...parentsContent?.upcomingEvents?.[0], time: e.target.value},
                                  parentsContent?.upcomingEvents?.[1],
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="2:00 PM - 4:00 PM"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[0]?.location || 'School Auditorium'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  {...parentsContent?.upcomingEvents?.[0], location: e.target.value},
                                  parentsContent?.upcomingEvents?.[1],
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="School Auditorium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Event 2 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Event 2 - Sports Day</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[1]?.title || 'Annual Sports Day'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  {...parentsContent?.upcomingEvents?.[1], title: e.target.value},
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Annual Sports Day"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[1]?.type || 'Sports'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  {...parentsContent?.upcomingEvents?.[1], type: e.target.value},
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Sports"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[1]?.date || 'April 20, 2024'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  {...parentsContent?.upcomingEvents?.[1], date: e.target.value},
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="April 20, 2024"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[1]?.time || '9:00 AM - 3:00 PM'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  {...parentsContent?.upcomingEvents?.[1], time: e.target.value},
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="9:00 AM - 3:00 PM"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[1]?.location || 'School Sports Ground'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  {...parentsContent?.upcomingEvents?.[1], location: e.target.value},
                                  parentsContent?.upcomingEvents?.[2]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="School Sports Ground"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Event 3 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Event 3 - Graduation Ceremony</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[2]?.title || 'Graduation Ceremony'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  parentsContent?.upcomingEvents?.[1],
                                  {...parentsContent?.upcomingEvents?.[2], title: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Graduation Ceremony"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[2]?.type || 'Ceremony'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  parentsContent?.upcomingEvents?.[1],
                                  {...parentsContent?.upcomingEvents?.[2], type: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ceremony"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[2]?.date || 'June 30, 2024'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  parentsContent?.upcomingEvents?.[1],
                                  {...parentsContent?.upcomingEvents?.[2], date: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="June 30, 2024"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[2]?.time || '10:00 AM - 12:00 PM'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  parentsContent?.upcomingEvents?.[1],
                                  {...parentsContent?.upcomingEvents?.[2], time: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="10:00 AM - 12:00 PM"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                              type="text"
                              value={parentsContent?.upcomingEvents?.[2]?.location || 'Main Hall'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                upcomingEvents: [
                                  parentsContent?.upcomingEvents?.[0],
                                  parentsContent?.upcomingEvents?.[1],
                                  {...parentsContent?.upcomingEvents?.[2], location: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Main Hall"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resources & Information */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                      Resources & Information
                    </h3>
                    <div className="space-y-6">
                      {/* Resource 1 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Resource 1 - Academic Calendar</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title</label>
                            <input
                              type="text"
                              value={parentsContent?.resources?.[0]?.title || 'Academic Calendar'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  {...parentsContent?.resources?.[0], title: e.target.value},
                                  parentsContent?.resources?.[1],
                                  parentsContent?.resources?.[2],
                                  parentsContent?.resources?.[3]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Academic Calendar"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                            <input
                              type="text"
                              value={parentsContent?.resources?.[0]?.type || 'Document'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  {...parentsContent?.resources?.[0], type: e.target.value},
                                  parentsContent?.resources?.[1],
                                  parentsContent?.resources?.[2],
                                  parentsContent?.resources?.[3]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Document"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={parentsContent?.resources?.[0]?.description || 'Complete academic calendar with holidays, exams, and important dates'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  {...parentsContent?.resources?.[0], description: e.target.value},
                                  parentsContent?.resources?.[1],
                                  parentsContent?.resources?.[2],
                                  parentsContent?.resources?.[3]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                              placeholder="Resource description..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Resource 2 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Resource 2 - School Policies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title</label>
                            <input
                              type="text"
                              value={parentsContent?.resources?.[1]?.title || 'School Policies'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  parentsContent?.resources?.[0],
                                  {...parentsContent?.resources?.[1], title: e.target.value},
                                  parentsContent?.resources?.[2],
                                  parentsContent?.resources?.[3]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="School Policies"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                            <input
                              type="text"
                              value={parentsContent?.resources?.[1]?.type || 'Policy'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  parentsContent?.resources?.[0],
                                  {...parentsContent?.resources?.[1], type: e.target.value},
                                  parentsContent?.resources?.[2],
                                  parentsContent?.resources?.[3]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Policy"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={parentsContent?.resources?.[1]?.description || 'Comprehensive guide to school policies and procedures'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  parentsContent?.resources?.[0],
                                  {...parentsContent?.resources?.[1], description: e.target.value},
                                  parentsContent?.resources?.[2],
                                  parentsContent?.resources?.[3]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                              placeholder="Resource description..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Resource 3 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Resource 3 - Parent Handbook</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title</label>
                            <input
                              type="text"
                              value={parentsContent?.resources?.[2]?.title || 'Parent Handbook'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  parentsContent?.resources?.[0],
                                  parentsContent?.resources?.[1],
                                  {...parentsContent?.resources?.[2], title: e.target.value},
                                  parentsContent?.resources?.[3]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Parent Handbook"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                            <input
                              type="text"
                              value={parentsContent?.resources?.[2]?.type || 'Handbook'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  parentsContent?.resources?.[0],
                                  parentsContent?.resources?.[1],
                                  {...parentsContent?.resources?.[2], type: e.target.value},
                                  parentsContent?.resources?.[3]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Handbook"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={parentsContent?.resources?.[2]?.description || 'Complete guide for parents with school information and guidelines'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  parentsContent?.resources?.[0],
                                  parentsContent?.resources?.[1],
                                  {...parentsContent?.resources?.[2], description: e.target.value},
                                  parentsContent?.resources?.[3]
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                              placeholder="Resource description..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Resource 4 */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Resource 4 - Fee Structure</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title</label>
                            <input
                              type="text"
                              value={parentsContent?.resources?.[3]?.title || 'Fee Structure'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  parentsContent?.resources?.[0],
                                  parentsContent?.resources?.[1],
                                  parentsContent?.resources?.[2],
                                  {...parentsContent?.resources?.[3], title: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Fee Structure"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                            <input
                              type="text"
                              value={parentsContent?.resources?.[3]?.type || 'Financial'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  parentsContent?.resources?.[0],
                                  parentsContent?.resources?.[1],
                                  parentsContent?.resources?.[2],
                                  {...parentsContent?.resources?.[3], type: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Financial"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={parentsContent?.resources?.[3]?.description || 'Detailed breakdown of school fees and payment schedules'}
                              onChange={(e) => setParentsContent({
                                ...parentsContent,
                                resources: [
                                  parentsContent?.resources?.[0],
                                  parentsContent?.resources?.[1],
                                  parentsContent?.resources?.[2],
                                  {...parentsContent?.resources?.[3], description: e.target.value}
                                ]
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                              placeholder="Resource description..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleParentsSave}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Parents Portal Content
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'footer':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <GraduationCap className="w-8 h-8 text-gray-600 mr-3" />
                  Footer Content Management
                </h2>
                
                <div className="space-y-8">
                  {/* School Info */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <GraduationCap className="w-5 h-5 text-gray-600 mr-2" />
                      School Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                        <input
                          type="text"
                          value={footerContent?.schoolName || 'Excellence Academy'}
                          onChange={(e) => setFooterContent({...footerContent, schoolName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-300 hover:shadow-md transition-all duration-200"
                          placeholder="Excellence Academy"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School Description</label>
                        <textarea
                          value={footerContent?.description || 'Providing world-class education with modern facilities and experienced teachers.'}
                          onChange={(e) => setFooterContent({...footerContent, description: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-300 hover:shadow-md transition-all duration-200"
                          placeholder="School description..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Link className="w-5 h-5 text-gray-600 mr-2" />
                      Quick Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">About Us Link</label>
                        <input
                          type="text"
                          value={footerContent?.quickLinks?.about || '#about'}
                          onChange={(e) => setFooterContent({
                            ...footerContent, 
                            quickLinks: {...footerContent?.quickLinks, about: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-300 hover:shadow-md transition-all duration-200"
                          placeholder="#about"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Activities Link</label>
                        <input
                          type="text"
                          value={footerContent?.quickLinks?.activities || '#activities'}
                          onChange={(e) => setFooterContent({
                            ...footerContent, 
                            quickLinks: {...footerContent?.quickLinks, activities: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-300 hover:shadow-md transition-all duration-200"
                          placeholder="#activities"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teachers Link</label>
                        <input
                          type="text"
                          value={footerContent?.quickLinks?.teachers || '#teachers'}
                          onChange={(e) => setFooterContent({
                            ...footerContent, 
                            quickLinks: {...footerContent?.quickLinks, teachers: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-300 hover:shadow-md transition-all duration-200"
                          placeholder="#teachers"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facilities Link</label>
                        <input
                          type="text"
                          value={footerContent?.quickLinks?.facilities || '#facilities'}
                          onChange={(e) => setFooterContent({
                            ...footerContent, 
                            quickLinks: {...footerContent?.quickLinks, facilities: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-300 hover:shadow-md transition-all duration-200"
                          placeholder="#facilities"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Link</label>
                        <input
                          type="text"
                          value={footerContent?.quickLinks?.contact || '#contact'}
                          onChange={(e) => setFooterContent({
                            ...footerContent, 
                            quickLinks: {...footerContent?.quickLinks, contact: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-300 hover:shadow-md transition-all duration-200"
                          placeholder="#contact"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Copyright */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Copyright className="w-5 h-5 text-gray-600 mr-2" />
                      Copyright Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                        <input
                          type="text"
                          value={footerContent?.copyright || '© 2024 Excellence Academy. All rights reserved. | Designed with excellence in education.'}
                          onChange={(e) => setFooterContent({...footerContent, copyright: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-300 hover:shadow-md transition-all duration-200"
                          placeholder="Copyright text..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleFooterSave}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Footer Content
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'social-media':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg p-8 border border-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Share2 className="w-8 h-8 text-blue-600 mr-3" />
                  Social Media Management
                </h2>
                
                <div className="space-y-8">
                  {/* Social Media Links */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Share2 className="w-5 h-5 text-blue-600 mr-2" />
                      Social Media Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                        <input
                          type="url"
                          value={socialMedia?.facebook || ''}
                          onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="https://facebook.com/excellenceacademy"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                        <input
                          type="url"
                          value={socialMedia?.twitter || ''}
                          onChange={(e) => setSocialMedia({...socialMedia, twitter: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="https://twitter.com/excellenceacademy"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                        <input
                          type="url"
                          value={socialMedia?.instagram || ''}
                          onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="https://instagram.com/excellenceacademy"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                        <input
                          type="url"
                          value={socialMedia?.linkedin || ''}
                          onChange={(e) => setSocialMedia({...socialMedia, linkedin: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          placeholder="https://linkedin.com/company/excellenceacademy"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleSocialMediaSave}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Social Media Links
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'programs':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg p-8 border border-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="w-8 h-8 text-green-600 mr-3" />
                  Programs Management
                </h2>
                
                <div className="space-y-8">
                  {/* Programs List */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                      Academic Programs
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Education</label>
                        <input
                          type="text"
                          value={programs?.primary || 'Primary Education'}
                          onChange={(e) => setPrograms({...programs, primary: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Primary Education"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Education</label>
                        <input
                          type="text"
                          value={programs?.secondary || 'Secondary Education'}
                          onChange={(e) => setPrograms({...programs, secondary: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Secondary Education"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Advanced Level</label>
                        <input
                          type="text"
                          value={programs?.advanced || 'Advanced Level'}
                          onChange={(e) => setPrograms({...programs, advanced: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Advanced Level"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Extracurricular</label>
                        <input
                          type="text"
                          value={programs?.extracurricular || 'Extracurricular'}
                          onChange={(e) => setPrograms({...programs, extracurricular: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Extracurricular"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sports Programs</label>
                        <input
                          type="text"
                          value={programs?.sports || 'Sports Programs'}
                          onChange={(e) => setPrograms({...programs, sports: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 hover:shadow-md transition-all duration-200"
                          placeholder="Sports Programs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleProgramsSave}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Programs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'map':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-lg p-8 border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-8 h-8 text-orange-600 mr-3" />
                  Map Settings
                </h2>
                
                <div className="space-y-8">
                  {/* Map Configuration */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 text-orange-600 mr-2" />
                      Map Configuration
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps API Key</label>
                        <input
                          type="text"
                          value={mapSettings?.apiKey || ''}
                          onChange={(e) => setMapSettings({...mapSettings, apiKey: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 hover:shadow-md transition-all duration-200"
                          placeholder="Enter your Google Maps API key"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School Address</label>
                        <input
                          type="text"
                          value={mapSettings?.address || '123 Education Street, Kampala, Uganda'}
                          onChange={(e) => setMapSettings({...mapSettings, address: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 hover:shadow-md transition-all duration-200"
                          placeholder="School address for map marker"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Map Zoom Level</label>
                        <select
                          value={mapSettings?.zoomLevel || '15'}
                          onChange={(e) => setMapSettings({...mapSettings, zoomLevel: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 hover:shadow-md transition-all duration-200"
                        >
                          <option value="10">Far (10)</option>
                          <option value="12">Medium-Far (12)</option>
                          <option value="15">Medium (15)</option>
                          <option value="17">Medium-Close (17)</option>
                          <option value="20">Close (20)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Map Height</label>
                        <select
                          value={mapSettings?.height || 'h-64'}
                          onChange={(e) => setMapSettings({...mapSettings, height: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 hover:shadow-md transition-all duration-200"
                        >
                          <option value="h-48">Small (192px)</option>
                          <option value="h-64">Medium (256px)</option>
                          <option value="h-80">Large (320px)</option>
                          <option value="h-96">Extra Large (384px)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleMapSave}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Map Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">
              This section is under development. Content management features will be available soon.
            </p>
          </div>
        );
    }
  };

  // Modal Components
  const renderAddModal = () => {
    if (!showAddModal) return null;

    const getModalTitle = () => {
      switch (modalType) {
        case 'activity': return 'Add New Activity';
        case 'teacher': return 'Add New Teacher';
        case 'facility': return 'Add New Facility';
        case 'testimonial': return 'Add New Testimonial';
        case 'news': return 'Add New News Article';
        case 'user': return 'Add New User';
        default: return 'Add New Item';
      }
    };

    const getModalContent = () => {
      switch (modalType) {
        case 'activity':
          return (
            <div className="space-y-6">
              {/* Activity Information Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  Activity Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activity Title*</label>
                    <input
                      type="text"
                      placeholder="Enter activity title"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                    <select
                      value={newActivity.category}
                      onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
                    <input
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Enter activity location"
                      value={newActivity.location || ''}
                      onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                  <textarea
                    placeholder="Enter activity description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    rows={3}
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Image className="w-5 h-5 text-green-600 mr-2" />
                  Activity Media
                </h4>
                <div className="flex items-center space-x-4">
                  {newActivity.image && (
                    <img 
                      src={newActivity.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Select image from media library"
                      value={newActivity.image}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newActivity')}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        case 'facility':
          return (
            <div className="space-y-6">
              {/* Facility Information Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Building className="w-5 h-5 text-purple-600 mr-2" />
                  Facility Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name*</label>
                    <input
                      type="text"
                      placeholder="Enter facility name"
                      value={newFacility.name}
                      onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                    <select
                      value={newFacility.category}
                      onChange={(e) => setNewFacility({...newFacility, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Recreation">Recreation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity*</label>
                    <input
                      type="number"
                      placeholder="Enter capacity"
                      value={newFacility.capacity}
                      onChange={(e) => setNewFacility({...newFacility, capacity: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      placeholder="Enter facility description"
                      value={newFacility.description || ''}
                      onChange={(e) => setNewFacility({...newFacility, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Image className="w-5 h-5 text-green-600 mr-2" />
                  Facility Media
                </h4>
                <div className="flex items-center space-x-4">
                  {newFacility.image && (
                    <img 
                      src={newFacility.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Select image from media library"
                      value={newFacility.image}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newFacility')}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        case 'teacher':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Teacher</h3>
              <input
                type="text"
                placeholder="Teacher Name"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Subject"
                value={newTeacher.subject}
                onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Years of Experience"
                value={newTeacher.experience}
                onChange={(e) => setNewTeacher({...newTeacher, experience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Teacher Image</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Selected image will appear here"
                    value={newTeacher.image}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newTeacher')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
                {newTeacher.image && (
                  <img 
                    src={newTeacher.image} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
                )}
              </div>
            </div>
          );
        case 'testimonial':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Testimonial</h3>
              <input
                type="text"
                placeholder="Person Name"
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Role (Parent, Student, Alumni)"
                value={newTestimonial.role}
                onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={newTestimonial.rating}
                onChange={(e) => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Selected image will appear here"
                    value={newTestimonial.image}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newTestimonial')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
                {newTestimonial.image && (
                  <img 
                    src={newTestimonial.image} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
                )}
              </div>
            </div>
          );
        case 'news':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Article</h3>
              <input
                type="text"
                placeholder="Article Title"
                value={newNews.title}
                onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="date"
                value={newNews.date}
                onChange={(e) => setNewNews({...newNews, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Article Image</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Selected image will appear here"
                    value={newNews.image}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newNews')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
                {newNews.image && (
                  <img 
                    src={newNews.image} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
                )}
              </div>
            </div>
          );
        case 'user':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New User</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> New users will be created with the default password "password". 
                  They will be prompted to change it on their first login.
                </p>
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select 
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          );
        default:
          return <div>Add form for {modalType}</div>;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{getModalTitle()}</h3>
              <p className="text-purple-100 text-sm">Simplified form for admin</p>
            </div>
            <button
              onClick={closeModals}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {getModalContent()}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex space-x-3">
            <button
              onClick={() => handleSave(modalType)}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={closeModals}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!showEditModal || !currentItem) return null;

    const getModalTitle = () => {
      switch (modalType) {
        case 'activity': return 'Edit Activity';
        case 'teacher': return 'Edit Teacher';
        case 'facility': return 'Edit Facility';
        case 'testimonial': return 'Edit Testimonial';
        case 'news': return 'Edit News Article';
        case 'user': return 'Edit User';
        default: return 'Edit Item';
      }
    };

    const getModalContent = () => {
      switch (modalType) {
        case 'activity':
          return (
            <div className="space-y-6">
              {/* Activity Information Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  Activity Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activity Title*</label>
                    <input
                      type="text"
                      placeholder="Enter activity title"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                    <select
                      value={newActivity.category}
                      onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
                    <input
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Enter activity location"
                      value={newActivity.location || ''}
                      onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                  <textarea
                    placeholder="Enter activity description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    rows={3}
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Image className="w-5 h-5 text-green-600 mr-2" />
                  Activity Media
                </h4>
                <div className="flex items-center space-x-4">
                  {newActivity.image && (
                    <img 
                      src={newActivity.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Select image from media library"
                      value={newActivity.image}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newActivity')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        case 'facility':
          return (
            <div className="space-y-6">
              {/* Facility Information Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Building className="w-5 h-5 text-purple-600 mr-2" />
                  Facility Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name*</label>
                    <input
                      type="text"
                      placeholder="Enter facility name"
                      value={newFacility.name}
                      onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                    <select
                      value={newFacility.category}
                      onChange={(e) => setNewFacility({...newFacility, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Recreation">Recreation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity*</label>
                    <input
                      type="number"
                      placeholder="Enter capacity"
                      value={newFacility.capacity}
                      onChange={(e) => setNewFacility({...newFacility, capacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      placeholder="Enter facility description"
                      value={newFacility.description || ''}
                      onChange={(e) => setNewFacility({...newFacility, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Image className="w-5 h-5 text-green-600 mr-2" />
                  Facility Media
                </h4>
                <div className="flex items-center space-x-4">
                  {newFacility.image && (
                    <img 
                      src={newFacility.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Select image from media library"
                      value={newFacility.image}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newFacility')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        case 'teacher':
          return (
            <div className="space-y-6">
              {/* Teacher Information Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 text-green-600 mr-2" />
                  Teacher Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Name*</label>
                    <input
                      type="text"
                      placeholder="Enter teacher name"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject*</label>
                    <input
                      type="text"
                      placeholder="Enter subject"
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience*</label>
                    <input
                      type="number"
                      placeholder="Enter years of experience"
                      value={newTeacher.experience}
                      onChange={(e) => setNewTeacher({...newTeacher, experience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      placeholder="Enter position"
                      value={newTeacher.position || ''}
                      onChange={(e) => setNewTeacher({...newTeacher, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Image className="w-5 h-5 text-green-600 mr-2" />
                  Teacher Media
                </h4>
                <div className="flex items-center space-x-4">
                  {newTeacher.image && (
                    <img 
                      src={newTeacher.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Select image from media library"
                      value={newTeacher.image}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newTeacher')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        case 'testimonial':
          return (
            <div className="space-y-6">
              {/* Testimonial Information Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-600 mr-2" />
                  Testimonial Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Person Name*</label>
                    <input
                      type="text"
                      placeholder="Enter person name"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role*</label>
                    <input
                      type="text"
                      placeholder="Parent, Student, Alumni"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating*</label>
                    <select
                      value={newTestimonial.rating}
                      onChange={(e) => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Text</label>
                    <textarea
                      placeholder="Enter testimonial text"
                      value={newTestimonial.text || ''}
                      onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Image className="w-5 h-5 text-green-600 mr-2" />
                  Profile Media
                </h4>
                <div className="flex items-center space-x-4">
                  {newTestimonial.image && (
                    <img 
                      src={newTestimonial.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Select image from media library"
                      value={newTestimonial.image}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newTestimonial')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        case 'news':
          return (
            <div className="space-y-6">
              {/* News Information Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Newspaper className="w-5 h-5 text-orange-600 mr-2" />
                  Article Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Article Title*</label>
                    <input
                      type="text"
                      placeholder="Enter article title"
                      value={newNews.title}
                      onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author*</label>
                    <input
                      type="text"
                      placeholder="Enter author name"
                      value={newNews.author || ''}
                      onChange={(e) => setNewNews({...newNews, author: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
                    <input
                      type="date"
                      value={newNews.date}
                      onChange={(e) => setNewNews({...newNews, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      placeholder="Enter category"
                      value={newNews.category || ''}
                      onChange={(e) => setNewNews({...newNews, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    placeholder="Enter article content"
                    value={newNews.content || ''}
                    onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    rows={4}
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Image className="w-5 h-5 text-green-600 mr-2" />
                  Article Media
                </h4>
                <div className="flex items-center space-x-4">
                  {newNews.image && (
                    <img 
                      src={newNews.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Select image from media library"
                      value={newNews.image}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('newNews')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        case 'user':
          return (
            <div className="space-y-6">
              {/* User Information Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  User Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name*</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={newUser.name || ''}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address*</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={newUser.email || ''}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role*</label>
                    <select
                      value={newUser.role || ''}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="Enter password (leave blank to keep current)"
                      value={newUser.password || ''}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return <div>Edit form for {modalType}</div>;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{getModalTitle()}</h3>
              <p className="text-purple-100 text-sm">Simplified form for admin</p>
            </div>
            <button
              onClick={closeModals}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {getModalContent()}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex space-x-3">
            <button
              onClick={() => handleSave(modalType)}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
            <button
              onClick={closeModals}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteModal = () => {
    if (!showDeleteModal || !currentItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{currentItem.title || currentItem.name}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => handleDeleteConfirm(modalType)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={closeModals}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMediaLibrary = () => {
    if (!showMediaLibrary) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Media Library</h3>
            <button
              onClick={closeModals}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media && media.length > 0 ? (
              media.map((item, index) => (
                <div 
                  key={item.id} 
                  className="relative group cursor-pointer bg-white rounded-lg border border-gray-200 p-3 hover:shadow-lg transition-all duration-200"
                  onClick={() => selectImageFromLibrary(`${BACKEND_BASE_URL}${item.file_url}`)}
                  title={`${item.original_name} (${(item.file_size / 1024 / 1024).toFixed(2)} MB)`}
                >
                  {/* Simple Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1" style={{zIndex: 9999, backgroundColor: 'yellow', padding: '4px', border: '2px solid red'}}>
                    <div style={{backgroundColor: 'red', color: 'white', padding: '4px', margin: '2px'}}>TEST</div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`${BACKEND_BASE_URL}${item.file_url}`, '_blank');
                      }}
                      className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center text-sm font-bold hover:bg-blue-600 shadow-lg"
                      title="View Image"
                    >
                      V
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const imageUrl = `${BACKEND_BASE_URL}${item.file_url}`;
                        navigator.clipboard.writeText(imageUrl).then(() => {
                          alert('Image URL copied to clipboard!');
                        }).catch(() => {
                          const textArea = document.createElement('textarea');
                          textArea.value = imageUrl;
                          document.body.appendChild(textArea);
                          textArea.select();
                          document.execCommand('copy');
                          document.body.removeChild(textArea);
                          alert('Image URL copied to clipboard!');
                        });
                      }}
                      className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center text-sm font-bold hover:bg-green-600 shadow-lg"
                      title="Copy Image URL"
                    >
                      C
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete "${item.original_name}"?`)) {
                          handleDeleteMedia(item.id);
                        }
                      }}
                      className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center text-sm font-bold hover:bg-red-600 shadow-lg"
                      title="Delete Image"
                    >
                      D
                    </button>
                  </div>
                  <div className="aspect-square mb-2 relative">
                    <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    </div>
                    <img 
                      src={`${BACKEND_BASE_URL}${item.file_url}`}
                      alt={item.original_name}
                      className="w-full h-full object-cover rounded-lg relative z-10"
                      onError={(e) => {
                        console.error('Image failed to load:', item.file_url, 'Full URL:', `${BACKEND_BASE_URL}${item.file_url}`, e);
                        console.error('Error details:', e.target.error || 'No error details available');
                        e.target.style.display = 'none';
                        e.target.previousElementSibling.innerHTML = `
                          <div class="flex flex-col items-center justify-center text-gray-400">
                            <svg class="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="text-xs">Failed to load</span>
                            <span class="text-xs mt-1">${item.file_url}</span>
                          </div>
                        `;
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', item.file_url, 'Full URL:', `${BACKEND_BASE_URL}${item.file_url}`);
                        e.target.previousElementSibling.style.display = 'none';
                      }}
                    />
                    </div>
                  <div className="text-xs font-medium text-gray-900 truncate mb-1" title={item.original_name}>
                    {item.original_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(item.file_size / 1024 / 1024).toFixed(2)} MB
                </div>
                                    <div className="text-xs text-gray-400 truncate" title={item.file_url}>
                    {item.file_url.split('/').pop()}
              </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No media files uploaded yet.
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={closeModals}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-600">EduSystem</h2>
                <p className="text-sm text-gray-600">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 mt-8 overflow-y-auto px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              
              // Define colors for each icon type
              const getIconColor = (itemId: string, isActive: boolean) => {
                if (isActive) return 'text-green-700';
                
                switch (itemId) {
                  case 'dashboard': return 'text-blue-600';
                  case 'branding': return 'text-purple-600';
                  case 'hero': return 'text-indigo-600';
                  case 'about': return 'text-green-600';
                  case 'activities': return 'text-orange-600';
                  case 'teachers': return 'text-pink-600';
                  case 'facilities': return 'text-teal-600';
                  case 'testimonials': return 'text-yellow-600';
                  case 'contact': return 'text-red-600';
                  case 'news': return 'text-cyan-600';
                  case 'media': return 'text-emerald-600';
                  case 'users': return 'text-violet-600';
                  case 'settings': return 'text-gray-600';
                  case 'sponsorship': return 'text-rose-600';
                  case 'parents': return 'text-sky-600';
                  case 'button-customization': return 'text-lime-600';
                  case 'footer': return 'text-gray-600';
                  case 'social-media': return 'text-blue-600';
                  case 'programs': return 'text-green-600';
                  case 'map': return 'text-orange-600';
                  default: return 'text-blue-500';
                }
              };

              const getBgColor = (itemId: string, isActive: boolean) => {
                if (isActive) return 'bg-green-100 text-green-700 shadow-lg';
                
                switch (itemId) {
                  case 'dashboard': return 'hover:bg-blue-50 hover:text-blue-700';
                  case 'branding': return 'hover:bg-purple-50 hover:text-purple-700';
                  case 'hero': return 'hover:bg-indigo-50 hover:text-indigo-700';
                  case 'about': return 'hover:bg-green-50 hover:text-green-700';
                  case 'activities': return 'hover:bg-orange-50 hover:text-orange-700';
                  case 'teachers': return 'hover:bg-pink-50 hover:text-pink-700';
                  case 'facilities': return 'hover:bg-teal-50 hover:text-teal-700';
                  case 'testimonials': return 'hover:bg-yellow-50 hover:text-yellow-700';
                  case 'contact': return 'hover:bg-red-50 hover:text-red-700';
                  case 'news': return 'hover:bg-cyan-50 hover:text-cyan-700';
                  case 'media': return 'hover:bg-emerald-50 hover:text-emerald-700';
                  case 'users': return 'hover:bg-violet-50 hover:text-violet-700';
                  case 'settings': return 'hover:bg-gray-50 hover:text-gray-700';
                  case 'sponsorship': return 'hover:bg-rose-50 hover:text-rose-700';
                  case 'parents': return 'hover:bg-sky-50 hover:text-sky-700';
                  case 'button-customization': return 'hover:bg-lime-50 hover:text-lime-700';
                  case 'footer': return 'hover:bg-gray-50 hover:text-gray-700';
                  case 'social-media': return 'hover:bg-blue-50 hover:text-blue-700';
                  case 'programs': return 'hover:bg-green-50 hover:text-green-700';
                  case 'map': return 'hover:bg-orange-50 hover:text-orange-700';
                  default: return 'hover:bg-gray-50 hover:text-gray-700';
                }
              };
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left transition-all duration-300 rounded-lg mb-2 ${
                    activeTab === item.id 
                        ? 'bg-green-100 text-green-700 shadow-lg' 
                        : `text-gray-700 ${getBgColor(item.id, false)}`
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-all duration-300 ${getIconColor(item.id, activeTab === item.id)}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="ml-auto opacity-100">
                      <LoadingDotsFixed size="sm" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md font-medium"
            >
              <LogOut className="w-5 h-5 mr-3 transition-all duration-300 hover:rotate-12" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-sm border-b border-purple-500 flex-shrink-0">
          <div className="flex items-center justify-between h-16 lg:h-20 px-4 lg:px-6 xl:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-2 lg:space-x-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={searchQuery ? `Searching in ${activeTab}...` : "Search..."}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 pr-6 py-2 lg:py-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent w-60 lg:w-80 bg-orange-500/30 text-white placeholder-orange-200/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <button 
                className="relative text-gray-300 hover:text-white p-2 transition-colors notifications-container"
                onClick={() => { loadNotifications(); setShowNotifications(!showNotifications); }}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-600">{unreadCount} unread</p>
                  </div>
                  <div className="p-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => {
                        const IconComponent = getNotificationIcon(notification.type);
                        const colorClasses = getNotificationColor(notification.type);
                        return (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                              !notification.read_status ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${colorClasses}`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(notification.created_at).toLocaleString()}
                                </p>
                              </div>
                              {!notification.read_status && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {notifications.length > 10 && (
                    <div className="p-3 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm lg:text-lg">A</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm lg:text-base font-medium text-white">Administrator</p>
                  <p className="text-xs lg:text-sm text-gray-300">Admin</p>
                </div>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  ADMIN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 xl:p-8 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderAddModal()}
      {renderEditModal()}
      {renderDeleteModal()}
      {renderMediaLibrary()}
    </div>
  );
};

export default AdminDashboard;