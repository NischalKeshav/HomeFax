import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuditLog from '../components/AuditLog';
import NotificationBanner from '../components/NotificationBanner';
import { 
  Home, 
  Shield, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  DollarSign,
  Hammer,
  Camera,
  Plus
} from 'lucide-react';

const HomeDashboard = () => {
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [reports, setReports] = useState([]);
  const [renovations, setRenovations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for homeowner's property
    const mockProperty = {
      id: 1,
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip_code: "94102",
      property_type: "single_family",
      year_built: 1950,
      square_feet: 2500,
      bedrooms: 3,
      bathrooms: 2.5,
      lot_size: 0.25,
      is_verified: true,
      verification_date: "2024-01-15T00:00:00",
      estimated_value: 1200000,
      owner_id: user?.id
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
        created_at: "2024-02-01T00:00:00"
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
        is_verified: true
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

    const mockAlerts = [
      {
        id: 1,
        type: "warning",
        title: "HVAC Maintenance Due",
        message: "Your HVAC system is due for annual maintenance",
        date: "2024-02-15T00:00:00",
        priority: "medium"
      },
      {
        id: 2,
        type: "info",
        title: "Nearby Construction",
        message: "New office building construction starting next month",
        date: "2024-02-10T00:00:00",
        priority: "low"
      },
      {
        id: 3,
        type: "success",
        title: "Renovation Approved",
        message: "Your kitchen renovation has been approved and verified",
        date: "2024-02-05T00:00:00",
        priority: "low"
      }
    ];

    setTimeout(() => {
      setProperty(mockProperty);
      setReports(mockReports);
      setRenovations(mockRenovations);
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  }, [user]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Home</h1>
          <p className="text-gray-600">
            Manage your property, track renovations, and maintain comprehensive records.
          </p>
        </div>

        {/* Property Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{property?.address}</h2>
                {property?.is_verified && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <Home className="w-4 h-4" />
                <span>{property?.city}, {property?.state} {property?.zip_code}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span>{property?.bedrooms} bed, {property?.bathrooms} bath</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Built {property?.year_built}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>{property?.square_feet?.toLocaleString()} sq ft</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>${property?.estimated_value?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 lg:mt-0 lg:ml-6">
              <div className="flex flex-col space-y-2">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Documents</span>
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Renovation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(alert.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Renovation Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Renovation Timeline</h3>
            <div className="space-y-4">
              {renovations.map((renovation) => (
                <div key={renovation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Hammer className="w-4 h-4 text-gray-500" />
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
                  <p className="text-gray-600 text-sm mb-2">{renovation.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">Type: <span className="font-medium capitalize">{renovation.renovation_type}</span></span>
                    <span className="text-gray-600">Cost: <span className="font-medium">${renovation.cost?.toLocaleString()}</span></span>
                    <span className="text-gray-600">Status: <span className="font-medium capitalize">{renovation.status}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <h4 className="font-semibold text-gray-900">{report.title}</h4>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 capitalize">{report.report_type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'approved' ? 'bg-green-100 text-green-800' :
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="mt-8">
          <AuditLog 
            propertyId={property?.id}
            showPropertySpecific={true}
          />
        </div>

        {/* File Upload Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure File Uploads</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload Photos</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload Receipts</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload Permits</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            All uploads are encrypted and pending verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
