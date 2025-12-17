import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../services/CartContext';
import { orderAPI } from '../services/api';
import './Cart.css';

const Cart = () => {
    const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsCheckingOut(true);

        try {
            const orderData = {
                guestEmail: formData.email,
                items: cart.map(item => ({
                    fragrance: item.fragranceId,
                    type: item.type,
                    quantity: item.quantity,
                    mlQuantity: item.mlQuantity,
                    priceAtPurchase: item.type === 'bottle'
                        ? item.price.bottle
                        : item.price.perMl * item.mlQuantity
                })),
                shippingAddress: {
                    name: formData.name,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip
                },
                subtotal: cartTotal,
                shipping: cartTotal > 100 ? 0 : 9.99,
                total: cartTotal + (cartTotal > 100 ? 0 : 9.99)
            };

            await orderAPI.create(orderData);
            setOrderComplete(true);
            clearCart();
        } catch (error) {
            console.error('Error creating order:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const getItemPrice = (item) => {
        if (item.type === 'bottle') {
            return item.price.bottle * item.quantity;
        }
        return item.price.perMl * item.mlQuantity * item.quantity;
    };

    const shipping = cartTotal > 100 ? 0 : 9.99;
    const total = cartTotal + shipping;

    if (orderComplete) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="order-complete">
                        <div className="order-complete-icon">✓</div>
                        <h1>Order Confirmed!</h1>
                        <p>Thank you for your purchase. Your fragrances are on their way!</p>
                        <p className="order-note">
                            The Smart Decant System has automatically updated our inventory.
                        </p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛍️</div>
                        <h2>Your Cart is Empty</h2>
                        <p>Discover your next signature scent</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Explore Collection
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="cart-title" style={{ marginBottom: 0 }}>
                        Your Cart
                    </h1>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear your cart?')) {
                                clearCart();
                            }
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="cart-content">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img
                                        src={item.imageUrl || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200'}
                                        alt={item.name}
                                    />
                                </div>

                                <div className="cart-item-info">
                                    <span className="cart-item-brand">{item.brand}</span>
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    <div className="cart-item-type">
                                        {item.type === 'bottle' ? (
                                            <span className="type-badge bottle">
                                                🍾 Full Bottle
                                            </span>
                                        ) : (
                                            <span className="type-badge decant">
                                                🧪 {item.mlQuantity}ml Decant
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="cart-item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.inventory ? (item.type === 'bottle'
                                            ? item.quantity >= item.inventory.sealedBottles
                                            : item.quantity * item.mlQuantity >= (item.inventory.openDecantMl + (item.inventory.sealedBottles * item.inventory.bottleSize))) : false}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="cart-item-price">
                                    ${getItemPrice(item).toFixed(2)}
                                </div>

                                <button
                                    className="cart-item-remove"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Sidebar */}
                    <div className="cart-checkout">
                        <div className="checkout-summary">
                            <h3>Order Summary</h3>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                            </div>

                            {cartTotal < 100 && (
                                <div className="free-shipping-notice">
                                    Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                                </div>
                            )}

                            <div className="summary-total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <form className="checkout-form" onSubmit={handleCheckout}>
                            <h3>Shipping Information</h3>

                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    name="street"
                                    placeholder="Street Address"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="zip"
                                        placeholder="ZIP"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full"
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? 'Processing...' : 'Complete Order'}
                            </button>

                            <p className="checkout-note">
                                🔒 Demo mode - no real payment processed
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
