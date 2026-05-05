module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Yetkisiz" });
    }

    // şimdilik geç
    req.user = { _id: "test-user" };

    next(); // BU ÇALIŞMALI
  } catch (err) {
    res.status(401).json({ error: "Token hatalı" });
  }
};
