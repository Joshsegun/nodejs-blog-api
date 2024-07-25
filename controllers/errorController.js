const ErrorHandler = require("../utils/errorHandler");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ErrorHandler(message, 400);
};

const handleDuplicateFieldsNameDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value : ${value} .. Please use a different value`;
  return new ErrorHandler(message, 400);
};

const handleJWTError = () =>
  new ErrorHandler("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new ErrorHandler("Your token has expired! Please log in again.", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === "11000") error = handleDuplicateFieldsNameDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};