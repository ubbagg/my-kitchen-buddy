import React from 'react';

const Card = ({
  children,
  variant = 'default',
  padding = 'base',
  hover = false,
  className = '',
  ...props
}) => {
  const baseClasses = `
    bg-white rounded-xl border border-gray-200
    transition-all duration-200
  `;

  const variants = {
    default: 'shadow-sm',
    elevated: 'shadow-lg',
    outlined: 'border-2 shadow-none',
    ghost: 'border-transparent shadow-none bg-transparent'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    base: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 cursor-pointer' 
    : '';

  const variantClasses = variants[variant] || variants.default;
  const paddingClasses = paddings[padding] || paddings.base;

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses}
        ${paddingClasses}
        ${hoverClasses}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components for better composition
Card.Header = ({ children, className = '', ...props }) => (
  <div 
    className={`pb-4 mb-4 border-b border-gray-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div 
    className={`pt-4 mt-4 border-t border-gray-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
