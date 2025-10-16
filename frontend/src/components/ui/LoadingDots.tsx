import React from 'react';

interface LoadingDotsFixedProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingDotsFixed: React.FC<LoadingDotsFixedProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  };

  return (
    <div className={`loading-dots-container ${sizeClasses[size]} ${className}`}>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
    </div>
  );
};

export default LoadingDotsFixed;
