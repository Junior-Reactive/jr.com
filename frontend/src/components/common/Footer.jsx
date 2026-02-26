import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3>Junior Reactive</h3>
                        <p>AI that works for you. Empowering businesses with cutting-edge technology solutions.</p>
                    </div>
                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/portfolio">Portfolio</Link></li>
                            <li><Link to="/apply">Apply for Services</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3>Contact</h3>
                        <ul>
                            <li> +256 764524816</li>
                            <li> Kampala, Uganda</li>
                            <li> juniorreactive@gmail.com</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3>Follow Us</h3>
                        <ul className="social-links">
                            <li><a href="https://wa.me/256764524816" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i> WhatsApp</a></li>
                            <li><a href="https://instagram.com/juniorreactive" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i> Instagram</a></li>
                            <li><a href="https://tiktok.com/@juniorreactive" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i> TikTok</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3>Legal</h3>
                        <ul>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {currentYear} Junior Reactive. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;