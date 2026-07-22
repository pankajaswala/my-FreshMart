const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {

            return res.status(401).json({
                message:"No token"
            });

        }


        const token = authHeader.split(" ")[1];
console.log("TOKEN:", token);
console.log("VERIFY SECRET:", process.env.JWT_SECRET);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = await User.findById(decoded.id);


        if(!req.user){

            return res.status(401).json({
                message:"User not found"
            });

        }


        next();


    } catch(error){

        return res.status(401).json({
            message:error.message
        });

    }

};


module.exports = protect;