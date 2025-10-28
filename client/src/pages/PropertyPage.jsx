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
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [propertyHistory, setPropertyHistory] = useState([]);
  const [partsInventory, setPartsInventory] = useState([]);

  useEffect(() => {
    loadPropertyDetails();
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/comprehensive`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProperty(data);
        
        // Store user role to prevent switching
        if (user && user.role) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Load additional maintenance data
        loadMaintenanceData();
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
  
  const loadMaintenanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Load maintenance tasks
      const maintenanceResponse = await fetch(`${API_BASE_URL}/properties/${propertyId}/maintenance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (maintenanceResponse.ok) {
        const maintenanceData = await maintenanceResponse.json();
        setMaintenanceTasks(maintenanceData);
      }
      
      // Load property history
      const historyResponse = await fetch(`${API_BASE_URL}/properties/${propertyId}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setPropertyHistory(historyData);
      }
      
      // Load parts inventory
      const partsResponse = await fetch(`${API_BASE_URL}/properties/${propertyId}/parts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (partsResponse.ok) {
        const partsData = await partsResponse.json();
        setPartsInventory(partsData);
      }
    } catch (error) {
      console.error('Error loading maintenance data:', error);
    }
  };
  
  const markMaintenanceComplete = async (taskId, taskType, frequencyMonths) => {
    try {
      const token = localStorage.getItem('token');
      const now = new Date();
      const nextDue = frequencyMonths ? new Date(now.getTime() + frequencyMonths * 30 * 24 * 60 * 60 * 1000) : null;
      
      const response = await fetch(`${API_BASE_URL}/maintenance-tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          last_completed: now.toISOString(),
          next_due_date: nextDue ? nextDue.toISOString() : null,
          status: 'completed'
        })
      });
      
      if (response.ok) {
        loadMaintenanceData(); // Reload to show updated data
      }
    } catch (error) {
      console.error('Error updating maintenance task:', error);
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

  const getPropertyImage = () => {
    if (!property) return '/CoverHouse.png';
    
    const address = property.address.toLowerCase();
    
    // 6000 SW Broadway St
    if (address.includes('6000') && address.includes('broadway')) {
      return '/6000_SW_Front.webp';
    }
    
    // 67 million dollar property (Thene House)
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
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('user'));
              navigate(`/dashboard/${user?.role || 'homeowner'}`);
            }}
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
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('user'));
                navigate(`/dashboard/${user?.role || 'homeowner'}`);
              }}
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
          {['overview', 'active', 'tasks', 'history', 'parts', 'maintenance', 'models'].map((tab) => (
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
              <h2 className="text-2xl font-bold text-black mb-6">Property View</h2>
              
              <div className="relative w-full h-[600px] rounded-lg overflow-hidden border-2 border-gray-200">
                <img 
                  src={getPropertyImage()} 
                  alt={property?.address || 'Property'} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floor Plan for 6000 SW Broadway */}
              {property?.address?.toLowerCase().includes('broadway') && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-black mb-3">Floor Plan</h3>
                  <div className="relative w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-200">
                    <img 
                      src="/Floor Plan.webp" 
                      alt="Floor Plan" 
                      className="w-full h-full object-contain bg-white"
                    />
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

        {/* Active Projects Tab */}
        {activeTab === 'active' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Active Projects</h2>
            
            {property.activeProjects && property.activeProjects.length > 0 ? (
              <div className="space-y-6">
                {property.activeProjects.map((project) => (
                  <div key={project.id} className="border-2 border-amber-800 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.description}</h3>
                        <p className="text-sm text-gray-600 mb-1">Contractor: {project.contractor_name} ({project.contractor_company})</p>
                        <p className="text-sm text-gray-600">Type: {project.type.charAt(0).toUpperCase() + project.type.slice(1)}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Progress</span>
                        <span className="text-sm font-semibold text-gray-900">{project.percent_complete}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-amber-800 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${project.percent_complete}%` }}
                        ></div>
                      </div>
                    </div>

                    {project.updates && project.updates.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Updates</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {project.updates.map((update) => (
                            <div key={update.id} className="border-l-4 border-amber-800 pl-4 py-2 bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold text-gray-900">{update.title}</p>
                                  <p className="text-sm text-gray-600">{update.description}</p>
                                  {update.update_type === 'progress' && update.progress_percentage !== null && (
                                    <p className="text-sm text-amber-800 font-medium mt-1">
                                      +{update.progress_percentage - (project.percent_complete - update.progress_percentage)}% progress
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(update.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {update.files_added && update.files_added.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {update.files_added.map((file, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700">
                                      {file}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.attachments && project.attachments.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Project Files</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.attachments.map((file, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700">
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No active projects</p>
            )}
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
            <h2 className="text-2xl font-bold text-black mb-6">Maintenance Tasks</h2>
 trending
            {maintenanceTasks && maintenanceTasks.length > 0 ? (
              <div className="space-y-4">
                {maintenanceTasks.map((task) => (
                  <div key={task.id} className={`border rounded-lg p-4 ${
                    task.status === 'pending' ? 'border-amber-300 bg-amber-50' : 
                    task.status === 'completed' ? 'border-green-300 bg-green-50' : 
                    'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{task.task_name}</h3>
                        <p className="text-gray-600 mt-1 text-sm capitalize">{task.task_type.replace('_', ' ')}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                          {task.frequency_months && (
                            <div>
                              <span className="font-medium text-gray-600">Frequency:</span>
                              <p className="text-gray-900">Every {task.frequency_months} months</p>
                            </div>
                          )}
                          <div>
                            <span className=" font-medium text-gray-600">Last Completed:</span>
                            <p className="text-gray-900">{task.last_completed ? formatDate(task.last_completed) : 'Never'}</p>
                          </div>
                          {task.next_due_date && (
                            <div>
                              <span className="font-medium text-gray-600">Next Due:</span>
                              <p className="text-gray-900">{formatDate(task.next_due_date)}</p>
                            </div>
                          )}
                          {task.contractor_name && (
                            <div>
                              <span className="font-medium text-gray-600">Contractor:</span>
                              <p className="text-gray-900">{task.contractor_name}</p>
                            </div>
                          )}
                        </div>
                        
                        {task.notes && (
                          <p className="text-sm text-gray-600 mt-2">{task.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          task.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {task.status}
                        </span>
                        {task.homeowner_editable && task.status === 'pending' && (
                          <button
                            onClick={() => markMaintenanceComplete(task.id, task.task_type, task.frequency_months)}
                            className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors text-sm font-medium"
                          >
                            Mark Complete
                          </button>
                        )}
                        {!task.homeowner_editable && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Requires Contractor
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