import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { orderAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await orderAPI.getByUser(user._id);
                // Sort by date sort of (if createdAt exists)
                const sortedOrders = response.data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <div>
                        <h1 className="text-title">My Account</h1>
                        <p className="profile-email">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        Logout
                    </button>
                </div>

                <div className="profile-content">
                    <section className="profile-section">
                        <h2 className="section-title">Order History</h2>

                        {loading ? (
                            <div className="loading">Loading orders...</div>
                        ) : orders.length > 0 ? (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order._id} className="order-card">
                                        <div className="order-header">
                                            <div>
                                                <span className="order-id">Order #{order._id.slice(-6)}</span>
                                                <span className="order-date">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={`order-status status-${order.status || 'pending'}`}>
                                                {order.status || 'Processing'}
                                            </span>
                                        </div>
                                        <div className="order-items">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="order-item">
                                                    <span>{item.quantity}x {item.fragrance?.name || 'Unknown Item'} ({item.type})</span>
                                                    <span>${(item.priceAtPurchase * (item.type === 'decant' ? 1 : item.quantity)).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="order-footer">
                                            <span>Total</span>
                                            <span className="order-total">${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-orders">
                                <p>You haven't placed any orders yet.</p>
                                <button onClick={() => navigate('/products')} className="btn btn-primary">
                                    Start Shopping
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
