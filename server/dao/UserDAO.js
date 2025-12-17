const User = require('../models/User');

/**
 * Data Access Object for User operations
 */
class UserDAO {

    async findById(id) {
        return await User.findById(id).populate('favorites');
    }

    async findByEmail(email) {
        return await User.findOne({ email: email.toLowerCase() });
    }

    async create(userData) {
        const user = new User({
            ...userData,
            email: userData.email.toLowerCase()
        });
        return await user.save();
    }

    async update(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }

    async addToFavorites(userId, fragranceId) {
        return await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: fragranceId } },
            { new: true }
        ).populate('favorites');
    }

    async removeFromFavorites(userId, fragranceId) {
        return await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: fragranceId } },
            { new: true }
        ).populate('favorites');
    }

    async updatePreferences(userId, preferences) {
        return await User.findByIdAndUpdate(
            userId,
            { preferences },
            { new: true }
        );
    }
}

module.exports = new UserDAO();
