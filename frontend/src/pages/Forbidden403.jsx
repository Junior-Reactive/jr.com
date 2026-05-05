import React from 'react';
import '../assets/css/error-pages.css';

export default function Forbidden403() {
    return (
        <div className="error-page error-403">
            <div className="error-container">
                <div className="error-logo">
                    <div className="logo-box">🔒</div>
                </div>

                <div className="error-status-code">403</div>

                <h1 className="error-title">Access Forbidden</h1>

                <p className="error-message">
                    You do not have permission to access this resource.
                </p>

                <a href="/" className="error-cta">
                    ← Return to Home
                </a>

                <div className="error-footer">
                    <p>© 2026 Junior Reactive. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
