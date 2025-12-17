import React, { useState, useEffect } from 'react';
import { fragranceAPI } from '../services/api';
import './NoteRecommender.css';

/**
 * NoteRecommender - Note-based recommendation engine interface
 * Uses Jaccard similarity to find matching fragrances
 */
const NoteRecommender = ({ onRecommend }) => {
    const [allNotes, setAllNotes] = useState([]);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch all available notes
        const fetchNotes = async () => {
            try {
                const response = await fragranceAPI.getAllNotes();
                setAllNotes(response.data);
            } catch (error) {
                // Fallback notes if API fails
                setAllNotes([
                    'bergamot', 'lemon', 'orange', 'grapefruit', 'mandarin',
                    'rose', 'jasmine', 'lavender', 'iris', 'violet',
                    'sandalwood', 'cedar', 'vetiver', 'oud', 'oakmoss',
                    'vanilla', 'tonka bean', 'amber', 'musk', 'patchouli',
                    'cinnamon', 'cardamom', 'pepper', 'ginger', 'saffron',
                    'apple', 'pear', 'peach', 'raspberry', 'blackcurrant'
                ]);
            }
        };
        fetchNotes();
    }, []);

    const toggleNote = (note) => {
        if (selectedNotes.includes(note)) {
            setSelectedNotes(selectedNotes.filter(n => n !== note));
        } else if (selectedNotes.length < 8) {
            setSelectedNotes([...selectedNotes, note]);
        }
    };

    const handleSearch = async () => {
        if (selectedNotes.length === 0) return;

        setLoading(true);
        try {
            const response = await fragranceAPI.getRecommendations(selectedNotes, 0.15);
            onRecommend(response.data);
        } catch (error) {
            console.error('Error getting recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => {
        setSelectedNotes([]);
        onRecommend([]);
    };

    const filteredNotes = allNotes.filter(note =>
        note.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Popular notes to highlight
    const popularNotes = ['vanilla', 'sandalwood', 'bergamot', 'rose', 'oud', 'amber', 'musk', 'jasmine'];

    return (
        <div className="note-recommender">
            <div className="note-recommender-header">
                <h3 className="note-recommender-title">
                    <span className="text-gradient">Find Your Scent</span>
                </h3>
                <p className="note-recommender-subtitle">
                    Select notes you love and discover matching fragrances
                </p>
            </div>

            {/* Selected Notes */}
            {selectedNotes.length > 0 && (
                <div className="note-recommender-selected">
                    <div className="note-recommender-selected-header">
                        <span>Your Notes ({selectedNotes.length}/8)</span>
                        <button className="note-clear-btn" onClick={clearSelection}>Clear All</button>
                    </div>
                    <div className="note-tags-selected">
                        {selectedNotes.map(note => (
                            <button
                                key={note}
                                className="tag tag-note selected"
                                onClick={() => toggleNote(note)}
                            >
                                {note} ×
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="note-search">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                />
            </div>

            {/* Popular Notes */}
            {!searchTerm && (
                <div className="note-section">
                    <h4 className="note-section-title">Popular Notes</h4>
                    <div className="note-tags">
                        {popularNotes.map(note => (
                            <button
                                key={note}
                                className={`tag tag-note ${selectedNotes.includes(note) ? 'selected' : ''}`}
                                onClick={() => toggleNote(note)}
                            >
                                {note}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* All Notes */}
            <div className="note-section">
                <h4 className="note-section-title">
                    {searchTerm ? `Results for "${searchTerm}"` : 'All Notes'}
                </h4>
                <div className="note-tags note-tags-scrollable">
                    {filteredNotes.map(note => (
                        <button
                            key={note}
                            className={`tag tag-note ${selectedNotes.includes(note) ? 'selected' : ''}`}
                            onClick={() => toggleNote(note)}
                        >
                            {note}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action */}
            <div className="note-recommender-actions">
                <button
                    className="btn btn-primary btn-lg w-full"
                    onClick={handleSearch}
                    disabled={selectedNotes.length === 0 || loading}
                >
                    {loading ? 'Finding Matches...' : `Find Matching Fragrances (${selectedNotes.length} notes)`}
                </button>
            </div>
        </div>
    );
};

export default NoteRecommender;
