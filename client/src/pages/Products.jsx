import React, { useState, useEffect } from 'react';
import { fragranceAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ScentFilter from '../components/ScentFilter';
import './Products.css';

const Products = () => {
    const [fragrances, setFragrances] = useState([]);
    const [filteredFragrances, setFilteredFragrances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [genderFilter, setGenderFilter] = useState('all');

    useEffect(() => {
        const fetchFragrances = async () => {
            try {
                const response = await fragranceAPI.getAll();
                setFragrances(response.data);
                setFilteredFragrances(response.data);
            } catch (error) {
                console.error('Error fetching fragrances:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFragrances();
    }, []);

    // Apply text search and gender filter
    useEffect(() => {
        let results = [...fragrances];

        // Text search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(f =>
                f.name.toLowerCase().includes(query) ||
                f.brand.toLowerCase().includes(query)
            );
        }

        // Gender filter
        if (genderFilter !== 'all') {
            results = results.filter(f => f.gender === genderFilter);
        }

        // Sort
        results.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price.bottle - b.price.bottle;
                case 'price-high':
                    return b.price.bottle - a.price.bottle;
                case 'brand':
                    return a.brand.localeCompare(b.brand);
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredFragrances(results);
    }, [fragrances, searchQuery, genderFilter, sortBy]);

    // Handle scent profile filter
    const handleScentFilter = async (scentFilters) => {
        if (Object.keys(scentFilters).length === 0) {
            setFilteredFragrances(fragrances);
            return;
        }

        try {
            const response = await fragranceAPI.searchByScent(scentFilters);
            setFilteredFragrances(response.data);
        } catch (error) {
            console.error('Error filtering by scent:', error);
        }
    };

    return (
        <div className="products-page">
            <div className="container">
                {/* Header */}
                <div className="products-header">
                    <div className="products-title-section">
                        <h1 className="text-title">
                            Our <span className="text-gradient">Collection</span>
                        </h1>
                        <p className="products-subtitle">
                            {filteredFragrances.length} fragrances available
                        </p>
                    </div>

                    <button
                        className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        🎯 Scent Search {showFilters ? '×' : ''}
                    </button>
                </div>

                {/* Scent Filter */}
                {showFilters && (
                    <div className="scent-filter-container animate-slideUp">
                        <ScentFilter onFilter={handleScentFilter} />
                    </div>
                )}

                {/* Basic Filters */}
                <div className="products-filters">
                    <div className="products-search">
                        <input
                            type="text"
                            placeholder="Search fragrances..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="products-filter-group">
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="form-input"
                        >
                            <option value="all">All Genders</option>
                            <option value="masculine">Masculine</option>
                            <option value="feminine">Feminine</option>
                            <option value="unisex">Unisex</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="form-input"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="brand">Sort by Brand</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="products-loading grid grid-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="product-skeleton"></div>
                        ))}
                    </div>
                ) : filteredFragrances.length > 0 ? (
                    <div className="products-grid grid grid-4">
                        {filteredFragrances.map(fragrance => (
                            <ProductCard key={fragrance._id} fragrance={fragrance} />
                        ))}
                    </div>
                ) : (
                    <div className="products-empty">
                        <p>No fragrances match your criteria.</p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setSearchQuery('');
                                setGenderFilter('all');
                                setFilteredFragrances(fragrances);
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
