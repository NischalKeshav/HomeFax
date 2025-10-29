import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/api';

function AIImageRecognition() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // TODO: Upload to server and run AI recognition
    setUploading(true);
    
    // For now, show a placeholder response
    setTimeout(() => {
      setResults({
        materials: [
          { name: 'Sheetrock', confidence: 0.95, description: 'Standard 1/2 inch sheetrock, likely installed 2017' },
          { name: 'Paint', confidence: 0.92, color: 'Eggshell White', manufacturer: 'Benjamin Moore' },
          { name: 'Wood Trim', confidence: 0.88, type: 'Pine', finish: 'Satin Polyurethane' }
        ],
        fixtures: [
          { name: 'Wall Outlet', confidence: 0.98, type: 'GFCI', standard: 'NEC 2020' },
          { name: 'Light Switch', confidence: 0.95, type: 'Standard Toggle', brand: 'Leviton' }
        ]
      });
      setUploading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">AI Image Recognition</h1>
            <p className="text-gray-600 mt-2">Upload an image to identify materials, fixtures, and components</p>
          </div>
          <button
            onClick={() => navigate(`/property/${propertyId}`)}
            className="bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
          >
            Back to Property
          </button>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {/* Upload Area */}
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Upload Image</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            {preview ? (
              <div>
                <img src={preview} alt="Preview" className="max-w-full max-h-96 mx-auto mb-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors cursor-pointer inline-block"
                >
                  Change Image
                </label>
              </div>
            ) : (
              <div>
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors cursor-pointer inline-block"
                >
                  Select Image
                </label>
                <p className="text-gray-500 mt-4">Upload an image of any part of your property for AI-powered identification</p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
              <p className="text-gray-600 mt-2">Analyzing image...</p>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Materials */}
            {results.materials && results.materials.length > 0 && (
              <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-black mb-6">Recognized Materials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.materials.map((material, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{material.name}</h4>
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                          {Math.round(material.confidence * 100)}% confidence
                        </span>
                      </div>
                      {material.description && <p className="text-gray-600 text-sm">{material.description}</p>}
                      {material.color && <p className="text-gray-600 text-sm">Color: {material.color}</p>}
                      {material.manufacturer && <p className="text-gray-600 text-sm">Manufacturer: {material.manufacturer}</p>}
                      {material.type && <p className="text-gray-600 text-sm">Type: {material.type}</p>}
                      {material.finish && <p className="text-gray-600 text-sm">Finish: {material.finish}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fixtures */}
            {results.fixtures && results.fixtures.length > 0 && (
              <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-black mb-6">Recognized Fixtures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.fixtures.map((fixture, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{fixture.name}</h4>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          {Math.round(fixture.confidence * 100)}% confidence
                        </span>
                      </div>
                      {fixture.type && <p className="text-gray-600 text-sm">Type: {fixture.type}</p>}
                      {fixture.standard && <p className="text-gray-600 text-sm">Standard: {fixture.standard}</p>}
                      {fixture.brand && <p className="text-gray-600 text-sm">Brand: {fixture.brand}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIImageRecognition;

