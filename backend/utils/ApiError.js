class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message || "Unexpected error");
    this.name = "ApiError";
    this.statusCode = statusCode || 500;
    this.details = details || null;
  }
}

module.exports = { ApiError };
