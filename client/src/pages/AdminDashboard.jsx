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

      // Load statistics
      const [propertiesRes, usersRes, requestsRes, projectsRes] = await Promise.all([
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
        })
      ]);

      const [properties, users, requests, projects] = await Promise.all([
        propertiesRes.json(),
        usersRes.json(),
        requestsRes.json(),
        projectsRes.json()
      ]);

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
              onClick={handleLogout}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
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
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-amber-600 transition-colors text-left"
              >
                <div>
                  <h3 className="font-semibold">User Management</h3>
                  <p className="text-sm text-gray-600">Manage users and permissions</p>
                </div>
              </button>
              
              <button
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-amber-600 transition-colors text-left"
              >
                <div className="flex items-center">
                  <div>
                    <h3 className="font-semibold">System Reports</h3>
                    <p className="text-sm text-gray-600">View system analytics</p>
                  </div>
                </div>
              </button>
              
              <button
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-amber-600 transition-colors text-left"
              >
                <div>
                  <h3 className="font-semibold">Admin Keys</h3>
                  <p className="text-sm text-gray-600">Manage admin registration keys</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
