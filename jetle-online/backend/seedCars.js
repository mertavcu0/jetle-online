require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const mongoose = require("mongoose");
const CarBrand = require("./models/CarBrand");

function model(name, fuel, transmission, body, engineVolume, enginePower) {
  return {
    name,
    fuel,
    transmission,
    body,
    engineVolume,
    enginePower,
    engine: engineVolume[0] || "",
    hp: enginePower[0] || ""
  };
}

const brandSeedNames = [
  "Abarth",
  "Acura",
  "Alfa Romeo",
  "Audi",
  "Aston Martin",
  "Bentley",
  "BMW",
  "Bugatti",
  "Buick",
  "Cadillac",
  "Chery",
  "Chevrolet",
  "Chrysler",
  "Cupra",
  "Daewoo",
  "Daihatsu",
  "Dodge",
  "DS Automobiles",
  "Mercedes-Benz",
  "Ferrari",
  "Gaz",
  "GMC",
  "Geely",
  "Genesis",
  "Haval",
  "Holden",
  "Hummer",
  "Infiniti",
  "Isuzu",
  "Iveco",
  "Jaguar",
  "Jeep",
  "JMC",
  "Koenigsegg",
  "Lada",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Lucid",
  "Mahindra",
  "MAN",
  "Maruti Suzuki",
  "Maserati",
  "Maybach",
  "Mazda",
  "McLaren",
  "MG",
  "Mini",
  "Mitsubishi",
  "Morgan",
  "Volkswagen",
  "Oldsmobile",
  "Pagani",
  "Plymouth",
  "Polestar",
  "Pontiac",
  "Porsche",
  "Proton",
  "Ram",
  "Toyota",
  "Renault",
  "Rivian",
  "Rolls-Royce",
  "Rover",
  "Saab",
  "Saturn",
  "Scion",
  "Smart",
  "Subaru",
  "SsangYong",
  "Suzuki",
  "Tata",
  "Tofaş",
  "Togg",
  "UAZ",
  "Vauxhall",
  "Wiesmann",
  "Zastava",
  "Zenvo",
  "Fiat",
  "Ford",
  "Opel",
  "Peugeot",
  "Honda",
  "Hyundai",
  "Kia",
  "Nissan",
  "Citroen",
  "Dacia",
  "Seat",
  "Skoda",
  "Tesla",
  "Volvo"
];

const detailedSeedData = [
  {
    name: "Audi",
    series: [
      { name: "A3", models: [model("1.0 TFSI", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan", "Hatchback"], ["1.0"], ["110 hp"]), model("1.5 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Sportback"], ["1.5"], ["150 hp"])] },
      { name: "A4", models: [model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["190 hp"]), model("2.0 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["204 hp"])] }
    ]
  },
  {
    name: "BMW",
    series: [
      { name: "3 Serisi", models: [model("320i", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["170 hp"]), model("320d", ["Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["190 hp"])] },
      { name: "5 Serisi", models: [model("520i", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["170 hp"]), model("520d", ["Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["190 hp"])] },
      { name: "X Serisi", models: [model("X1 1.5i", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["136 hp"]), model("X3 2.0d", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["190 hp"])] }
    ]
  },
  {
    name: "Mercedes-Benz",
    series: [
      { name: "C Serisi", models: [model("C180", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["156 hp"]), model("C200d", ["Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["160 hp"])] },
      { name: "E Serisi", models: [model("E200", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["197 hp"]), model("E220d", ["Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["194 hp"])] },
      { name: "GLC", models: [model("GLC 200", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["197 hp"]), model("GLC 300d", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["245 hp"])] }
    ]
  },
  {
    name: "Volkswagen",
    series: [
      { name: "Golf", models: [model("1.0 TSI", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.0"], ["110 hp"]), model("1.5 eTSI", ["Benzin", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["150 hp"])] },
      { name: "Passat", models: [model("1.5 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["150 hp"]), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["190 hp"])] },
      { name: "Tiguan", models: [model("1.5 TSI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["200 hp"])] }
    ]
  },
  {
    name: "Toyota",
    series: [
      { name: "Corolla", models: [model("1.5 Vision", ["Benzin"], ["Manuel"], ["Sedan"], ["1.5"], ["125 hp"]), model("1.8 Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.8"], ["140 hp"])] },
      { name: "C-HR", models: [model("1.8 Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.8"], ["140 hp"]), model("2.0 Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"])] },
      { name: "RAV4", models: [model("2.5 Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["218 hp"]), model("2.5 Hybrid 4x4", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["222 hp"])] }
    ]
  },
  {
    name: "Renault",
    series: [
      { name: "Clio", models: [model("1.0 TCe", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["90 hp"]), model("1.5 Blue dCi", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.5"], ["100 hp"])] },
      { name: "Megane", models: [model("1.3 TCe", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.3"], ["140 hp"]), model("1.5 Blue dCi", ["Dizel"], ["Otomatik"], ["Sedan"], ["1.5"], ["115 hp"])] },
      { name: "Captur", models: [model("1.0 TCe", ["Benzin"], ["Manuel"], ["SUV"], ["1.0"], ["90 hp"]), model("1.3 TCe", ["Benzin"], ["Otomatik"], ["SUV"], ["1.3"], ["155 hp"])] }
    ]
  },
  {
    name: "Fiat",
    series: [
      { name: "Egea", models: [model("1.4 Fire", ["Benzin"], ["Manuel"], ["Sedan"], ["1.4"], ["95 hp"]), model("1.6 Multijet", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["130 hp"])] },
      { name: "500", models: [model("1.0 Hybrid", ["Hibrit"], ["Manuel"], ["Hatchback"], ["1.0"], ["70 hp"]), model("1.2 Lounge", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["69 hp"])] }
    ]
  },
  {
    name: "Ford",
    series: [
      { name: "Focus", models: [model("1.0 EcoBoost", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan", "Hatchback"], ["1.0"], ["125 hp"]), model("1.5 TDCi", ["Dizel"], ["Manuel"], ["Sedan"], ["1.5"], ["120 hp"])] },
      { name: "Fiesta", models: [model("1.1 Ti-VCT", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.1"], ["85 hp"]), model("1.0 EcoBoost", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["100 hp"])] },
      { name: "Kuga", models: [model("1.5 EcoBoost", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["182 hp"]), model("2.0 EcoBlue", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["190 hp"])] }
    ]
  },
  {
    name: "Opel",
    series: [
      { name: "Corsa", models: [model("1.2", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["75 hp"]), model("1.2 Turbo", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.2"], ["100 hp"])] },
      { name: "Astra", models: [model("1.2 Turbo", ["Benzin"], ["Otomatik"], ["Hatchback", "Sedan"], ["1.2"], ["130 hp"]), model("1.5 Diesel", ["Dizel"], ["Otomatik"], ["Hatchback"], ["1.5"], ["130 hp"])] },
      { name: "Mokka", models: [model("1.2 Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2"], ["130 hp"]), model("Electric", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["136 hp"])] }
    ]
  },
  {
    name: "Peugeot",
    series: [
      { name: "208", models: [model("1.2 PureTech", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.2"], ["100 hp"]), model("e-208", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["136 hp"])] },
      { name: "308", models: [model("1.2 PureTech", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.2"], ["130 hp"]), model("1.5 BlueHDi", ["Dizel"], ["Otomatik"], ["Hatchback"], ["1.5"], ["130 hp"])] },
      { name: "3008", models: [model("1.6 PureTech", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["180 hp"]), model("1.5 BlueHDi", ["Dizel"], ["Otomatik"], ["SUV"], ["1.5"], ["130 hp"])] }
    ]
  },
  {
    name: "Honda",
    series: [
      { name: "Civic", models: [model("1.5 VTEC Turbo", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["182 hp"]), model("1.6 i-DTEC", ["Dizel"], ["Manuel"], ["Sedan"], ["1.6"], ["120 hp"])] },
      { name: "Jazz", models: [model("1.5 e:HEV", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["109 hp"]), model("1.3 i-VTEC", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.3"], ["102 hp"])] },
      { name: "CR-V", models: [model("1.5 VTEC Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["193 hp"]), model("2.0 e:HEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"])] }
    ]
  },
  {
    name: "Hyundai",
    series: [
      { name: "i20", models: [model("1.2 MPI", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["84 hp"]), model("1.0 T-GDI", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.0"], ["100 hp"])] },
      { name: "i30", models: [model("1.5 DPI", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.5"], ["110 hp"]), model("1.6 CRDi", ["Dizel"], ["Otomatik"], ["Hatchback"], ["1.6"], ["136 hp"])] },
      { name: "Tucson", models: [model("1.6 T-GDI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["180 hp"]), model("1.6 CRDi", ["Dizel"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp"])] }
    ]
  },
  {
    name: "Kia",
    series: [
      { name: "Rio", models: [model("1.25 MPI", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.25"], ["84 hp"]), model("1.4 MPI", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.4"], ["100 hp"])] },
      { name: "Ceed", models: [model("1.5 T-GDI", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.5"], ["160 hp"]), model("1.6 CRDi", ["Dizel"], ["Otomatik"], ["Hatchback"], ["1.6"], ["136 hp"])] },
      { name: "Sportage", models: [model("1.6 T-GDI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["180 hp"]), model("1.6 CRDi", ["Dizel"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp"])] }
    ]
  },
  {
    name: "Nissan",
    series: [
      { name: "Micra", models: [model("1.0 IG-T", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["100 hp"]), model("1.5 dCi", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.5"], ["90 hp"])] },
      { name: "Qashqai", models: [model("1.3 DIG-T", ["Benzin"], ["Otomatik"], ["SUV"], ["1.3"], ["158 hp"]), model("1.5 dCi", ["Dizel"], ["Manuel"], ["SUV"], ["1.5"], ["115 hp"])] },
      { name: "X-Trail", models: [model("1.5 e-Power", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["213 hp"]), model("1.7 dCi", ["Dizel"], ["Otomatik"], ["SUV"], ["1.7"], ["150 hp"])] }
    ]
  },
  {
    name: "Citroen",
    series: [
      { name: "C3", models: [model("1.2 PureTech", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["83 hp"]), model("1.5 BlueHDi", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.5"], ["102 hp"])] },
      { name: "C4", models: [model("1.2 PureTech", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.2"], ["130 hp"]), model("e-C4", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["136 hp"])] },
      { name: "C5 Aircross", models: [model("1.6 PureTech", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["180 hp"]), model("1.5 BlueHDi", ["Dizel"], ["Otomatik"], ["SUV"], ["1.5"], ["130 hp"])] }
    ]
  },
  {
    name: "Dacia",
    series: [
      { name: "Sandero", models: [model("1.0 Sce", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["65 hp"]), model("1.0 ECO-G", ["Benzin", "LPG"], ["Manuel"], ["Hatchback"], ["1.0"], ["100 hp"])] },
      { name: "Duster", models: [model("1.3 TCe", ["Benzin"], ["Otomatik"], ["SUV"], ["1.3"], ["150 hp"]), model("1.5 Blue dCi", ["Dizel"], ["Manuel"], ["SUV"], ["1.5"], ["115 hp"])] },
      { name: "Jogger", models: [model("1.0 ECO-G", ["Benzin", "LPG"], ["Manuel"], ["Station Wagon"], ["1.0"], ["100 hp"]), model("Hybrid 140", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.6"], ["140 hp"])] }
    ]
  },
  {
    name: "Seat",
    series: [
      { name: "Ibiza", models: [model("1.0 MPI", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["80 hp"]), model("1.0 TSI", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.0"], ["110 hp"])] },
      { name: "Leon", models: [model("1.5 eTSI", ["Benzin", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["150 hp"]), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Hatchback"], ["2.0"], ["150 hp"])] },
      { name: "Ateca", models: [model("1.5 TSI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["150 hp"])] }
    ]
  },
  {
    name: "Skoda",
    series: [
      { name: "Fabia", models: [model("1.0 MPI", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["80 hp"]), model("1.0 TSI", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.0"], ["110 hp"])] },
      { name: "Octavia", models: [model("1.5 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["150 hp"]), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["150 hp"])] },
      { name: "Kodiaq", models: [model("1.5 TSI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["200 hp"])] }
    ]
  },
  {
    name: "Tesla",
    series: [
      { name: "Model 3", models: [model("Standard Range", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["283 hp"]), model("Long Range", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["498 hp"])] },
      { name: "Model Y", models: [model("Long Range", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["514 hp"]), model("Performance", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["534 hp"])] }
    ]
  }
];

const seedData = brandSeedNames.map((brandName) => {
  const detailedBrand = detailedSeedData.find((item) => item.name === brandName);
  return detailedBrand || { name: brandName, series: [] };
});

function countPlan(brands) {
  let series = 0;
  let models = 0;
  brands.forEach((brand) => {
    series += brand.series.length;
    brand.series.forEach((item) => {
      models += item.models.length;
    });
  });
  return { brands: brands.length, series, models };
}

async function buildDiff() {
  const existingBrands = await CarBrand.find({}, { name: 1, series: 1 }).lean();
  const existingMap = new Map(existingBrands.map((brand) => [brand.name, brand]));
  const additions = [];
  const summary = { brands: 0, series: 0, models: 0 };

  for (const brand of seedData) {
    const existingBrand = existingMap.get(brand.name);
    const brandAdd = { name: brand.name, series: [] };

    if (!existingBrand) {
      brandAdd.series = brand.series;
      summary.brands += 1;
      summary.series += brand.series.length;
      brand.series.forEach((series) => {
        summary.models += series.models.length;
      });
      additions.push(brandAdd);
      continue;
    }

    const existingSeriesMap = new Map((existingBrand.series || []).map((series) => [series.name, series]));

    for (const series of brand.series) {
      const existingSeries = existingSeriesMap.get(series.name);
      if (!existingSeries) {
        brandAdd.series.push(series);
        summary.series += 1;
        summary.models += series.models.length;
        continue;
      }

      const existingModelNames = new Set((existingSeries.models || []).map((item) => item.name));
      const missingModels = series.models.filter((item) => !existingModelNames.has(item.name));

      if (missingModels.length) {
        brandAdd.series.push({ name: series.name, models: missingModels });
        summary.models += missingModels.length;
      }
    }

    if (brandAdd.series.length) {
      additions.push(brandAdd);
    }
  }

  return { additions, summary };
}

async function applyDiff(additions) {
  for (const brandAdd of additions) {
    let brand = await CarBrand.findOne({ name: brandAdd.name });

    if (!brand) {
      brand = await CarBrand.create({
        name: brandAdd.name,
        series: brandAdd.series
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
      seriesAdd.models.forEach((item) => {
        if (!existingModelNames.has(item.name)) {
          series.models.push(item);
        }
      });
    }

    await brand.save();
  }
}

async function run() {
  const plan = countPlan(seedData);
  console.log("Seed kapsamÄ±:");
  console.log(`- Marka: ${plan.brands}`);
  console.log(`- Seri: ${plan.series}`);
  console.log(`- Model: ${plan.models}`);
  console.log("");

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI bulunamadÄ±");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const { additions, summary } = await buildDiff();

  console.log("Dry-run sonucu:");
  console.log(`- Yeni marka: ${summary.brands}`);
  console.log(`- Yeni seri: ${summary.series}`);
  console.log(`- Yeni model: ${summary.models}`);

  if (!summary.brands && !summary.series && !summary.models) {
    console.log("Eklenecek yeni araÃ§ verisi yok.");
    await mongoose.disconnect();
    return;
  }

  await applyDiff(additions);
  console.log("Seed tamamlandÄ±.");

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("SEED CARS ERROR:", err.message);
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
