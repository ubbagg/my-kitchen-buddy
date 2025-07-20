import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helper,
  type = 'text',
  size = 'base',
  className = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const baseClasses = `
    w-full rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-gray-400
  `;

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    base: 'px-4 py-2.5 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  const stateClasses = error
    ? `border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 text-red-900`
    : `border-gray-300 bg-white focus:border-primary focus:ring-primary-light text-gray-900`;

  const sizeClasses = sizes[size] || sizes.base;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={`
          ${baseClasses}
          ${stateClasses}
          ${sizeClasses}
          ${className}
        `.replace(/\s+/g, ' ').trim()}
        style={{
          '--color-primary': 'var(--color-primary)',
          '--color-primary-light': 'var(--color-primary-light)'
        }}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
