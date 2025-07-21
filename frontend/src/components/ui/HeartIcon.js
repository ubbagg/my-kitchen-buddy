import React from 'react';

const HeartIcon = ({ 
  isLiked = false, 
  onClick, 
  size = 'base',
  className = '',
  disabled = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    base: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const sizeClass = sizes[size] || sizes.base;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        p-1 rounded-full transition-all duration-200 ease-out
        hover:bg-gray-100 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      <svg
        className={`${sizeClass} transition-all duration-200 ${
          isLiked 
            ? 'text-red-500 fill-current transform scale-110' 
            : 'text-gray-400 hover:text-red-400'
        }`}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default HeartIcon;
