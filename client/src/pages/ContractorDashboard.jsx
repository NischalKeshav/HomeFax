import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function ContractorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // projects, search, reports
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [createProjectForm, setCreateProjectForm] = useState({
    address: '',
    location: '',
    build_year: new Date().getFullYear(),
    zoning: '',
    description: '',
    timeline_months: 12,
    estimated_budget: '',
    plans_attachments: '',
    registration_number: ''
  });
  const [statistics, setStatistics] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/signin');
      return;
    }
    const user = JSON.parse(userData);
    
    // Check if user is a contractor
    if (user.role !== 'contractor') {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'homeowner') {
        navigate('/dashboard/homeowner');
      } else if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/signin');
      }
      return;
    }
    
    setUser(user);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      // Load projects
      const projectsResponse = await fetch(`${API_BASE_URL}/projects?contractor_id=${userData.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const projectsData = await projectsResponse.json();
      setProjects(projectsData);

      // Load statistics
      const activeProjects = projectsData.filter(p => p.status === 'in_progress').length;
      const completedProjects = projectsData.filter(p => p.status === 'completed').length;
      setStatistics({
        totalProjects: projectsData.length,
        activeProjects,
        completedProjects,
        pendingRequests: 0
      });

      // Load access requests
      const requestsResponse = await fetch(`${API_BASE_URL}/access-requests?contractor_id=${userData.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const requestsData = await requestsResponse.json();
      setAccessRequests(requestsData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchProperties = async () => {
    if (searchQuery.length < 2) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/properties?search=${searchQuery}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`${API_BASE_URL}/access-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property_id: propertyId,
          contractor_id: userData.id,
          request_type: 'contractor_access',
          status: 'pending'
        })
      });

      if (response.ok) {
        alert('Access request sent successfully!');
        loadDashboardData();
        setProperties(properties.filter(p => p.id !== propertyId));
      }
    } catch (error) {
      console.error('Error requesting access:', error);
      alert('Failed to request access');
    }
  };

  const handleStartProject = async (propertyId) => {
    const projectDescription = prompt('Enter project description (e.g., Roof maintenance, Kitchen renovation, etc.):');
    if (!projectDescription) return;
    
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property_id: propertyId,
          contractor_id: userData.id,
          type: 'renovation',
          description: projectDescription,
          status: 'in_progress',
          percent_complete: 0
        })
      });

      if (response.ok) {
        alert('Project started successfully!');
        loadDashboardData();
      } else {
        alert('Failed to start project');
      }
    } catch (error) {
      console.error('Error starting project:', error);
      alert('Failed to start project');
    }
  };

  const handleSubmitNewProperty = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`${API_BASE_URL}/properties/submission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          address: createProjectForm.address,
          location: createProjectForm.location,
          build_year: createProjectForm.build_year,
          zoning: createProjectForm.zoning,
          description: createProjectForm.description,
          timeline_months: createProjectForm.timeline_months,
          estimated_budget: createProjectForm.estimated_budget,
          plans_attachments: createProjectForm.plans_attachments ? createProjectForm.plans_attachments.split(',').map(f => f.trim()) : [],
          registration_number: createProjectForm.registration_number,
          contractor_id: userData.id,
          status: 'pending_verification'
        })
      });

      if (response.ok) {
        alert('Property submitted for admin review!');
        setShowCreateProject(false);
        setCreateProjectForm({
          address: '',
          location: '',
          build_year: new Date().getFullYear(),
          zoning: '',
          description: '',
          timeline_months: 12,
          estimated_budget: '',
          plans_attachments: '',
          registration_number: ''
        });
        loadDashboardData();
      } else {
        alert('Failed to submit property');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('Failed to submit property');
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
              onClick={handleLogout}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Create Project Button */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setShowCreateProject(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Start New Property
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-600">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.totalProjects}</p>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-600">Active Projects</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.activeProjects}</p>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-600">Completed Projects</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.completedProjects}</p>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-600">Pending Requests</p>
            <p className="text-2xl font-bold text-gray-900">{accessRequests.filter(r => r.status === 'pending').length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-4 px-1 border-b-2 font-semibold ${
                activeTab === 'projects' ? 'border-amber-800 text-amber-800' : 'border-transparent text-gray-500'
              }`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`pb-4 px-1 border-b-2 font-semibold ${
                activeTab === 'search' ? 'border-amber-800 text-amber-800' : 'border-transparent text-gray-500'
              }`}
            >
              Search Properties
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-4 px-1 border-b-2 font-semibold ${
                activeTab === 'reports' ? 'border-amber-800 text-amber-800' : 'border-transparent text-gray-500'
              }`}
            >
              Project Reports
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Active Projects</h2>
              {projects.filter(p => p.status === 'in_progress').length > 0 ? (
                <div className="space-y-4">
                  {projects.filter(p => p.status === 'in_progress').map(project => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{project.description || project.type}</h3>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                          {project.property_address || '6000 SW Broadway St'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                        <div>Type: {project.type}</div>
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
                      <button
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="mt-3 w-full bg-amber-800 text-white px-4 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
                      >
                        View Project & Add Updates
                      </button>
                      {project.attachments && project.attachments.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="font-semibold">Files:</p>
                          <ul className="list-disc list-inside">
                            {project.attachments.map((file, idx) => (
                              <li key={idx}>{file}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No active projects</p>
              )}
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Access Requests</h2>
              {accessRequests.length > 0 ? (
                <div className="space-y-4">
                  {accessRequests.map(request => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.property_address}</h3>
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
                      {request.status === 'approved' && (
                        <button
                          onClick={() => navigate(`/property/${request.property_id}`)}
                          className="mt-2 bg-amber-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors w-full"
                        >
                          View Property
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No access requests</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div>
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Search for Properties</h2>
              
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter property address..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchProperties()}
                />
                <button
                  onClick={handleSearchProperties}
                  disabled={loading}
                  className="bg-amber-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors disabled:opacity-50"
                >
                  Search
                </button>
              </div>

              {properties.length > 0 && (
                <div className="space-y-4">
                  {properties.map(property => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{property.address}</h3>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                            <div>Registration: {property.registration_number}</div>
                            <div>Build Year: {property.build_year}</div>
                            <div>Status: {property.status}</div>
                            {property.property_value && (
                              <div>Value: ${parseFloat(property.property_value).toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleRequestAccess(property.id)}
                          className="bg-amber-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
                        >
                          Request Access
                        </button>
                        <button
                          onClick={() => handleStartProject(property.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Start Project
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Project Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Projects Completed</h3>
                <p className="text-3xl font-bold text-amber-800">{statistics.completedProjects}</p>
              </div>
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Total Contributing Properties</h3>
                <p className="text-3xl font-bold text-amber-800">{new Set(projects.map(p => p.property_id)).size}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Completed Projects</h3>
              <div className="space-y-4">
                {projects.filter(p => p.status === 'completed').map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-lg">{project.description || project.type}</h4>
                    <p className="text-sm text-gray-600">{project.property_address}</p>
                    <p className="text-sm text-gray-600">Completed: {new Date(project.end_date).toLocaleDateString()}</p>
                  </div>
                ))}
                {projects.filter(p => p.status === 'completed').length === 0 && (
                  <p className="text-gray-500">No completed projects yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Property Submission Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Submit New Property</h2>
            
            <form onSubmit={handleSubmitNewProperty}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Address *</label>
                  <input
                    type="text"
                    value={createProjectForm.address}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="6000 SW Broadway St"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Location *</label>
                  <input
                    type="text"
                    value={createProjectForm.location}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="Bentonville AR, 72713"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Build Year *</label>
                    <input
                      type="number"
                      value={createProjectForm.build_year}
                      onChange={(e) => setCreateProjectForm({ ...createProjectForm, build_year: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Timeline (months) *</label>
                    <input
                      type="number"
                      value={createProjectForm.timeline_months}
                      onChange={(e) => setCreateProjectForm({ ...createProjectForm, timeline_months: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Zoning *</label>
                  <input
                    type="text"
                    value={createProjectForm.zoning}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, zoning: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="R-1 Residential"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Estimated Budget *</label>
                  <input
                    type="text"
                    value={createProjectForm.estimated_budget}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, estimated_budget: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="$100,000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Registration Number</label>
                  <input
                    type="text"
                    value={createProjectForm.registration_number}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, registration_number: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="HK-2024-001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Description *</label>
                  <textarea
                    value={createProjectForm.description}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    rows="4"
                    placeholder="Full details about the new property being built..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Blueprints/Plans Attachments</label>
                  <input
                    type="text"
                    value={createProjectForm.plans_attachments}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, plans_attachments: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="/blueprints/full-house-plan.pdf, /photos/site-survey.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Comma-separated file paths</p>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateProject(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
                >
                  Submit for Admin Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractorDashboard;