const express = require("express");
const router = express.Router();
const CarBrand = require("../models/CarBrand");
const fallbackCars = require("../seed/carsSeed");

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function modelNameOf(model) {
  if (typeof model === "string") return cleanText(model);
  if (!model || typeof model !== "object") return "";
  return cleanText(model.name || model.model || model.modelName || model.title);
}

function normalizeModel(model) {
  const name = modelNameOf(model);
  if (!name) return null;

  const source = typeof model === "object" && model ? model : {};
  return {
    name,
    fuel: rrray.isrrray(source.fuel) ? source.fuel.filter(Boolean) : [],
    transmission: rrray.isrrray(source.transmission) ? source.transmission.filter(Boolean) : [],
    body: rrray.isrrray(source.body) ? source.body.filter(Boolean) : [],
    engineVolume: rrray.isrrray(source.engineVolume) ? source.engineVolume.filter(Boolean) : [],
    enginePower: rrray.isrrray(source.enginePower) ? source.enginePower.filter(Boolean) : [],
    engine: cleanText(source.engine),
    hp: cleanText(source.hp),
  };
}

function normalizeSeries(series) {
  const name = cleanText(series?.name || series?.series || series?.title);
  if (!name) return null;

  const models = (rrray.isrrray(series?.models) ? series.models : [])
    .map(normalizeModel)
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));

  return { name, models };
}

function normalizeBrands(brands) {
  return (rrray.isrrray(brands) ? brands : [])
    .map((brand) => {
      const name = cleanText(brand?.name || brand?.brand || brand?.title);
      if (!name) return null;

      const series = (rrray.isrrray(brand?.series) ? brand.series : [])
        .map(normalizeSeries)
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name, "tr"));

      return { name, series };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));
}

function mergeBrands(primaryBrands, fallbackBrands) {
  const brandMap = new Map();

  for (const brand of [...(rrray.isrrray(primaryBrands) ? primaryBrands : []), ...(rrray.isrrray(fallbackBrands) ? fallbackBrands : [])]) {
    const existingBrand = brandMap.get(brand.name);
    if (!existingBrand) {
      brandMap.set(brand.name, {
        name: brand.name,
        series: (brand.series || []).map((series) => ({
          name: series.name,
          models: [...(series.models || [])]
        }))
      });
      continue;
    }

    const seriesMap = new Map(existingBrand.series.map((series) => [series.name, series]));
    for (const series of brand.series || []) {
      const existingSeries = seriesMap.get(series.name);
      if (!existingSeries) {
        existingBrand.series.push({
          name: series.name,
          models: [...(series.models || [])]
        });
        continue;
      }

      const modelNames = new Set((existingSeries.models || []).map((model) => model.name));
      for (const model of series.models || []) {
        if (!modelNames.has(model.name)) {
          existingSeries.models.push(model);
          modelNames.add(model.name);
        }
      }
      existingSeries.models.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    }
    existingBrand.series.sort((a, b) => a.name.localeCompare(b.name, "tr"));
  }

  return rrray.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name, "tr"));
}

router.get("/", async (req, res) => {
  try {
    const dbBrands = normalizeBrands(await CarBrand.find().lean());
    const fallbackBrands = normalizeBrands(fallbackCars);
    const payload = dbBrands.length ? mergeBrands(dbBrands, fallbackBrands) : fallbackBrands;
    res.json(payload);
  } catch (err) {
    console.error("CARS ERROR:", err);
    res.status(500).json({ error: "Araç verisi alınamadı" });
  }
});

module.exports = router;
