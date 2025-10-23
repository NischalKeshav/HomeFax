import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import PropertyCard from '../components/PropertyCard';
import { Search, Filter, MapPin, Home, DollarSign } from 'lucide-react';

const ExplorePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Mock data
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
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
        last_inspection: "2024-01-15",
        renovation_count: 3
      },
      {
        id: 2,
        address: "456 Oak Ave",
        city: "San Francisco",
        state: "CA",
        zip_code: "94103",
        latitude: 37.7849,
        longitude: -122.4094,
        property_type: "condo",
        year_built: 1985,
        square_feet: 1200,
        bedrooms: 2,
        bathrooms: 2.0,
        lot_size: 0.1,
        is_verified: false,
        verification_date: null,
        estimated_value: 850000,
        last_inspection: "2023-12-01",
        renovation_count: 1
      },
      {
        id: 3,
        address: "789 Pine St",
        city: "San Francisco",
        state: "CA",
        zip_code: "94104",
        latitude: 37.7949,
        longitude: -122.3994,
        property_type: "townhouse",
        year_built: 1995,
        square_feet: 1800,
        bedrooms: 3,
        bathrooms: 2.0,
        lot_size: 0.15,
        is_verified: true,
        verification_date: "2024-02-01T00:00:00",
        estimated_value: 950000,
        last_inspection: "2024-02-01",
        renovation_count: 2
      }
    ];
    
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredProperties = properties.filter(property => {
    if (filters.city && !property.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.property_type && property.property_type !== filters.property_type) {
      return false;
    }
    if (filters.min_price && property.estimated_value < parseInt(filters.min_price)) {
      return false;
    }
    if (filters.max_price && property.estimated_value > parseInt(filters.max_price)) {
      return false;
    }
    if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) {
      return false;
    }
    if (filters.bathrooms && property.bathrooms < parseFloat(filters.bathrooms)) {
      return false;
    }
    return true;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Properties</h1>
          <p className="text-gray-600">
            Discover verified properties with complete history and neighborhood insights.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                placeholder="San Francisco"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={filters.property_type}
                onChange={(e) => handleFilterChange('property_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="single_family">Single Family</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="multi_family">Multi Family</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="500000"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="2000000"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3+</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Property Map
              </h2>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapView 
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                />
              </div>
            </div>
          </div>

          {/* Property List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Properties ({filteredProperties.length})
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isSelected={selectedProperty?.id === property.id}
                    onClick={() => setSelectedProperty(property)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredProperties.length}</div>
              <div className="text-sm text-gray-600">Properties Found</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredProperties.filter(p => p.is_verified).length}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${Math.round(filteredProperties.reduce((sum, p) => sum + p.estimated_value, 0) / filteredProperties.length).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Avg Value</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(filteredProperties.reduce((sum, p) => sum + p.renovation_count, 0) / filteredProperties.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Renovations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
