const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    customerName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        default: "Cash on Delivery"
    },

    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);