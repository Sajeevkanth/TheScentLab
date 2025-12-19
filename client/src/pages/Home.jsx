import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fragranceAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ScentRadar from '../components/ScentRadar';
import './Home.css';

const Home = () => {
    const [featuredFragrances, setFeaturedFragrances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await fragranceAPI.getAll();
                setFeaturedFragrances(response.data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching fragrances:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    // Demo scent profile for visualization
    const heroProfile = {
        citrus: 70, floral: 45, woody: 80, spicy: 55,
        fresh: 60, musky: 40, sweet: 50, oriental: 65
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="container hero-content">
                    <div className="hero-text">
                        <h1 className="text-display animate-slideUp">
                            See The <span className="text-gradient">Scent</span>
                        </h1>
                        <p className="hero-subtitle animate-slideUp">
                            Discover fragrances through visual profiles, smart sampling,
                            and smart recommendations. Never blind buy again.
                        </p>
                        <div className="hero-actions animate-slideUp">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Explore Collection
                            </Link>
                            <Link to="/recommend" className="btn btn-secondary btn-lg">
                                Find Your Scent
                            </Link>
                        </div>
                    </div>
                    <div className="hero-visual animate-fadeIn">
                        <div className="hero-radar">
                            <ScentRadar scentProfile={heroProfile} size="large" interactive={true} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section features">
                <div className="container">
                    <h2 className="text-title text-center mb-xl">
                        Why <span className="text-gradient">The Scent Lab</span>?
                    </h2>

                    <div className="features-grid grid grid-3">
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3 className="feature-title">Visual Scent Profiles</h3>
                            <p className="feature-description">
                                See the DNA of every fragrance with our radar charts.
                                Compare scents visually before you buy.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🧪</div>
                            <h3 className="feature-title">Smart Decant System</h3>
                            <p className="feature-description">
                                Try before you commit. Order sample sizes from 5ml to 30ml
                                with our intelligent inventory system.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3 className="feature-title">Note Matching</h3>
                            <p className="feature-description">
                                Tell us the notes you love, and our smart system recommends
                                fragrances that match your preferences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-products">
                <div className="container">
                    <div className="section-header">
                        <h2 className="text-title">
                            Featured <span className="text-gradient">Fragrances</span>
                        </h2>
                        <Link to="/products" className="btn btn-outline">
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-grid grid grid-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="product-skeleton"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-4">
                            {featuredFragrances.map(fragrance => (
                                <ProductCard key={fragrance._id} fragrance={fragrance} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta">
                <div className="container">
                    <div className="cta-card">
                        <h2 className="text-title">Ready to Find Your Signature Scent?</h2>
                        <p className="cta-text">
                            Use our intelligent recommendation engine to discover fragrances
                            tailored to your preferences.
                        </p>
                        <Link to="/recommend" className="btn btn-primary btn-lg">
                            Start Discovery →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
