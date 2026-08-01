const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ==========================
// GET CART
// ==========================

const getCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");


        if (!cart) {

            return res.status(200).json({
                items: []
            });

        }


        res.json(cart);


    } catch(error){

        console.log("GET CART ERROR:", error);

        res.status(500).json({
            message:error.message
        });

    }

};



// ==========================
// ADD TO CART
// ==========================

const addToCart = async(req,res)=>{

    try{

        const { productId, quantity } = req.body;


        const product = await Product.findById(productId);


        if(!product){

            return res.status(404).json({
                message:"Product not found"
            });

        }


        let cart = await Cart.findOne({
            user:req.user._id
        });



        if(!cart){

            cart = await Cart.create({

                user:req.user._id,

                items:[

                    {
                        product:productId,
                        quantity:quantity || 1
                    }

                ]

            });


        }else{


            const itemIndex = cart.items.findIndex(

                item => item.product.toString() === productId

            );


            if(itemIndex > -1){

                cart.items[itemIndex].quantity += quantity || 1;


            }else{


                cart.items.push({

                    product:productId,

                    quantity:quantity || 1

                });

            }


            await cart.save();


        }



        res.status(200).json({

            message:"Added to cart",

            cart

        });



    }catch(error){

        console.log(error);

        res.status(500).json({
            message:error.message
        });

    }

};




// ==========================
// REMOVE CART ITEM
// ==========================

const removeFromCart = async(req,res)=>{


    try{


        const {productId}=req.params;


        const cart = await Cart.findOne({

            user:req.user._id

        });



        if(!cart){

            return res.status(404).json({
                message:"Cart empty"
            });

        }



        cart.items = cart.items.filter(

            item => item.product.toString() !== productId

        );


        await cart.save();



        res.json({

            message:"Item removed",

            cart

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }


};




// ==========================
// CLEAR CART
// ==========================

const clearCart = async(req,res)=>{

    try{


        await Cart.findOneAndDelete({

            user:req.user._id

        });


        res.json({

            message:"Cart cleared"

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




module.exports = {

    getCart,
    addToCart,
    removeFromCart,
    clearCart

};