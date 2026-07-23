const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addToCart,
    getCart,
    removeFromCart
} = require("../controllers/cartController");

// Add Product to Cart
router.post("/", protect, addToCart);

// Get User Cart
router.get("/", protect, getCart);

// Remove Product from Cart
router.delete("/:id", protect, removeFromCart);

module.exports = router;