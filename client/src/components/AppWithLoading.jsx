import { useState, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import FaxNowPage from '../pages/FaxNowPage';

function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show loading for 1.5 seconds, then hide
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <video 
        autoPlay 
        muted 
        loop
        playsInline
        className="w-auto h-auto max-w-[80vw] max-h-[80vh] object-contain"
        style={{ 
          maxHeight: '80vh',
          maxWidth: '80vw'
        }}
      >
        <source src="/Main Animation.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function AppWithLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Show loading on initial app load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading on route changes - prevent showing page before animation
  useEffect(() => {
    if (!isLoading && location.pathname !== currentPath) {
      setShowLoading(true);
      setCurrentPath(location.pathname);
      
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, isLoading, currentPath]);

  if (isLoading || showLoading) {
    return <LoadingAnimation />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/fax-now" element={<FaxNowPage />} />
    </Routes>
  );
}

export default AppWithLoading;
