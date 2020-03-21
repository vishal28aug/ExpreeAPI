const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) =>{

    let error = {...err};
   error.message = err.message;

    //Mongoose bad objectId
    if(err.name === 'CastError'){
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key.. Using err.c ode bcz we dont get name for duplicate error from mongo
    if(err.code === 11000){
        const message = 'Duplicate fields value entered';
        error = new ErrorResponse(message, 400);
    }

    //Mongoose field Validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        sucess:false,
        error:error.message || 'Server Error'
    })
  }

  module.exports = errorHandler;