const AppError = require("../utils/appError");

const errorHandler = (err, _req, res, _next) => {
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
