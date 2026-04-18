function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    code: "NOT_FOUND",
    message: "Endpoint not found"
  });
}

module.exports = { notFoundHandler };
