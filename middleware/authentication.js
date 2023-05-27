const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const auth = (req,res,next) => {
    // headers
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // could see the below syntax in some projects, but here not needed
        // const user = User.findById(payload.userId).select('-password');// select('-password') is used to not return the password in the response
        // req.user=user;
        // attach the user to job routes
        req.user = {userId: payload.userId, name: payload.name};
        console.log('authHeader:', authHeader);
        console.log('token:', token);
        console.log('payload:', payload);
        console.log('req.user:', req.user);
        next();
    } catch (error) {
        throw (new UnauthenticatedError('Authentication invalid'));
    }
}

module.exports = auth;