const Fragrance = require('../models/Fragrance');

/**
 * Data Access Object for Fragrance operations
 * Implements repository pattern for clean data access
 */
class FragranceDAO {

    /**
     * Get all fragrances with optional filters
     */
    async findAll(filters = {}) {
        const query = { isActive: true };

        if (filters.brand) {
            query.brand = new RegExp(filters.brand, 'i');
        }

        if (filters.gender) {
            query.gender = filters.gender;
        }

        if (filters.concentration) {
            query.concentration = filters.concentration;
        }

        return await Fragrance.find(query).sort({ createdAt: -1 });
    }

    /**
     * Get fragrance by ID
     */
    async findById(id) {
        return await Fragrance.findById(id);
    }

    /**
     * Create new fragrance
     */
    async create(fragranceData) {
        const fragrance = new Fragrance(fragranceData);
        return await fragrance.save();
    }

    /**
     * Update fragrance
     */
    async update(id, updateData) {
        return await Fragrance.findByIdAndUpdate(id, updateData, { new: true });
    }

    /**
     * Delete fragrance (soft delete)
     */
    async delete(id) {
        return await Fragrance.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }

    /**
     * Visual Scent Search - Filter by scent profile ranges
     * @param {Object} filters - Object with accord names and min/max values
     * Example: { citrus: { min: 60, max: 100 }, woody: { min: 0, max: 40 } }
     */
    async findByScentProfile(filters) {
        const query = { isActive: true };

        const accords = ['citrus', 'floral', 'woody', 'spicy', 'fresh', 'musky', 'sweet', 'oriental'];

        accords.forEach(accord => {
            if (filters[accord]) {
                const { min, max } = filters[accord];
                if (min !== undefined) {
                    query[`scentProfile.${accord}`] = query[`scentProfile.${accord}`] || {};
                    query[`scentProfile.${accord}`].$gte = min;
                }
                if (max !== undefined) {
                    query[`scentProfile.${accord}`] = query[`scentProfile.${accord}`] || {};
                    query[`scentProfile.${accord}`].$lte = max;
                }
            }
        });

        return await Fragrance.find(query);
    }

    /**
     * Note Similarity Engine using Jaccard Similarity
     * Finds fragrances with similar notes to the input list
     * @param {Array} inputNotes - Array of note names to match
     * @param {Number} threshold - Minimum similarity score (0-1)
     */
    async findSimilarByNotes(inputNotes, threshold = 0.2) {
        const allFragrances = await Fragrance.find({ isActive: true });

        const inputSet = new Set(inputNotes.map(n => n.toLowerCase().trim()));

        const results = allFragrances.map(fragrance => {
            const fragranceNotes = new Set([
                ...fragrance.notes.top,
                ...fragrance.notes.middle,
                ...fragrance.notes.base
            ].map(n => n.toLowerCase().trim()));

            // Jaccard Similarity: |A ∩ B| / |A ∪ B|
            const intersection = new Set([...inputSet].filter(x => fragranceNotes.has(x)));
            const union = new Set([...inputSet, ...fragranceNotes]);

            const similarity = intersection.size / union.size;

            return {
                fragrance,
                similarity,
                matchedNotes: [...intersection]
            };
        });

        // Filter by threshold and sort by similarity
        return results
            .filter(r => r.similarity >= threshold)
            .sort((a, b) => b.similarity - a.similarity);
    }

    /**
     * Search fragrances by name or brand
     */
    async search(searchTerm) {
        const regex = new RegExp(searchTerm, 'i');
        return await Fragrance.find({
            isActive: true,
            $or: [
                { name: regex },
                { brand: regex },
                { 'notes.top': regex },
                { 'notes.middle': regex },
                { 'notes.base': regex }
            ]
        });
    }

    /**
     * Get unique brands
     */
    async getBrands() {
        return await Fragrance.distinct('brand', { isActive: true });
    }

    /**
     * Get all unique notes from all fragrances
     */
    async getAllNotes() {
        const fragrances = await Fragrance.find({ isActive: true });
        const notesSet = new Set();

        fragrances.forEach(f => {
            [...f.notes.top, ...f.notes.middle, ...f.notes.base].forEach(note => {
                notesSet.add(note.toLowerCase());
            });
        });

        return [...notesSet].sort();
    }
}

module.exports = new FragranceDAO();
