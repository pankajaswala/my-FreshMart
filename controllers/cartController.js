const Cart = require("../models/Cart");

// =========================
// ADD TO CART
// =========================
const addToCart = async (req, res) => {

    try {

        const { productId, quantity } = req.body;

        const cart = await Cart.create({
            userId: req.user.id,
            productId,
            quantity
        });

        res.status(201).json({
            message: "Product Added To Cart",
            cart
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// =========================
// GET CART
// =========================
const getCart = async (req, res) => {

    try {

        const cart = await Cart.find({
            userId: req.user.id
        }).populate("productId");

        res.status(200).json(cart);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// =========================
// REMOVE FROM CART
// =========================
const removeFromCart = async (req, res) => {

    try {

        const cart = await Cart.findByIdAndDelete(req.params.id);

        if (!cart) {

            return res.status(404).json({
                message: "Cart Item Not Found"
            });

        }

        res.status(200).json({
            message: "Item Removed Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    addToCart,
    getCart,
    removeFromCart
};