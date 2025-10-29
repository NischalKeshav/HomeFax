import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function RoomPartsInventory() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [partsByRoom, setPartsByRoom] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParts();
  }, [propertyId]);

  const loadParts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/parts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const parts = await response.json();
        // Organize by room
        const organized = {};
        parts.forEach(part => {
          const room = part.location || 'Other';
          if (!organized[room]) { organized[room] = []; }
          organized[room].push(part);
        });
        setPartsByRoom(organized);
      }
    } catch (error) {
      console.error('Error loading parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDependenciesBadge = (part) => {
    const deps = [];
    if (part.requires_electricity) deps.push('⚡ Electricity');
    if (part.requires_water) deps.push('💧 Water');
    if (part.requires_gas) deps.push('🔥 Gas');
    return deps.join(', ');
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Room-by-Room Parts Inventory</h1>
            <p className="text-gray-600 mt-2">Organized parts list by location</p>
          </div>
          <button
            onClick={() => navigate(`/property/${propertyId}`)}
            className="bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
          >
            Back to Property
          </button>
        </div>
      </div>

      <div className="p-8">
        {Object.keys(partsByRoom).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No parts inventory available</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(partsByRoom).map(([room, parts]) => (
              <div key={room} className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-black mb-6 capitalize">{room}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parts.map((part) => (
                    <div key={part.id} className="border border-gray-200 rounded-lg p-4 hover:border-amber-800 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{part.part_name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          part.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                          part.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                          part.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {part.condition}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        {part.part_type && (
                          <p><span className="font-medium">Type:</span> {part.part_type}</p>
                        )}
                        {part.brand && (
                          <p><span className="font-medium">Brand:</span> {part.brand}</p>
                        )}
                        {part.model && (
                          <p><span className="font-medium">Model:</span> {part.model}</p>
                        )}
                        {part.quantity > 1 && (
                          <p><span className="font-medium">Quantity:</span> {part.quantity}</p>
                        )}
                        {part.unit_cost && (
                          <p><span className="font-medium">Cost:</span> ${part.unit_cost.toLocaleString()}</p>
                        )}
                        <p className="text-xs text-gray-500">{getDependenciesBadge(part)}</p>
                        {part.warranty_until && (
                          <p className="text-xs"><span className="font-medium">Warranty until:</span> {new Date(part.warranty_until).toLocaleDateString()}</p>
                        )}
                      </div>
                      
                      {part.notes && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-600 italic">{part.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomPartsInventory;

