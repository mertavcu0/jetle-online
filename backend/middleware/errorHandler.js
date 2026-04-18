function errorHandler(err, req, res, next) {
  if (err && err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        ok: false,
        code: "MulterError",
        message: "Dosya boyutu sınırı aşıldı. Fotoğraf için en fazla 12 MB, video için en fazla 200 MB yükleyin."
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        ok: false,
        code: "MulterError",
        message: "Dosya limiti aşıldı. En fazla 30 fotoğraf ve 1 video yükleyebilirsiniz."
      });
    }
    return res.status(400).json({
      ok: false,
      code: "MulterError",
      message: "Dosya yükleme sırasında bir hata oluştu."
    });
  }
  var status = err && err.statusCode ? err.statusCode : 500;
  var payload = {
    ok: false,
    code: err && err.name ? err.name : "INTERNAL_ERROR",
    message: err && err.message ? err.message : "Unexpected error"
  };
  if (err && err.details) payload.details = err.details;
  if (process.env.NODE_ENV !== "production" && err && err.stack) payload.stack = err.stack;
  res.status(status).json(payload);
}

module.exports = { errorHandler };
