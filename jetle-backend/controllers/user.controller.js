const User = require("../models/User");

async function me(req, res) {
  try {
    var user = await User.findById(req.user.userId).lean();
    if (!user) {
      return res.status(404).json({ ok: false, message: "Kullanıcı bulunamadı." });
    }
    return res.json({
      ok: true,
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Profil alınamadı." });
  }
}

module.exports = { me };
