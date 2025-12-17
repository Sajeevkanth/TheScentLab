import React from 'react';
import { Link } from 'react-router-dom';
import ScentRadar from './ScentRadar';
import './ProductCard.css';

const ProductCard = ({ fragrance }) => {
    const { _id, name, brand, imageUrl, price, scentProfile, concentration, gender } = fragrance;

    return (
        <Link to={`/products/${_id}`} className="product-card card">
            <div className="product-card-image card-image">
                <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'}
                    alt={name}
                />
                <div className="product-card-overlay">
                    <ScentRadar scentProfile={scentProfile} size="small" />
                </div>
                <div className="product-card-badges">
                    <span className="tag">{concentration}</span>
                </div>
            </div>

            <div className="product-card-content card-content">
                <span className="product-card-brand card-subtitle">{brand}</span>
                <h3 className="product-card-name card-title">{name}</h3>

                <div className="product-card-footer">
                    <div className="product-card-prices">
                        <span className="product-card-price">${price.bottle}</span>
                        <span className="product-card-price-ml">${price.perMl}/ml</span>
                    </div>
                    <span className="product-card-gender">{gender}</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
