import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <header>
            <div className="container nav-container">
                <Link to="/" className="logo-link">
                    <img src="/logo.png" alt="Junior Reactive Logo" className="logo-img" />
                    <div className="logo-text">
                        Junior <span>Reactive</span>
                    </div>
                </Link>
                <button className="mobile-menu-toggle" onClick={toggleMenu}>☰</button>
                <nav>
                    <ul className={menuOpen ? 'active' : ''}>
                        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
                        <li><NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>Services</NavLink></li>
                        <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
                        {/* <li><NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Blog</NavLink></li> */}
                        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;