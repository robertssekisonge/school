import React from 'react';

interface ContinuousImageSliderProps {
  images: string[];
  direction?: 'left' | 'right';
  speed?: number; // Duration in seconds
  className?: string;
  imageClassName?: string;
}

const ContinuousImageSlider: React.FC<ContinuousImageSliderProps> = ({
  images,
  direction = 'left',
  speed = 20,
  className = '',
  imageClassName = ''
}) => {
  if (!images || images.length === 0) return null;

  // Create multiple copies for truly seamless infinite loop
  const copies = 3; // Use 3 copies for smoother transition
  const duplicatedImages = Array(copies).fill(images).flat();

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex"
        style={{
          animation: `slide-${direction} ${speed}s linear infinite`,
          width: `${duplicatedImages.length * 100}%`
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: `${100 / duplicatedImages.length}%`, minWidth: '300px' }}
          >
            <img
              src={image}
              alt={`Slide ${(index % images.length) + 1}`}
              className={`w-full h-full object-cover ${imageClassName}`}
              onError={(e) => {
                console.error('Image failed to load:', image);
                // Hide broken images
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes slide-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${100 / copies}%); }
        }
        @keyframes slide-right {
          0% { transform: translateX(-${100 / copies}%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default ContinuousImageSlider;
