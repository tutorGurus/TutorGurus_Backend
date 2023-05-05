const customiError = function(httpStatus, errorMessage){
    const error = new Error(errorMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    return error ;
}

module.exports = customiError;