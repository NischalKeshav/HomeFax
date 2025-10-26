import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function ContractorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
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

      // Load projects
      const projectsResponse = await fetch(`${API_BASE_URL}/projects?contractor_id=${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const projectsData = await projectsResponse.json();
      setProjects(projectsData);

      // Load access requests
      const requestsResponse = await fetch(`${API_BASE_URL}/access-requests?contractor_id=${userData.id}`, {
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
            <h1 className="text-3xl font-bold text-black">Contractor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
            <p className="text-sm text-gray-500">{user?.company} • {user?.contractorRole}</p>
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
          {/* My Projects */}
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">My Projects</h2>
            
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900">{project.description}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                      <div>Type: {project.type}</div>
                      <div>Status: {project.status}</div>
                      <div>Property: {project.property_address}</div>
                      <div>Completion: {project.percent_complete}%</div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-800 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.percent_complete}%` }}
                        ></div>
                      </div>
                    </div>
                    {project.attachments && project.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Attachments: {project.attachments.length}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No projects assigned</p>
            )}
          </div>

          {/* Access Requests */}
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">My Access Requests</h2>
            
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
                          Type: {request.request_type}
                        </p>
                        <p className="text-sm text-gray-600">
                          Requested: {new Date(request.created_at).toLocaleDateString()}
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No access requests</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/fax-now')}
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-amber-600 transition-colors text-left"
            >
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold">Search Properties</h3>
              <p className="text-sm text-gray-600">Find properties to work on</p>
            </button>
            
            <button
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-left"
            >
              <h3 className="font-semibold">Request Access</h3>
              <p className="text-sm text-gray-600">Request access to specific properties</p>
            </button>
            
            <button
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-left"
            >
              <h3 className="font-semibold">Project Reports</h3>
              <p className="text-sm text-gray-600">View project analytics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractorDashboard;
