function requestLogger(req, res, next) {
  var start = Date.now();
  res.on("finish", function onFinish() {
    var took = Date.now() - start;
    console.log("[http]", req.method, req.originalUrl, res.statusCode, took + "ms");
  });
  next();
}

module.exports = { requestLogger };
