import { useNavigate } from 'react-router-dom';
import AnimatedSearchBar from '../components/AnimatedSearchbar.jsx';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden relative">
      
      <div className="w-full bg-white px-8 py-6 flex justify-between items-center relative z-20 border-b border-gray-200">
        {/* Left side - Search Bar */}
        <div className="flex-1 flex justify-start">
        </div>

        {/* Center - Fax Now Button */}
        <div className="flex-1 flex justify-center">
          <button 
            onClick={() => navigate('/fax-now')}
            className="bg-white text-black px-10 py-4 rounded-lg font-bold text-xl border-2 border-black hover:bg-gray-50 transition-colors"
          >
            Fax Now
          </button>
          <AnimatedSearchBar />
        </div>
        
        {/* Right side - Sign In/Sign Up */}
        <div className="flex-1 flex justify-end gap-4">
          <button className="bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors">
            Sign In
          </button>
          <button className="bg-amber-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors">
            Sign Up
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right,rgb(0, 0, 0) 1px, transparent 1px),
            linear-gradient(to bottom, #000000 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Centered Logo Video */}
      <div className="flex justify-center items-center w-full mb-8">
        <video 
          autoPlay 
          muted 
          loop
          playsInline
          className="w-auto max-w-[90vw] h-auto max-h-[80vh] object-cover "
          style={{ 
            clipPath: 'inset(15% 15% 15% 15%)',
            objectPosition: 'center'
          }}
        >
          <source src="/Logo.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Motto - Just Below Logo */}
      <div className="text-center mt-[-2rem] bg-white px-12 py-6 rounded-lg shadow-lg relative z-10">
        <h1 className="text-5xl font-bold text-black mb-4 relative z-10">
          Your Home. Your Facts. Your Fax
        </h1>
        {/* Wood Accent Line */}
        <div className="h-2 bg-amber-800 mx-auto rounded-full w-[500px] relative z-10" />
      </div>
      </div>
    </div>
  );
}

export default LandingPage;