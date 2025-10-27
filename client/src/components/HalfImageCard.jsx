import React, { useState, useEffect } from 'react';

const HalfImageCard = ({ imageUrl }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate the offset based on scroll position (0-50% range)
  const offset = (scrollPosition * 0.05) % 50;

  return (
    <div 
      className="relative overflow-hidden bg-gray-200 rounded-lg shadow-lg"
      style={{ 
        width: '18vw',
        height: '45vh',
        minWidth: '200px',
        minHeight: '150px'
      }}  
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: `${offset}% center`,
          backgroundRepeat: 'no-repeat',
          width: '200%',
          transform: 'translateX(-50%)'
        }}
      />
    </div>
  );
};
export default HalfImageCard;
