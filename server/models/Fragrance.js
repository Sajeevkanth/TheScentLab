const mongoose = require('mongoose');

const fragranceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    price: {
        bottle: { type: Number, required: true },
        perMl: { type: Number, required: true }
    },
    // Scent Profile for Radar Chart (0-100 scale)
    scentProfile: {
        citrus: { type: Number, min: 0, max: 100, default: 0 },
        floral: { type: Number, min: 0, max: 100, default: 0 },
        woody: { type: Number, min: 0, max: 100, default: 0 },
        spicy: { type: Number, min: 0, max: 100, default: 0 },
        fresh: { type: Number, min: 0, max: 100, default: 0 },
        musky: { type: Number, min: 0, max: 100, default: 0 },
        sweet: { type: Number, min: 0, max: 100, default: 0 },
        oriental: { type: Number, min: 0, max: 100, default: 0 }
    },
    // Fragrance Notes
    notes: {
        top: [{ type: String, lowercase: true, trim: true }],
        middle: [{ type: String, lowercase: true, trim: true }],
        base: [{ type: String, lowercase: true, trim: true }]
    },
    // Dual Inventory System
    inventory: {
        sealedBottles: { type: Number, default: 0, min: 0 },
        bottleSize: { type: Number, default: 100 }, // in ml
        openDecantMl: { type: Number, default: 0, min: 0 }
    },
    // Metadata
    gender: {
        type: String,
        enum: ['masculine', 'feminine', 'unisex'],
        default: 'unisex'
    },
    concentration: {
        type: String,
        enum: ['EDT', 'EDP', 'Parfum', 'Cologne', 'Extrait'],
        default: 'EDP'
    },
    year: Number,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for all notes combined (for Jaccard similarity)
fragranceSchema.virtual('allNotes').get(function () {
    return [...this.notes.top, ...this.notes.middle, ...this.notes.base];
});

// Virtual to check if decant is available
fragranceSchema.virtual('decantAvailable').get(function () {
    return this.inventory.openDecantMl > 0 || this.inventory.sealedBottles > 0;
});

// Virtual to check if bottle is available
fragranceSchema.virtual('bottleAvailable').get(function () {
    return this.inventory.sealedBottles > 0;
});

fragranceSchema.set('toJSON', { virtuals: true });
fragranceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Fragrance', fragranceSchema);
