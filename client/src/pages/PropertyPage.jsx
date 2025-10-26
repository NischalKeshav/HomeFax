import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function PropertyPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadPropertyDetails();
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/comprehensive`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        setError('Property not found');
      }
    } catch (error) {
      console.error('Error loading property:', error);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Property not found'}</p>
          <button
            onClick={() => navigate('/dashboard/homeowner')}
            className="bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">{property.address}</h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-600">Property Value: {formatCurrency(property.property_value || 0)}</p>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.property_type === 'rental' 
                    ? 'bg-amber-200 text-amber-800' 
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {property.property_type === 'rental' ? 'Rental Property' : 'Primary Residence'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.property_category === 'commercial' 
                    ? 'bg-blue-200 text-blue-800'
                    : property.property_category === 'mixed_use'
                    ? 'bg-purple-200 text-purple-800'
                    : 'bg-green-200 text-green-800'
                }`}>
                  {property.property_category === 'commercial' ? 'Commercial' : 
                   property.property_category === 'mixed_use' ? 'Mixed Use' : 'Residential'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard/homeowner')}
              className="bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-8">
          {['overview', 'tasks', 'history', 'parts', 'maintenance', 'models'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-amber-800 text-amber-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Images */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Property Images</h2>
              
              {property.photos && property.photos.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {property.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-600">{photo}</p>
                          <p className="text-sm text-gray-500 mt-2">Property Image {index + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-600">No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Property Information */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Property Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Address</label>
                    <p className="text-lg text-gray-900">{property.address}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Registration</label>
                    <p className="text-lg text-gray-900">{property.registration_number}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Build Year</label>
                    <p className="text-lg text-gray-900">{property.build_year}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Zoning</label>
                    <p className="text-lg text-gray-900">{property.zoning}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</label>
                    <p className="text-lg text-gray-900 capitalize">{property.status}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completion</label>
                    <p className="text-lg text-gray-900">{property.percent_complete}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completion Progress</label>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-amber-800 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${property.percent_complete}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{property.percent_complete}% Complete</p>
                  </div>
                </div>

                {/* Current Damage (Admin Only) */}
                {property.current_damage && property.current_damage.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Current Damage</label>
                    <div className="mt-2 space-y-2">
                      {property.current_damage.map((damage, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-800 font-medium">{damage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ongoing Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Ongoing Tasks</h2>
            
            {property.ongoingTasks && property.ongoingTasks.length > 0 ? (
              <div className="space-y-4">
                {property.ongoingTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{task.task_name}</h3>
                        <p className="text-gray-600">{task.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Contractor:</span>
                        <p className="text-gray-900">{task.contractor_name || 'Not assigned'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Start Date:</span>
                        <p className="text-gray-900">{task.start_date ? formatDate(task.start_date) : 'Not started'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Estimated Completion:</span>
                        <p className="text-gray-900">{task.estimated_completion ? formatDate(task.estimated_completion) : 'TBD'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Progress:</span>
                        <p className="text-gray-900">{task.progress_percentage}%</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-800 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No ongoing tasks</p>
            )}
          </div>
        )}

        {/* Property History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Property History</h2>
            
            {property.history && property.history.length > 0 ? (
              <div className="space-y-4">
                {property.history.map((entry) => (
                  <div key={entry.id} className="border-l-4 border-amber-800 pl-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {entry.action_type.replace('_', ' ')}
                        </h3>
                        <p className="text-gray-600 mt-1">{entry.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Performed by: {entry.performed_by} • {formatDate(entry.date_performed)}
                        </p>
                      </div>
                      {entry.cost && (
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">{formatCurrency(entry.cost)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No history available</p>
            )}
          </div>
        )}

        {/* Parts Inventory Tab */}
        {activeTab === 'parts' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Parts Inventory</h2>
            
            {property.partsInventory && property.partsInventory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.partsInventory.map((part) => (
                  <div key={part.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{part.part_name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        part.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                        part.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                        part.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                        part.condition === 'poor' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {part.condition}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Type:</span>
                        <span className="ml-2 text-gray-900 capitalize">{part.part_type}</span>
                      </div>
                      {part.brand && (
                        <div>
                          <span className="font-medium text-gray-600">Brand:</span>
                          <span className="ml-2 text-gray-900">{part.brand}</span>
                        </div>
                      )}
                      {part.model && (
                        <div>
                          <span className="font-medium text-gray-600">Model:</span>
                          <span className="ml-2 text-gray-900">{part.model}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-600">Location:</span>
                        <span className="ml-2 text-gray-900 capitalize">{part.location}</span>
                      </div>
                      {part.unit_cost && (
                        <div>
                          <span className="font-medium text-gray-600">Cost:</span>
                          <span className="ml-2 text-gray-900">{formatCurrency(part.unit_cost)}</span>
                        </div>
                      )}
                      {part.installation_date && (
                        <div>
                          <span className="font-medium text-gray-600">Installed:</span>
                          <span className="ml-2 text-gray-900">{formatDate(part.installation_date)}</span>
                        </div>
                      )}
                    </div>
                    
                    {part.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">{part.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No parts inventory</p>
            )}
          </div>
        )}

        {/* Maintenance Checklist Tab */}
        {activeTab === 'maintenance' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Maintenance Checklist</h2>
            
            {property.maintenanceChecklist && property.maintenanceChecklist.length > 0 ? (
              <div className="space-y-4">
                {property.maintenanceChecklist.map((item) => (
                  <div key={item.id} className={`border rounded-lg p-4 ${
                    item.is_overdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.task_name}</h3>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Frequency:</span>
                            <p className="text-gray-900">Every {item.frequency_months} months</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Last Completed:</span>
                            <p className="text-gray-900">{item.last_completed ? formatDate(item.last_completed) : 'Never'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Next Due:</span>
                            <p className="text-gray-900">{formatDate(item.next_due)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Estimated Cost:</span>
                            <p className="text-gray-900">{item.estimated_cost ? formatCurrency(item.estimated_cost) : 'TBD'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        {item.is_overdue && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                        {item.contractor_required && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Contractor Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No maintenance items</p>
            )}
          </div>
        )}

        {/* 3D Models Tab */}
        {activeTab === 'models' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">3D Models & Blueprints</h2>
            
            {/* 3D Models */}
            {property.models3D && property.models3D.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3D Models</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.models3D.map((model) => (
                    <div key={model.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">{model.file_format.toUpperCase()}</p>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900">{model.model_name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{model.model_type.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Created by: {model.created_by_name} • {formatDate(model.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blueprints */}
            {property.blueprints && property.blueprints.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Blueprints & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.blueprints.map((blueprint, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900">Blueprint {index + 1}</h4>
                        <p className="text-sm text-gray-600">{blueprint}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!property.models3D || property.models3D.length === 0) && (!property.blueprints || property.blueprints.length === 0) && (
              <p className="text-gray-500">No 3D models or blueprints available</p>
            )}
          </div>
        )}

        {/* Connected Utilities */}
        <div className="mt-8 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Connected Utilities</h2>
          
          {property.connected_utilities ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(property.connected_utilities).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 capitalize">{key}</h3>
                  <p className="text-sm text-gray-600">
                    {typeof value === 'boolean' ? (value ? 'Connected' : 'Not Connected') : value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No utility information available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyPage;