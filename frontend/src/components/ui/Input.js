import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  autoComplete,
  ...props 
}, ref) => {
  // Set appropriate autocomplete values
  const getAutoComplete = () => {
    if (autoComplete) return autoComplete;
    
    switch (props.name) {
      case 'email': return 'email';
      case 'password': return type === 'password' ? 'current-password' : 'new-password';
      case 'confirmPassword': return 'new-password';
      case 'name': return 'name';
      default: return 'off';
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        autoComplete={getAutoComplete()}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
