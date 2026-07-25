const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

// ==========================
// REGISTER USER
// ==========================

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Please fill all fields",
            });

        }


        console.log("Register API Called");
        console.log("Ready State:", mongoose.connection.readyState);


        const userExists = await User.findOne({ email });


        if (userExists) {

            return res.status(400).json({
                message: "User already exists",
            });

        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({

            name,
            email,
            password: hashedPassword,

        });


        res.status(201).json({

            message: "Registration Successful",

        });


    } catch (error) {

        console.log("Register Error:", error);


        res.status(500).json({

            message: error.message,

        });

    }

};



// ==========================
// LOGIN USER
// ==========================

const loginUser = async (req, res) => {

    try {


        const { email, password } = req.body;



        if (!email || !password) {

            return res.status(400).json({

                message: "Please enter email and password",

            });

        }



        console.log("Login API Called");
        console.log("Ready State:", mongoose.connection.readyState);



        const user = await User.findOne({ email });



        if (!user) {

            return res.status(400).json({

                message: "User not found",

            });

        }




        const isMatch = await bcrypt.compare(
            password,
            user.password
        );



        if (!isMatch) {

            return res.status(400).json({

                message: "Invalid password",

            });

        }




        const token = jwt.sign(

            {

                id: user._id,

                isAdmin: user.isAdmin,

            },


            process.env.JWT_SECRET,


            {

                expiresIn: "1d",

            }

        );





        res.status(200).json({

            message: "Login Successful",

            id: user._id,

            token,

            isAdmin: user.isAdmin,

            name: user.name,

            email: user.email,

        });



    } catch (error) {


        console.log("Login Error:", error);



        res.status(500).json({

            message: error.message,

        });


    }

};



// ==========================
// EXPORTS
// ==========================

module.exports = {

    registerUser,

    loginUser,

};