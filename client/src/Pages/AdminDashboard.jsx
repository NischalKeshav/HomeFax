import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Charts from '../components/Charts';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Users, 
  Home, 
  FileText,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingReports, setPendingReports] = useState([]);
  const [pendingUpdates, setPendingUpdates] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockPendingReports = [
      {
        id: 1,
        property_id: 1,
        submitter_id: 2,
        report_type: "repair",
        title: "Kitchen Renovation",
        description: "Complete kitchen remodel with new appliances",
        status: "pending",
        created_at: "2024-02-01T00:00:00",
        submitter: {
          first_name: "Jane",
          last_name: "Smith",
          role: "contractor"
        }
      },
      {
        id: 2,
        property_id: 2,
        submitter_id: 3,
        report_type: "inspection",
        title: "Pre-purchase Inspection",
        description: "Comprehensive inspection before purchase",
        status: "pending",
        created_at: "2024-02-05T00:00:00",
        submitter: {
          first_name: "Bob",
          last_name: "Johnson",
          role: "buyer"
        }
      }
    ];

    const mockPendingUpdates = [
      {
        id: 1,
        property_id: null,
        neighborhood_id: "sf_downtown",
        update_type: "school",
        title: "New Elementary School Opening",
        description: "New elementary school opening in the neighborhood",
        impact_level: "low",
        is_verified: false,
        created_by: 1,
        created_at: "2024-02-01T00:00:00",
        creator: {
          first_name: "John",
          last_name: "Doe",
          role: "homeowner"
        }
      }
    ];

    const mockStats = {
      totalProperties: 150,
      totalReports: 45,
      pendingReports: 2,
      totalUsers: 25,
      verifiedProperties: 120,
      communityUpdates: 8,
      contractors: 12,
      homeowners: 8
    };

    setTimeout(() => {
      setPendingReports(mockPendingReports);
      setPendingUpdates(mockPendingUpdates);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApproveReport = (reportId) => {
    setPendingReports(prev => prev.filter(r => r.id !== reportId));
    // In real app, would make API call
  };

  const handleRejectReport = (reportId) => {
    setPendingReports(prev => prev.filter(r => r.id !== reportId));
    // In real app, would make API call
  };

  const handleApproveUpdate = (updateId) => {
    setPendingUpdates(prev => prev.filter(u => u.id !== updateId));
    // In real app, would make API call
  };

  const handleRejectUpdate = (updateId) => {
    setPendingUpdates(prev => prev.filter(u => u.id !== updateId));
    // In real app, would make API call
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage the HomeFax platform, approve reports, and oversee community updates.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Properties</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.verifiedProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Reports */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Pending Reports ({pendingReports.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{report.title}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Submitted by: {report.submitter.first_name} {report.submitter.last_name} ({report.submitter.role})
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveReport(report.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectReport(report.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Community Updates */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Pending Community Updates ({pendingUpdates.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingUpdates.map((update) => (
                <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{update.title}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(update.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{update.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created by: {update.creator.first_name} {update.creator.last_name} ({update.creator.role})
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveUpdate(update.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectUpdate(update.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h2>
            <Charts 
              type="admin"
              data={{
                userGrowth: [
                  { month: 'Jan', users: 15 },
                  { month: 'Feb', users: 18 },
                  { month: 'Mar', users: 22 },
                  { month: 'Apr', users: 25 },
                  { month: 'May', users: 28 },
                  { month: 'Jun', users: 25 }
                ],
                propertyVerification: [
                  { month: 'Jan', verified: 8, pending: 2 },
                  { month: 'Feb', verified: 12, pending: 3 },
                  { month: 'Mar', verified: 15, pending: 1 },
                  { month: 'Apr', verified: 18, pending: 2 },
                  { month: 'May', verified: 22, pending: 1 },
                  { month: 'Jun', verified: 20, pending: 3 }
                ]
              }}
            />
          </div>
        </div>

        {/* User Management */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.homeowners}</div>
              <div className="text-sm text-gray-600">Homeowners</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.contractors}</div>
              <div className="text-sm text-gray-600">Contractors</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.totalUsers - stats.homeowners - stats.contractors}</div>
              <div className="text-sm text-gray-600">Buyers</div>
            </div>
          </div>
        </div>

        {/* Community Notifications */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Community Notification</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Neighborhood</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Select Neighborhood</option>
                <option>Downtown</option>
                <option>Mission District</option>
                <option>Castro</option>
                <option>All Neighborhoods</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your notification message..."
              />
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
