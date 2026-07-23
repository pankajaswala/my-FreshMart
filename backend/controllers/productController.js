const Product = require("../models/Product");

// =========================
// GET ALL PRODUCTS
// =========================
const getProducts = async (req, res) => {

    try {

        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// =========================
// ADD PRODUCT
// =========================
const addProduct = async (req, res) => {

    try {

        console.log(req.body);

        const product = new Product({

            name: req.body.name,
            category: req.body.category,
            weight: req.body.weight,
            price: req.body.price,
            unit: req.body.unit,
            image: req.body.image,
            stock: req.body.stock,
            description: req.body.description

        });

        const savedProduct = await product.save();

        res.status(201).json({
            message: "Product Added Successfully",
            product: savedProduct
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
// =========================
// UPDATE PRODUCT
// =========================
const updateProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        product.name = req.body.name || product.name;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
        product.unit = req.body.unit || product.unit;
        product.image = req.body.image || product.image;
        product.stock = req.body.stock || product.stock;
        product.description = req.body.description || product.description;

        const updatedProduct = await product.save();

        res.status(200).json({
            message: "Product Updated Successfully",
            product: updatedProduct
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// =========================
// DELETE PRODUCT
// =========================
const deleteProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product Deleted Successfully"
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
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
};