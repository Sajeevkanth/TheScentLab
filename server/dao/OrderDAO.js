const Order = require('../models/Order');
const InventoryDAO = require('./InventoryDAO');

/**
 * Data Access Object for Order operations
 */
class OrderDAO {

    async findById(id) {
        return await Order.findById(id)
            .populate('user')
            .populate('items.fragrance');
    }

    async findByUser(userId) {
        return await Order.find({ user: userId })
            .populate('items.fragrance')
            .sort({ createdAt: -1 });
    }

    async findAll() {
        return await Order.find()
            .populate('user')
            .populate('items.fragrance')
            .sort({ createdAt: -1 });
    }

    /**
     * Create order with automatic inventory deduction
     */
    async create(orderData) {
        // Process each item and remove inventory
        for (const item of orderData.items) {
            const quantity = item.type === 'decant' ? (item.mlQuantity * item.quantity) : item.quantity;

            // Triggers auto-conversion
            await InventoryDAO.deductInventory(
                item.fragrance,
                item.type,
                quantity
            );
        }

        const order = new Order(orderData);
        return await order.save();
    }

    async updateStatus(id, status) {
        const updateData = { status };

        if (status === 'shipped') {
            updateData.shippedAt = new Date();
        } else if (status === 'delivered') {
            updateData.deliveredAt = new Date();
        }

        return await Order.findByIdAndUpdate(id, updateData, { new: true });
    }

    async cancel(id) {
        return await Order.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        );
    }
}

module.exports = new OrderDAO();
