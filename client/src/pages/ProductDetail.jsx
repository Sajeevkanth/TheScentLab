import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fragranceAPI } from '../services/api';
import { useCart } from '../services/CartContext';
import ScentRadar from '../components/ScentRadar';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [fragrance, setFragrance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchaseType, setPurchaseType] = useState('decant');
    const [decantSize, setDecantSize] = useState(5);
    const [quantity, setQuantity] = useState(1);
    const [showAddedMessage, setShowAddedMessage] = useState(false);

    const decantSizes = [5, 10, 15, 20, 30];

    useEffect(() => {
        const fetchFragrance = async () => {
            try {
                const response = await fragranceAPI.getById(id);
                setFragrance(response.data);
            } catch (error) {
                console.error('Error fetching fragrance:', error);
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchFragrance();
    }, [id, navigate]);

    const handleAddToCart = () => {
        addToCart(fragrance, purchaseType, quantity, decantSize);
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 2000);
    };

    const getCurrentPrice = () => {
        if (purchaseType === 'bottle') {
            return fragrance.price.bottle * quantity;
        }
        return fragrance.price.perMl * decantSize * quantity;
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!fragrance) {
        return null;
    }

    const allNotes = [
        ...fragrance.notes.top,
        ...fragrance.notes.middle,
        ...fragrance.notes.base
    ];

    return (
        <div className="product-detail">
            <div className="container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back to Collection
                </button>

                <div className="product-detail-content">
                    {/* Visuals */}
                    <div className="product-detail-visual">
                        <div className="product-detail-image">
                            <img
                                src={fragrance.imageUrl || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800'}
                                alt={fragrance.name}
                            />
                            <div className="product-badges">
                                <span className="tag">{fragrance.concentration}</span>
                                <span className="tag">{fragrance.gender}</span>
                            </div>
                        </div>


                    </div>

                    {/* Details */}
                    <div className="product-detail-info">
                        <span className="product-brand">{fragrance.brand}</span>
                        <h1 className="product-name">{fragrance.name}</h1>

                        <p className="product-description">{fragrance.description}</p>

                        <div className="product-analysis-row">
                            {/* Notes */}
                            <div className="product-notes">
                                <h3>Fragrance Notes</h3>

                                <div className="notes-section">
                                    <span className="notes-label">Top Notes</span>
                                    <div className="notes-tags">
                                        {fragrance.notes.top.map(note => (
                                            <span key={note} className="tag tag-note">{note}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="notes-section">
                                    <span className="notes-label">Heart Notes</span>
                                    <div className="notes-tags">
                                        {fragrance.notes.middle.map(note => (
                                            <span key={note} className="tag tag-note">{note}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="notes-section">
                                    <span className="notes-label">Base Notes</span>
                                    <div className="notes-tags">
                                        {fragrance.notes.base.map(note => (
                                            <span key={note} className="tag tag-note">{note}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="product-radar-section">
                                <h3>Scent Profile</h3>
                                <ScentRadar
                                    scentProfile={fragrance.scentProfile}
                                    size="medium"
                                    interactive={true}
                                    showLegend={false}
                                />
                            </div>
                        </div>

                        {/* Purchase Options */}
                        <div className="purchase-section">
                            <h3>Purchase Options</h3>

                            <div className="purchase-types">
                                <button
                                    className={`purchase-type ${purchaseType === 'decant' ? 'active' : ''}`}
                                    onClick={() => setPurchaseType('decant')}
                                    disabled={fragrance.inventory.sealedBottles === 0 && fragrance.inventory.openDecantMl === 0}
                                >
                                    <span className="purchase-type-icon">🧪</span>
                                    <span className="purchase-type-label">Sample Decant</span>
                                    <span className="purchase-type-price">From ${fragrance.price.perMl * 5}</span>
                                    {fragrance.inventory.sealedBottles === 0 && fragrance.inventory.openDecantMl === 0 && (
                                        <span className="out-of-stock">Out of Stock</span>
                                    )}
                                </button>

                                <button
                                    className={`purchase-type ${purchaseType === 'bottle' ? 'active' : ''}`}
                                    onClick={() => setPurchaseType('bottle')}
                                    disabled={fragrance.inventory.sealedBottles === 0}
                                >
                                    <span className="purchase-type-icon">🍾</span>
                                    <span className="purchase-type-label">
                                        Full Bottle ({fragrance.inventory.bottleSize}ml)
                                    </span>
                                    <span className="purchase-type-price">${fragrance.price.bottle}</span>
                                    {fragrance.inventory.sealedBottles === 0 && (
                                        <span className="out-of-stock">Out of Stock</span>
                                    )}
                                </button>
                            </div>

                            {/* Decant Size Selector */}
                            {purchaseType === 'decant' && (
                                <div className="decant-sizes">
                                    <label>Select Size:</label>
                                    <div className="decant-size-options">
                                        {decantSizes.map(size => (
                                            <button
                                                key={size}
                                                className={`decant-size ${decantSize === size ? 'active' : ''}`}
                                                onClick={() => setDecantSize(size)}
                                            >
                                                {size}ml
                                                <span>${(fragrance.price.perMl * size).toFixed(2)}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => {
                                            const limit = purchaseType === 'bottle'
                                                ? fragrance.inventory.sealedBottles
                                                : Math.floor((fragrance.inventory.openDecantMl + (fragrance.inventory.sealedBottles * fragrance.inventory.bottleSize)) / decantSize);
                                            return Math.min(q + 1, limit);
                                        })}
                                        disabled={quantity >= (purchaseType === 'bottle'
                                            ? fragrance.inventory.sealedBottles
                                            : Math.floor((fragrance.inventory.openDecantMl + (fragrance.inventory.sealedBottles * fragrance.inventory.bottleSize)) / decantSize))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <div className="purchase-action">
                                <div className="purchase-total">
                                    <span>Total:</span>
                                    <span className="total-price">${getCurrentPrice().toFixed(2)}</span>
                                </div>

                                <button
                                    className="btn btn-primary btn-lg w-full"
                                    onClick={handleAddToCart}
                                    disabled={
                                        (purchaseType === 'bottle' && fragrance.inventory.sealedBottles === 0) ||
                                        (purchaseType === 'decant' && fragrance.inventory.sealedBottles === 0 && fragrance.inventory.openDecantMl === 0)
                                    }
                                >
                                    {showAddedMessage ? '✓ Added to Cart!' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>

                        {/* Inventory Status */}
                        <div className="inventory-status">
                            <div className="inventory-item">
                                <span>Sealed Bottles:</span>
                                <span className={fragrance.inventory.sealedBottles > 0 ? 'in-stock' : 'low-stock'}>
                                    {fragrance.inventory.sealedBottles > 0
                                        ? `${fragrance.inventory.sealedBottles} in stock`
                                        : 'Out of Stock'}
                                </span>
                            </div>
                            <div className="inventory-item">
                                <span>Decant Available:</span>
                                <span className={fragrance.inventory.openDecantMl > 0 ? 'in-stock' : 'low-stock'}>
                                    {fragrance.inventory.openDecantMl > 0
                                        ? `${fragrance.inventory.openDecantMl}ml ready`
                                        : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
