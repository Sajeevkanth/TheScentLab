import React, { useState } from 'react';
import './ScentFilter.css';

const accords = [
    { key: 'citrus', label: 'Citrus', emoji: '🍋' },
    { key: 'floral', label: 'Floral', emoji: '🌸' },
    { key: 'woody', label: 'Woody', emoji: '🪵' },
    { key: 'spicy', label: 'Spicy', emoji: '🌶️' },
    { key: 'fresh', label: 'Fresh', emoji: '💨' },
    { key: 'musky', label: 'Musky', emoji: '🦌' },
    { key: 'sweet', label: 'Sweet', emoji: '🍯' },
    { key: 'oriental', label: 'Oriental', emoji: '✨' },
];

/**
 * ScentFilter - Visual Scent Search Interface
 * Allows filtering by scent accord intensity ranges
 */
const ScentFilter = ({ onFilter, initialFilters = {} }) => {
    const [filters, setFilters] = useState(
        accords.reduce((acc, { key }) => ({
            ...acc,
            [key]: initialFilters[key] || { min: 0, max: 100, enabled: false }
        }), {})
    );

    const handleToggle = (accordKey) => {
        setFilters(prev => ({
            ...prev,
            [accordKey]: {
                ...prev[accordKey],
                enabled: !prev[accordKey].enabled
            }
        }));
    };

    const handleMinChange = (accordKey, value) => {
        setFilters(prev => ({
            ...prev,
            [accordKey]: {
                ...prev[accordKey],
                min: Math.min(parseInt(value), prev[accordKey].max)
            }
        }));
    };

    const handleMaxChange = (accordKey, value) => {
        setFilters(prev => ({
            ...prev,
            [accordKey]: {
                ...prev[accordKey],
                max: Math.max(parseInt(value), prev[accordKey].min)
            }
        }));
    };

    const applyFilters = () => {
        // Only include enabled filters
        const activeFilters = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value.enabled) {
                activeFilters[key] = { min: value.min, max: value.max };
            }
        });
        onFilter(activeFilters);
    };

    const resetFilters = () => {
        const reset = accords.reduce((acc, { key }) => ({
            ...acc,
            [key]: { min: 0, max: 100, enabled: false }
        }), {});
        setFilters(reset);
        onFilter({});
    };

    const activeCount = Object.values(filters).filter(f => f.enabled).length;

    return (
        <div className="scent-filter">
            <div className="scent-filter-header">
                <h3 className="scent-filter-title">
                    <span className="text-gradient">Visual Scent Search</span>
                </h3>
                <p className="scent-filter-subtitle">
                    Filter fragrances by scent geometry
                </p>
            </div>

            <div className="scent-filter-grid">
                {accords.map(({ key, label, emoji }) => (
                    <div
                        key={key}
                        className={`scent-filter-item ${filters[key].enabled ? 'active' : ''}`}
                    >
                        <button
                            className="scent-filter-toggle"
                            onClick={() => handleToggle(key)}
                        >
                            <span className="scent-filter-emoji">{emoji}</span>
                            <span className="scent-filter-label">{label}</span>
                            <span className="scent-filter-check">
                                {filters[key].enabled ? '✓' : '+'}
                            </span>
                        </button>

                        {filters[key].enabled && (
                            <div className="scent-filter-sliders animate-fadeIn">
                                <div className="scent-filter-slider-group">
                                    <label>Min: {filters[key].min}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={filters[key].min}
                                        onChange={(e) => handleMinChange(key, e.target.value)}
                                        className="range-slider"
                                    />
                                </div>
                                <div className="scent-filter-slider-group">
                                    <label>Max: {filters[key].max}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={filters[key].max}
                                        onChange={(e) => handleMaxChange(key, e.target.value)}
                                        className="range-slider"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="scent-filter-actions">
                <button className="btn btn-secondary" onClick={resetFilters}>
                    Reset
                </button>
                <button className="btn btn-primary" onClick={applyFilters}>
                    Apply Filters {activeCount > 0 && `(${activeCount})`}
                </button>
            </div>
        </div>
    );
};

export default ScentFilter;
