const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

const getJob = async (req,res) => {
    const { user: {userId}, params: {id: jobId}} = req;
    const job = await Job.findOne({ _id:jobId, createdBy: userId});
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json(job);
}
const getAllJobs = async (req,res) => {
    const jobs = await Job.find({ createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}
const createJob = async (req,res) => {
    req.body.createdBy = req.user.userId;// we can access the user from the req object because we attached it in the auth middleware
    const job =  await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(job);
}
const updateJob = async (req,res) => {
    const {// destructuring the request object
        user: {userId},
        body: {company, position},
        params: {id: jobId},
    } = req;
    if(company === '' || position === ''){
        throw new BadRequestError('Company or Position fields cannot be empty');    
    }
    const job = await Job.findByIdAndUpdate(
        {_id: jobId, createdBy: userId},// to find the job we want to update
        {company, position},// the data we want to update
        {new: true, runValidators: true},//new: true returns the updated job, runValidators: true runs the validators in the model
    )
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    console.log(job);
    res.status(StatusCodes.OK).json(job);
}
const deleteJob = async (req,res) => {
    const { user: {userId}, params: {id: jobId}} = req;
    const job = await Job.findByIdAndDelete({_id: jobId, createdBy: userId});
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({msg: 'success'});
}

module.exports = {getJob,getAllJobs,createJob,updateJob,deleteJob};