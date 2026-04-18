function create(req, res) {
  res.status(201).json({ ok: true, data: req.body || {} });
}

function listForAdmin(req, res) {
  res.json({ ok: true, data: [] });
}

function updateForAdmin(req, res) {
  res.json({ ok: true, data: { id: req.params.id, status: req.body && req.body.status } });
}

module.exports = { create, listForAdmin, updateForAdmin };
