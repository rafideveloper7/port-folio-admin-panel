import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} border-4 border-gray-700 border-t-green-500 rounded-full animate-spin`}></div>
      {text && <p className="text-gray-400 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;