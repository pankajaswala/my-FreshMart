

const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// =========================
// PUBLIC ROUTES
// =========================

// Get All Products
router.get("/", getProducts);

// =========================
// ADMIN ROUTES
// =========================

// Add Product
router.post("/", protect, adminOnly, addProduct);

// Update Product
router.put("/:id", protect, adminOnly, updateProduct);

// Delete Product
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;