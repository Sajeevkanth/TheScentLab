import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../services/CartContext';
import { useAuth } from '../services/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-logo">
                    The Scent Lab
                </Link>

                <div className="navbar-links">
                    <Link to="/products">Collection</Link>
                    <Link to="/recommend">Find My Scent</Link>
                </div>

                <div className="navbar-actions">
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="navbar-admin">
                            Admin Panel
                        </Link>
                    )}
                    {user ? (
                        <Link to="/profile" className="nav-icon-btn profile-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </Link>
                    ) : (
                        <Link to="/login" className="navbar-login">
                            Login
                        </Link>
                    )}

                    <Link to="/cart" className="navbar-cart">
                        Cart ({cartCount})
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
