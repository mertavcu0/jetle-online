require("dotenv").config();

const mongoose = require("mongoose");
const CarBrand = require("../models/CarBrand");

function model(name, fuel = ["Benzin"], transmission = ["Otomatik"], body = ["Sedan"], engine = "1.6", hp = "120hp") {
  return { name, fuel, transmission, body, engine, hp };
}

const data = [
  {
    name: "BMW",
    series: [
      { name: "1 Serisi", models: [model("116i", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.6", "136hp"), model("118i", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "140hp"), model("120i", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "178hp"), model("120d", ["Dizel"], ["Otomatik"], ["Hatchback"], "2.0", "190hp"), model("125i", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "224hp")] },
      { name: "3 Serisi", models: [model("316i", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "136hp"), model("318i", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "156hp"), model("320i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("320d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("330i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "258hp"), model("335i", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "306hp")] },
      { name: "5 Serisi", models: [model("520i", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "170hp"), model("520d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("525d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "218hp"), model("530i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "252hp"), model("540i", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "340hp")] },
      { name: "7 Serisi", models: [model("730d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "265hp"), model("740i", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "326hp"), model("750i", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "450hp"), model("745e", ["Hybrid"], ["Otomatik"], ["Sedan"], "3.0", "394hp"), model("760Li", ["Benzin"], ["Otomatik"], ["Sedan"], "6.6", "610hp")] },
      { name: "X Serisi", models: [model("X1", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("X3", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "2.0", "190hp"), model("X5", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "286hp"), model("X6", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "340hp"), model("X7", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "352hp")] }
    ]
  },
  {
    name: "Mercedes-Benz",
    series: [
      { name: "A Serisi", models: [model("A180", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.3", "136hp"), model("A200", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.3", "163hp"), model("A220", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "190hp"), model("A250", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "224hp"), model("A35 AMG", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "306hp")] },
      { name: "C Serisi", models: [model("C180", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "156hp"), model("C200", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "184hp"), model("C220d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "194hp"), model("C300", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "258hp"), model("C43 AMG", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "390hp")] },
      { name: "E Serisi", models: [model("E180", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "156hp"), model("E200", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "184hp"), model("E220d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "194hp"), model("E300", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "258hp"), model("E350", ["Hybrid"], ["Otomatik"], ["Sedan"], "2.0", "320hp")] },
      { name: "GLA", models: [model("GLA180", ["Benzin"], ["Otomatik"], ["SUV"], "1.3", "136hp"), model("GLA200", ["Benzin"], ["Otomatik"], ["SUV"], "1.3", "163hp"), model("GLA220d", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "190hp"), model("GLA250", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "224hp"), model("GLA45 AMG", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "421hp")] },
      { name: "GLC", models: [model("GLC200", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "197hp"), model("GLC220d", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "194hp"), model("GLC300", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "258hp"), model("GLC350e", ["Hybrid"], ["Otomatik"], ["SUV"], "2.0", "320hp"), model("GLC43 AMG", ["Benzin"], ["Otomatik"], ["SUV"], "3.0", "390hp")] }
    ]
  },
  {
    name: "Audi",
    series: [
      { name: "A1", models: [model("25 TFSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.0", "95hp"), model("30 TFSI", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.0", "110hp"), model("35 TFSI", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "150hp"), model("1.6 TDI", ["Dizel"], ["Manuel"], ["Hatchback"], "1.6", "116hp"), model("S Line", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "150hp")] },
      { name: "A3", models: [model("30 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Hatchback"], "1.0", "110hp"), model("35 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Hatchback"], "1.5", "150hp"), model("40 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("35 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("S3", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "310hp")] },
      { name: "A4", models: [model("35 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("40 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("45 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "245hp"), model("35 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "163hp"), model("40 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "204hp")] },
      { name: "Q Serisi", models: [model("Q2", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("Q3", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("Q5", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "2.0", "204hp"), model("Q7", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "286hp"), model("Q8", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "340hp")] },
      { name: "RS", models: [model("RS3", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "400hp"), model("RS4", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.9", "450hp"), model("RS5", ["Benzin"], ["Otomatik"], ["Coupe"], "2.9", "450hp"), model("RS6", ["Benzin"], ["Otomatik"], ["Station Wagon"], "4.0", "600hp"), model("RS Q8", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "600hp")] }
    ]
  },
  {
    name: "Volkswagen",
    series: [
      { name: "Golf", models: [model("1.0 TSI", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "110hp"), model("1.5 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.5", "150hp"), model("1.6 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], "1.6", "115hp"), model("2.0 GTI", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "245hp"), model("R", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "320hp")] },
      { name: "Passat", models: [model("1.4 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], "1.4", "150hp"), model("1.5 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "150hp"), model("1.6 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "1.6", "120hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("2.0 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "280hp")] },
      { name: "Polo", models: [model("1.0 MPI", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "80hp"), model("1.0 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.0", "95hp"), model("1.2 TSI", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "90hp"), model("1.4 TDI", ["Dizel"], ["Manuel"], ["Hatchback"], "1.4", "90hp"), model("GTI", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "207hp")] },
      { name: "Tiguan", models: [model("1.4 TSI", ["Benzin"], ["Otomatik"], ["SUV"], "1.4", "150hp"), model("1.5 TSI", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("2.0 TSI", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "220hp"), model("1.6 TDI", ["Dizel"], ["Manuel"], ["SUV"], "1.6", "115hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "150hp")] },
      { name: "Arteon", models: [model("1.5 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "150hp"), model("2.0 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "280hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "200hp"), model("R-Line", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("Shooting Brake", ["Benzin", "Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "200hp")] }
    ]
  }
];

const extraCatalog = [
  { name: "Toyota", series: { Corolla: ["1.4 D-4D", "1.6", "1.8 Hybrid", "2.0 Hybrid", "Cross"], Yaris: ["1.0", "1.3", "1.5", "1.5 Hybrid", "GR"], Camry: ["2.0", "2.4", "2.5", "2.5 Hybrid", "3.5 V6"], RAV4: ["2.0", "2.2 D-4D", "2.5 Hybrid", "Prime", "Adventure"], "C-HR": ["1.2 Turbo", "1.8 Hybrid", "2.0 Hybrid", "Dynamic", "Passion"] } },
  { name: "Honda", series: { Civic: ["1.4", "1.5 Turbo", "1.6", "1.6 i-DTEC", "Type R"], Accord: ["1.5 Turbo", "2.0", "2.0 Hybrid", "2.4", "3.5 V6"], "CR-V": ["1.5 Turbo", "1.6 i-DTEC", "2.0", "2.0 Hybrid", "2.4"], "HR-V": ["1.5", "1.5 Turbo", "1.6 i-DTEC", "e:HEV", "Sport"], Jazz: ["1.2", "1.3", "1.4", "1.5", "Hybrid"] } },
  { name: "Ford", series: { Fiesta: ["1.0 EcoBoost", "1.25", "1.4", "1.5 TDCi", "ST"], Focus: ["1.0 EcoBoost", "1.5 EcoBoost", "1.5 TDCi", "1.6 TDCi", "ST"], Mondeo: ["1.5 EcoBoost", "1.6 TDCi", "2.0 TDCi", "2.0 Hybrid", "2.0 EcoBoost"], Kuga: ["1.5 EcoBoost", "1.5 TDCi", "2.0 TDCi", "2.5 Hybrid", "PHEV"], Puma: ["1.0 EcoBoost", "1.0 Hybrid", "ST-Line", "ST", "Titanium"] } },
  { name: "Renault", series: { Clio: ["0.9 TCe", "1.0 TCe", "1.2", "1.5 dCi", "E-Tech"], Megane: ["1.2 TCe", "1.3 TCe", "1.5 dCi", "1.6 dCi", "RS"], Symbol: ["0.9 TCe", "1.2", "1.4", "1.5 dCi", "Joy"], Talisman: ["1.3 TCe", "1.5 dCi", "1.6 dCi", "1.8 TCe", "Initiale"], Captur: ["0.9 TCe", "1.0 TCe", "1.3 TCe", "1.5 dCi", "E-Tech"] } },
  { name: "Hyundai", series: { i10: ["1.0", "1.0 MPI", "1.2", "1.2 MPI", "Style"], i20: ["1.0 T-GDI", "1.2 MPI", "1.4 MPI", "1.4 CRDi", "N Line"], i30: ["1.0 T-GDI", "1.4 MPI", "1.4 T-GDI", "1.6 CRDi", "N"], Elantra: ["1.6 MPI", "1.6 GDI", "1.6 T-GDI", "2.0", "Hybrid"], Tucson: ["1.6 GDI", "1.6 T-GDI", "1.6 CRDi", "2.0 CRDi", "Hybrid"] } },
  { name: "Peugeot", series: { "208": ["1.2 PureTech", "1.4 HDi", "1.5 BlueHDi", "GT", "e-208"], "308": ["1.2 PureTech", "1.5 BlueHDi", "1.6 THP", "GT", "Hybrid"], "3008": ["1.2 PureTech", "1.5 BlueHDi", "1.6 THP", "GT", "Hybrid4"], "5008": ["1.2 PureTech", "1.5 BlueHDi", "1.6 THP", "GT", "Allure"], "508": ["1.5 BlueHDi", "1.6 PureTech", "GT", "PSE", "Hybrid"] } },
  { name: "Opel", series: { Corsa: ["1.0", "1.2", "1.2 Turbo", "1.3 CDTI", "e-Corsa"], Astra: ["1.2 Turbo", "1.4 Turbo", "1.5 Diesel", "1.6 CDTI", "GTC"], Insignia: ["1.5 Turbo", "1.6 CDTI", "2.0 CDTI", "2.0 Turbo", "GSi"], Mokka: ["1.2 Turbo", "1.4 Turbo", "1.6 CDTI", "Mokka-e", "GS Line"], Crossland: ["1.2", "1.2 Turbo", "1.5 Diesel", "Elegance", "Ultimate"] } },
  { name: "Fiat", series: { Egea: ["1.4 Fire", "1.3 Multijet", "1.6 Multijet", "1.5 Hybrid", "Cross"], Linea: ["1.3 Multijet", "1.4 Fire", "1.4 T-Jet", "1.6 Multijet", "Urban"], Punto: ["1.2", "1.3 Multijet", "1.4", "1.4 Fire", "Evo"], "500": ["1.0 Hybrid", "1.2", "1.3 Multijet", "Abarth", "500e"], Doblo: ["1.3 Multijet", "1.6 Multijet", "2.0 Multijet", "Cargo", "Panorama"] } },
  { name: "Nissan", series: { Micra: ["1.0", "1.2", "1.5 dCi", "IG-T", "Tekna"], Juke: ["1.0 DIG-T", "1.2 DIG-T", "1.5 dCi", "1.6", "Hybrid"], Qashqai: ["1.2 DIG-T", "1.3 DIG-T", "1.5 dCi", "1.6 dCi", "e-Power"], "X-Trail": ["1.6 dCi", "1.7 dCi", "2.0 dCi", "e-Power", "Tekna"], Navara: ["2.3 dCi", "2.5 dCi", "4x2", "4x4", "Platinum"] } },
  { name: "Kia", series: { Rio: ["1.0 T-GDI", "1.2", "1.4", "1.4 CRDi", "GT-Line"], Ceed: ["1.0 T-GDI", "1.4 T-GDI", "1.5 T-GDI", "1.6 CRDi", "GT"], Sportage: ["1.6 GDI", "1.6 T-GDI", "1.6 CRDi", "2.0 CRDi", "Hybrid"], Stonic: ["1.0 T-GDI", "1.2", "1.4", "MHEV", "GT-Line"], Sorento: ["2.2 CRDi", "2.5 T-GDI", "Hybrid", "PHEV", "Prestige"] } },
  { name: "Skoda", series: { Fabia: ["1.0 MPI", "1.0 TSI", "1.2 TSI", "1.4 TDI", "Monte Carlo"], Octavia: ["1.0 TSI", "1.4 TSI", "1.5 TSI", "1.6 TDI", "RS"], Superb: ["1.5 TSI", "1.6 TDI", "2.0 TDI", "2.0 TSI", "L&K"], Karoq: ["1.0 TSI", "1.5 TSI", "1.6 TDI", "2.0 TDI", "Sportline"], Kodiaq: ["1.5 TSI", "2.0 TDI", "2.0 TSI", "Scout", "RS"] } },
  { name: "Volvo", series: { S60: ["T3", "T4", "T5", "B4", "Recharge"], S90: ["D4", "D5", "T5", "B5", "Recharge"], V40: ["T2", "T3", "T4", "D2", "D3"], XC40: ["T3", "T4", "T5", "B4", "Recharge"], XC60: ["D4", "D5", "T5", "B5", "Recharge"] } },
  { name: "Tesla", series: { "Model 3": ["Standard Range", "Rear-Wheel Drive", "Long Range", "Performance", "Highland"], "Model S": ["60", "75D", "90D", "Long Range", "Plaid"], "Model X": ["75D", "90D", "100D", "Long Range", "Plaid"], "Model Y": ["Standard Range", "Rear-Wheel Drive", "Long Range", "Performance", "Juniper"], Cybertruck: ["Rear-Wheel Drive", "All-Wheel Drive", "Cyberbeast", "Foundation", "Long Range"] } },
  { name: "Dacia", series: { Sandero: ["1.0", "1.0 TCe", "1.5 dCi", "Stepway", "Essential"], Duster: ["1.0 TCe", "1.3 TCe", "1.5 dCi", "4x2", "4x4"], Logan: ["1.0", "1.2", "1.5 dCi", "MCV", "Stepway"], Jogger: ["1.0 TCe", "Hybrid", "Extreme", "Expression", "Essential"], Spring: ["Electric 45", "Electric 65", "Comfort", "Extreme", "Business"] } },
  { name: "Seat", series: { Ibiza: ["1.0 MPI", "1.0 TSI", "1.2 TSI", "1.4 TDI", "FR"], Leon: ["1.0 TSI", "1.4 TSI", "1.5 TSI", "1.6 TDI", "FR"], Ateca: ["1.0 TSI", "1.4 TSI", "1.5 TSI", "1.6 TDI", "2.0 TDI"], Arona: ["1.0 TSI", "1.5 TSI", "1.6 TDI", "Xcellence", "FR"], Tarraco: ["1.5 TSI", "2.0 TSI", "2.0 TDI", "Xcellence", "FR"] } },
  { name: "Citroen", series: { C3: ["1.2 PureTech", "1.4 HDi", "1.5 BlueHDi", "Feel", "Shine"], C4: ["1.2 PureTech", "1.5 BlueHDi", "1.6 HDi", "Cactus", "e-C4"], "C5 Aircross": ["1.2 PureTech", "1.5 BlueHDi", "1.6 PureTech", "Hybrid", "Shine"], Berlingo: ["1.5 BlueHDi", "1.6 HDi", "Feel", "Shine", "Van"], Ami: ["Electric", "Cargo", "Pop", "Tonic", "My Ami"] } }
];

extraCatalog.forEach((brandConfig) => {
  data.push({
    name: brandConfig.name,
    series: Object.entries(brandConfig.series).map(([seriesName, modelNames]) => ({
      name: seriesName,
      models: modelNames.map((modelName, modelIndex) => {
        const modelNo = modelIndex + 1;
        const isSuv = seriesName === "SUV" || seriesName === "Crossover";
        const isElectric = brandConfig.name === "Tesla" || /electric|e-|ami/i.test(modelName);
        return model(
          modelName,
          isElectric ? ["Elektrik"] : modelNo % 2 === 0 ? ["Dizel"] : ["Benzin"],
          ["Otomatik"],
          [isSuv || /SUV|C-HR|RAV4|Tucson|Sportage|Qashqai|Duster|Ateca|Arona|Tarraco|Karoq|Kodiaq|XC|CR-V|HR-V|3008|5008|Mokka|Crossland|Juke|X-Trail|Sorento/i.test(seriesName) ? "SUV" : /Yaris|i10|i20|i30|Corsa|Punto|500|Micra|Rio|Fabia|V40|Sandero|Ibiza|Leon|C3|C4/i.test(seriesName) ? "Hatchback" : "Sedan"],
          isElectric ? "Elektrik" : modelNo % 2 === 0 ? "1.6" : "1.5",
          isElectric ? `${220 + modelIndex * 30}hp` : `${110 + modelIndex * 15}hp`
        );
      })
    }))
  });
});
