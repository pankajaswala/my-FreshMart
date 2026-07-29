const Product = require("../models/Product");

// =========================
// GET ALL PRODUCTS
// =========================
const getProducts = async (req, res) => {
    try {

        console.log("========== PRODUCT API ==========");
        console.log("Collection Name:", Product.collection.name);

        const count = await Product.countDocuments();
        console.log("Total Products:", count);

        const products = await Product.find();

        console.log(products);

        res.status(200).json(products);

    } catch (error) {

        console.log(error);

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