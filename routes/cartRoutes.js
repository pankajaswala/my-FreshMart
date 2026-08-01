const express = require("express");
const router = express.Router();


const cartController = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");


console.log("CART CONTROLLER:", cartController);
console.log("PROTECT:", protect);



router.get(
    "/",
    protect,
    cartController.getCart
);


router.post(
    "/",
    protect,
    cartController.addToCart
);


router.delete(
    "/:productId",
    protect,
    cartController.removeFromCart
);


router.delete(
    "/",
    protect,
    cartController.clearCart
);



module.exports = router;