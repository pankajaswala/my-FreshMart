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
                message: "Please fill all fields"
            });

        }


        console.log("REGISTER REQUEST:", req.body);
        console.log(
            "MongoDB Status:",
            mongoose.connection.readyState
        );


        const userExists = await User.findOne({
            email: email
        });


        if (userExists) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = await User.create({

            name: name,

            email: email,

            password: hashedPassword

        });


        res.status(201).json({

            message: "Registration Successful",

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });


    } catch (error) {


        console.log("REGISTER ERROR:", error);


        res.status(500).json({

            message: error.message

        });

    }

};




// ==========================
// LOGIN USER
// ==========================

const loginUser = async (req, res) => {


    try {


        const { email, password } = req.body;



        console.log("LOGIN REQUEST:", req.body);



        if (!email || !password) {


            return res.status(400).json({

                message: "Please enter email and password"

            });


        }



        console.log(
            "MongoDB Status:",
            mongoose.connection.readyState
        );



        const user = await User.findOne({

            email: email

        });



        console.log("FOUND USER:", user);



        if (!user) {


            return res.status(404).json({

                message: "User not found"

            });


        }




        const passwordMatch = await bcrypt.compare(

            password,

            user.password

        );



        if (!passwordMatch) {


            return res.status(400).json({

                message: "Invalid password"

            });


        }





        const token = jwt.sign(

            {

                id: user._id,

                isAdmin: user.isAdmin || false

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


            isAdmin: user.isAdmin || false,


            token: token


        });



    } catch(error) {



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