import React, { useState, useEffect } from 'react';
import { fragranceAPI, orderAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [fragrances, setFragrances] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fragData, orderData] = await Promise.all([
                    fragranceAPI.getAll(),
                    orderAPI.getAllOrders ? orderAPI.getAllOrders() : Promise.resolve({ data: [] })
                ]);
                setFragrances(fragData.data);
                if (orderData.data) setOrders(orderData.data);
            } catch (error) {
                console.error("Error fetching admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEdit = (fragrance) => {
        setEditingId(fragrance._id);
        setEditForm({
            sealedBottles: fragrance.inventory.sealedBottles,
            openDecantMl: fragrance.inventory.openDecantMl,
            bottlePrice: fragrance.price.bottle,
            perMlPrice: fragrance.price.perMl
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = async (id) => {
        try {
            // Optimistic update
            const updatedFragrance = {
                ...fragrances.find(f => f._id === id),
                inventory: {
                    sealedBottles: parseInt(editForm.sealedBottles),
                    openDecantMl: parseInt(editForm.openDecantMl),
                    bottleSize: 100 // default or preserve existing if complex
                },
                price: {
                    bottle: parseFloat(editForm.bottlePrice),
                    perMl: parseFloat(editForm.perMlPrice)
                }
            };

            // Preserve other inventory fields we didn't edit
            const original = fragrances.find(f => f._id === id);
            updatedFragrance.inventory.bottleSize = original.inventory.bottleSize;

            await fragranceAPI.update(id, updatedFragrance);

            setFragrances(prev => prev.map(f => f._id === id ? updatedFragrance : f));
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update inventory", error);
            alert("Failed to save changes");
        }
    };

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    // Add Product Logic
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', brand: '', description: '', priceBottle: '', stockSealed: '', imageUrl: ''
    });

    const handleAddChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: newProduct.name,
                brand: newProduct.brand,
                description: newProduct.description,
                imageUrl: newProduct.imageUrl,
                price: {
                    bottle: parseFloat(newProduct.priceBottle),
                    perMl: (parseFloat(newProduct.priceBottle) / 50).toFixed(2) // Rough estimate default
                },
                inventory: {
                    sealedBottles: parseInt(newProduct.stockSealed),
                    bottleSize: 100,
                    openDecantMl: 0
                },
                // Defaults for required complex fields
                scentProfile: { citrus: 50, floral: 50, woody: 50, spicy: 50, fresh: 50, musky: 50, sweet: 50, oriental: 50 },
                notes: { top: [], middle: [], base: [] },
                gender: 'unisex',
                concentration: 'EDP',
                year: 2024
            };

            const response = await fragranceAPI.create(payload);
            setFragrances([response.data, ...fragrances]);
            setShowAddModal(false);
            setNewProduct({ name: '', brand: '', description: '', priceBottle: '', stockSealed: '', imageUrl: '' });
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Failed to create product");
        }
    };

    const handleDelete = async (id) => {
        try {
            await fragranceAPI.delete(id);
            setFragrances(fragrances.filter(f => f._id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="container">
                <h1 className="admin-title">Admin Dashboard</h1>

                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        Inventory Management
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Sales & Orders
                    </button>
                </div>

                <div className="admin-content">
                    {loading ? (
                        <div className="loading">Loading dashboard...</div>
                    ) : (
                        <>
                            {activeTab === 'inventory' && (
                                <div className="inventory-view">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2>Inventory Control</h2>
                                        <button
                                            className="btn-primary"
                                            onClick={() => setShowAddModal(true)}
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                        >
                                            + Add Product
                                        </button>
                                    </div>

                                    <div className="table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Price (Bottle)</th>
                                                    <th>Price (/ml)</th>
                                                    <th>Stock (Bottles)</th>
                                                    <th>Stock (Decant mL)</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fragrances.map(f => (
                                                    <tr key={f._id}>
                                                        <td>
                                                            <div className="fw-bold">{f.name}</div>
                                                            <div className="text-secondary">{f.brand}</div>
                                                        </td>

                                                        {editingId === f._id ? (
                                                            <>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="edit-input"
                                                                        name="bottlePrice"
                                                                        value={editForm.bottlePrice}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="edit-input"
                                                                        name="perMlPrice"
                                                                        value={editForm.perMlPrice}
                                                                        onChange={handleInputChange}
                                                                        step="0.10"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="edit-input"
                                                                        name="sealedBottles"
                                                                        value={editForm.sealedBottles}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="edit-input"
                                                                        name="openDecantMl"
                                                                        value={editForm.openDecantMl}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <div className="action-buttons">
                                                                        <button onClick={() => handleSave(f._id)} className="btn-save" title="Save">💾</button>
                                                                        <button onClick={handleCancel} className="btn-cancel" title="Cancel">❌</button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td>${f.price.bottle}</td>
                                                                <td>${f.price.perMl}</td>
                                                                <td>
                                                                    <span className={f.inventory.sealedBottles < 2 ? 'stock-low' : 'stock-ok'}>
                                                                        {f.inventory.sealedBottles}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className={f.inventory.openDecantMl < 20 ? 'stock-low' : 'stock-ok'}>
                                                                        {f.inventory.openDecantMl}ml
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div className="action-buttons">
                                                                        <button onClick={() => handleEdit(f)} className="btn-edit" title="Edit">✏️</button>
                                                                        <button
                                                                            onClick={() => {
                                                                                if (window.confirm('Delete this product?')) handleDelete(f._id);
                                                                            }}
                                                                            className="btn-cancel"
                                                                            title="Delete"
                                                                        >
                                                                            🗑️
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="orders-view">
                                    <h2>Sales History</h2>
                                    <div className="table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Items</th>
                                                    <th>Status</th>
                                                    <th>Total</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
                                                    <tr key={order._id}>
                                                        <td className="font-mono text-sm">#{order._id.slice(-6)}</td>
                                                        <td>
                                                            <div className="fw-bold">{order.user?.name || order.shippingAddress?.name || 'Guest'}</div>
                                                            <div className="text-secondary">{order.user?.email || order.guestEmail}</div>
                                                        </td>
                                                        <td>
                                                            {order.items.length} items
                                                            <div className="text-secondary text-sm">
                                                                {order.items[0]?.fragrance?.name || order.items[0]?.productName || 'Item'}
                                                                {order.items[0]?.type === 'decant' ? ` (${order.items[0]?.mlQuantity}ml)` : ''}...
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`status-badge status-${order.status}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td>${order.total.toFixed(2)}</td>
                                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Product</h3>
                        <form onSubmit={handleAddSubmit} className="add-product-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input required name="name" value={newProduct.name} onChange={handleAddChange} />
                            </div>
                            <div className="form-group">
                                <label>Brand</label>
                                <input required name="brand" value={newProduct.brand} onChange={handleAddChange} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea required name="description" value={newProduct.description} onChange={handleAddChange} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (Bottle)</label>
                                    <input required type="number" name="priceBottle" value={newProduct.priceBottle} onChange={handleAddChange} />
                                </div>
                                <div className="form-group">
                                    <label>Stock (Sealed)</label>
                                    <input required type="number" name="stockSealed" value={newProduct.stockSealed} onChange={handleAddChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input required name="imageUrl" value={newProduct.imageUrl} onChange={handleAddChange} placeholder="https://..." />
                                </div>
                                <small className="text-secondary">Use Unsplash or similar for now</small>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

