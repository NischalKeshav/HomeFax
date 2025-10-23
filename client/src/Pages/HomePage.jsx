
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Shield, Map, Home, Users, CheckCircle, Star } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Verified Property History",
      description: "Complete renovation records, inspection reports, and maintenance history for every property."
    },
    {
      icon: <Map className="w-8 h-8 text-primary-600" />,
      title: "Neighborhood Insights",
      description: "Real-time updates on construction, traffic, school zones, and community events."
    },
    {
      icon: <Home className="w-8 h-8 text-primary-600" />,
      title: "Homeowner Dashboard",
      description: "Manage your property, track renovations, and maintain comprehensive records."
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Contractor Network",
      description: "Verified contractors with detailed project portfolios and customer reviews."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "HomeFax helped me understand my home's complete history before buying. It's like CarFax but for houses!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Real Estate Agent",
      content: "My clients love the transparency HomeFax provides. It builds trust and speeds up the buying process.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Contractor",
      content: "The platform helps me showcase my work and connect with homeowners who need quality renovations.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Know your home.<br />
              <span className="text-primary-200">Know your worth.</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              CarFax for Homes - Get comprehensive property history, renovation records, 
              and neighborhood insights to make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/explore"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Explore a Home</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/signup"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="text-primary-200 hover:text-white transition-colors px-8 py-3"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <div className="text-primary-200">
                  Welcome back, {user?.first_name}! 
                  <Link to="/my-home" className="text-white hover:text-primary-200 ml-2 underline">
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Problem with Home Buying Today
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Buying a home is one of life's biggest decisions, yet most buyers have limited 
              visibility into a property's true history and condition.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-red-600 text-4xl font-bold mb-2">73%</div>
              <p className="text-gray-700">of homebuyers discover major issues after purchase</p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600 text-4xl font-bold mb-2">$15K</div>
              <p className="text-gray-700">average unexpected repair costs in first year</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-blue-600 text-4xl font-bold mb-2">45%</div>
              <p className="text-gray-700">of renovations lack proper documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How HomeFax Solves This
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive property intelligence to help you make informed decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners, buyers, and contractors who trust HomeFax 
            for comprehensive property intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/explore"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Explore Properties
            </Link>
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
  
