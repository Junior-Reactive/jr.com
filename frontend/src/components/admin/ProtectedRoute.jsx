import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { adminVerify } from '../../services/adminService';

export default function ProtectedRoute({ children }) {
    const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'denied'

    useEffect(() => {
        adminVerify()
            .then(() => setStatus('ok'))
            .catch(() => setStatus('denied'));
    }, []);

    if (status === 'checking') {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: '#f0f2f8',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="admin-spinner" />
                    <p style={{ marginTop: 16, color: '#6b7280', fontSize: 14 }}>Verifying session…</p>
                </div>
            </div>
        );
    }

    if (status === 'denied') return <Navigate to="/admin/login" replace />;

    return children;
}
