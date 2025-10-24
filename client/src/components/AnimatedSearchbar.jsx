import React, { useState } from 'react';

const AnimatedSearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      console.log('Searching for:', searchValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex ">
      <div className="relative">
        <div
          className={`
            relative bg-black border-2 border-gray-700
            transition-all duration-500 ease-out
            ${isExpanded ? 'w-80' : 'w-16'}
            h-16
            flex items-center
            hover:border-gray-500
            cursor-pointer
          `}
          style={{
            transform: 'skewX(-10deg)',
            boxShadow: isExpanded 
              ? '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)' 
              : '0 5px 20px rgba(0, 0, 0, 0.3)'
          }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => !searchValue && setIsExpanded(false)}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{ transform: 'skewX(0deg)' }}
          />
          
          <div 
            className="relative w-full h-full flex items-center px-4"
            style={{ transform: 'skewX(10deg)' }}
          >
            <svg
              className={`
                text-gray-400 transition-all duration-500
                ${isExpanded ? 'w-5 h-5' : 'w-6 h-6 mx-auto'}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search..."
              className={`
                flex-1 bg-transparent border-none outline-none
                text-white placeholder-gray-500
                ml-3 transition-all duration-500
                ${isExpanded ? 'opacity-100 w-full' : 'opacity-0 w-0'}
              `}
              style={{ caretColor: '#a78bfa' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default AnimatedSearchBar;