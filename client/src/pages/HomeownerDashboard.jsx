import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function HomeownerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/signin');
      return;
    }
    
    setUser(JSON.parse(userData));
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      // Load properties
      const propertiesResponse = await fetch(`${API_BASE_URL}/properties?owner_id=${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const propertiesData = await propertiesResponse.json();
      setProperties(propertiesData);

      // Load access requests
      const requestsResponse = await fetch(`${API_BASE_URL}/access-requests/owner/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const requestsData = await requestsResponse.json();
      setAccessRequests(requestsData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/access-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: action })
      });

      if (response.ok) {
        loadDashboardData(); // Reload data
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Homeowner Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/fax-now')}
              className="bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
            >
              Public Fax
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Properties */}
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">My Properties</h2>
            
            {properties.length > 0 ? (
              <div className="space-y-4">
                {properties.map(property => (
                  <div 
                    key={property.id} 
                    onClick={() => navigate(`/property/${property.id}`)}
                    className={`border rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                      property.property_type === 'rental' 
                        ? 'border-amber-300 bg-amber-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{property.address}</h3>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              property.property_type === 'rental' 
                                ? 'bg-amber-200 text-amber-800' 
                                : 'bg-gray-200 text-gray-800'
                            }`}>
                              {property.property_type === 'rental' ? 'Rental' : 'Primary'}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              property.property_category === 'commercial' 
                                ? 'bg-blue-200 text-blue-800'
                                : property.property_category === 'mixed_use'
                                ? 'bg-purple-200 text-purple-800'
                                : 'bg-green-200 text-green-800'
                            }`}>
                              {property.property_category === 'commercial' ? 'Commercial' : 
                               property.property_category === 'mixed_use' ? 'Mixed Use' : 'Residential'}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                          <div>Registration: {property.registration_number}</div>
                          <div>Build Year: {property.build_year}</div>
                          <div>Status: {property.status}</div>
                          <div>Completion: {property.percent_complete}%</div>
                        </div>
                        <div className="mt-3">
                          <div className={`w-full rounded-full h-2 ${
                            property.property_type === 'rental' ? 'bg-amber-200' : 'bg-gray-200'
                          }`}>
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                property.property_type === 'rental' ? 'bg-amber-600' : 'bg-amber-800'
                              }`}
                              style={{ width: `${property.percent_complete}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className={`ml-4 ${
                        property.property_type === 'rental' ? 'text-amber-600' : 'text-amber-600'
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No properties found</p>
            )}
          </div>

          {/* Access Requests */}
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Access Requests</h2>
            
            {accessRequests.length > 0 ? (
              <div className="space-y-4">
                {accessRequests.map(request => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {request.property_address}
                        </h3>
                        <p className="text-sm text-gray-600">
                          From: {request.contractor_name || 'Public User'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Type: {request.request_type}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleRequestAction(request.id, 'approved')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, 'denied')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No access requests</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeownerDashboard;
