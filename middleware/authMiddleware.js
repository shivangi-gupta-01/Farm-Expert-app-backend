const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');

// Making the protected route, ie only be used when u r authorised to access: middleware

const protect = asyncHandler(async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Farm-Expert")) {
            try {
                token = req.headers.authorization.split(" ")[1]; //here Bearer is spilt and the token is extracted
                const id = jwt.verify(token, process.env.JWT_SECRET);
                const userExist = await User.findById(id);
                if (!userExist) {
                    throw new Error("Wrong ID");
                }
                else {
                    req.id = id
                    next();
                }
                // console.log(req);
            } catch (error) {
                res.status(401);
                throw new Error("Not authorised, token failed");
            }
        }
        // if there is no token at all
        if (!token) {
            res.status(401);
            throw new Error("Not authorised, no token");
        }
    }
    catch (error) {
        console.error('Error in protect middleware:', error);
        res.status(401).send({ error: 'Not authorized' });
    }
})

module.exports = protect;