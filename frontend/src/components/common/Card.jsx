import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ icon, title, description, linkTo, linkText = 'Learn More →' }) => {
    return (
        <div className="card">
            {icon && <div className="card-icon">{icon}</div>}
            <h3>{title}</h3>
            <p>{description}</p>
            {linkTo && <Link to={linkTo} style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>{linkText}</Link>}
        </div>
    );
};

export default Card;