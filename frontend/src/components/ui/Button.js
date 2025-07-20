import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'base',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    border border-transparent
    transform active:scale-95
    min-h-[2.5rem]
    whitespace-nowrap
  `;

  const variants = {
    primary: `
      bg-primary text-white
      hover:bg-primary-dark hover:shadow-md hover:-translate-y-[1px]
      focus:ring-primary-light
      shadow-sm
      active:shadow-sm active:translate-y-0
    `,
    secondary: `
      bg-white text-gray-700 border-gray-300
      hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:-translate-y-[1px]
      focus:ring-gray-200
      shadow-sm
      active:shadow-sm active:translate-y-0 active:bg-gray-100
    `,
    outline: `
      bg-transparent text-primary border-primary border-2
      hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-[1px]
      focus:ring-primary-light
      active:shadow-sm active:translate-y-0 active:scale-95
    `,
    ghost: `
      bg-transparent text-gray-600
      hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm hover:-translate-y-[1px]
      focus:ring-gray-200
      active:bg-gray-200 active:translate-y-0
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700 hover:shadow-md hover:-translate-y-[1px]
      focus:ring-red-200
      shadow-sm
      active:shadow-sm active:translate-y-0
    `
  };

  const sizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[2rem]',      
  base: 'px-4 py-2 text-base min-h-[2.5rem]', 
  lg: 'px-6 py-3 text-lg min-h-[3rem]'
};


  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.base;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses}
        ${sizeClasses}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      style={{
        backgroundColor: variant === 'primary' ? 'var(--color-primary)' : undefined,
        borderColor: variant === 'outline' ? 'var(--color-primary)' : undefined,
        color: variant === 'outline' ? 'var(--color-primary)' : undefined,
      }}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;