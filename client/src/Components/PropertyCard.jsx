import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, DollarSign, Calendar, MapPin, CheckCircle } from 'lucide-react';

const PropertyCard = ({ property, isSelected, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  const getPropertyTypeLabel = (type) => {
    switch (type) {
      case 'single_family':
        return 'Single Family';
      case 'condo':
        return 'Condo';
      case 'townhouse':
        return 'Townhouse';
      case 'multi_family':
        return 'Multi Family';
      default:
        return type;
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-primary-500 bg-primary-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      {/* Property Image Placeholder */}
      <div className="relative h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-80"></div>
        <div className="absolute top-2 right-2">
          {property.is_verified ? (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Verified</span>
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              Unverified
            </div>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {property.address}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {getPropertyTypeLabel(property.property_type)}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-gray-600 text-xs">
          <MapPin className="w-3 h-3" />
          <span>{property.city}, {property.state}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3 text-gray-600">
            <div className="flex items-center space-x-1">
              <Home className="w-3 h-3" />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Home className="w-3 h-3" />
              <span>{property.bathrooms} bath</span>
            </div>
          </div>
          <div className="font-semibold text-gray-900">
            {formatPrice(property.estimated_value)}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Built {property.year_built}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="w-3 h-3" />
            <span>{property.square_feet?.toLocaleString()} sq ft</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last inspection: {property.last_inspection}</span>
            <span>{property.renovation_count} renovations</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            to={`/property/${property.id}`}
            className="block w-full text-center bg-primary-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-primary-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
