import React from 'react';
import Button from '../common/Button';

const HeroSection = ({ title, subtitle, primaryBtnText, primaryBtnLink, secondaryBtnText, secondaryBtnLink }) => {
    return (
        <section className="hero">
            <div className="container">
                <h1>{title}</h1>
                <p>{subtitle}</p>
                {(primaryBtnText || secondaryBtnText) && (
                    <div className="hero-btns">
                        {primaryBtnText && (
                            <Button
                                onClick={() => window.location.href = primaryBtnLink}
                                style={{ marginRight: '15px' }}
                            >
                                {primaryBtnText}
                            </Button>
                        )}
                        {secondaryBtnText && (
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = secondaryBtnLink}
                            >
                                {secondaryBtnText}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HeroSection;
