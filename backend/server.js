const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

console.log("JWT SECRET =", process.env.JWT_SECRET);

const app = express();

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
        console.log("✅ MongoDB Connected");
        console.log("Database Name:", mongoose.connection.name);

        console.log("Before app.listen");

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server Running on Port ${PORT}`);
        });

        console.log("After app.listen");

        server.on("error", (err) => {
            console.error("❌ Server Error:", err);
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