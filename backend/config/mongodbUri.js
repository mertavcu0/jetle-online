/** Log için şifreyi maskele (mongodb / mongodb+srv). */
function maskMongoDbUri(uri) {
  try {
    return String(uri).replace(/\/\/([^/@:]+):([^/@]+)@/g, "//$1:***@");
  } catch (e) {
    return "(gizli)";
  }
}

module.exports = { maskMongoDbUri };
