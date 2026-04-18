function list(req, res) {
  res.json({ ok: true, data: [] });
}

function detail(req, res) {
  res.json({ ok: true, data: { conversationId: req.params.conversationId, messages: [] } });
}

function create(req, res) {
  res.status(201).json({ ok: true, data: req.body || {} });
}

module.exports = { list, detail, create };
