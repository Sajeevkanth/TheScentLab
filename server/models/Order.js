const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    fragrance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fragrance',
        required: true
    },
    type: {
        type: String,
        enum: ['bottle', 'decant'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    mlQuantity: {
        type: Number, // Only for decants
        min: 1
    },
    priceAtPurchase: {
        type: Number,
        required: true
    },
    productName: String,
    brand: String,
    productImage: String
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guestEmail: {
        type: String,
        lowercase: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        name: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String, default: 'USA' }
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'card'
    },
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
