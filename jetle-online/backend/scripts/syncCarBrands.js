require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const CarBrand = require("../models/CarBrand");
const seedBrands = require("../seed/carsSeed");

function modelNameOf(model) {
  if (typeof model === "string") return model.trim();
  if (!model || typeof model !== "object") return "";
  if (typeof model.name === "string" && model.name.trim()) return model.name.trim();

  const numericKeys = Object.keys(model)
    .filter((key) => /^\d+$/.test(key))
    .sort((a, b) => Number(a) - Number(b));

  if (!numericKeys.length) return "";
  return numericKeys.map((key) => String(model[key] || "")).join("").trim();
}

function normalizeModel(model) {
  const name = modelNameOf(model);
  if (!name) return null;
  const source = typeof model === "object" && model ? model : {};
  return {
    name,
    fuel: Array.isArray(source.fuel) ? source.fuel.filter(Boolean) : [],
    transmission: Array.isArray(source.transmission) ? source.transmission.filter(Boolean) : [],
    body: Array.isArray(source.body) ? source.body.filter(Boolean) : [],
    engineVolume: Array.isArray(source.engineVolume) ? source.engineVolume.filter(Boolean) : [],
    enginePower: Array.isArray(source.enginePower) ? source.enginePower.filter(Boolean) : [],
    engine: typeof source.engine === "string" ? source.engine : "",
    hp: typeof source.hp === "string" ? source.hp : ""
  };
}

function sortModels(models) {
  return [...(models || [])]
    .map(normalizeModel)
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));
}

function sortSeries(series) {
  return [...(series || [])]
    .map((item) => ({
      ...item,
      models: sortModels(item.models || [])
    }))
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "tr"));
}

function countSeed(brands) {
  let series = 0;
  let models = 0;
  for (const brand of brands) {
    series += (brand.series || []).length;
    for (const item of brand.series || []) {
      models += (item.models || []).length;
    }
  }
  return { brands: brands.length, series, models };
}

async function buildDiff() {
  const existingBrands = await CarBrand.find({}, { name: 1, series: 1 }).lean();
  const existingMap = new Map(existingBrands.map((brand) => [brand.name, brand]));
  const additions = [];
  const summary = { brands: 0, series: 0, models: 0 };
  const tracked = {
    Acura: { added: false, series: 0, models: 0 },
    Abarth: { added: false, series: 0, models: 0 },
    Aion: { added: false, series: 0, models: 0 }
  };

  for (const brand of seedBrands) {
    const normalizedBrand = {
      name: brand.name,
      series: sortSeries(brand.series || [])
    };

    const existingBrand = existingMap.get(normalizedBrand.name);
    const brandAdd = { name: normalizedBrand.name, series: [] };

    if (!existingBrand) {
      brandAdd.series = normalizedBrand.series;
      summary.brands += 1;
      summary.series += normalizedBrand.series.length;
      normalizedBrand.series.forEach((series) => {
        summary.models += series.models.length;
      });
      additions.push(brandAdd);
      if (tracked[normalizedBrand.name]) {
        tracked[normalizedBrand.name] = {
          added: true,
          series: normalizedBrand.series.length,
          models: normalizedBrand.series.reduce((sum, item) => sum + item.models.length, 0)
        };
      }
      continue;
    }

    const existingSeriesMap = new Map((existingBrand.series || []).map((series) => [series.name, series]));

    for (const series of normalizedBrand.series) {
      const existingSeries = existingSeriesMap.get(series.name);
      if (!existingSeries) {
        brandAdd.series.push(series);
        summary.series += 1;
        summary.models += series.models.length;
        continue;
      }

      const existingModelNames = new Set((existingSeries.models || []).map(modelNameOf).filter(Boolean));
      const missingModels = series.models.filter((item) => !existingModelNames.has(item.name));

      if (missingModels.length) {
        brandAdd.series.push({ name: series.name, models: sortModels(missingModels) });
        summary.models += missingModels.length;
      }
    }

    if (brandAdd.series.length) {
      brandAdd.series = sortSeries(brandAdd.series);
      additions.push(brandAdd);
      if (tracked[normalizedBrand.name]) {
        tracked[normalizedBrand.name] = {
          added: true,
          series: brandAdd.series.length,
          models: brandAdd.series.reduce((sum, item) => sum + item.models.length, 0)
        };
      }
    }
  }

  return { additions, summary, tracked };
}

async function applyDiff(additions) {
  for (const brandAdd of additions) {
    let brand = await CarBrand.findOne({ name: brandAdd.name });

    if (!brand) {
      await CarBrand.create({
        name: brandAdd.name,
        series: sortSeries(brandAdd.series)
      });
      continue;
    }

    for (const seriesAdd of brandAdd.series) {
      let series = brand.series.find((item) => item.name === seriesAdd.name);

      if (!series) {
        brand.series.push(seriesAdd);
        continue;
      }

      const existingModelNames = new Set((series.models || []).map((item) => item.name));
      for (const item of sortModels(seriesAdd.models)) {
        if (!existingModelNames.has(item.name)) {
          series.models.push(item);
          existingModelNames.add(item.name);
        }
      }
      series.models = sortModels(series.models);
    }

    brand.series = sortSeries(brand.series);
    await brand.save();
  }
}

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI bulunamadi");
  }

  const plan = countSeed(seedBrands);
  console.log("Seed kapsamı:");
  console.log(`- Marka: ${plan.brands}`);
  console.log(`- Seri: ${plan.series}`);
  console.log(`- Model: ${plan.models}`);
  console.log("");

  await mongoose.connect(process.env.MONGO_URI);

  const { additions, summary, tracked } = await buildDiff();
  console.log("Sync sonucu:");
  console.log(`- Yeni marka: ${summary.brands}`);
  console.log(`- Yeni seri: ${summary.series}`);
  console.log(`- Yeni model: ${summary.models}`);
  console.log(`- Acura eklendi mi: ${tracked.Acura.added}`);
  console.log(`- Abarth eklendi mi: ${tracked.Abarth.added}`);
  console.log(`- Aion eklendi mi: ${tracked.Aion.added}`);

  if (summary.brands || summary.series || summary.models) {
    await applyDiff(additions);
    console.log("DB senkronizasyonu tamamlandı.");
  } else {
    console.log("Eklenecek veri bulunamadı.");
  }

  const totalBrands = await CarBrand.countDocuments();
  console.log(`- Toplam marka sayısı: ${totalBrands}`);
}

run()
  .catch((err) => {
    console.error("SYNC ERROR:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
  });
