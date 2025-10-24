import { useState, useEffect, useRef } from 'react';

function LoadingAnimation({ onComplete }) {
  const videoRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [progress, setProgress] = useState(0);

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
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Video */}
      <video 
        ref={videoRef}
        muted
        playsInline
        loop={false}
        className="w-auto h-auto max-w-[80vw] max-h-[80vh] object-contain mb-8"
        style={{ 
          maxHeight: '80vh',
          maxWidth: '80vw'
        }}
      >
        <source src="/Main Animation.mp4" type="video/mp4" />
      </video>
      
      {/* Brown Loading Bar */}
      <div className="w-[400px] h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-amber-800 transition-all duration-200 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingAnimation;