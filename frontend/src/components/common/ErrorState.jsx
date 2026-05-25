import React from 'react';

const ErrorState = ({
    icon = '⚠️',
    title = 'Something went wrong',
    message,
    onRetry,
    retryLabel = 'Try Again',
    renderIcon = null,
}) => (
    <div className="error-state">
        <div className="error-icon">{renderIcon ? renderIcon() : icon}</div>
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        {onRetry && (
            <button className="btn" onClick={onRetry}>
                ↻ {retryLabel}
            </button>
        )}
    </div>
);

export default ErrorState;
