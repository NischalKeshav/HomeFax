import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import Charts from '../components/Charts';
import NotificationBanner from '../components/NotificationBanner';
import { 
  MapPin, 
  AlertTriangle, 
  Construction, 
  School, 
  Car, 
  Calendar,
  TrendingUp,
  Users,
  Home
} from 'lucide-react';

const NeighborhoodDashboard = () => {
  const { user } = useAuth();
  const [communityUpdates, setCommunityUpdates] = useState([]);
  const [neighborhoodStats, setNeighborhoodStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockCommunityUpdates = [
      {
        id: 1,
        update_type: "construction",
        title: "New Office Building Construction",
        description: "Large office building construction project starting next month",
        impact_level: "high",
        start_date: "2024-03-01T00:00:00",
        end_date: "2024-12-31T00:00:00",
        location: {
          type: "Point",
          coordinates: [-122.4194, 37.7749]
        },
        is_verified: true
      },
      {
        id: 2,
        update_type: "traffic",
        title: "Road Closure on Main Street",
        description: "Main Street will be closed for utility work",
        impact_level: "medium",
        start_date: "2024-02-15T00:00:00",
        end_date: "2024-02-20T00:00:00",
        location: {
          type: "LineString",
          coordinates: [[-122.4194, 37.7749], [-122.4184, 37.7759]]
        },
        is_verified: true
      },
      {
        id: 3,
        update_type: "school",
        title: "New Elementary School Opening",
        description: "New elementary school opening in the neighborhood",
        impact_level: "low",
        start_date: "2024-09-01T00:00:00",
        end_date: null,
        location: {
          type: "Point",
          coordinates: [-122.4094, 37.7849]
        },
        is_verified: false
      }
    ];

    const mockStats = {
      avgPropertyValue: 1000000,
      totalProperties: 150,
      activeRenovations: 12,
      openPermits: 8,
      schoolRating: 8.5,
      walkScore: 85,
      crimeRate: "Low",
      avgCommuteTime: 25
    };

    setTimeout(() => {
      setCommunityUpdates(mockCommunityUpdates);
      setNeighborhoodStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'construction':
        return <Construction className="w-5 h-5 text-orange-500" />;
      case 'traffic':
        return <Car className="w-5 h-5 text-blue-500" />;
      case 'school':
        return <School className="w-5 h-5 text-green-500" />;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Neighborhood</h1>
          <p className="text-gray-600">
            Stay informed about your neighborhood with real-time updates and insights.
          </p>
        </div>

        {/* Notifications */}
        <NotificationBanner 
          type="info"
          message="New construction project starting next month. Check the map for details."
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Property Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${neighborhoodStats.avgPropertyValue?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {neighborhoodStats.totalProperties}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Construction className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Renovations</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {neighborhoodStats.activeRenovations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">School Rating</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {neighborhoodStats.schoolRating}/10
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Neighborhood Map
              </h2>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapView 
                  communityUpdates={communityUpdates}
                  showCommunityUpdates={true}
                />
              </div>
            </div>
          </div>

          {/* Community Updates */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Community Updates</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {communityUpdates.map((update) => (
                  <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {getUpdateIcon(update.update_type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{update.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(update.impact_level)}`}>
                            {update.impact_level}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{update.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {update.start_date && new Date(update.start_date).toLocaleDateString()}
                            {update.end_date && ` - ${new Date(update.end_date).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood Trends</h2>
            <Charts 
              type="neighborhood"
              data={{
                propertyValues: [
                  { month: 'Jan', value: 950000 },
                  { month: 'Feb', value: 980000 },
                  { month: 'Mar', value: 1000000 },
                  { month: 'Apr', value: 1020000 },
                  { month: 'May', value: 1050000 },
                  { month: 'Jun', value: 1000000 }
                ],
                renovations: [
                  { month: 'Jan', count: 8 },
                  { month: 'Feb', count: 12 },
                  { month: 'Mar', count: 15 },
                  { month: 'Apr', count: 10 },
                  { month: 'May', count: 18 },
                  { month: 'Jun', count: 12 }
                ]
              }}
            />
          </div>
        </div>

        {/* Additional Neighborhood Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Walk Score</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{neighborhoodStats.walkScore}</div>
              <p className="text-gray-600">Very Walkable</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crime Rate</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{neighborhoodStats.crimeRate}</div>
              <p className="text-gray-600">Safe Neighborhood</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avg Commute</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{neighborhoodStats.avgCommuteTime}min</div>
              <p className="text-gray-600">To Downtown</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodDashboard;
