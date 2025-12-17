import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NoteRecommender from '../components/NoteRecommender';
import ScentRadar from '../components/ScentRadar';
import './Recommend.css';

const Recommend = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleRecommend = (results) => {
        setRecommendations(results);
        setHasSearched(true);
    };

    return (
        <div className="recommend-page">
            <div className="container">
                {/* Header */}
                <div className="recommend-header">
                    <h1 className="text-title">
                        <span className="text-gradient">Note Similarity Engine</span>
                    </h1>
                    <p className="recommend-subtitle">
                        Powered by Jaccard similarity algorithm to find fragrances that match your preferences
                    </p>
                </div>

                <div className="recommend-content">
                    {/* Note Selector */}
                    <div className="recommend-selector">
                        <NoteRecommender onRecommend={handleRecommend} />
                    </div>

                    {/* Results */}
                    <div className="recommend-results">
                        {!hasSearched ? (
                            <div className="recommend-placeholder">
                                <div className="placeholder-icon">🔮</div>
                                <h3>Your Matches Will Appear Here</h3>
                                <p>Select notes you love and click "Find Matching Fragrances"</p>
                            </div>
                        ) : recommendations.length === 0 ? (
                            <div className="recommend-empty">
                                <div className="placeholder-icon">😔</div>
                                <h3>No Matches Found</h3>
                                <p>Try selecting different notes or fewer notes for broader results</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="results-title">
                                    Found <span className="text-gradient">{recommendations.length}</span> Matches
                                </h2>
                                <div className="results-list">
                                    {recommendations.map(({ fragrance, similarity, matchedNotes }) => (
                                        <Link
                                            key={fragrance._id}
                                            to={`/products/${fragrance._id}`}
                                            className="result-card"
                                        >
                                            <div className="result-image">
                                                <img
                                                    src={fragrance.imageUrl || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'}
                                                    alt={fragrance.name}
                                                />
                                            </div>

                                            <div className="result-info">
                                                <span className="result-brand">{fragrance.brand}</span>
                                                <h3 className="result-name">{fragrance.name}</h3>

                                                <div className="result-match">
                                                    <div className="match-score">
                                                        <span className="match-label">Match Score</span>
                                                        <span className="match-value">{(similarity * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="match-bar">
                                                        <div
                                                            className="match-fill"
                                                            style={{ width: `${similarity * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="result-matched-notes">
                                                    <span className="matched-label">Matching Notes:</span>
                                                    <div className="matched-tags">
                                                        {matchedNotes.slice(0, 5).map(note => (
                                                            <span key={note} className="tag tag-note">{note}</span>
                                                        ))}
                                                        {matchedNotes.length > 5 && (
                                                            <span className="more-notes">+{matchedNotes.length - 5} more</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="result-price">
                                                    From ${fragrance.price.perMl * 5}
                                                </div>
                                            </div>

                                            <div className="result-radar">
                                                <ScentRadar scentProfile={fragrance.scentProfile} size="small" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommend;
