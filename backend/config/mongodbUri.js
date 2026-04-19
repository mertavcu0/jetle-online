/**
 * Railway production MongoDB için `MONGODB_URI_PRODUCTION` kullanın (Variables veya MongoDB plugin).
 * Tanımlı değilse `MONGODB_URI` (yerel veya tek kaynak) kullanılır.
 */
function resolveMongoDbUri() {
  var prod = process.env.MONGODB_URI_PRODUCTION;
  if (prod != null && String(prod).trim() !== "") return String(prod).trim();
  var fallback = process.env.MONGODB_URI;
  if (fallback != null && String(fallback).trim() !== "") return String(fallback).trim();
  return null;
}

/** Log için şifreyi maskele (mongodb / mongodb+srv). */
function maskMongoDbUri(uri) {
  try {
    return String(uri).replace(/\/\/([^/@:]+):([^/@]+)@/g, "//$1:***@");
  } catch (e) {
    return "(gizli)";
  }
}

module.exports = { resolveMongoDbUri, maskMongoDbUri };
