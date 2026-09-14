const express = require("express");
const store = require("../data/store");

const router = express.Router();

// PLACE ORDER
router.post("/place", (req, res) => {

    // Check if cart is empty
    if (store.cart.length === 0) {
        return res.status(400).json({
            message: "Cart is empty"
        });
    }

    // Create a new order using the cart
    const order = {
        orderId: store.orders.length + 1,
        items: [...store.cart],
        status: "Placed",
        createdAt: new Date()
    };

    // Save order
    store.orders.push(order);

    // Empty the cart after placing order
    store.cart.length = 0;

    res.status(201).json({
        message: "Order placed successfully",
        order: order
    });
});

// GET all orders
router.get("/", (req, res) => {
    res.json(store.orders);
});

module.exports = router;