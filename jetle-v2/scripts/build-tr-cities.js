/**
 * One-off: raw JSON -> jetle-v2/tr-cities.js
 * Run: node scripts/build-tr-cities.js <path-to-turkey_provinces_districts.json>
 */
const fs = require("fs");
const path = require("path");

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/build-tr-cities.js <input.json>");
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(src, "utf8"));
const out = data.map(function (pr) {
  return {
    name: pr.name,
    districts: pr.districts.map(function (d) {
      return d.name;
    })
  };
});
const json = JSON.stringify(out, null, 2);
const banner =
  "/**\n" +
  " * Türkiye 81 il ve ilçeleri (resmi ilçe adları).\n" +
  " * Kaynak: beratdogan/turkey_provinces_districts.json (gist) — JETLE için { name, districts } biçimine dönüştürülmüştür.\n" +
  " */\n";
const body =
  banner +
  '(function (global) {\n  "use strict";\n  global.JETLE_TR_CITIES = ' +
  json +
  ";\n})(typeof window !== \"undefined\" ? window : this);\n";

const dest = path.join(__dirname, "..", "tr-cities.js");
fs.writeFileSync(dest, body, "utf8");
console.log("Wrote", dest, "provinces:", out.length, "districts:", out.reduce(function (a, x) { return a + x.districts.length; }, 0));
