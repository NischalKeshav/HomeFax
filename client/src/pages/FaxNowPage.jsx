import { useState, useEffect } from 'react';

function FaxNowPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:3001/api';

  const getPropertyImage = (property) => {
    if (!property) return '/CoverHouse.png';
    
    const address = property.address.toLowerCase();
    
    // 6000 SW Broadway St
    if (address.includes('6000') && address.includes('broadway')) {
      return '/6000_SW_Front.webp';
    }
    
    // 67 million dollar property (Theme House)
    if (address.includes('stonefield') || address.includes('holstrom')) {
      return '/Theme House.webp';
    }
    
    // Big House for large properties
    if (property.property_value && property.property_value > 5000000) {
      return '/Big House.webp';
    }
    
    // Beautiful Property for other nice properties
    if (property.property_value && property.property_value > 1000000) {
      return '/Beatiful Property .webp';
    }
    
    // Default cover house
    return '/CoverHouse.png';
  };

  // Search for properties
  const searchProperties = async (query) => {
    console.log('Searching for:', query);
    if (query.length < 2) {
      setRecommendations([]);
      setShowRecommendations(false);
      return;
    }

    try {
      setLoading(true);
      const url = `${API_BASE_URL}/properties?search=${encodeURIComponent(query)}&limit=5`;
      console.log('API URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API Response:', data);
      setRecommendations(data);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error searching properties:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // Get property details
  const getPropertyDetails = async (propertyId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`);
      const data = await response.json();
      setSelectedProperty(data);
    } catch (error) {
      console.error('Error fetching property details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create access request
  const createAccessRequest = async (propertyId, ownerId) => {
    try {
	    //let me hit  lil bro I want to smash so bad you are
      const response = await fetch(`${API_BASE_URL}/access-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
          contractor_id: null, // Public request
          owner_id: ownerId,
          admin_id: null,
          request_type: 'public_info_request'
        }),
      });

      if (response.ok) {
        setRequestSent(true);
        setTimeout(() => {
          setRequestSent(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating access request:', error);
    }
  };

  // Filter recommendations based on search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProperties(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.length >= 2) {
      await searchProperties(searchQuery);
    }
  };

  const handleRecommendationClick = async (property) => {
    setSearchQuery(property.address);
    setShowRecommendations(false);
    await getPropertyDetails(property.id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRequestMoreInfo = () => {
    if (selectedProperty) {
      createAccessRequest(selectedProperty.id, selectedProperty.owner_id);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-black mb-4">
            Public Fax
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Search for property information
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="flex items-center bg-white border-2 border-gray-300 rounded-lg shadow-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter property address..."
              className="flex-1 px-6 py-4 text-lg border-none outline-none rounded-l-lg"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-4 bg-amber-800 hover:bg-amber-900 transition-colors rounded-r-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Recommendations Dropdown */}
          {showRecommendations && recommendations.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 border-t-0 rounded-b-lg shadow-lg z-10">
              {recommendations.map((property) => (
                <div
                  key={property.id}
                  onClick={() => handleRecommendationClick(property)}
                  className="px-6 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                        <div className="font-medium text-gray-900">{property.address}</div>
                        <div className="text-sm text-gray-600">
                          {property.registration_number} • {property.zoning}
                          {property.property_category && (
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                              property.property_category === 'commercial' 
                                ? 'bg-blue-200 text-blue-800'
                                : property.property_category === 'mixed_use'
                                ? 'bg-purple-200 text-purple-800'
                                : 'bg-green-200 text-green-800'
                            }`}>
                              {property.property_category === 'commercial' ? 'Commercial' : 
                               property.property_category === 'mixed_use' ? 'Mixed Use' : 'Residential'}
                            </span>
                          )}
                        </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Information Display */}
        {selectedProperty && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-black mb-6">Property Information</h2>
            
            {/* Property Image */}
            <div className="mb-8 border-2 border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={getPropertyImage(selectedProperty)} 
                alt={selectedProperty.address} 
                className="w-full h-64 object-cover"
              />
            </div>
            
            {/* Rental/For Sale Banner */}
            {selectedProperty.is_for_rent && selectedProperty.property_type === 'rental' && (
              <div className="mb-6 bg-amber-100 border-2 border-amber-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-amber-900">Available for Rent</p>
                    {selectedProperty.rent_amount && (
                      <p className="text-2xl font-bold text-amber-800">${selectedProperty.rent_amount.toLocaleString()}/month</p>
                    )}
                  </div>
                  <button className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors">
                    Contact Owner
                  </button>
                </div>
              </div>
            )}

            {selectedProperty.is_for_sale && (
              <div className="mb-6 bg-blue-100 border-2 border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-blue-900">For Sale</p>
                    {selectedProperty.sale_price && (
                      <p className="text-2xl font-bold text-blue-800">${selectedProperty.sale_price.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
                      Schedule Viewing
                    </button>
                    <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                      Contact Realtor (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Address</label>
                  <p className="text-lg text-gray-900">{selectedProperty.address}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Registration Number</label>
                  <p className="text-lg text-gray-900">{selectedProperty.registration_number}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Build Year</label>
                  <p className="text-lg text-gray-900">{selectedProperty.build_year}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Zoning</label>
                  <p className="text-lg text-gray-900">{selectedProperty.zoning}</p>
                </div>

                {/* Additional Property Details */}
                {selectedProperty.beds && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Bedrooms</label>
                    <p className="text-lg text-gray-900">{selectedProperty.beds}</p>
                  </div>
                )}

                {selectedProperty.baths && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Bathrooms</label>
                    <p className="text-lg text-gray-900">{selectedProperty.baths}</p>
                  </div>
                )}

                {selectedProperty.sqft && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Square Feet</label>
                    <p className="text-lg text-gray-900">{selectedProperty.sqft.toLocaleString()} sq ft</p>
                  </div>
                )}

                {selectedProperty.lot_size && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Lot Size</label>
                    <p className="text-lg text-gray-900">{selectedProperty.lot_size} acres</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</label>
                  <p className="text-lg text-gray-900 capitalize">{selectedProperty.status}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Property Type</label>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProperty.property_type === 'rental' 
                        ? 'bg-amber-200 text-amber-800' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {selectedProperty.property_type === 'rental' ? 'Rental Property' : 'Primary Residence'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProperty.property_category === 'commercial' 
                        ? 'bg-blue-200 text-blue-800'
                        : selectedProperty.property_category === 'mixed_use'
                        ? 'bg-purple-200 text-purple-800'
                        : 'bg-green-200 text-green-800'
                    }`}>
                      {selectedProperty.property_category === 'commercial' ? 'Commercial' : 
                       selectedProperty.property_category === 'mixed_use' ? 'Mixed Use' : 'Residential'}
                    </span>
                  </div>
                </div>

                {selectedProperty.school_district && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">School District</label>
                    <p className="text-lg text-gray-900">{selectedProperty.school_district}</p>
                  </div>
                )}

                {selectedProperty.subdivision && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Subdivision</label>
                    <p className="text-lg text-gray-900">{selectedProperty.subdivision}</p>
                  </div>
                )}

                {selectedProperty.builder_name && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Builder</label>
                    <p className="text-lg text-gray-900">{selectedProperty.builder_name}</p>
                    {selectedProperty.builder_url && (
                      <a href={selectedProperty.builder_url} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:underline text-sm">
                        Visit Builder Website
                      </a>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Owner</label>
                  <p className="text-lg text-gray-900">{selectedProperty.owner_name || 'Private'}</p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            {(selectedProperty.total_appraised_value || selectedProperty.taxes || selectedProperty.homeowners_insurance) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-black mb-4">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedProperty.total_appraised_value && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Appraised Value</label>
                      <p className="text-2xl font-bold text-amber-800">${selectedProperty.total_appraised_value.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedProperty.taxes && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Annual Taxes</label>
                      <p className="text-2xl font-bold text-gray-900">${selectedProperty.taxes.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedProperty.homeowners_insurance && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Home Insurance</label>
                      <p className="text-2xl font-bold text-gray-900">${selectedProperty.homeowners_insurance.toLocaleString()}/yr</p>
                    </div>
                  )}
                  {selectedProperty.poa_fees && (
                    <div className="md:col-span-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">POA/HOA Fees</label>
                      <p className="text-lg text-gray-900">${selectedProperty.poa_fees.toLocaleString()}/month (${(selectedProperty.poa_fees * 12).toLocaleString()}/year)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sales History (If Available) */}
            {selectedProperty.sales_history && selectedProperty.sales_history.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-black mb-4">Sales History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Sold</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deed Type</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedProperty.sales_history.map((sale, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm text-gray-900">{new Date(sale.sold).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{sale.price ? `$${sale.price.toLocaleString()}` : 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{sale.deed_type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Connected Utilities</label>
                <div className="text-lg text-gray-900 grid grid-cols-2 gap-2">
                  {selectedProperty.connected_utilities && Object.entries(selectedProperty.connected_utilities).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  This is limited public information. For detailed property data, please request access below.
                </p>
                
                {requestSent ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Request Sent!</p>
                    <p className="text-sm">The property owner will be notified of your request for more information.</p>
                  </div>
                ) : (
                  <button
                    onClick={handleRequestMoreInfo}
                    className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
                  >
                    Request More Information
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <button 
            onClick={() => window.history.back()}
            className="bg-amber-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default FaxNowPage;
