const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company:{
        type: String,
        required: [true, "provide Company name"],
        maxlength: 50,
    },
    position:{
        type: String,
        required: [true, "provide Position"],
        maxlength: 50,
    },
    status:{
        type:String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending',
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,// this is the id of the user who created the job
        ref: 'User', // this is the reference to the User collection
        required: [true,'please provide a user id'],
    }
},{timestamps: true})// timestamps: true will add createdAt and updatedAt fields to the document



const Job = mongoose.model('Job', JobSchema);
module.exports = Job;