import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import FaxNowPage from './pages/FaxNowPage';
import LoadingAnimation from './components/LoadingAnimation';

function AppContent() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setIsTransitioning(true);
      setCurrentPath(location.pathname);
    }
  }, [location.pathname, currentPath]);

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  if (isTransitioning) {
    return <LoadingAnimation onComplete={handleTransitionComplete} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/fax-now" element={<FaxNowPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;