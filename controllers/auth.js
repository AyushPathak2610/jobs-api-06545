const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');
// const bcrypt = require('bcryptjs'); // dont need it when we pre save middleare in ../models/User
const jwt = require('jsonwebtoken');

const login = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({email})// {email:email} is same as {email}
    if(!user){
        throw new UnauthenticatedError('Inavlid Credentials');
    }
    const isPasswordCorrect = await user.comparePasswords(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Inavlid Credentials');
    }
    // now we know that user exists, so now create a token for authorization at post request
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({name: {name:user.name}, token});
}

const register = async (req,res) => {
    // const {name,email,password} = req.body;
    // if(!user || !email || !passwprd){// we can skip this part because we are using the mongoose validator for errors
    //     throw new BadRequestError('Please provide name,email and password');
    // } 

    // const {name,email,password} = req.body;
    // // The `genSaltSync()` function generates a salt, which is used to enhance the security of the hash.
    // // The higher the number of salt rounds, the longer it takes to generate the hash but also the more secure it is.
    // const salt = await bcrypt.genSalt(10);
    // // hash() and hashSync() are two methods for generating a salted hash of a password. hash() is asynchronous and hashSync() is synchronous.
    // const hashedPassword = await bcrypt.hash(password,salt);
    // const tempUser = {name,email,password:hashedPassword};
    // // The `compareSync()` function compares the plain password with the hashed value and returns a boolean indicating whether they match.
    // // const isMatch = bcrypt.compareSync(anotherPassword, hash);

    // // const user = await User.create({...req.body});// here we are creating a new document named user in the database and ... before req.body means that we are copying all the properties of req.body to the new user but this would cause password leak worries
    // const user = await User.create({...tempUser});

    const user = await User.create({...req.body});// pre save middleware will run here on req.body and the password will be replaced by hashed password
    // // make a jwt token
    // const token = jwt.sign({userId:user._id, name:user.name}, 'jwt_Secret', {expiresIn:'30d'});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({user: {name:user.getName()},token});
    // res.status(StatusCodes.CREATED).json({user});
}

module.exports = {login,register};