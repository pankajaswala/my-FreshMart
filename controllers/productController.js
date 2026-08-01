const Product = require("../models/product");
// ==========================
// GET ALL PRODUCTS
// ==========================

const getProducts = async (req, res) => {
    try {
        console.log("Database:", Product.db.name);

        const count = await Product.countDocuments();
        console.log("Count:", count);

        const products = await Product.find();
        console.log(products);

        res.json(products);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================
// GET SINGLE PRODUCT
// ==========================

const getProductById = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);


        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }


        res.status(200).json(product);


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:error.message
        });

    }

};



// ==========================
// CREATE PRODUCT (ADMIN)
// ==========================

const createProduct = async (req, res) => {

    try {

        console.log("BODY:", req.body);

        const {
            name,
            description,
            price,
            category,
            image,
            weight,
            unit,
            stock
        } = req.body;

        const product = await Product.create({

            name,
            description,
            price,
            category,
            image,
            weight,
            unit,
            stock

        });

        res.status(201).json({

            message: "Product Created Successfully",

            product

        });

    } catch (error) {

        console.log("CREATE PRODUCT ERROR:", error);

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================
// UPDATE PRODUCT
// ==========================

const updateProduct = async(req,res)=>{

    try{


        const product = await Product.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new:true
            }

        );


        if(!product){

            return res.status(404).json({
                message:"Product not found"
            });

        }


        res.json(product);



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// ==========================
// DELETE PRODUCT
// ==========================

const deleteProduct = async(req,res)=>{

    try{


        const product = await Product.findByIdAndDelete(
            req.params.id
        );


        if(!product){

            return res.status(404).json({
                message:"Product not found"
            });

        }


        res.json({

            message:"Product Deleted"

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// ==========================
// EXPORTS
// ==========================

module.exports = {

    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct

};