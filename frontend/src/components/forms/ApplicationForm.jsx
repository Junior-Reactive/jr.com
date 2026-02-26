import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submissionService } from '../../services/submissionService';
import Button from '../common/Button';

const ApplicationForm = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        email: '',
        phone: '',
        service_type: 'General Inquiry',
        requirements: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const serviceParam = searchParams.get('service');
        if (serviceParam) {
            setFormData(prev => ({ ...prev, service_type: serviceParam }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await submissionService.submitApplication(formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: 'Application submitted successfully!' });
                setFormData({
                    company: '',
                    name: '',
                    email: '',
                    phone: '',
                    service_type: 'General Inquiry',
                    requirements: ''
                });
            }
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.error || 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: 40, borderRadius: 8, boxShadow: 'var(--shadow-card)' }}>
            <h3>Client Information</h3>
            <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="name">Contact Person Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <h3 style={{ marginTop: 30 }}>Project Details</h3>
            <div className="form-group">
                <label htmlFor="service_type">Service Interested In</label>
                <select id="service_type" name="service_type" value={formData.service_type} onChange={handleChange}>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="AI Consulting">AI Consulting</option>
                    <option value="Custom Software Development">Custom Software</option>
                    <option value="Data Analytics & Insights">Data Analytics</option>
                    <option value="Cloud Solutions">Cloud Solutions</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="requirements">Project Requirements / Brief *</label>
                <textarea id="requirements" name="requirements" rows="6" value={formData.requirements} onChange={handleChange} required />
            </div>

            {status.message && (
                <div style={{ marginBottom: 15, padding: 10, borderRadius: 4, backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da', color: status.type === 'success' ? '#155724' : '#721c24' }}>
                    {status.message}
                </div>
            )}

            <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: 20 }}>
                {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
        </form>
    );
};

export default ApplicationForm;