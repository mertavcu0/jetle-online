const { validationResult } = require("express-validator");

function validateRequest() {
  return function validate(req, res, next) {
    var result = validationResult(req);
    if (result.isEmpty()) return next();
    return res.status(400).json({
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      details: result.array()
    });
  };
}

module.exports = { validateRequest };
