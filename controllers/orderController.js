const Order = require("../models/Order");
const Product = require("../models/product");

// ==========================
// CREATE ORDER
// ==========================

const createOrder = async (req, res) => {

    try {

        const {
            customerName,
            phone,
            address,
            paymentMethod,
            products,
            totalPrice
        } = req.body;


        if (
            !customerName ||
            !phone ||
            !address ||
            !products ||
            products.length === 0
        ) {

            return res.status(400).json({
                message: "Please fill all order details"
            });

        }



        const order = await Order.create({

            userId: req.user.id,

            customerName,

            phone,

            address,

            paymentMethod,

            products,

            totalPrice

        });



        res.status(201).json({

            message: "Order Placed Successfully",

            order

        });



    }
    catch(error){

        console.log("Create Order Error:",error);

        res.status(500).json({

            message:error.message

        });

    }

};




// ==========================
// GET USER ORDERS
// ==========================

const getMyOrders = async(req,res)=>{


    try{


        const orders = await Order.find({

            userId:req.user.id

        })
        .populate(
            "products.productId"
        )
        .sort({
            createdAt:-1
        });



        res.json(orders);



    }
    catch(error){


        console.log("My Orders Error:",error);


        res.status(500).json({

            message:error.message

        });


    }


};




// ==========================
// GET ALL ORDERS (ADMIN)
// ==========================

const getAllOrders = async(req,res)=>{


    try{


        const orders = await Order.find()

        .populate("userId")

        .populate("products.productId")

        .sort({
            createdAt:-1
        });



        res.json(orders);



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};




// ==========================
// UPDATE ORDER STATUS
// ==========================

const updateOrderStatus = async(req,res)=>{


    try{


        const order = await Order.findById(
            req.params.id
        );


        if(!order){

            return res.status(404).json({

                message:"Order not found"

            });

        }



        order.status = req.body.status;



        await order.save();



        res.json({

            message:"Order Status Updated",

            order

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};





// ==========================
// DELETE ORDER
// ==========================

const deleteOrder = async(req,res)=>{


    try{


        const order = await Order.findById(
            req.params.id
        );


        if(!order){

            return res.status(404).json({

                message:"Order not found"

            });

        }



        await order.deleteOne();



        res.json({

            message:"Order Deleted"

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};




module.exports = {

    createOrder,

    getMyOrders,

    getAllOrders,

    updateOrderStatus,

    deleteOrder

};
