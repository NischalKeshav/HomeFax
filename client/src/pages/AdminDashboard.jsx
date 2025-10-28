import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    pendingRequests: 0,
    activeProjects: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [adminKeys, setAdminKeys] = useState([]);
  const [showAdminKeyModal, setShowAdminKeyModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [newKeyForm, setNewKeyForm] = useState({ territory: 'Benton County, Arkansas', jurisdiction: 'County' });
  const [notificationForm, setNotificationForm] = useState({ 
    title: '', 
    message: '', 
    target_type: 'all_users', // 'all_users' or 'by_utility'
    utility_type: '',
    priority: 'normal' 
  });
  const [loading, setLoading] = useState(true);
  const [currentBG, setCurrentBG] = useState(0);
  const backgrounds = ['/AdminBG1.png', '/AdminBg2.png'];

  // Rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBG(prev => (prev + 1) % backgrounds.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

      // Load statistics
      const [propertiesRes, usersRes, requestsRes, projectsRes, ongoingProjectsRes, pendingVerificationsRes, adminKeysRes] = await Promise.all([
        fetch(`${API_BASE_URL}/properties`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/access-requests?status=pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/projects?status=in_progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin/ongoing-projects`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/access-requests?status=pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin-keys`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [propertiesResData, usersResData, requestsResData, projectsResData, ongoingProjectsResData, pendingVerificationsResData, adminKeysData] = await Promise.all([
        propertiesRes.ok ? propertiesRes.json() : [],
        usersRes.ok ? usersRes.json() : [],
        requestsRes.ok ? requestsRes.json() : [],
        projectsRes.ok ? projectsRes.json() : [],
        ongoingProjectsRes.ok ? ongoingProjectsRes.json() : [],
        pendingVerificationsRes.ok ? pendingVerificationsRes.json() : [],
        adminKeysRes.ok ? adminKeysRes.json() : []
      ]);
      
      const properties = Array.isArray(propertiesResData) ? propertiesResData : [];
      const users = Array.isArray(usersResData) ? usersResData : [];
      const requests = Array.isArray(requestsResData) ? requestsResData : [];
      const projects = Array.isArray(projectsResData) ? projectsResData : [];
      const ongoingProjectsData = Array.isArray(ongoingProjectsResData) ? ongoingProjectsResData : [];
      const pendingVerificationsData = Array.isArray(pendingVerificationsResData) ? pendingVerificationsResData : [];
      const adminKeysArray = Array.isArray(adminKeysData) ? adminKeysData : [];
      
      setAdminKeys(adminKeysArray);
      
      console.log('Admin Dashboard Data Loaded:', {
        propertiesCount: properties.length,
        usersCount: users.length,
        requestsCount: requests.length,
        projectsCount: projects.length,
        ongoingProjectsCount: ongoingProjectsData.length,
        pendingVerificationsCount: pendingVerificationsData.length
      });
      
      setOngoingProjects(ongoingProjectsData);
      setPendingVerifications(pendingVerificationsData);

      setStats({
        totalProperties: properties.length,
        totalUsers: users.length,
        pendingRequests: requests.length,
        activeProjects: projects.length
      });

      // Load recent activity (mock data for now)
      setRecentActivity([
        { type: 'user_registration', message: 'New contractor registered: John Doe', time: '2 hours ago' },
        { type: 'access_request', message: 'Access request approved for 123 Maple St', time: '4 hours ago' },
        { type: 'project_update', message: 'Project completed: Roof repair at 456 Oak Ave', time: '6 hours ago' },
        { type: 'user_registration', message: 'New homeowner registered: Jane Smith', time: '1 day ago' }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      console.error('Error details:', error.message, error.stack);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCreateAdminKey = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Generate a random key
      const keyValue = `ADMIN-${Math.random().toString(36).substring(2, 15).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      console.log('Creating admin key with:', {
        key_value: keyValue,
        territory: newKeyForm.territory,
        created_by: userData?.id
      });
      
      const response = await fetch(`${API_BASE_URL}/admin-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key_value: keyValue,
          territory: newKeyForm.territory,
          created_by: userData?.id
        })
      });

      const data = await response.json();
      console.log('Admin key creation response:', response.status, data);

      if (response.ok) {
        alert(`Admin key created successfully!\n\nKey: ${keyValue}\nTerritory: ${newKeyForm.territory}\n\nCopy this key and give it to the new admin.`);
        setShowAdminKeyModal(false);
        setNewKeyForm({ territory: 'Benton County, Arkansas', jurisdiction: 'County' });
        loadDashboardData();
      } else {
        console.error('Failed to create admin key:', data);
        alert(`Failed to create admin key: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating admin key:', error);
      alert(`Failed to create admin key: ${error.message}`);
    }
  };

  const handlePushNotification = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationForm)
      });

      if (response.ok) {
        alert('Notification pushed successfully!');
        setShowNotificationModal(false);
        setNotificationForm({ title: '', message: '', target_type: 'all_users', utility_type: '', priority: 'normal' });
        loadDashboardData();
      } else {
        alert('Failed to push notification');
      }
    } catch (error) {
      console.error('Error pushing notification:', error);
      alert('Failed to push notification');
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
            <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
            <p className="text-sm text-gray-500">System Administrator</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/fax-now')}
              className="bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
            >
              Public Fax
            </button>
            <button
              onClick={() => setShowNotificationModal(true)}
              className="bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
            >
              Push Notification
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
        {/* Rotating Hero Images Section */}
        <div className="mb-8 border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg relative h-64">
          <img 
            src={backgrounds[0]} 
            alt="Background 1" 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentBG === 0 ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <img 
            src={backgrounds[1]} 
            alt="Background 2" 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentBG === 1 ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/fax-now')}
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-amber-600 transition-colors text-left"
              >
                <div>
                  <h3 className="font-semibold">Property Search</h3>
                  <p className="text-sm text-gray-600">Search and manage properties</p>
                </div>
              </button>
              
              <button
                onClick={() => {
                  // Display users in an alert for now (or create a dedicated modal)
                  console.log('User Management clicked - showing users');
                  alert(`Total Users: ${stats.totalUsers}\n\nThis feature will display a full user management interface.`);
                }}
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-amber-600 transition-colors text-left"
              >
                <div>
                  <h3 className="font-semibold">User Management</h3>
                  <p className="text-sm text-gray-600">Manage users and permissions</p>
                </div>
              </button>
              
              {/* Only show System Reports for Arjun Paradkar (super admin) */}
              {user?.name === 'Arjun Paradkar' && (
                <button
                  onClick={() => {
                    // Display system reports in an alert for now
                    console.log('System Reports clicked - showing reports');
                    alert(`System Reports:\n\n- Total Properties: ${stats.totalProperties}\n- Total Users: ${stats.totalUsers}\n- Pending Requests: ${stats.pendingRequests}\n- Active Projects: ${stats.activeProjects}\n\nThis feature will display detailed analytics.`);
                  }}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-amber-600 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-semibold">System Reports</h3>
                      <p className="text-sm text-gray-600">View system analytics</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ongoing Projects */}
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-black mb-6">Ongoing Projects</h2>
          
          {ongoingProjects.length > 0 ? (
            <div className="space-y-4">
              {ongoingProjects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{project.description}</h3>
                      <p className="text-sm text-gray-600">Property: {project.property_address}</p>
                      <p className="text-sm text-gray-500">Contractor: {project.contractor_name} ({project.company})</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm font-semibold text-gray-700">{project.percent_complete}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-800 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.percent_complete}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No ongoing projects</p>
          )}
        </div>

        {/* Pending Verifications */}
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-black mb-6">Pending Verifications ({pendingVerifications.length})</h2>
          
          {pendingVerifications.length > 0 ? (
            <div className="space-y-4">
              {pendingVerifications.map(verification => (
                <div key={verification.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{verification.property_address}</h3>
                      <p className="text-sm text-gray-600">Contractor: {verification.requester_name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">Requested: {new Date(verification.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      Pending
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        fetch(`${API_BASE_URL}/access-requests/${verification.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          },
                          body: JSON.stringify({ status: 'approved' })
                        }).then(() => loadDashboardData());
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        fetch(`${API_BASE_URL}/access-requests/${verification.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          },
                          body: JSON.stringify({ status: 'denied' })
                        }).then(() => loadDashboardData());
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pending verifications</p>
          )}
        </div>

        {/* Admin Keys Management - Only visible to Arjun Paradkar (super admin) */}
        {user?.name === 'Arjun Paradkar' && (
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Admin Keys ({adminKeys.length})</h2>
            <button
              onClick={() => setShowAdminKeyModal(true)}
              className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
            >
              Create Admin Key
            </button>
          </div>
          
          {adminKeys.length > 0 ? (
            <div className="space-y-4">
              {adminKeys.map(key => (
                <div key={key.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{key.key_value}</h3>
                      <p className="text-sm text-gray-600">Territory: {key.territory || 'Global'}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(key.created_at).toLocaleDateString()}
                        {key.is_used && (
                          <span className="ml-2 text-red-600">• Used</span>
                        )}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      key.is_used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {key.is_used ? 'Used' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No admin keys created yet</p>
          )}
        </div>
        )}
      </div>

      {/* Create Admin Key Modal - Only visible to Arjun Paradkar (super admin) */}
      {user?.name === 'Arjun Paradkar' && showAdminKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Create New Admin Key</h2>
            
            <form onSubmit={handleCreateAdminKey}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Territory/Jurisdiction</label>
                  <input
                    type="text"
                    value={newKeyForm.territory}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, territory: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="Benton County, Arkansas"
                    required
                  />
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAdminKeyModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
                  >
                    Create Key
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Push Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Push Notification</h2>
            
            <form onSubmit={handlePushNotification}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Title *</label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="Water pressure down"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Message *</label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    rows="3"
                    placeholder="Water pressure will be reduced for next 3 days..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Target Audience</label>
                  <select
                    value={notificationForm.target_type}
                    onChange={(e) => setNotificationForm({ ...notificationForm, target_type: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                  >
                    <option value="all_users">All Users</option>
                    <option value="by_utility">By Utility Type</option>
                  </select>
                </div>
                
                {notificationForm.target_type === 'by_utility' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Utility Type</label>
                    <select
                      value={notificationForm.utility_type}
                      onChange={(e) => setNotificationForm({ ...notificationForm, utility_type: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    >
                      <option value="">Select utility...</option>
                      <option value="water">Water</option>
                      <option value="electricity">Electricity</option>
                      <option value="gas">Gas</option>
                      <option value="internet">Internet</option>
                      <option value="sewer">Sewer</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Priority</label>
                  <select
                    value={notificationForm.priority}
                    onChange={(e) => setNotificationForm({ ...notificationForm, priority: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Push Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
