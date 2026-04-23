/**
 * ESM: `import { TR_CITIES } from "./tr-cities.esm.mjs"`
 * Dizi `tr-cities.js` içindeki `TR_CITIES` ile aynıdır.
 */
import { createRequire } from "module";

const require = createRequire(import.meta.url);
export const TR_CITIES = require("./tr-cities.js").TR_CITIES;
