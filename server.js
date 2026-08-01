const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

console.log("JWT SECRET =", process.env.JWT_SECRET);

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// Routes
// ======================
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ======================
// Debug Route
// ======================
const User = require("./models/User");

app.get("/check-users", async (req, res) => {
    try {
        const users = await User.find();

        res.json({
            totalUsers: users.length,
            users
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

// ======================
// Home Route
// ======================
app.get("/", (req, res) => {
    res.send("FreshMart API Running...");
});

// ======================
// MongoDB Connection
// ======================
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("📦 Mongoose Connected");
        console.log("✅ MongoDB Connected");
        console.log("Database Name:", mongoose.connection.name);

        app.listen(PORT, () => {
            console.log(`🚀 Server Running on Port ${PORT}`);
        });

    })
    .catch((err) => {

        console.error("❌ MongoDB Error:", err);

    });

// ======================
// MongoDB Events
// ======================
mongoose.connection.on("connected", () => {
    console.log("📦 Mongoose Connected");
});

mongoose.connection.on("error", (err) => {
    console.log("❌ Mongoose Error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("⚠️ Mongoose Disconnected");
});