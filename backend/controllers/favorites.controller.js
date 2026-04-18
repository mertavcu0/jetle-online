function create(req, res) {
  res.status(201).json({
    ok: true,
    data: {
      userId: req.auth.userId,
      listingId: req.params.listingId
    }
  });
}

function remove(req, res) {
  res.status(204).send();
}

module.exports = { create, remove };
