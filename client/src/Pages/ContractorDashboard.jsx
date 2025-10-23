import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Charts from '../components/Charts';
import { 
  Hammer, 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Camera,
  Blueprint,
  Package,
  TrendingUp,
  Calendar
} from 'lucide-react';

const ContractorDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    // Mock data
    const mockAssignments = [
      {
        id: 1,
        property_id: 1,
        assignment_type: "renovation",
        status: "completed",
        assigned_date: "2024-01-01T00:00:00",
        completed_date: "2024-02-28T00:00:00",
        notes: "Kitchen renovation completed successfully",
        property: {
          address: "123 Main St",
          city: "San Francisco",
          state: "CA"
        }
      },
      {
        id: 2,
        property_id: 2,
        assignment_type: "renovation",
        status: "in_progress",
        assigned_date: "2024-01-15T00:00:00",
        completed_date: null,
        notes: "Bathroom renovation in progress",
        property: {
          address: "456 Oak Ave",
          city: "San Francisco",
          state: "CA"
        }
      }
    ];

    const mockProjects = [
      {
        id: 1,
        property_id: 1,
        title: "Kitchen Renovation",
        description: "Complete kitchen remodel with new appliances",
        renovation_type: "kitchen",
        start_date: "2024-01-15T00:00:00",
        end_date: "2024-02-28T00:00:00",
        cost: 25000,
        status: "completed",
        is_verified: true,
        materials: {
          cabinets: "Custom oak cabinets",
          countertops: "Quartz countertops",
          appliances: "Stainless steel appliances"
        },
        blueprints: ["kitchen_layout.pdf", "electrical_plan.pdf"],
        photos: ["before_photos.zip", "progress_photos.zip", "after_photos.zip"]
      },
      {
        id: 2,
        property_id: 2,
        title: "Bathroom Remodel",
        description: "Master bathroom renovation",
        renovation_type: "bathroom",
        start_date: "2024-02-01T00:00:00",
        cost: 15000,
        status: "in_progress",
        is_verified: false,
        materials: {
          tile: "Ceramic tile",
          fixtures: "Modern fixtures",
          vanity: "Custom vanity"
        },
        blueprints: ["bathroom_layout.pdf"],
        photos: ["before_photos.zip"]
      }
    ];

    const mockNotifications = [
      {
        id: 1,
        type: "project_approved",
        title: "Project Approved",
        message: "Your kitchen renovation project has been approved",
        created_at: "2024-02-01T00:00:00",
        read: false
      },
      {
        id: 2,
        type: "new_assignment",
        title: "New Assignment",
        message: "You have been assigned to a new bathroom renovation project",
        created_at: "2024-01-25T00:00:00",
        read: true
      }
    ];

    const mockStats = {
      totalProjects: 8,
      completedProjects: 6,
      inProgressProjects: 2,
      totalRevenue: 180000,
      avgProjectDuration: 45,
      clientSatisfaction: 4.8
    };

    setTimeout(() => {
      setAssignments(mockAssignments);
      setProjects(mockProjects);
      setNotifications(mockNotifications);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contractor Dashboard</h1>
          <p className="text-gray-600">
            Manage your projects, submit reports, and track your work portfolio.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hammer className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.avgProjectDuration} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className={`bg-white rounded-lg shadow-md p-4 ${
                !notification.read ? 'border-l-4 border-primary-500' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Assignments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Assignments</h2>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(assignment.status)}
                      <h4 className="font-semibold text-gray-900">{assignment.property.address}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{assignment.notes}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Type: {assignment.assignment_type}</span>
                    <span>Assigned: {new Date(assignment.assigned_date).toLocaleDateString()}</span>
                    {assignment.completed_date && (
                      <span>Completed: {new Date(assignment.completed_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Submissions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Project Submissions</h2>
              <button
                onClick={() => setShowProjectModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <h4 className="font-semibold text-gray-900">{project.title}</h4>
                      {project.is_verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Verified
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-1 font-medium capitalize">{project.renovation_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost:</span>
                      <span className="ml-1 font-medium">${project.cost?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Project Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload Photos</p>
              <p className="text-xs text-gray-500 mt-1">Before, during, and after</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Blueprint className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload Blueprints</p>
              <p className="text-xs text-gray-500 mt-1">3D models and plans</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload Parts List</p>
              <p className="text-xs text-gray-500 mt-1">Materials and specifications</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Analytics</h2>
            <Charts 
              type="contractor"
              data={{
                projectTimeline: [
                  { month: 'Jan', completed: 1, inProgress: 1 },
                  { month: 'Feb', completed: 2, inProgress: 1 },
                  { month: 'Mar', completed: 1, inProgress: 2 },
                  { month: 'Apr', completed: 2, inProgress: 1 },
                  { month: 'May', completed: 1, inProgress: 2 },
                  { month: 'Jun', completed: 2, inProgress: 1 }
                ],
                revenue: [
                  { month: 'Jan', revenue: 25000 },
                  { month: 'Feb', revenue: 30000 },
                  { month: 'Mar', revenue: 20000 },
                  { month: 'Apr', revenue: 35000 },
                  { month: 'May', revenue: 25000 },
                  { month: 'Jun', revenue: 30000 }
                ]
              }}
            />
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit New Project</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Select Property</option>
                  <option>123 Main St, San Francisco</option>
                  <option>456 Oak Ave, San Francisco</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Kitchen Renovation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the project..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Kitchen</option>
                  <option>Bathroom</option>
                  <option>Roof</option>
                  <option>Flooring</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="25000"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Submit Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorDashboard;
