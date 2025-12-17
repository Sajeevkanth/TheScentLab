const express = require('express');
const router = express.Router();
const fragranceController = require('../controllers/fragranceController');

// Search routes (must be before :id routes)
router.get('/search', fragranceController.searchFragrances);
router.get('/brands', fragranceController.getBrands);
router.get('/notes', fragranceController.getAllNotes);

// Visual Scent Search
router.post('/search/scent', fragranceController.searchByScentProfile);

// Note Similarity Recommendation Engine
router.post('/recommend', fragranceController.getRecommendations);

// CRUD routes
router.get('/', fragranceController.getAllFragrances);
router.get('/:id', fragranceController.getFragranceById);
router.post('/', fragranceController.createFragrance);
router.put('/:id', fragranceController.updateFragrance);
router.delete('/:id', fragranceController.deleteFragrance);

// Inventory
router.get('/:id/inventory', fragranceController.getInventoryStatus);

module.exports = router;
