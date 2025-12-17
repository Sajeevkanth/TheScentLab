const OrderDAO = require('../dao/OrderDAO');

/**
 * Controller for Order operations
 */
const orderController = {

    // GET /api/orders
    async getAllOrders(req, res) {
        try {
            const orders = await OrderDAO.findAll();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/orders/:id
    async getOrderById(req, res) {
        try {
            const order = await OrderDAO.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/orders/user/:userId
    async getOrdersByUser(req, res) {
        try {
            const orders = await OrderDAO.findByUser(req.params.userId);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/orders - Create order with inventory deduction
    async createOrder(req, res) {
        try {
            const orderData = req.body;

            // Calculate totals
            let subtotal = 0;
            for (const item of orderData.items) {
                subtotal += item.priceAtPurchase * (item.type === 'decant' ? 1 : item.quantity);
            }

            orderData.subtotal = subtotal;
            orderData.total = subtotal + (orderData.shipping || 0);

            // This will automatically deduct inventory and trigger conversion if needed
            const order = await OrderDAO.create(orderData);

            res.status(201).json({
                order,
                message: 'Order created successfully. Inventory has been updated.'
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // PUT /api/orders/:id/status
    async updateOrderStatus(req, res) {
        try {
            const { status } = req.body;
            const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const order = await OrderDAO.updateStatus(req.params.id, status);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /api/orders/:id - Cancel order
    async cancelOrder(req, res) {
        try {
            const order = await OrderDAO.cancel(req.params.id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json({ message: 'Order cancelled successfully', order });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = orderController;
