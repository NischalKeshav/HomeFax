import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    title: '',
    description: '',
    progress_increment: 10,
    files: '',
    parts_list: ''
  });

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      // Load project details
      const projectResponse = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const projectData = await projectResponse.json();
      setProject(projectData);

      // Load project updates
      const updatesResponse = await fetch(`${API_BASE_URL}/project-updates/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const updatesData = await updatesResponse.json();
      setUpdates(updatesData);

    } catch (error) {
      console.error('Error loading project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const newProgress = project.percent_complete + parseInt(updateForm.progress_increment);
      
      await fetch(`${API_BASE_URL}/project-updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          project_id: projectId,
          contractor_id: user.id,
          update_type: 'update',
          title: updateForm.title,
          description: updateForm.description,
          progress_percentage: newProgress,
          files_added: updateForm.files ? updateForm.files.split(',').map(f => f.trim()) : [],
          parts_listed: updateForm.parts_list ? JSON.parse(updateForm.parts_list) : null
        })
      });

      setShowUpdateForm(false);
      setUpdateForm({ title: '', description: '', progress_increment: 10, files: '', parts_list: '' });
      loadProjectDetails();
    } catch (error) {
      console.error('Error submitting update:', error);
    }
  };

  const handleFinishProject = async () => {
    if (!window.confirm('Mark this project as completed?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Create final update
      await fetch(`${API_BASE_URL}/project-updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          project_id: projectId,
          contractor_id: user.id,
          update_type: 'update',
          title: 'Project Completed',
          description: 'This project has been completed successfully.',
          progress_percentage: 100
        })
      });

      // Mark project as completed
      await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed', percent_complete: 100 })
      });

      navigate('/dashboard/contractor');
    } catch (error) {
      console.error('Error finishing project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Project Not Found</h1>
          <button
            onClick={() => navigate('/dashboard/contractor')}
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
            <h1 className="text-3xl font-bold text-black">{project.description || project.type}</h1>
            <p className="text-gray-600">Property: {project.property_address}</p>
            <p className="text-sm text-gray-500">Type: {project.type} • Status: {project.status}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard/contractor')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              className="bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
            >
              {showUpdateForm ? 'Cancel' : 'Add Update'}
            </button>
            {project.percent_complete === 100 && (
              <button
                onClick={handleFinishProject}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Progress */}
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Progress</h2>
          <div className="mb-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Completion</span>
              <span className="text-sm font-semibold text-gray-700">{project.percent_complete}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-amber-800 h-4 rounded-full transition-all duration-300"
                style={{ width: `${project.percent_complete}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Update Form */}
        {showUpdateForm && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Add Update</h2>
            
            {/* Contractor Update Image */}
            <div className="mb-6 border-2 border-gray-200 rounded-lg overflow-hidden">
              <img 
                src="/Contracter Update Image.png" 
                alt="Contractor Update" 
                className="w-full h-48 object-cover"
              />
            </div>
            
            <form onSubmit={handleSubmitUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Update Title *
                  </label>
                  <input
                    type="text"
                    value={updateForm.title}
                    onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="e.g., Completed framing"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={updateForm.description}
                    onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder="What did you complete today?"
                    rows="4"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Progress Increment (%)
                    </label>
                    <input
                      type="number"
                      value={updateForm.progress_increment}
                      onChange={(e) => setUpdateForm({ ...updateForm, progress_increment: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Files (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={updateForm.files}
                      onChange={(e) => setUpdateForm({ ...updateForm, files: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                      placeholder="/blueprints/new.pdf, /photos/work.jpg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Parts Added (JSON format) - Optional
                  </label>
                  <textarea
                    value={updateForm.parts_list}
                    onChange={(e) => setUpdateForm({ ...updateForm, parts_list: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 outline-none"
                    placeholder='[{"name": "Ceiling Fan", "quantity": 2, "unitCost": 150.00, "location": "Master Bedroom"}]'
                    rows="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: Array of objects with name, quantity, unitCost, and location fields
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
                >
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Updates Timeline */}
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Update History</h2>
          {updates.length > 0 ? (
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{update.title}</h3>
                      <p className="text-sm text-gray-500">{new Date(update.created_at).toLocaleString()}</p>
                    </div>
                    {update.progress_percentage && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                        {update.progress_percentage}%
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{update.description}</p>
                  {update.files_added && update.files_added.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Files:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {update.files_added.map((file, idx) => (
                          <li key={idx}>{file}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {update.parts_listed && update.parts_listed.length > 0 && (
                    <div className="mb-2 bg-amber-50 p-3 rounded border border-amber-200">
                      <p className="text-sm font-semibold text-amber-800 mb-2">Parts Added:</p>
                      <div className="space-y-1">
                        {update.parts_listed.map((part, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            <span className="font-medium">{part.quantity}x</span> {part.name} 
                            {part.unitCost && (
                              <span className="text-gray-500"> - ${part.unitCost.toFixed(2)} each</span>
                            )}
                            {part.location && (
                              <span className="text-gray-500"> - {part.location}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No updates yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;

