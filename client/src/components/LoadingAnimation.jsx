import { useState, useEffect, useRef } from 'react';

function LoadingAnimation({ onComplete }) {
  const videoRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBG, setCurrentBG] = useState(0);
  
  const backgrounds = ['/BG1.png', '/BG2.png', '/BG3.png'];

  // Background rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBG(prev => (prev + 1) % backgrounds.length);
    }, 2000); // Switch every 2 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
      }
    };

    const handleVideoEnd = () => {
      if (!hasPlayed) {
        setHasPlayed(true);
        setProgress(100);
        // No wait time - immediately call onComplete
        onComplete();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnd);
    
    // Ensure video plays only once
    video.play();

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [onComplete, hasPlayed]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Rotating Background Images at 50% opacity */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={backgrounds[0]} 
          alt="Background 1" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            currentBG === 0 ? 'opacity-50' : 'opacity-0'
          }`}
        />
        <img 
          src={backgrounds[1]} 
          alt="Background 2" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            currentBG === 1 ? 'opacity-50' : 'opacity-0'
          }`}
        />
        <img 
          src={backgrounds[2]} 
          alt="Background 3" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            currentBG === 2 ? 'opacity-50' : 'opacity-0'
          }`}
        />
      </div>
      
      {/* Video */}
      <video 
        ref={videoRef}
        muted
        playsInline
        loop={false}
        className="w-auto h-auto max-w-[80vw] max-h-[80vh] object-contain mb-8 relative z-10"
        style={{ 
          maxHeight: '80vh',
          maxWidth: '80vw'
        }}
      >
        <source src="/Main Animation.mp4" type="video/mp4" />
      </video>
      
      {/* Brown Loading Bar */}
      <div className="w-[400px] h-2 bg-gray-200 rounded-full overflow-hidden relative z-10">
        <div 
          className="h-full bg-amber-800 transition-all duration-200 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingAnimation;