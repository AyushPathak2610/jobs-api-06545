const { custom } = require('joi')
const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default values
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,// if the error has a status code, use that, otherwise use the internal server error status code
    msg: err.message || 'Something went wrong, please try again later',
  }
  // if (err instanceof CustomAPIError) {// if the error is an instance of our custom error class
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(err.name === 'ValidationError'){// if the error is a validation error
    customError.msg = Object.values(err.errors).map((item) => item.message).join(', ');// get the error messages from the errors object and join them together
    customError.statusCode = 400;
  }
  if(err.code && err.code === 11000){// if the error is a duplicate key error
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = 400;
  }
  if(err.name === 'CastError'){// if the error is a cast error
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(StatusCodes.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
