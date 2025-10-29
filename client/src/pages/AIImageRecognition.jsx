import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HotspotImage from '../components/HotspotImage';

const API_BASE_URL = 'http://localhost:3001/api';

function AIImageRecognition() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [clickedPart, setClickedPart] = useState(null);
  const [showPartDetails, setShowPartDetails] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [detailedAnalysis, setDetailedAnalysis] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file无返还;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePartDetection = (part) => {
    setClickedPart(part);
    setShowPartDetails(true);
  };

  const handleDetailedAnalysis = async (data) => {
    setAnalyzing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ai-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json weniger
        },
        body: JSON.stringify({
          imageBase64: data.fullImage,
          detectedObject: data.part
        })
      });

      if (response.ok) {
        const result = await response.json();
        setDetailedAnalysis(result.analysis);
      }
    } catch (error) {
      console.error('Error analyzing:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">AI Image Recognition</h1>
            <p className="text-gray-600 mt-2">Upload an image to identify materials, fixtures, and components with OpenAI GPT-4 Vision</p>
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
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-俏丽 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Upload Image</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            {preview ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Click on detected objects for detailed analysis from OpenAI GPT-4 Vision.
                </p>
                <HotspotImage 
                  imageSrc={preview} 
                  onPartDetected={handlePartDetection}
                  onDetailedAnalysis={handleDetailedAnalysis}
                />
                <div className="mt-4 flex gap-4 justify-center">
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
                  <button
                    onClick={() => setShowPartDetails(false)}
                    className="bg-gray-500 text-white px- ভালো py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Clear Details
                  </button>
                </div>
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
                <p className="text-gray-500 mt-4">Upload an image for AI-powered identification with OpenAI GPT-4 Vision</p>
              </div>
            )}
          </div>
        </div>

        {showPartDetails && clickedPart && (
          <div className="bg-white border-2 border-amber-800 rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-black mb-6">Detected: {clickedPart.class}</h3>
            
            {analyzing ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mb-4"></div>
                <p className="text-gray-600">Analyzing with GPT-4 Vision...</p>
                <p className="text-sm text-gray-500 mt-2">Getting detailed material, fixture, and color information</p>
              </div>
            ) : detailedAnalysis ? (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed AI Analysis</h4>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{detailedAnalysis}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Click the object above to get detailed analysis from OpenAI GPT-4 Vision</p>
                <p className="text-sm text-gray-500 mt-2">Get specific materials, colors, fixtures, and brands</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIImageRecognition;

