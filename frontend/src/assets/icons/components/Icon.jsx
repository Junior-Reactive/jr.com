import React from 'react';
import '../styles.css';

const Icon = ({
  name,                    // Required: icon name (e.g., 'ai', 'email')
  size = 'md',             // Optional: sm, md, lg, xl (default: md)
  color = 'primary',       // Optional: primary, secondary, accent, success, error, white
  variant = 'outlined',    // Optional: outlined, filled, mixed (default: outlined)
  className = '',          // Optional: additional CSS classes
  ariaLabel = '',          // Optional: screen reader label
  tooltip = '',            // Optional: hover tooltip text
  ...props                 // Pass through other props
}) => {
  // Validate required props
  if (!name) {
    console.warn('Icon component requires a "name" prop');
    return null;
  }

  // Map sizes to pixel values
  const sizeMap = {
    sm: '24px',
    md: '32px',
    lg: '48px',
    xl: '64px',
  };

  const sizeValue = sizeMap[size] || sizeMap.md;

  // Build CSS classes
  const cssClasses = [
    'icon',
    `icon-${name}`,
    `icon-${size}`,
    `icon-${color}`,
    `icon-${variant}`,
    className
  ].filter(Boolean).join(' ');

  // Icon SVG import path
  const iconPath = `/icons/svg/${name}.svg`;

  return (
    <span
      className={cssClasses}
      style={{
        width: sizeValue,
        height: sizeValue,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      title={tooltip}
      {...props}
    >
      <img
        src={iconPath}
        alt=""
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </span>
  );
};

export default Icon;
