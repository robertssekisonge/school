import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';

const SubHeader: React.FC = () => {
  const navigate = useNavigate();
  const { branding } = useContent();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Branding left */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">{(branding.schoolName || 'E')[0]}</span>
            </div>
            <div className="leading-tight">
              <h1 className="text-lg md:text-2xl font-extrabold tracking-tight text-white">
                {branding.schoolName}
              </h1>
              {branding.tagline && (
                <span className="hidden md:block mt-1 text-[11px] md:text-xs text-slate-300">{branding.tagline}</span>
              )}
            </div>
          </div>

          {/* Back button right */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        </div>
      </div>
    </header>
  );
};

export default SubHeader;


