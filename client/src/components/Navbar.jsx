import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../services/CartContext';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const { cartCount } = useCart();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="logo">
                    The Scent <span>Lab</span>
                </Link>

                <ul className="nav-links">
                    <li>
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
                            Fragrances
                        </Link>
                    </li>
                    <li>
                        <Link to="/recommend" className={`nav-link ${isActive('/recommend') ? 'active' : ''}`}>
                            Find Your Scent
                        </Link>
                    </li>
                </ul>

                <div className="nav-actions">
                    <Link to="/cart" className="cart-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="cart-count badge">{cartCount}</span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
