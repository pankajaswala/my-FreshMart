const Order = require("../models/Order");
const Product = require("../models/Product");


// =========================
// PLACE ORDER
// =========================
const placeOrder = async (req, res) => {

    try {

        const {
            customerName,
            phone,
            address,
            paymentMethod,
            products,
            totalPrice
        } = req.body;
console.log("REQ BODY =", req.body);

        // Validation
        if (
            !customerName ||
            !phone ||
            !address ||
            !products ||
            products.length === 0
        ) {

            return res.status(400).json({
                message: "Please fill all required fields."
            });

        }


        // Check Stock & Reduce Stock
        for (const item of products) {

            const product = await Product.findById(item.productId);


            if (!product) {

                return res.status(404).json({
                    message: "Product Not Found"
                });

            }


            if (product.stock < item.quantity) {

                return res.status(400).json({
                    message: `${product.name} is Out Of Stock`
                });

            }


            product.stock -= item.quantity;

            await product.save();

        }



        // Create Order
        const order = await Order.create({

            userId: req.user._id,

            customerName,

            phone,

            address,

            paymentMethod,

            products,

            totalPrice,

            status: "Pending"

        });



        res.status(201).json({

            message: "Order Placed Successfully",

            order

        });



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }

};





// =========================
// GET MY ORDERS
// =========================
const getMyOrders = async (req, res) => {

    try {


        const orders = await Order.find({

            userId: req.user._id

        })
        .populate("products.productId")
        .sort({createdAt:-1});



        res.status(200).json(orders);



    } catch (error) {


        res.status(500).json({

            message:error.message

        });


    }

};





// =========================
// GET ALL ORDERS (ADMIN)
// =========================
const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("products.productId", "name price image")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// =========================
// UPDATE ORDER STATUS
// =========================
const updateOrderStatus = async (req,res)=>{

    try{


        const order = await Order.findById(req.params.id);



        if(!order){

            return res.status(404).json({

                message:"Order Not Found"

            });

        }



        order.status = req.body.status;



        await order.save();



        res.status(200).json({

            message:"Order Status Updated",

            order

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};





// =========================
// DELETE ORDER
// =========================

const deleteOrder = async (req, res) => {

    try {

        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found"
            });
        }

        res.status(200).json({
            message: "Order Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// =========================
// EXPORTS
// =========================

module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
};
