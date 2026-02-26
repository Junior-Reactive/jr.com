import React from 'react';
import './Button.css';

const Button = ({ 
    children, 
    variant = 'primary', 
    onClick, 
    type = 'button', 
    className = '',
    disabled = false,
    fullWidth = false
}) => {
    const buttonClasses = [
        'btn',
        variant === 'outline' ? 'btn-outline' : '',
        variant === 'secondary' ? 'btn-secondary' : '',
        variant === 'accent' ? 'btn-accent' : '',
        fullWidth ? 'btn-full-width' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;