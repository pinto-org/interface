import { generateID } from '@/utils/utils';
import { useState, useEffect } from 'react';

const LoadingSpinner = ({
  size = 40,
  duration = 100,
  repeat = true,
  className = '',
  onComplete = () => {}
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  // Generate frames array from the SVG files
  const frames = Array.from({ length: 8 }, (_, i) => ({
    src: `/src/assets/misc/Spinner-${i + 1}.svg`,
    duration: duration
  }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentFrame < frames.length - 1) {
        setCurrentFrame(prev => prev + 1);
      } else {
        if (repeat) {
          setCurrentFrame(0);
        } else {
          onComplete();
        }
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentFrame, frames.length, repeat, duration, onComplete]);

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Preload all SVGs */}
      <div className="hidden">
        {frames.map((frame, index) => (
          <img 
            key={generateID('spinner')}
            src={frame.src} 
            alt={`preload ${index}`}
          />
        ))}
      </div>

      {/* Current frame */}
      <img
        src={frames[currentFrame].src}
        alt={`spinner frame ${currentFrame + 1}`}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default LoadingSpinner;