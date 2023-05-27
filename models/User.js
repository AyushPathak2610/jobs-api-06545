const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
})

// UserSchema.pre('save', async function(next){// this function will run before the document is saved to the database, and function(next) is used to tell the mongoose that the function is completed and it can move to the next function
UserSchema.pre('save', async function(){// we can skip next parameter if we are using async await
    const salt= await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);// this.password is the password of the document in the database from req.body
    // next();
})

UserSchema.methods.getName = function(){
    return this.name;
}

UserSchema.methods.createJWT = function() {
    return jwt.sign({userId:this._id, name:this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});// this._id is the id of the document in the database
}

UserSchema.methods.comparePasswords = async function(password) {
    const isMatch = await bcrypt.compare(password,this.password);
    return isMatch;
}

const User = mongoose.model('User', UserSchema);// creating User collection in the database and UserSchema is the schema of the collection
module.exports = User;