import { useState, useEffect, useRef } from 'react';
import { MapPin, Home, AlertTriangle, Construction, Car, School } from 'lucide-react';

const MapView = ({ 
  properties = [], 
  communityUpdates = [], 
  selectedProperty, 
  onPropertySelect,
  showCommunityUpdates = false 
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Mock map initialization
    // In a real app, this would initialize Mapbox GL JS
    setMapLoaded(true);
  }, []);

  const getPropertyIcon = (property) => {
    if (property.is_verified) {
      return <Home className="w-6 h-6 text-green-600" />;
    }
    return <Home className="w-6 h-6 text-gray-600" />;
  };

  const getUpdateIcon = (update) => {
    switch (update.update_type) {
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
        return 'border-red-500 bg-red-100';
      case 'medium':
        return 'border-yellow-500 bg-yellow-100';
      case 'low':
        return 'border-green-500 bg-green-100';
      default:
        return 'border-gray-500 bg-gray-100';
    }
  };

  if (!mapLoaded) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Property Markers */}
      {properties.map((property) => (
        <div
          key={property.id}
          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
            selectedProperty?.id === property.id ? 'z-20' : 'z-10'
          }`}
          style={{
            left: `${50 + (property.longitude || -122.4194) * 100}%`,
            top: `${50 - (property.latitude || 37.7749) * 100}%`
          }}
          onClick={() => onPropertySelect?.(property)}
        >
          <div className={`p-2 rounded-full shadow-lg ${
            selectedProperty?.id === property.id 
              ? 'bg-primary-600 text-white scale-110' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } transition-all duration-200`}>
            {getPropertyIcon(property)}
          </div>
          {selectedProperty?.id === property.id && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg p-3 min-w-48 z-30">
              <h4 className="font-semibold text-gray-900 text-sm">{property.address}</h4>
              <p className="text-gray-600 text-xs">{property.city}, {property.state}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{property.bedrooms} bed, {property.bathrooms} bath</span>
                {property.is_verified && (
                  <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs">Verified</span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Community Update Markers */}
      {showCommunityUpdates && communityUpdates.map((update) => (
        <div
          key={update.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-5"
          style={{
            left: `${50 + (update.location?.coordinates?.[0] || -122.4194) * 100}%`,
            top: `${50 - (update.location?.coordinates?.[1] || 37.7749) * 100}%`
          }}
        >
          <div className={`p-2 rounded-full shadow-lg border-2 ${getImpactColor(update.impact_level)}`}>
            {getUpdateIcon(update)}
          </div>
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="text-xs font-medium text-gray-700 mb-1">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Verified Property</span>
            </div>
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">Unverified Property</span>
            </div>
            {showCommunityUpdates && (
              <>
                <div className="flex items-center space-x-2">
                  <Construction className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-gray-600">Construction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600">Traffic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <School className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-600">School</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        Map data © HomeFax
      </div>
    </div>
  );
};

export default MapView;
