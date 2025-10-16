import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { branding } = useContent();

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Activities', href: '#activities' },
    { name: 'Teachers', href: '#teachers' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-sm border-b border-slate-700 shadow-lg">
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Extreme Left */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">{(branding.schoolName || 'E')[0]}</span>
              </div>
              <div className="leading-tight">
                <h1 className="text-lg md:text-2xl font-extrabold tracking-tight text-white">
                  {branding.schoolName}
                </h1>
                {branding.tagline && (
                  <span className="hidden md:block mt-3 text-[11px] md:text-xs text-slate-300">{branding.tagline}</span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Centered with balanced spacing */}
          <nav className="hidden md:flex items-center flex-1 justify-center space-x-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-slate-300 hover:text-white px-1.5 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:bg-slate-700 hover:shadow-md"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTAs - Parents, Sponsorship, Admin */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/sponsorship')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
            >
              Sponsorship
            </button>
            <button
              onClick={() => navigate('/parents')}
              className="bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
            >
              Parents Portal
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
            >
              Admin Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-slate-700"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 border-t border-slate-700">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => { setIsMenuOpen(false); navigate('/sponsorship'); }}
                className="block w-full text-left px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-md font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
              >
                Sponsorship
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); navigate('/parents'); }}
                className="block w-full text-left px-3 py-2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-md font-semibold hover:from-indigo-600 hover:to-sky-600 transition-all duration-300 transform hover:scale-105"
              >
                Parents Portal
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}
                className="block w-full text-left px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Admin Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;