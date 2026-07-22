const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
} = require("../controllers/orderController");

// ==========================
// USER ROUTES
// ==========================

// Place Order
router.post("/", protect, placeOrder);

// My Orders
router.get("/myorders", protect, getMyOrders);

// ==========================
// ADMIN ROUTES
// ==========================

// Get All Orders
router.get("/", getAllOrders);

// Update Order Status
router.put("/:id", updateOrderStatus);

// Delete Order
router.delete("/:id", deleteOrder);

module.exports = router;