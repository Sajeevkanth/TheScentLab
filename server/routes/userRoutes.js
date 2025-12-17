const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.getUserById);
router.post('/:id/favorites/:fragranceId', userController.addToFavorites);
router.delete('/:id/favorites/:fragranceId', userController.removeFromFavorites);
router.put('/:id/preferences', userController.updatePreferences);

module.exports = router;
