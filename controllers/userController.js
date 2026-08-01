const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ======================
// REGISTER USER
// ======================
const registerUser = async (req, res) => {
    try {

        console.log("REGISTER BODY:", req.body);

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword
        });

        console.log("USER CREATED:", user);

        res.status(201).json({
            message: "Registration Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {

        console.log("REGISTER ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }
};

// ======================
// LOGIN USER
// ======================
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        console.log("================================");
        console.log("Login Email:", email);

        const allUsers = await User.find();

        console.log("Users Count:", allUsers.length);

        const user = await User.findOne({ email });

        console.log("Found User:", user);
        console.log("================================");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
        });

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    registerUser,
    loginUser
};