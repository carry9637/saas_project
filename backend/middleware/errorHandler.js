const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV === "development") {
    console.error(`[${req.method}] ${req.path} -> ${statusCode}: ${message}`);
  }
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
