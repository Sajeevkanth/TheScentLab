const FragranceDAO = require('../dao/FragranceDAO');
const InventoryDAO = require('../dao/InventoryDAO');

/**
 * Controller for Fragrance operations
 */
const fragranceController = {

    // GET /api/fragrances
    async getAllFragrances(req, res) {
        try {
            const filters = {
                brand: req.query.brand,
                gender: req.query.gender,
                concentration: req.query.concentration
            };

            const fragrances = await FragranceDAO.findAll(filters);
            res.json(fragrances);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/fragrances/:id
    async getFragranceById(req, res) {
        try {
            const fragrance = await FragranceDAO.findById(req.params.id);
            if (!fragrance) {
                return res.status(404).json({ error: 'Fragrance not found' });
            }
            res.json(fragrance);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/fragrances
    async createFragrance(req, res) {
        try {
            const fragrance = await FragranceDAO.create(req.body);
            res.status(201).json(fragrance);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // PUT /api/fragrances/:id
    async updateFragrance(req, res) {
        try {
            const fragrance = await FragranceDAO.update(req.params.id, req.body);
            if (!fragrance) {
                return res.status(404).json({ error: 'Fragrance not found' });
            }
            res.json(fragrance);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // DELETE /api/fragrances/:id
    async deleteFragrance(req, res) {
        try {
            const fragrance = await FragranceDAO.delete(req.params.id);
            if (!fragrance) {
                return res.status(404).json({ error: 'Fragrance not found' });
            }
            res.json({ message: 'Fragrance deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/fragrances/search/scent - Visual Scent Search
    async searchByScentProfile(req, res) {
        try {
            // Expected body: { citrus: { min: 60, max: 100 }, woody: { min: 0, max: 40 }, ... }
            const fragrances = await FragranceDAO.findByScentProfile(req.body);
            res.json(fragrances);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/fragrances/recommend - Note Similarity Engine
    async getRecommendations(req, res) {
        try {
            const { notes, threshold } = req.body;

            if (!notes || !Array.isArray(notes) || notes.length === 0) {
                return res.status(400).json({ error: 'Please provide an array of notes' });
            }

            const recommendations = await FragranceDAO.findSimilarByNotes(notes, threshold || 0.2);
            res.json(recommendations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/fragrances/search?q=query
    async searchFragrances(req, res) {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({ error: 'Search query required' });
            }
            const fragrances = await FragranceDAO.search(q);
            res.json(fragrances);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/fragrances/brands
    async getBrands(req, res) {
        try {
            const brands = await FragranceDAO.getBrands();
            res.json(brands);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/fragrances/notes
    async getAllNotes(req, res) {
        try {
            const notes = await FragranceDAO.getAllNotes();
            res.json(notes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/fragrances/:id/inventory
    async getInventoryStatus(req, res) {
        try {
            const status = await InventoryDAO.getInventoryStatus(req.params.id);
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = fragranceController;
