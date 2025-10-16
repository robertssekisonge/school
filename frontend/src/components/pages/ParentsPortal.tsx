import React, { useState, useEffect } from 'react';
import { Users, Mail, Calendar, BookOpen, Award, Phone, MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import ParentRegistrationModal from '../forms/ParentRegistrationModal';
import NewsletterSubscription from '../forms/NewsletterSubscription';
import { Link } from 'react-router-dom';
import SubHeader from '../layout/SubHeader';

const ParentsPortal: React.FC = () => {
  const { parentsContent, loading } = useContent();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Sliding background images - use from context or fallback to defaults
  const backgroundSlides = parentsContent?.additionalSlides?.length > 0 
    ? [parentsContent.heroImage, ...parentsContent.additionalSlides].filter(Boolean)
    : [
        'https://images.pexels.com/photos/8199565/pexels-photo-8199565.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/8199566/pexels-photo-8199566.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/8199567/pexels-photo-8199567.jpeg?auto=compress&cs=tinysrgb&w=1920'
      ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length);
    }, parentsContent?.slideIntervalMs || 5000);
    return () => clearInterval(interval);
  }, [backgroundSlides.length, parentsContent?.slideIntervalMs]);

  const quickActions = [
    {
      icon: Calendar,
      title: 'View Academic Calendar',
      description: 'Check important dates, holidays, and events',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: 'Access Student Records',
      description: 'View grades, attendance, and progress reports',
      color: 'bg-green-500'
    },
    {
      icon: Mail,
      title: 'Contact Teachers',
      description: 'Send messages to your child\'s teachers',
      color: 'bg-purple-500'
    },
    {
      icon: Award,
      title: 'View Achievements',
      description: 'See your child\'s awards and accomplishments',
      color: 'bg-orange-500'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Parent-Teacher Conference',
      date: 'March 15, 2024',
      time: '2:00 PM - 4:00 PM',
      location: 'School Auditorium',
      type: 'Meeting'
    },
    {
      title: 'Science Fair',
      date: 'March 22, 2024',
      time: '10:00 AM - 2:00 PM',
      location: 'School Gymnasium',
      type: 'Event'
    },
    {
      title: 'Sports Day',
      date: 'March 29, 2024',
      time: '9:00 AM - 3:00 PM',
      location: 'School Grounds',
      type: 'Event'
    }
  ];
  const eventIconColors = ['text-blue-500', 'text-emerald-500', 'text-purple-500'];
  const contactIconBg = [
    'from-blue-100 to-blue-50 text-blue-700',
    'from-emerald-100 to-emerald-50 text-emerald-700',
    'from-amber-100 to-amber-50 text-amber-700',
    'from-rose-100 to-rose-50 text-rose-700',
  ];

  const resources = [
    {
      title: 'Parent Handbook',
      description: 'Complete guide to school policies and procedures',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Academic Support',
      description: 'Resources for helping your child with studies',
      icon: Award,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Health & Safety',
      description: 'Important health and safety information',
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Transportation',
      description: 'Bus schedules and transportation policies',
      icon: MapPin,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: 'Main Office',
      value: '+256 123 456 789',
      description: 'General inquiries'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@excellenceacademy.com',
      description: 'General questions'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      value: '7:30 AM - 4:30 PM',
      description: 'Monday to Friday'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Education Street, Kampala',
      description: 'Main campus'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading parents portal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubHeader />
      <div className="min-h-screen bg-white pt-16">
      {/* Hero Section with Sliding Background (restored) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Sliding Background Images */}
        {backgroundSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
        ))}
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <Users className="w-20 h-20 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            {parentsContent?.title || 'Parents Portal'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {parentsContent?.subtitle || 'Stay connected with your child\'s education. Access important information, communicate with teachers, and track progress all in one place.'}
          </p>
        </div>
      </section>

      {/* All extra content removed per requirement */}

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about important school events and activities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {event.type}
                  </span>
                  <Calendar className={`h-5 w-5 ${eventIconColors[index % eventIconColors.length]}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-amber-500" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  Add to Calendar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Resources & Information
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access important documents, policies, and resources to support your child's education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`${resource.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <resource.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center hover:scale-105 transition-all duration-200">
                  View Resource
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with us for any questions or concerns about your child's education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((contact, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${contactIconBg[index % contactIconBg.length]}`}>
                  <contact.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{contact.title}</h3>
                <p className="text-blue-600 font-semibold mb-2">{contact.value}</p>
                <p className="text-gray-600 text-sm">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Subscribe to our newsletter to receive important updates about school events, academic progress, and parent resources.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Monthly school newsletters</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Event announcements</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Academic updates</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Parent resources and tips</span>
                </div>
              </div>
            </div>
            <div>
              <NewsletterSubscription />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create your parent account today and stay connected with your child's educational journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg"
              onClick={() => setShowRegistrationModal(true)}
            >
              Create Account
            </button>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      <ParentRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </div>
    </>
  );
};

export default ParentsPortal;
