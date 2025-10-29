import { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

function HotspotImage({ imageSrc, onPartDetected }) {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Load the COCO-SSD model
    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setLoading(false);
      } catch (error) {
        console.error('Error loading model:', error);
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    // Run detection when image loads
    if (imageSrc && model && imageRef.current) {
      detectObjects();
    }
  }, [imageSrc, model]);

  const detectObjects = async () => {
    if (!model || !imageRef.current || !canvasRef.current) return;

    const predictions = await model.detect(imageRef.current);
    
    // Draw bounding boxes and store detection data
    const ctx = canvasRef.current.getContext('2d');
    const img = imageRef.current;
    
    canvasRef.current.width = img.width;
    canvasRef.current.height = img.height;
    
    // Draw all detected objects
    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label
      ctx.fillStyle = 'rgba(217, 119, 6, 0.9)';
      ctx.font = '14px sans-serif';
      ctx.fillText(
        `${prediction.class}: ${Math.round(prediction.score * 100)}%`,
        x,
        y > 10 ? y - 5 : y + 15
      );
    });
    
    // Store predictions for click detection
    canvasRef.current._predictions = predictions;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
    
    // Check if cursor is over a detected object
    if (canvasRef.current?._predictions) {
      const predictions = canvasRef.current._predictions;
      const clickedPrediction = predictions.find((pred) => {
        const [px, py, width, height] = pred.bbox;
        return x >= px && x <= px + width && y >= py && y <= py + height;
      });
      
      if (clickedPrediction) {
        setSelectedPart(clickedPrediction);
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }
    }
  };

  const handleClick = (e) => {
    if (selectedPart && onPartDetected) {
      onPartDetected(selectedPart);
    }
  };

  return (
    <div className="relative inline-block">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mb-4"></div>
            <p className="text-gray-600">Loading AI Model...</p>
          </div>
        </div>
      )}
      
      <div 
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        <img 
          ref={imageRef}
          src={imageSrc} 
          alt="Property" 
          className="max-w-full h-auto block"
          crossOrigin="anonymous"
        />
        <canvas 
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
        />
        
        {/* Cursor indicator circle */}
        {showTooltip && (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: cursorPos.x - 60,
              top: cursorPos.y - 60,
              width: 120,
              height: 120,
              border: '3px solid rgba(217, 119, 6, 0.6)',
              borderRadius: '50%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
        )}
      </div>
      
      {/* Tooltip */}
      {showTooltip && selectedPart && (
        <div 
          className="absolute bg-amber-900 text-white px-4 py-2 rounded-lg shadow-lg z-20 pointer-events-none"
          style={{
            left: cursorPos.x + 20,
            top: cursorPos.y - 40,
            transform: 'translateY(-100%)'
          }}
        >
          <p className="font-semibold text-sm">
            {selectedPart.class} ({Math.round(selectedPart.score * 100)}%)
          </p>
          <p className="text-xs mt-1">Click to get details</p>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default HotspotImage;

