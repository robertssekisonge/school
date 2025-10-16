import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';

const Hero: React.FC = () => {
  const { heroContent } = useContent();

  // Base slides: exactly 3 photos. Renderer duplicates for seamless 1 2 3 1 2 3 flow
  const slides = (heroContent.slides && heroContent.slides.length > 0
    ? heroContent.slides.slice(0, 3)
    : [
        heroContent.backgroundImage || 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8199564/pexels-photo-8199564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]);

  // Force continuous sliding mode - always use marquee
  const slideMode = 'marquee';
  const slideDirection = heroContent.slideDirection || 'left';
  const slideIntervalMs = heroContent.slideIntervalMs || 4000; // Slower sliding for better visibility
  
  // Calculate duration for smooth continuous sliding (tuned for 2x track) - slower speed
  const marqueeDuration = Math.max(12, (slideIntervalMs / 1000) * slides.length * 2);

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      <style>{`
        @keyframes slideLeft { from { transform: translateX(24px); opacity: 0.6; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideRight { from { transform: translateX(-24px); opacity: 0.6; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-left { animation: slideLeft 700ms ease both; }
        .animate-slide-right { animation: slideRight 700ms ease both; }
        @keyframes marqueeLeft { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }
        @keyframes marqueeRight { 
          0% { transform: translateX(-50%); } 
          100% { transform: translateX(0); } 
        }
      `}</style>
      {/* Continuous Sliding Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="flex h-full w-[200%]"
          style={{
            animation: `${slideDirection === 'right' ? 'marqueeRight' : 'marqueeLeft'} ${marqueeDuration}s linear infinite`
          }}
        >
          {/* Duplicate once for seamless circular flow: 1 2 3 | 1 2 3 */}
          {[...slides, ...slides].map((src, i) => (
            <div key={`slide-${i}`} className="h-full flex-shrink-0" style={{ flex: `0 0 ${100 / (slides.length * 2)}%`, minWidth: '50vw' }}>
              <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url(${src})` }} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            {heroContent.headline || 'Excellence in Education'}
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-blue-200 animate-fade-in-up animation-delay-200">
            {heroContent.subHeadline || 'Shaping Tomorrow\'s Leaders Today'}
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
            {heroContent.description || 'Join our community of learners and discover your potential with world-class education and modern facilities.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <button onClick={() => document.querySelector('#programs')?.scrollIntoView({behavior:'smooth'})} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Explore Programs
            </button>
            <button onClick={() => document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'})} className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Schedule a Visit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;