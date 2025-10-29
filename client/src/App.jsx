import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import FaxNowPage from './pages/FaxNowPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import HomeownerDashboard from './pages/HomeownerDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PropertyPage from './pages/PropertyPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AIImageRecognition from './pages/AIImageRecognition';
import RoomPartsInventory from './pages/RoomPartsInventory';
import LoadingAnimation from './components/LoadingAnimation';

// Set to false to temporarily disable loading animations
const ENABLE_LOADING_ANIMATION = false;

function AppContent() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const location = useLocation();

  useEffect(() => {
    // Only show transition if path actually changed AND animations are enabled
    if (ENABLE_LOADING_ANIMATION && location.pathname !== currentPath) {
      setIsTransitioning(true);
      setCurrentPath(location.pathname);
    } else if (!ENABLE_LOADING_ANIMATION) {
      setCurrentPath(location.pathname); // Still update currentPath without animation
    }
  }, [location.pathname, currentPath]);

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  if (ENABLE_LOADING_ANIMATION && isTransitioning) {
    return <LoadingAnimation onComplete={handleTransitionComplete} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/fax-now" element={<FaxNowPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/dashboard/homeowner" element={<HomeownerDashboard />} />
      <Route path="/dashboard/contractor" element={<ContractorDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/property/:propertyId" element={<PropertyPage />} />
      <Route path="/property/:propertyId/ai-recognition" element={<AIImageRecognition />} />
      <Route path="/property/:propertyId/rooms" element={<RoomPartsInventory />} />
      <Route path="/project/:projectId" element={<ProjectDetailPage />} />
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