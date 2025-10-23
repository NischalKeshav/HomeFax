import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  MapPin, 
  Home, 
  Calendar, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Upload,
  FileText,
  Camera,
  Hammer
} from 'lucide-react';

const PropertyPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, hasRole, hasAnyRole } = useAuth();
  const [property, setProperty] = useState(null);
  const [reports, setReports] = useState([]);
  const [renovations, setRenovations] = useState([]);
  const [communityUpdates, setCommunityUpdates] = useState([]);
  const [activeTab, setActiveTab] = useState('history');
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    // Mock data loading
    const mockProperty = {
      id: parseInt(id),
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip_code: "94102",
      latitude: 37.7749,
      longitude: -122.4194,
      property_type: "single_family",
      year_built: 1950,
      square_feet: 2500,
      bedrooms: 3,
      bathrooms: 2.5,
      lot_size: 0.25,
      is_verified: true,
      verification_date: "2024-01-15T00:00:00",
      estimated_value: 1200000,
      owner_id: 1
    };

    const mockReports = [
      {
        id: 1,
        report_type: "inspection",
        title: "Annual Home Inspection",
        description: "Comprehensive inspection of all major systems",
        status: "approved",
        created_at: "2024-01-15T00:00:00",
        report_data: {
          electrical: "Good",
          plumbing: "Good",
          hvac: "Needs maintenance",
          roof: "Good"
        }
      },
      {
        id: 2,
        report_type: "repair",
        title: "Kitchen Renovation",
        description: "Complete kitchen remodel with new appliances",
        status: "pending",
        created_at: "2024-02-01T00:00:00",
        report_data: {
          cost: 25000,
          duration: "6 weeks",
          contractor: "ABC Construction"
        }
      }
    ];

    const mockRenovations = [
      {
        id: 1,
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
        }
      },
      {
        id: 2,
        title: "Bathroom Remodel",
        description: "Master bathroom renovation",
        renovation_type: "bathroom",
        start_date: "2023-06-01T00:00:00",
        end_date: "2023-08-15T00:00:00",
        cost: 15000,
        status: "completed",
        is_verified: true
      }
    ];

    const mockCommunityUpdates = [
      {
        id: 1,
        update_type: "construction",
        title: "New Office Building Construction",
        description: "Large office building construction project starting next month",
        impact_level: "high",
        start_date: "2024-03-01T00:00:00",
        end_date: "2024-12-31T00:00:00"
      },
      {
        id: 2,
        update_type: "traffic",
        title: "Road Closure on Main Street",
        description: "Main Street will be closed for utility work",
        impact_level: "medium",
        start_date: "2024-02-15T00:00:00",
        end_date: "2024-02-20T00:00:00"
      }
    ];

    setTimeout(() => {
      setProperty(mockProperty);
      setReports(mockReports);
      setRenovations(mockRenovations);
      setCommunityUpdates(mockCommunityUpdates);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <Link to="/explore" className="text-primary-600 hover:text-primary-700">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{property.address}</h1>
                {property.is_verified && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{property.city}, {property.state} {property.zip_code}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Built {property.year_built}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>{property.square_feet?.toLocaleString()} sq ft</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>${property.estimated_value?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 lg:mt-0 lg:ml-6">
              <div className="flex flex-col space-y-2">
                {hasRole('homeowner') && property.owner_id === user?.id && (
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Manage Property
                  </button>
                )}
                {hasRole('buyer') && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Request HomeFax Report
                  </button>
                )}
                {hasRole('contractor') && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Project Files
                  </button>
                )}
                {hasAnyRole(['homeowner', 'contractor', 'admin']) && (
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Report Issue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'history', label: 'History', icon: <FileText className="w-4 h-4" /> },
                { id: 'renovations', label: 'Renovations', icon: <Hammer className="w-4 h-4" /> },
                { id: 'community', label: 'Community Impact', icon: <Users className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property History & Reports</h3>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(report.status)}
                          <h4 className="font-semibold text-gray-900">{report.title}</h4>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{report.description}</p>
                      {report.report_data && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h5 className="font-medium text-gray-900 mb-2">Report Details:</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            {Object.entries(report.report_data).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600 capitalize">{key}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Renovations Tab */}
            {activeTab === 'renovations' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Renovation History</h3>
                <div className="space-y-4">
                  {renovations.map((renovation) => (
                    <div key={renovation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(renovation.status)}
                          <h4 className="font-semibold text-gray-900">{renovation.title}</h4>
                          {renovation.is_verified && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {renovation.start_date && new Date(renovation.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{renovation.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-1 font-medium capitalize">{renovation.renovation_type}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cost:</span>
                          <span className="ml-1 font-medium">${renovation.cost?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className="ml-1 font-medium capitalize">{renovation.status}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="ml-1 font-medium">
                            {renovation.start_date && renovation.end_date 
                              ? `${Math.ceil((new Date(renovation.end_date) - new Date(renovation.start_date)) / (1000 * 60 * 60 * 24))} days`
                              : 'Ongoing'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Impact Tab */}
            {activeTab === 'community' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Impact & Updates</h3>
                <div className="space-y-4">
                  {communityUpdates.map((update) => (
                    <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{update.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(update.impact_level)}`}>
                            {update.impact_level} impact
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {update.start_date && new Date(update.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{update.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{update.update_type}</span>
                        {update.end_date && (
                          <span>Ends: {new Date(update.end_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report an Issue</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Incorrect Information</option>
                  <option>Missing Data</option>
                  <option>Technical Issue</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Please describe the issue..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;
