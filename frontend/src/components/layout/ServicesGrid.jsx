import React from 'react';
import Card from '../common/Card';

const ServicesGrid = ({ services }) => {
    return (
        <div className="services-grid">
            {services.map(service => (
                <Card
                    key={service.id}
                    icon={service.icon}
                    title={service.title}
                    description={service.shortDescription}
                    linkTo={`/services/${service.key}`}
                />
            ))}
        </div>
    );
};

export default ServicesGrid;