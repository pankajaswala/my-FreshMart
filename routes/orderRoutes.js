const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
} = require("../controllers/orderController");


const { protect, admin } = require("../middleware/authMiddleware");



router.post("/", protect, createOrder);


router.get("/myorders", protect, getMyOrders);


router.get("/", protect, admin, getAllOrders);


router.put("/:id", protect, admin, updateOrderStatus);


router.delete("/:id", protect, admin, deleteOrder);



module.exports = router;