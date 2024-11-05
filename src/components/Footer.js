import React from 'react';
import './styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container text-center">
                <p>&copy; {new Date().getFullYear()} Task Management. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
