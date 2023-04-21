const errorHandler = require('../utils/errorHandler');
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong MongoDb id error
    if (err.name === "CastError") {
        const message = `Resource not found,Invalid:${err.path}`;
        err = new errorHandler(message, 400);
    }
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new errorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid ,try again`;
        err = new errorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired ,login again`;
        err = new errorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};