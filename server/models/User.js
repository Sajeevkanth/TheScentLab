const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fragrance'
    }],
    preferences: {
        preferredNotes: [{ type: String, lowercase: true }],
        dislikedNotes: [{ type: String, lowercase: true }],
        scentPreferences: {
            citrus: { type: Number, min: 0, max: 100, default: 50 },
            floral: { type: Number, min: 0, max: 100, default: 50 },
            woody: { type: Number, min: 0, max: 100, default: 50 },
            spicy: { type: Number, min: 0, max: 100, default: 50 },
            fresh: { type: Number, min: 0, max: 100, default: 50 },
            musky: { type: Number, min: 0, max: 100, default: 50 },
            sweet: { type: Number, min: 0, max: 100, default: 50 },
            oriental: { type: Number, min: 0, max: 100, default: 50 }
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
