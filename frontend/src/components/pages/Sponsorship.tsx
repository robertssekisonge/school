import React, { useState, useEffect } from 'react';
import { Heart, Users, BookOpen, Award, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import { Link } from 'react-router-dom';
import SponsorshipApplicationModal from '../forms/SponsorshipApplicationModal';
import ChildSponsorshipModal from '../forms/ChildSponsorshipModal';
import SubHeader from '../layout/SubHeader';

const Sponsorship: React.FC = () => {
  const { sponsorshipContent, loading } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showSponsorshipModal, setShowSponsorshipModal] = useState(false);

  // Sliding background images - use from context or fallback to defaults
  const backgroundSlides = sponsorshipContent?.additionalSlides?.length > 0 
    ? [sponsorshipContent.heroImage, ...sponsorshipContent.additionalSlides].filter(Boolean)
    : [
        'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/8199564/pexels-photo-8199564.jpeg?auto=compress&cs=tinysrgb&w=1920'
      ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length);
    }, sponsorshipContent?.slideIntervalMs || 5000);
    return () => clearInterval(interval);
  }, [backgroundSlides.length, sponsorshipContent?.slideIntervalMs]);

  const sponsorshipLevels = [
    {
      name: 'Full Scholarship',
      amount: 'UGX 500,000',
      description: 'Complete tuition, books, and uniform for one academic year',
      benefits: ['Full tuition coverage', 'Textbooks and supplies', 'School uniform', 'Monthly progress reports', 'Direct communication with student'],
      color: 'bg-green-500'
    },
    {
      name: 'Partial Scholarship',
      amount: 'UGX 250,000',
      description: 'Half tuition coverage for one academic year',
      benefits: ['50% tuition coverage', 'Textbooks', 'Quarterly progress reports', 'Student communication'],
      color: 'bg-blue-500'
    },
    {
      name: 'Book & Uniform',
      amount: 'UGX 100,000',
      description: 'Essential supplies and uniform for one student',
      benefits: ['Complete textbook set', 'School uniform', 'School bag', 'Semester progress report'],
      color: 'bg-purple-500'
    }
  ];

  const impactStats = [
    { icon: Users, label: 'Students Sponsored', value: '150+' },
    { icon: Heart, label: 'Active Sponsors', value: '45' },
    { icon: BookOpen, label: 'Years of Program', value: '8' },
    { icon: Award, label: 'Success Rate', value: '95%' }
  ];

  const successStories = [
    {
      name: 'Sarah M.',
      age: '12',
      before: {
        image: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Sarah struggled to attend school due to financial constraints. Her family could barely afford basic necessities.'
      },
      after: {
        image: 'https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Now Sarah is a top-performing student with dreams of becoming a doctor. She\'s confident and full of hope.'
      },
      story: 'Sponsored student who graduated with honors and is now studying medicine at university.'
    },
    {
      name: 'David K.',
      age: '14',
      before: {
        image: 'https://images.pexels.com/photos/8199564/pexels-photo-8199564.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'David spent his days working odd jobs instead of attending school. Education seemed like a distant dream.'
      },
      after: {
        image: 'https://images.pexels.com/photos/8199565/pexels-photo-8199565.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Today, David is an engineering student with a bright future. He\'s giving back by mentoring other students.'
      },
      story: 'Former sponsored student now working as an engineer and giving back to the community.'
    },
    {
      name: 'Grace W.',
      age: '10',
      before: {
        image: 'https://images.pexels.com/photos/8199566/pexels-photo-8199566.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Grace faced daily challenges accessing education. Her family prioritized survival over schooling.'
      },
      after: {
        image: 'https://images.pexels.com/photos/8199567/pexels-photo-8199567.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Grace is now a confident young girl excelling in her studies. She dreams of becoming a teacher.'
      },
      story: 'Sponsored student who became a teacher and now mentors other students in our program.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sponsorship content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubHeader />
      <div className="min-h-screen bg-gray-50 pt-16">
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
          <Heart className="w-20 h-20 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            {sponsorshipContent?.title || 'Transform Lives Through Education'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {sponsorshipContent?.subtitle || 'Every child deserves the opportunity to learn, grow, and dream. Join our sponsorship program and be part of their journey to success.'}
          </p>
        </div>
      </section>

      {/* All extra content removed per requirement */}

      {/* Before & After Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transformations That Inspire
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the incredible impact of sponsorship through the eyes of our children. Every story is a testament to the power of education and hope.
            </p>
          </div>

          <div className="space-y-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Before */}
                  <div className="relative p-6 bg-red-50">
                    {/* Sad Emoji in Upper Right Corner */}
                    <div className="absolute top-4 right-4 text-4xl animate-bounce">
                      😢
                    </div>
                    <div className="text-center">
                      <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-bold">Before</span>
                      </div>
                      <img
                        src={story.before.image}
                        alt={`${story.name} before`}
                        className="w-32 h-32 object-cover rounded-full mx-auto mb-3 border-4 border-red-200"
                      />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{story.name}, {story.age}</h3>
                      <p className="text-sm text-gray-600">{story.before.description}</p>
                    </div>
                  </div>
                  
                  {/* After */}
                  <div className="relative p-6 bg-green-50">
                    {/* Happy Emoji in Upper Right Corner */}
                    <div className="absolute top-4 right-4 text-4xl animate-pulse">
                      😄
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-bold">After</span>
                      </div>
                      <img
                        src={story.after.image}
                        alt={`${story.name} after`}
                        className="w-32 h-32 object-cover rounded-full mx-auto mb-3 border-4 border-green-200"
                      />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{story.name}, {story.age}</h3>
                      <p className="text-sm text-gray-600">{story.after.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  <h4 className="text-lg font-bold mb-2">Their Story</h4>
                  <p className="text-sm mb-3">{story.story}</p>
                  <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm">
                    Read Full Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Levels */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Impact Level
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every contribution makes a difference. Choose the sponsorship level that fits your heart and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sponsorshipLevels.map((level, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group">
                <div className={`${level.color} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden`}>
                  <Heart className="h-8 w-8" />
                  {/* Hover Emoji */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-2xl">
                      {index === 0 ? '😊' : index === 1 ? '🤗' : '💝'}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{level.name}</h3>
                <div className="text-3xl font-bold text-green-600 mb-3 text-center">{level.amount}</div>
                <p className="text-sm text-gray-600 mb-4 text-center">{level.description}</p>
                <ul className="space-y-2 mb-6">
                  {level.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-base relative overflow-hidden group"
                  onClick={() => setShowSponsorshipModal(true)}
                >
                  <span className="relative z-10">Sponsor Now</span>
                  {/* Big Smiling Emoji on Button Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-125">
                    <span className="text-3xl">😄</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Your Sponsorship Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our sponsorship process is simple, transparent, and impactful. Here's how you can change a child's life.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Choose Your Child</h3>
              <p className="text-sm text-gray-600">Browse profiles and select a child whose story touches your heart.</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Make Your Pledge</h3>
              <p className="text-sm text-gray-600">Choose your sponsorship level and set up your monthly contribution.</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Stay Connected</h3>
              <p className="text-sm text-gray-600">Receive regular updates, photos, and letters from your sponsored child.</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">See the Impact</h3>
              <p className="text-sm text-gray-600">Watch your sponsored child grow, learn, and achieve their dreams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Change a Life?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our sponsorship program today and be part of a child's journey to a brighter future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-base"
              onClick={() => setShowApplicationModal(true)}
            >
              Apply for Sponsorship
            </button>
            <button 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-base"
              onClick={() => setShowSponsorshipModal(true)}
            >
              Sponsor a Child
            </button>
          </div>
          
          {/* Sukrop Foundation Partnership */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-base mb-3">Partnering with</p>
            <a
              href="https://sukrop.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm"
            >
              <Heart className="w-4 h-4 mr-2" />
              Sukrop Children's Foundation
              <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SponsorshipApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
      />
      <ChildSponsorshipModal
        isOpen={showSponsorshipModal}
        onClose={() => setShowSponsorshipModal(false)}
      />
    </div>
    </>
  );
};

export default Sponsorship;
