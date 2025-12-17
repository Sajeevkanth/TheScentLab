const UserDAO = require('../dao/UserDAO');
const bcrypt = require('bcryptjs');

/**
 * Controller for User operations
 */
const userController = {

    // GET /api/users/:id
    async getUserById(req, res) {
        try {
            const user = await UserDAO.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Don't send password
            const { password, ...userData } = user.toObject();
            res.json(userData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/users/register
    async register(req, res) {
        try {
            const { email, password, name } = req.body;

            // Check if user exists
            const existingUser = await UserDAO.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await UserDAO.create({ email, password: hashedPassword, name });
            const { password: _, ...userData } = user.toObject();

            res.status(201).json(userData);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // POST /api/users/login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await UserDAO.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const { password: _, ...userData } = user.toObject();
            res.json({ user: userData, message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/users/:id/favorites/:fragranceId
    async addToFavorites(req, res) {
        try {
            const user = await UserDAO.addToFavorites(req.params.id, req.params.fragranceId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user.favorites);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /api/users/:id/favorites/:fragranceId
    async removeFromFavorites(req, res) {
        try {
            const user = await UserDAO.removeFromFavorites(req.params.id, req.params.fragranceId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user.favorites);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /api/users/:id/preferences
    async updatePreferences(req, res) {
        try {
            const user = await UserDAO.updatePreferences(req.params.id, req.body);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user.preferences);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;
