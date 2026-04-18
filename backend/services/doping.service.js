function activateDoping(payload) {
  var now = new Date();
  var plus7 = new Date(now.getTime() + 7 * 86400000).toISOString();
  var type = payload.type;
  if (type === "showcase") return { showcase: true, featured: true, showcaseUntil: plus7, featuredUntil: plus7 };
  if (type === "featured") return { featured: true, featuredUntil: plus7 };
  if (type === "urgent") return { urgent: true };
  if (type === "highlight") return { highlight: true };
  return {};
}

module.exports = { activateDoping };
