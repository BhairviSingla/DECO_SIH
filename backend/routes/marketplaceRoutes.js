const express = require("express");

const router = express.Router();

const products = [
    {
        id: 1,
        name: "Aqua Cure",
        description: "Treatment for bacterial infections in fish.",
        price: "₹499",
        rating: 4.5,
        tag: "Bacterial Treatment"
    },
    {
        id: 2,
        name: "FishGuard",
        description: "Helps protect fish from common infections.",
        price: "₹399",
        rating: 4.3,
        tag: "Fish Health"
    },
    {
        id: 3,
        name: "Aqua Shield",
        description: "Water care treatment for maintaining healthy tanks.",
        price: "₹299",
        rating: 4.4,
        tag: "Water Care"
    }
];

router.get("/", (req, res) => {
    res.json(products);
});

module.exports = router;