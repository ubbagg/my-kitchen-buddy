import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = '', 
  fullScreen = false,
  className = '' 
}) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const sizeClass = sizes[size] || sizes.medium;

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClass}`}
        style={{ borderTopColor: 'var(--color-primary)' }}
      />
      {message && (
        <p className="mt-3 text-sm text-gray-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
