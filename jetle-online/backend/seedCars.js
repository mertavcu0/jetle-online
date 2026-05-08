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
  "BYD",
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
  "Eagle",
  "Mercedes-Benz",
  "Ferrari",
  "Gaz",
  "GMC",
  "Geely",
  "Genesis",
  "Haval",
  "Holden",
  "Hummer",
  "IKCO",
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
  "Leapmotor",
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
  "Regal Raptor",
  "Relive",
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
    name: "Alfa Romeo",
    series: [
      { name: "Giulietta", models: [
        model("1.4 TB", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4"], ["120 hp", "170 hp"]),
        model("1.6 JTDm", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6"], ["105 hp", "120 hp"]),
        model("2.0 JTDm", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["2.0"], ["150 hp", "170 hp"]),
        model("Progression", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "1.6"], ["120 hp"]),
        model("Distinctive", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "1.6", "2.0"], ["120 hp", "170 hp"]),
        model("Sportiva", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "2.0"], ["170 hp"])
      ] },
      { name: "Giulia", models: [
        model("2.0 Turbo", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["200 hp", "280 hp"]),
        model("2.2 JTD", ["Dizel"], ["Otomatik"], ["Sedan"], ["2.2"], ["160 hp", "210 hp"]),
        model("Q4", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0", "2.2"], ["210 hp", "280 hp"]),
        model("Veloce", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0", "2.2"], ["210 hp", "280 hp"]),
        model("Estrema", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["280 hp"]),
        model("Competizione", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0", "2.2"], ["210 hp", "280 hp"])
      ] },
      { name: "Mito", models: [
        model("0.9 TwinAir", ["Benzin"], ["Manuel"], ["Hatchback"], ["0.9"], ["85 hp", "105 hp"]),
        model("1.3 JTDm", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.3"], ["95 hp"]),
        model("1.4 T-Jet", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4"], ["120 hp", "155 hp"]),
        model("1.4 MultiAir", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4"], ["135 hp", "170 hp"]),
        model("Quadrifoglio Verde", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4"], ["170 hp"])
      ] },
      { name: "159", models: [
        model("1.9 JTS", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon"], ["1.9"], ["160 hp"]),
        model("1.9 JTDm", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.9"], ["120 hp", "150 hp"]),
        model("2.0 JTDm", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["170 hp"]),
        model("2.4 JTDm", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["2.4"], ["200 hp"]),
        model("3.2 JTS", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["3.2"], ["260 hp"]),
        model("Sedan", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.9", "2.4", "3.2"], ["120 hp", "260 hp"]),
        model("Sportwagon", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.9", "2.4", "3.2"], ["120 hp", "260 hp"])
      ] },
      { name: "156", models: [
        model("1.6 TS", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon"], ["1.6"], ["120 hp"]),
        model("2.0 TS", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon"], ["2.0"], ["150 hp"]),
        model("2.5 V6", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon"], ["2.5"], ["190 hp"]),
        model("GTA", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon"], ["3.2"], ["250 hp"]),
        model("Sedan", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6", "2.0", "2.5"], ["120 hp", "190 hp"]),
        model("Sportwagon", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.6", "2.0", "2.5"], ["120 hp", "190 hp"])
      ] },
      { name: "147", models: [
        model("1.6 TS", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.6"], ["120 hp"]),
        model("2.0 TS", ["Benzin"], ["Manuel"], ["Hatchback"], ["2.0"], ["150 hp"]),
        model("1.9 JTDm", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.9"], ["120 hp", "150 hp"]),
        model("GTA", ["Benzin"], ["Manuel"], ["Hatchback"], ["3.2"], ["250 hp"])
      ] },
      { name: "Tonale", models: [
        model("1.3 Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3"], ["190 hp", "280 hp"]),
        model("1.5 Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["130 hp", "160 hp"]),
        model("1.6 JTD", ["Dizel"], ["Otomatik"], ["SUV"], ["1.6"], ["130 hp"]),
        model("Q4", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3"], ["280 hp"]),
        model("Ti", ["Hibrit", "Dizel"], ["Otomatik"], ["SUV"], ["1.3", "1.5", "1.6"], ["130 hp", "280 hp"]),
        model("Veloce", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3", "1.5"], ["160 hp", "280 hp"]),
        model("Edizione Speciale", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["160 hp"])
      ] },
      { name: "Stelvio", models: [
        model("2.0 Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["200 hp", "280 hp"]),
        model("2.2 JTD", ["Dizel"], ["Otomatik"], ["SUV"], ["2.2"], ["160 hp", "210 hp"]),
        model("Q4", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0", "2.2"], ["210 hp", "280 hp"]),
        model("Veloce", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0", "2.2"], ["210 hp", "280 hp"]),
        model("Competizione", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0", "2.2"], ["210 hp", "280 hp"]),
        model("Estrema", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["280 hp"])
      ] },
      { name: "Junior Milano", models: [
        model("Elettrica", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["156 hp", "240 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["156 hp", "240 hp"]),
        model("Ibrida", ["Hibrit"], ["Otomatik"], ["Crossover"], ["1.2"], ["136 hp"]),
        model("Hibrit", ["Hibrit"], ["Otomatik"], ["Crossover"], ["1.2"], ["136 hp"])
      ] },
      { name: "Giulia Quadrifoglio", models: [
        model("2.9 V6 Bi-Turbo", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan"], ["2.9"], ["510 hp"])
      ] },
      { name: "Stelvio Quadrifoglio", models: [
        model("2.9 V6 Bi-Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["2.9"], ["510 hp"])
      ] },
      { name: "4C", models: [
        model("1.750 TBi", ["Benzin"], ["Otomatik"], ["Coupe", "Spider"], ["1.75"], ["240 hp"]),
        model("Coupé", ["Benzin"], ["Otomatik"], ["Coupe"], ["1.75"], ["240 hp"]),
        model("Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["1.75"], ["240 hp"])
      ] },
      { name: "8C Competizione", models: [
        model("4.7 V8", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["4.7"], ["450 hp"]),
        model("Coupé", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.7"], ["450 hp"]),
        model("Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.7"], ["450 hp"])
      ] },
      { name: "GT", models: [
        model("1.9 JTD", ["Dizel"], ["Manuel"], ["Coupe"], ["1.9"], ["150 hp"]),
        model("2.0 JTS", ["Benzin"], ["Manuel"], ["Coupe"], ["2.0"], ["165 hp"]),
        model("3.2 V6", ["Benzin"], ["Manuel"], ["Coupe"], ["3.2"], ["240 hp"])
      ] },
      { name: "Brera", models: [
        model("2.2 JTS", ["Benzin"], ["Manuel"], ["Coupe"], ["2.2"], ["185 hp"]),
        model("2.4 JTDm", ["Dizel"], ["Manuel", "Otomatik"], ["Coupe"], ["2.4"], ["200 hp"]),
        model("3.2 JTS", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.2"], ["260 hp"]),
        model("Coupé", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Coupe"], ["2.2", "2.4", "3.2"], ["185 hp", "260 hp"])
      ] },
      { name: "Spider", models: [
        model("2.2 JTS", ["Benzin"], ["Manuel"], ["Roadster"], ["2.2"], ["185 hp"]),
        model("2.4 JTDm", ["Dizel"], ["Manuel", "Otomatik"], ["Roadster"], ["2.4"], ["200 hp"]),
        model("3.2 JTS", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["3.2"], ["260 hp"]),
        model("Roadster", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Roadster"], ["2.2", "2.4", "3.2"], ["185 hp", "260 hp"])
      ] },
      { name: "33 Stradale", models: [
        model("Sınırlı Üretim", ["Benzin", "Elektrik"], ["Otomatik"], ["Coupe"], ["3.0", "0"], ["620 hp", "750 hp"])
      ] },
      { name: "145 / 146", models: [
        model("145", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4", "1.6", "2.0"], ["90 hp", "150 hp"]),
        model("146", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4", "1.6", "2.0"], ["90 hp", "150 hp"])
      ] },
      { name: "164 / 166", models: [
        model("164", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0", "3.0"], ["144 hp", "232 hp"]),
        model("166", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0", "3.0"], ["150 hp", "226 hp"])
      ] },
      { name: "GTV", models: [
        model("GTV", ["Benzin"], ["Manuel"], ["Coupe"], ["2.0", "3.0"], ["150 hp", "220 hp"])
      ] },
      { name: "75 / 33", models: [
        model("75", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6", "1.8", "2.0", "3.0"], ["110 hp", "192 hp"]),
        model("33", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.3", "1.5", "1.7"], ["90 hp", "137 hp"])
      ] }
    ]
  },
  {
    name: "Audi",
    series: [
      { name: "A1", models: [
        model("Sportback", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.0", "1.5"], ["95 hp", "150 hp"]),
        model("Citycarver", ["Benzin"], ["Otomatik"], ["Crossover"], ["1.0", "1.5"], ["110 hp", "150 hp"]),
        model("30 TFSI", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.0"], ["110 hp"]),
        model("35 TFSI", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.5"], ["150 hp"])
      ] },
      { name: "A3", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Otomatik", "Manuel"], ["Sedan"], ["1.0", "1.5", "2.0"], ["110 hp", "150 hp", "190 hp"]),
        model("Sportback", ["Benzin", "Dizel"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.0", "1.5", "2.0"], ["110 hp", "150 hp", "190 hp"]),
        model("30 TFSI", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan", "Sportback"], ["1.0"], ["110 hp"]),
        model("35 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Sportback"], ["1.5"], ["150 hp"]),
        model("30 TDI", ["Dizel"], ["Otomatik", "Manuel"], ["Sedan", "Sportback"], ["2.0"], ["116 hp"]),
        model("35 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Sportback"], ["2.0"], ["150 hp"]),
        model("40 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Sportback"], ["2.0"], ["190 hp"])
      ] },
      { name: "A4", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["150 hp", "204 hp"]),
        model("Avant", ["Benzin", "Dizel"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["150 hp", "204 hp"]),
        model("Allroad", ["Dizel"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["204 hp"]),
        model("30 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Avant"], ["2.0"], ["136 hp"]),
        model("35 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Avant"], ["2.0"], ["150 hp"]),
        model("40 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Avant", "Allroad"], ["2.0"], ["204 hp"]),
        model("45 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Avant"], ["2.0"], ["265 hp"]),
        model("Quattro", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan", "Avant", "Allroad"], ["2.0", "3.0"], ["204 hp", "265 hp"])
      ] },
      { name: "A5", models: [
        model("Coupé", ["Benzin", "Dizel"], ["Otomatik"], ["Coupe"], ["2.0"], ["150 hp", "265 hp"]),
        model("Sportback", ["Benzin", "Dizel"], ["Otomatik"], ["Liftback"], ["2.0"], ["150 hp", "265 hp"]),
        model("Cabrio", ["Benzin"], ["Otomatik"], ["Cabrio"], ["2.0"], ["265 hp"]),
        model("35 TFSI", ["Benzin"], ["Otomatik"], ["Coupé", "Sportback"], ["2.0"], ["150 hp"]),
        model("40 TDI", ["Dizel"], ["Otomatik"], ["Coupé", "Sportback"], ["2.0"], ["204 hp"]),
        model("45 TFSI", ["Benzin"], ["Otomatik"], ["Coupé", "Sportback", "Cabrio"], ["2.0"], ["265 hp"]),
        model("Quattro", ["Benzin", "Dizel"], ["Otomatik"], ["Coupé", "Sportback", "Cabrio"], ["2.0", "3.0"], ["204 hp", "265 hp"])
      ] },
      { name: "A6", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0", "3.0"], ["204 hp", "340 hp"]),
        model("Avant", ["Benzin", "Dizel"], ["Otomatik"], ["Station Wagon"], ["2.0", "3.0"], ["204 hp", "340 hp"]),
        model("Allroad", ["Dizel"], ["Otomatik"], ["Station Wagon"], ["3.0"], ["286 hp"]),
        model("40 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Avant"], ["2.0"], ["204 hp"]),
        model("45 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Avant"], ["2.0"], ["265 hp"]),
        model("50 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Avant", "Allroad"], ["3.0"], ["286 hp"]),
        model("55 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Avant"], ["3.0"], ["340 hp"])
      ] },
      { name: "A7", models: [
        model("Sportback", ["Benzin", "Dizel"], ["Otomatik"], ["Liftback"], ["2.0", "3.0"], ["204 hp", "340 hp"]),
        model("40 TDI", ["Dizel"], ["Otomatik"], ["Liftback"], ["2.0"], ["204 hp"]),
        model("45 TFSI", ["Benzin"], ["Otomatik"], ["Liftback"], ["2.0"], ["265 hp"]),
        model("50 TDI", ["Dizel"], ["Otomatik"], ["Liftback"], ["3.0"], ["286 hp"]),
        model("55 TFSI", ["Benzin"], ["Otomatik"], ["Liftback"], ["3.0"], ["340 hp"])
      ] },
      { name: "A8", models: [
        model("L Long", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["3.0", "4.0"], ["286 hp", "460 hp"]),
        model("TFSIe", ["Hibrit"], ["Otomatik"], ["Sedan"], ["3.0"], ["462 hp"]),
        model("50 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], ["3.0"], ["286 hp"]),
        model("55 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["340 hp"]),
        model("60 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.0"], ["460 hp"])
      ] },
      { name: "Q2", models: [
        model("30 TFSI", ["Benzin"], ["Otomatik", "Manuel"], ["SUV"], ["1.0"], ["110 hp"]),
        model("35 TFSI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]),
        model("30 TDI", ["Dizel"], ["Otomatik", "Manuel"], ["SUV"], ["2.0"], ["116 hp"])
      ] },
      { name: "Q3", models: [
        model("Sportback", ["Benzin", "Dizel"], ["Otomatik"], ["SUV Coupe"], ["1.5", "2.0"], ["150 hp", "245 hp"]),
        model("TFSI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["150 hp", "190 hp"]),
        model("TDI", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["150 hp", "200 hp"]),
        model("35 TFSI", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["1.5"], ["150 hp"]),
        model("40 TFSI", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["190 hp"]),
        model("45 TFSI", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["245 hp"])
      ] },
      { name: "Q4 e-tron", models: [
        model("35", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["170 hp"]),
        model("40", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"]),
        model("45", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["265 hp"]),
        model("50", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["299 hp"]),
        model("55", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"])
      ] },
      { name: "Q5", models: [
        model("Sportback", ["Benzin", "Dizel"], ["Otomatik"], ["SUV Coupe"], ["2.0"], ["204 hp", "265 hp"]),
        model("FY", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["204 hp", "265 hp"]),
        model("TDI", ["Dizel"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["204 hp"]),
        model("TFSI", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["265 hp"]),
        model("40 TDI", ["Dizel"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["204 hp"]),
        model("45 TFSI", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["265 hp"])
      ] },
      { name: "Q6 e-tron", models: [
        model("Quattro", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["387 hp"]),
        model("SQ6", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["490 hp"])
      ] },
      { name: "Q7", models: [
        model("50 TDI", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["286 hp"]),
        model("55 TFSI", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["340 hp"]),
        model("60 TFSIe", ["Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["456 hp"]),
        model("Quattro", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["286 hp", "456 hp"])
      ] },
      { name: "Q8", models: [
        model("50 TDI", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["286 hp"]),
        model("55 TFSI", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["340 hp"]),
        model("60 TFSIe", ["Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["462 hp"]),
        model("SUV", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["286 hp", "462 hp"]),
        model("Sportback", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV Coupe"], ["3.0"], ["286 hp", "462 hp"])
      ] },
      { name: "S Modelleri", models: [
        model("S3", ["Benzin"], ["Otomatik"], ["Sedan", "Sportback"], ["2.0"], ["310 hp"]),
        model("S4", ["Dizel", "Benzin"], ["Otomatik"], ["Sedan", "Avant"], ["3.0"], ["347 hp"]),
        model("S5", ["Dizel", "Benzin"], ["Otomatik"], ["Coupé", "Sportback", "Cabrio"], ["3.0"], ["347 hp"]),
        model("S6", ["Dizel", "Benzin"], ["Otomatik"], ["Sedan", "Avant"], ["3.0"], ["344 hp"]),
        model("S7", ["Dizel", "Benzin"], ["Otomatik"], ["Sportback"], ["3.0"], ["344 hp"]),
        model("S8", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.0"], ["571 hp"]),
        model("SQ2", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["300 hp"]),
        model("SQ5", ["Dizel", "Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["3.0"], ["347 hp"]),
        model("SQ7", ["Dizel", "Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["507 hp"]),
        model("SQ8", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["4.0"], ["507 hp"])
      ] },
      { name: "RS Modelleri", models: [
        model("RS3", ["Benzin"], ["Otomatik"], ["Sedan", "Sportback"], ["2.5"], ["400 hp"]),
        model("RS4", ["Benzin"], ["Otomatik"], ["Avant"], ["2.9"], ["450 hp"]),
        model("RS5", ["Benzin"], ["Otomatik"], ["Coupé", "Sportback"], ["2.9"], ["450 hp"]),
        model("RS6", ["Benzin"], ["Otomatik"], ["Avant"], ["4.0"], ["600 hp"]),
        model("RS7", ["Benzin"], ["Otomatik"], ["Sportback"], ["4.0"], ["600 hp"]),
        model("RS Q3", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.5"], ["400 hp"]),
        model("RS Q8", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["4.0"], ["600 hp"])
      ] },
      { name: "e-tron", models: [
        model("50", ["Elektrik"], ["Otomatik"], ["SUV", "SUV Coupe"], ["0"], ["313 hp"]),
        model("55", ["Elektrik"], ["Otomatik"], ["SUV", "SUV Coupe"], ["0"], ["408 hp"]),
        model("S", ["Elektrik"], ["Otomatik"], ["SUV", "SUV Coupe"], ["0"], ["503 hp"]),
        model("SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["313 hp", "408 hp"]),
        model("Sportback", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["313 hp", "408 hp"])
      ] },
      { name: "e-tron GT", models: [
        model("RS e-tron GT", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["646 hp"]),
        model("Quattro", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["530 hp"])
      ] },
      { name: "Q8 e-tron", models: [
        model("50", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"]),
        model("55", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["408 hp"]),
        model("SQ8", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["503 hp"])
      ] },
      { name: "TT", models: [
        model("Coupé", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["2.0", "2.5"], ["197 hp", "400 hp"]),
        model("Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], ["2.0"], ["197 hp"]),
        model("40 TFSI", ["Benzin"], ["Otomatik"], ["Coupé", "Roadster"], ["2.0"], ["197 hp"]),
        model("45 TFSI", ["Benzin"], ["Otomatik"], ["Coupé", "Roadster"], ["2.0"], ["245 hp"]),
        model("TTS", ["Benzin"], ["Otomatik"], ["Coupé", "Roadster"], ["2.0"], ["306 hp"]),
        model("TT RS", ["Benzin"], ["Otomatik"], ["Coupé"], ["2.5"], ["400 hp"])
      ] },
      { name: "R8", models: [
        model("V10 Performance", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["620 hp"]),
        model("Spyder", ["Benzin"], ["Otomatik"], ["Roadster"], ["5.2"], ["570 hp"]),
        model("Quattro", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["5.2"], ["570 hp", "620 hp"])
      ] }
    ]
  },
  {
    name: "BYD",
    series: [
      { name: "Dolphin", models: [
        model("Dolphin", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["95 hp", "177 hp"]),
        model("Dolphin Surf", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["95 hp", "177 hp"]),
        model("Dolphin Mini", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["75 hp", "95 hp"])
      ] },
      { name: "Seal", models: [
        model("Seal", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["204 hp", "313 hp", "530 hp"]),
        model("Seal 06", ["Hibrit", "Elektrik"], ["Otomatik"], ["Sedan"], ["1.5", "0"], ["101 hp", "218 hp"]),
        model("Seal 07", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["231 hp", "313 hp"]),
        model("Seal Performance", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["530 hp"])
      ] },
      { name: "Seal U", models: [
        model("Seal U EV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"]),
        model("Seal U DM-i", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["218 hp", "324 hp"])
      ] },
      { name: "Sealion", models: [
        model("Sealion 5", ["Elektrik", "Hibrit"], ["Otomatik"], ["SUV"], ["0", "1.5"], ["204 hp", "218 hp"]),
        model("Sealion 6", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["218 hp", "324 hp"]),
        model("Sealion 7", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["231 hp", "313 hp", "530 hp"])
      ] },
      { name: "Shark", models: [
        model("Shark 6", ["Hibrit"], ["Otomatik"], ["Pickup"], ["1.5"], ["430 hp"])
      ] },
      { name: "Han", models: [
        model("Han EV", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["222 hp", "517 hp"]),
        model("Han DM-i", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["197 hp", "218 hp"]),
        model("Han DM-p", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["489 hp"])
      ] },
      { name: "Tang", models: [
        model("Tang EV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["245 hp", "517 hp"]),
        model("Tang DM-i", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["218 hp", "324 hp"]),
        model("Tang L", ["Elektrik", "Hibrit"], ["Otomatik"], ["SUV"], ["0", "1.5"], ["313 hp", "517 hp"])
      ] },
      { name: "Atto / Yuan", models: [
        model("Atto 2", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["95 hp", "177 hp"]),
        model("Yuan Up", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["95 hp", "177 hp"]),
        model("Atto 3", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"]),
        model("Yuan Plus", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"]),
        model("Atto 3 Evo", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp", "218 hp"])
      ] },
      { name: "Qin", models: [
        model("Qin Plus DM-i", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["180 hp", "197 hp"]),
        model("Qin Plus EV", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["136 hp", "184 hp"]),
        model("Qin L", ["Hibrit", "Elektrik"], ["Otomatik"], ["Sedan"], ["1.5", "0"], ["180 hp", "218 hp"])
      ] },
      { name: "Song", models: [
        model("Song Plus", ["Hibrit", "Elektrik"], ["Otomatik"], ["SUV"], ["1.5", "0"], ["218 hp", "324 hp"]),
        model("Song L EV", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["231 hp", "313 hp"]),
        model("Song L DM-i", ["Hibrit"], ["Otomatik"], ["SUV Coupe"], ["1.5"], ["218 hp", "324 hp"])
      ] },
      { name: "Denza", models: [
        model("Denza D9", ["Elektrik", "Hibrit"], ["Otomatik"], ["MPV"], ["0", "1.5"], ["231 hp", "374 hp"]),
        model("Denza N7", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["313 hp", "530 hp"]),
        model("Denza N8", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["489 hp"]),
        model("Denza Z9 GT", ["Elektrik", "Hibrit"], ["Otomatik"], ["Shooting Brake"], ["0", "2.0"], ["313 hp", "858 hp"])
      ] },
      { name: "Yangwang", models: [
        model("Yangwang U7", ["Elektrik", "Hibrit"], ["Otomatik"], ["Sedan"], ["0", "2.0"], ["1000 hp", "1300 hp"]),
        model("Yangwang U8", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["1197 hp"]),
        model("Yangwang U9", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["1300 hp"])
      ] },
      { name: "Fangchengbao", models: [
        model("Bao 3", ["Elektrik", "Hibrit"], ["Otomatik"], ["SUV"], ["0", "1.5"], ["218 hp", "272 hp"]),
        model("Bao 5", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["680 hp"]),
        model("Bao 8", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["748 hp"])
      ] },
      { name: "e-Serisi", models: [
        model("e1", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["61 hp"]),
        model("e2", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["95 hp"]),
        model("e3", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["95 hp"]),
        model("e6", ["Elektrik"], ["Otomatik"], ["MPV"], ["0"], ["122 hp", "136 hp"]),
        model("e9", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["95 hp", "136 hp"])
      ] }
    ]
  },
  {
    name: "Cadillac",
    series: [
      { name: "CT4", models: [
        model("Luxury", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["237 hp"]),
        model("Premium Luxury", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["237 hp"]),
        model("Sport", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0", "2.7"], ["237 hp", "325 hp"]),
        model("2.0T", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["237 hp"]),
        model("2.7T", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.7"], ["325 hp"])
      ] },
      { name: "CT5", models: [
        model("Luxury", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["237 hp"]),
        model("Premium Luxury", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0", "3.0"], ["237 hp", "335 hp"]),
        model("Sport", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0", "3.0"], ["237 hp", "335 hp"]),
        model("2.0T", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["237 hp"]),
        model("3.0TT V6", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["335 hp"])
      ] },
      { name: "CT6", models: [
        model("2.0T", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["237 hp"]),
        model("3.0TT", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["404 hp"]),
        model("3.6 V6", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6"], ["335 hp"]),
        model("4.2 V8 Blackwing", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.2"], ["550 hp"]),
        model("Platinum", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0", "4.2"], ["404 hp", "550 hp"])
      ] },
      { name: "ATS", models: [
        model("Sedan", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan"], ["2.0", "2.5", "3.6"], ["202 hp", "335 hp"]),
        model("Coupé", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["2.0", "3.6"], ["272 hp", "470 hp"]),
        model("2.0T", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan", "Coupe"], ["2.0"], ["272 hp"]),
        model("2.5", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["202 hp"]),
        model("3.6 V6", ["Benzin"], ["Otomatik"], ["Sedan", "Coupe"], ["3.6"], ["321 hp"])
      ] },
      { name: "CTS", models: [
        model("2.0T", ["Benzin"], ["Otomatik"], ["Sedan", "Coupe", "Station Wagon"], ["2.0"], ["272 hp"]),
        model("3.0", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["270 hp"]),
        model("3.6 V6", ["Benzin"], ["Otomatik"], ["Sedan", "Coupe", "Station Wagon"], ["3.6"], ["318 hp"]),
        model("6.2 V8", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan", "Coupe", "Station Wagon"], ["6.2"], ["556 hp", "640 hp"]),
        model("Luxury", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0", "3.6"], ["272 hp", "318 hp"]),
        model("Performance", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6", "6.2"], ["318 hp", "640 hp"]),
        model("Premium", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6", "6.2"], ["318 hp", "640 hp"])
      ] },
      { name: "XTS", models: [
        model("3.6 V6", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6"], ["304 hp"]),
        model("V-Sport", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6"], ["410 hp"])
      ] },
      { name: "XT4", models: [
        model("Luxury", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["237 hp"]),
        model("Premium Luxury", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["237 hp"]),
        model("Sport", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["237 hp"])
      ] },
      { name: "XT5", models: [
        model("Luxury", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0", "3.6"], ["237 hp", "310 hp"]),
        model("Premium Luxury", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0", "3.6"], ["237 hp", "310 hp"]),
        model("Sport", ["Benzin"], ["Otomatik"], ["SUV"], ["3.6"], ["310 hp"]),
        model("3.6 V6", ["Benzin"], ["Otomatik"], ["SUV"], ["3.6"], ["310 hp"]),
        model("2.0T", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["237 hp"])
      ] },
      { name: "XT6", models: [
        model("Luxury", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0", "3.6"], ["237 hp", "310 hp"]),
        model("Premium Luxury", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0", "3.6"], ["237 hp", "310 hp"]),
        model("Sport", ["Benzin"], ["Otomatik"], ["SUV"], ["3.6"], ["310 hp"])
      ] },
      { name: "Escalade", models: [
        model("Luxury", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["6.2", "3.0"], ["277 hp", "420 hp"]),
        model("Premium Luxury", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["6.2", "3.0"], ["277 hp", "420 hp"]),
        model("Sport", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["6.2", "3.0"], ["277 hp", "420 hp"]),
        model("Platinum", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["6.2", "3.0"], ["277 hp", "420 hp"]),
        model("6.2 V8", ["Benzin"], ["Otomatik"], ["SUV"], ["6.2"], ["420 hp"]),
        model("3.0 Duramax Dizel", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["277 hp"])
      ] },
      { name: "Escalade ESV", models: [
        model("Long", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["6.2", "3.0"], ["277 hp", "420 hp"])
      ] },
      { name: "V Modelleri", models: [
        model("CT4-V", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.7"], ["325 hp"]),
        model("CT5-V", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["360 hp"]),
        model("CT4-V Blackwing", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["3.6"], ["472 hp"]),
        model("CT5-V Blackwing", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["6.2"], ["668 hp"])
      ] },
      { name: "SUV V Modelleri", models: [
        model("Escalade-V", ["Benzin"], ["Otomatik"], ["SUV"], ["6.2"], ["682 hp"])
      ] },
      { name: "Eski V Serisi", models: [
        model("CTS-V", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe", "Station Wagon"], ["6.2"], ["556 hp", "640 hp"]),
        model("ATS-V", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["3.6"], ["470 hp"]),
        model("XLR-V", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.4"], ["443 hp"]),
        model("STS-V", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.4"], ["469 hp"])
      ] },
      { name: "LYRIQ", models: [
        model("Tech", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"]),
        model("Luxury", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp", "500 hp"]),
        model("Sport", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp", "500 hp"]),
        model("eDrive40", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"]),
        model("Sport AWD", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["500 hp"])
      ] },
      { name: "OPTIQ", models: [
        model("OPTIQ", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["300 hp"])
      ] },
      { name: "VISTIQ", models: [
        model("VISTIQ", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["500 hp"])
      ] },
      { name: "Escalade IQ / IQL", models: [
        model("Escalade IQ", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["750 hp"]),
        model("Escalade IQL", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["750 hp"])
      ] },
      { name: "CELESTIQ", models: [
        model("CELESTIQ", ["Elektrik"], ["Otomatik"], ["Liftback"], ["0"], ["600 hp"])
      ] },
      { name: "DeVille", models: [
        model("Coupe DeVille", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.1", "4.9"], ["135 hp", "200 hp"]),
        model("Sedan DeVille", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.1", "4.9"], ["135 hp", "200 hp"]),
        model("DTS", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.6"], ["275 hp", "292 hp"])
      ] },
      { name: "Eldorado", models: [
        model("Biarritz", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.1", "4.5"], ["170 hp", "200 hp"]),
        model("Seville", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.6"], ["300 hp"]),
        model("Brougham", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.7"], ["180 hp"]),
        model("Convertible", ["Benzin"], ["Otomatik"], ["Cabrio"], ["4.5"], ["200 hp"])
      ] },
      { name: "Fleetwood", models: [
        model("Brougham", ["Benzin"], ["Otomatik"], ["Sedan"], ["5.0", "5.7"], ["140 hp", "260 hp"]),
        model("Sixty Special", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.6"], ["300 hp"]),
        model("Limousine", ["Benzin"], ["Otomatik"], ["Limousine"], ["5.7"], ["260 hp"])
      ] },
      { name: "Seville", models: [
        model("STS", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.6"], ["300 hp"]),
        model("SLS", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.6"], ["275 hp"])
      ] },
      { name: "Brougham", models: [
        model("Brougham", ["Benzin"], ["Otomatik"], ["Sedan"], ["5.0", "5.7"], ["140 hp", "180 hp"])
      ] },
      { name: "Allanté / XLR", models: [
        model("Allanté", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.5", "4.6"], ["200 hp", "295 hp"]),
        model("XLR", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.6"], ["320 hp"])
      ] },
      { name: "STS / SRX", models: [
        model("STS", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6", "4.6"], ["255 hp", "320 hp"]),
        model("SRX", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0", "3.6"], ["265 hp", "308 hp"])
      ] },
      { name: "BLS", models: [
        model("BLS", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.9", "2.0", "2.8"], ["150 hp", "255 hp"])
      ] }
    ]
  },
  {
    name: "Chery",
    series: [
      { name: "Tiggo 4 Pro", models: [
        model("Comfort", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["147 hp"]),
        model("Elite", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["147 hp"])
      ] },
      { name: "Tiggo 7 Pro", models: [
        model("Comfort", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"]),
        model("Luxury", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"]),
        model("Excellent", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"]),
        model("Avantgarde", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"]),
        model("1.6 TGDI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"])
      ] },
      { name: "Tiggo 8 Pro", models: [
        model("Luxury", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"]),
        model("Excellent", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"]),
        model("Avantgarde", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"])
      ] },
      { name: "Tiggo 8 Pro Max", models: [
        model("2.0 TGDI", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["254 hp"]),
        model("AWD", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["254 hp"])
      ] },
      { name: "Tiggo 9 Pro", models: [
        model("Tiggo 9 Pro", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["261 hp"])
      ] },
      { name: "Omoda 5", models: [
        model("Comfort", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["1.6"], ["183 hp"]),
        model("Luxury", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["1.6"], ["183 hp"]),
        model("Excellent", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["1.6"], ["183 hp"])
      ] },
      { name: "Omoda E5", models: [
        model("Omoda E5", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["204 hp"])
      ] },
      { name: "Jaecoo 7", models: [
        model("Revado", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"]),
        model("Propel", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["183 hp"])
      ] },
      { name: "Jaecoo 8", models: [
        model("Jaecoo 8", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["245 hp"])
      ] },
      { name: "Arrizo 5 / 5 Plus", models: [
        model("1.5", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.5"], ["116 hp"]),
        model("1.5T", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["156 hp"])
      ] },
      { name: "Arrizo 8", models: [
        model("Arrizo 8", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6", "2.0"], ["197 hp", "254 hp"])
      ] },
      { name: "Alia", models: [
        model("1.6", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["119 hp"])
      ] },
      { name: "Chance", models: [
        model("1.6", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["119 hp"]),
        model("2.0", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["139 hp"])
      ] },
      { name: "Kimo", models: [
        model("1.3", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.3"], ["83 hp"])
      ] },
      { name: "Niche", models: [
        model("2.0", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["139 hp"])
      ] },
      { name: "EQ1", models: [
        model("Little Ant", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["41 hp", "75 hp"])
      ] },
      { name: "EQ7", models: [
        model("EQ7", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["211 hp"])
      ] },
      { name: "Taxim", models: [
        model("1.6", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["119 hp"])
      ] },
      { name: "Tiggo", models: [
        model("İlk Nesil", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.6", "2.0"], ["119 hp", "139 hp"]),
        model("2008-2015", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.6", "2.0"], ["119 hp", "139 hp"])
      ] }
    ]
  },
  {
    name: "Chevrolet",
    series: [
      { name: "Trax", models: [
        model("LS", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2"], ["137 hp"]),
        model("1RS", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2"], ["137 hp"]),
        model("LT", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2"], ["137 hp"]),
        model("2RS", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2"], ["137 hp"]),
        model("Activ", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2"], ["137 hp"])
      ] },
      { name: "Trailblazer", models: [
        model("LS", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2", "1.3"], ["137 hp", "155 hp"]),
        model("LT", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2", "1.3"], ["137 hp", "155 hp"]),
        model("RS", ["Benzin"], ["Otomatik"], ["SUV"], ["1.3"], ["155 hp"]),
        model("Activ", ["Benzin"], ["Otomatik"], ["SUV"], ["1.3"], ["155 hp"])
      ] },
      { name: "Equinox", models: [
        model("LT", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["175 hp"]),
        model("RS", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["175 hp"]),
        model("Activ", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["175 hp"]),
        model("2026 Yeni Kasa", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["175 hp"])
      ] },
      { name: "Blazer", models: [
        model("LT", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0", "3.6"], ["228 hp", "308 hp"]),
        model("RS", ["Benzin"], ["Otomatik"], ["SUV"], ["3.6"], ["308 hp"]),
        model("Premier", ["Benzin"], ["Otomatik"], ["SUV"], ["3.6"], ["308 hp"])
      ] },
      { name: "Traverse", models: [
        model("LS", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["328 hp"]),
        model("LT", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["328 hp"]),
        model("Z71", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["328 hp"]),
        model("RS", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["328 hp"])
      ] },
      { name: "Tahoe", models: [
        model("LS", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "6.2", "3.0"], ["277 hp", "355 hp", "420 hp"]),
        model("LT", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "6.2", "3.0"], ["277 hp", "355 hp", "420 hp"]),
        model("RST", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "6.2", "3.0"], ["277 hp", "420 hp"]),
        model("Z71", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "3.0"], ["277 hp", "355 hp"]),
        model("Premier", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "6.2", "3.0"], ["277 hp", "420 hp"]),
        model("High Country", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["6.2", "3.0"], ["277 hp", "420 hp"])
      ] },
      { name: "Suburban", models: [
        model("LS", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "6.2", "3.0"], ["277 hp", "355 hp", "420 hp"]),
        model("LT", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "6.2", "3.0"], ["277 hp", "355 hp", "420 hp"]),
        model("RST", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "6.2", "3.0"], ["277 hp", "420 hp"]),
        model("Z71", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "3.0"], ["277 hp", "355 hp"]),
        model("Premier", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["5.3", "6.2", "3.0"], ["277 hp", "420 hp"]),
        model("High Country", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["6.2", "3.0"], ["277 hp", "420 hp"])
      ] },
      { name: "Captiva", models: [
        model("1.5 Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["147 hp"])
      ] },
      { name: "Colorado", models: [
        model("WT", ["Benzin"], ["Otomatik"], ["Pickup"], ["2.7"], ["237 hp", "310 hp"]),
        model("LT", ["Benzin"], ["Otomatik"], ["Pickup"], ["2.7"], ["237 hp", "310 hp"]),
        model("Trail Boss", ["Benzin"], ["Otomatik"], ["Pickup"], ["2.7"], ["310 hp"]),
        model("Z71", ["Benzin"], ["Otomatik"], ["Pickup"], ["2.7"], ["310 hp"]),
        model("ZR2", ["Benzin"], ["Otomatik"], ["Pickup"], ["2.7"], ["310 hp"]),
        model("ZR2 Bison", ["Benzin"], ["Otomatik"], ["Pickup"], ["2.7"], ["310 hp"])
      ] },
      { name: "Silverado 1500", models: [
        model("WT", ["Benzin", "Dizel"], ["Otomatik"], ["Pickup"], ["2.7", "5.3", "6.2", "3.0"], ["277 hp", "310 hp", "355 hp", "420 hp"]),
        model("Custom", ["Benzin", "Dizel"], ["Otomatik"], ["Pickup"], ["2.7", "5.3", "3.0"], ["277 hp", "310 hp", "355 hp"]),
        model("LT", ["Benzin", "Dizel"], ["Otomatik"], ["Pickup"], ["2.7", "5.3", "3.0"], ["277 hp", "310 hp", "355 hp"]),
        model("RST", ["Benzin", "Dizel"], ["Otomatik"], ["Pickup"], ["2.7", "5.3", "6.2", "3.0"], ["277 hp", "310 hp", "420 hp"]),
        model("LTZ", ["Benzin", "Dizel"], ["Otomatik"], ["Pickup"], ["5.3", "6.2", "3.0"], ["277 hp", "355 hp", "420 hp"]),
        model("High Country", ["Benzin", "Dizel"], ["Otomatik"], ["Pickup"], ["6.2", "3.0"], ["277 hp", "420 hp"]),
        model("ZR2", ["Benzin"], ["Otomatik"], ["Pickup"], ["6.2"], ["420 hp"])
      ] },
      { name: "Silverado HD", models: [
        model("2500HD", ["Benzin", "Dizel"], ["Otomatik"], ["Pickup"], ["6.6"], ["401 hp", "470 hp"]),
        model("3500HD", ["Benzin", "Dizel"], ["Otomatik"], ["Pickup"], ["6.6"], ["401 hp", "470 hp"])
      ] },
      { name: "Corvette", models: [
        model("Stingray", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio"], ["6.2"], ["490 hp", "495 hp"]),
        model("Z06", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio"], ["5.5"], ["670 hp"]),
        model("E-Ray", ["Hibrit"], ["Otomatik"], ["Coupe", "Cabrio"], ["6.2"], ["655 hp"]),
        model("ZR1", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.5"], ["800 hp"])
      ] },
      { name: "Camaro", models: [
        model("LS", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe", "Cabrio"], ["2.0"], ["275 hp"]),
        model("LT", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe", "Cabrio"], ["2.0", "3.6"], ["275 hp", "335 hp"]),
        model("SS", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe", "Cabrio"], ["6.2"], ["455 hp"]),
        model("ZL1", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe", "Cabrio"], ["6.2"], ["650 hp"])
      ] },
      { name: "Malibu", models: [
        model("LS", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["163 hp"]),
        model("RS", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["163 hp"]),
        model("LT", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["163 hp"])
      ] },
      { name: "Aveo / Sonic", models: [
        model("Aveo", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.4", "1.6"], ["100 hp", "115 hp"]),
        model("Sonic", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.4", "1.8"], ["138 hp"])
      ] },
      { name: "Cruze", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.4", "1.6", "1.7"], ["113 hp", "153 hp"]),
        model("Hatchback", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "1.6", "1.7"], ["113 hp", "153 hp"])
      ] },
      { name: "Spark", models: [
        model("Spark", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2"], ["68 hp", "82 hp"])
      ] },
      { name: "Impala", models: [
        model("Impala", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5", "3.6"], ["197 hp", "305 hp"])
      ] },
      { name: "Equinox EV", models: [
        model("LT", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["213 hp", "288 hp"]),
        model("RS", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["213 hp", "288 hp"])
      ] },
      { name: "Blazer EV", models: [
        model("LT", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["288 hp"]),
        model("RS", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"]),
        model("SS", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["557 hp"])
      ] },
      { name: "Silverado EV", models: [
        model("WT", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["510 hp"]),
        model("RST", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["664 hp"]),
        model("Trail Boss", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["725 hp"])
      ] },
      { name: "Bolt EV / Bolt EUV", models: [
        model("Bolt EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["200 hp"]),
        model("Bolt EUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["200 hp"])
      ] },
      { name: "Express", models: [
        model("Cargo Van", ["Benzin", "Dizel"], ["Otomatik"], ["Van"], ["4.3", "6.6", "2.8"], ["181 hp", "276 hp", "401 hp"]),
        model("Passenger Van", ["Benzin"], ["Otomatik"], ["Van"], ["4.3", "6.6"], ["276 hp", "401 hp"]),
        model("Cutaway", ["Benzin", "Dizel"], ["Otomatik"], ["Cutaway"], ["4.3", "6.6"], ["276 hp", "401 hp"])
      ] },
      { name: "Low Cab Forward", models: [
        model("Low Cab Forward", ["Dizel"], ["Otomatik"], ["Kamyon"], ["5.2"], ["215 hp"])
      ] }
    ]
  },
  {
    name: "Chrysler",
    series: [
      { name: "Pacifica", models: [
        model("Select", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.6"], ["287 hp"]),
        model("Limited", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.6"], ["287 hp"]),
        model("Pinnacle", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.6"], ["287 hp"])
      ] },
      { name: "Pacifica Plug-In Hybrid", models: [
        model("Select", ["Hibrit"], ["Otomatik"], ["Minivan"], ["3.6"], ["260 hp"]),
        model("Pinnacle", ["Hibrit"], ["Otomatik"], ["Minivan"], ["3.6"], ["260 hp"])
      ] },
      { name: "Voyager", models: [
        model("LX", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.6"], ["287 hp"])
      ] },
      { name: "Grand Voyager", models: [
        model("Limited", ["Dizel", "Benzin"], ["Otomatik"], ["Minivan"], ["2.8", "3.6"], ["163 hp", "287 hp"]),
        model("Touring", ["Dizel", "Benzin"], ["Otomatik"], ["Minivan"], ["2.8", "3.6"], ["163 hp", "287 hp"])
      ] },
      { name: "300 Serisi", models: [
        model("Touring", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6"], ["292 hp"]),
        model("Touring L", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6"], ["292 hp"]),
        model("300S", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6", "5.7"], ["300 hp", "363 hp"])
      ] },
      { name: "300C", models: [
        model("6.4L HEMI V8", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.4"], ["485 hp"])
      ] },
      { name: "200 Serisi", models: [
        model("LX", ["Benzin"], ["Otomatik"], ["Sedan", "Cabrio"], ["2.4"], ["173 hp"]),
        model("Limited", ["Benzin"], ["Otomatik"], ["Sedan", "Cabrio"], ["2.4", "3.6"], ["173 hp", "283 hp"]),
        model("S", ["Benzin"], ["Otomatik"], ["Sedan", "Cabrio"], ["3.6"], ["283 hp"]),
        model("C", ["Benzin"], ["Otomatik"], ["Sedan", "Cabrio"], ["3.6"], ["283 hp"])
      ] },
      { name: "Sebring", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Otomatik", "Manuel"], ["Sedan"], ["2.0", "2.4", "2.7"], ["140 hp", "186 hp"]),
        model("Cabrio", ["Benzin"], ["Otomatik"], ["Cabrio"], ["2.4", "2.7"], ["173 hp", "186 hp"])
      ] },
      { name: "LHS / Concorde", models: [
        model("LHS", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.5"], ["253 hp"]),
        model("Concorde", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.7", "3.2", "3.5"], ["200 hp", "253 hp"])
      ] },
      { name: "Aspen", models: [
        model("Limited", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["4.7", "5.7"], ["303 hp", "385 hp"])
      ] },
      { name: "Pacifica SUV", models: [
        model("2004-2008 Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], ["3.5", "4.0"], ["250 hp", "255 hp"])
      ] },
      { name: "Airflow Concept", models: [
        model("EV Concept", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["400 hp"])
      ] },
      { name: "Halcyon", models: [
        model("Electric Sedan Concept", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["500 hp"])
      ] },
      { name: "EV Serisi", models: [
        model("Electric SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp", "400 hp"]),
        model("Electric Crossover", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["300 hp", "400 hp"])
      ] },
      { name: "Imperial", models: [
        model("Imperial", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.8"], ["385 hp"])
      ] },
      { name: "New Yorker", models: [
        model("New Yorker", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.3", "3.5"], ["147 hp", "253 hp"])
      ] },
      { name: "LeBaron", models: [
        model("Coupe", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["2.2", "2.5", "3.0"], ["93 hp", "141 hp"]),
        model("Convertible", ["Benzin"], ["Otomatik", "Manuel"], ["Cabrio"], ["2.2", "2.5", "3.0"], ["93 hp", "141 hp"]),
        model("Sedan", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan"], ["2.2", "2.5", "3.0"], ["93 hp", "141 hp"])
      ] },
      { name: "Town & Country", models: [
        model("Station Wagon", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["3.3", "3.8"], ["180 hp", "197 hp"]),
        model("Minivan", ["Benzin", "Dizel"], ["Otomatik"], ["Minivan"], ["2.8", "3.6", "3.8"], ["163 hp", "287 hp"])
      ] },
      { name: "Crossfire", models: [
        model("Coupe", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["3.2"], ["215 hp", "330 hp"]),
        model("Roadster", ["Benzin"], ["Otomatik", "Manuel"], ["Roadster"], ["3.2"], ["215 hp", "330 hp"])
      ] },
      { name: "PT Cruiser", models: [
        model("Classic", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.6", "2.0"], ["116 hp", "141 hp"]),
        model("Touring", ["Benzin", "Dizel"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.6", "2.2"], ["121 hp", "150 hp"]),
        model("Limited", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.4"], ["150 hp"]),
        model("GT", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["2.4"], ["223 hp", "230 hp"])
      ] },
      { name: "Neon", models: [
        model("LE", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan"], ["2.0"], ["132 hp"]),
        model("SE", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan"], ["2.0"], ["132 hp"])
      ] }
    ]
  },
  {
    name: "Citroen",
    series: [
      { name: "Ami", models: [
        model("My Ami Pop", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], ["0"], ["8 hp"]),
        model("My Ami Tonic", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], ["0"], ["8 hp"]),
        model("My Ami Buggy", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], ["0"], ["8 hp"])
      ] },
      { name: "C3", models: [
        model("1.2 PureTech", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["83 hp", "100 hp"]),
        model("100 HP", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["100 hp"]),
        model("1.2 Mild-Hybrid", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["110 hp"]),
        model("Feel Bold", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["100 hp", "110 hp"]),
        model("Shine", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["100 hp", "110 hp"]),
        model("Max", ["Benzin", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["110 hp"])
      ] },
      { name: "ë-C3", models: [
        model("113 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["113 hp"])
      ] },
      { name: "C4", models: [
        model("1.2 PureTech", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.2"], ["130 hp"]),
        model("1.5 BlueHDi", ["Dizel"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.5"], ["130 hp"]),
        model("Hybrid 136", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["136 hp"]),
        model("Feel", ["Benzin", "Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.2", "1.5"], ["130 hp", "136 hp"]),
        model("Shine", ["Benzin", "Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.2", "1.5"], ["130 hp", "136 hp"]),
        model("E-Series", ["Benzin", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["130 hp", "136 hp"])
      ] },
      { name: "ë-C4", models: [
        model("136 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["136 hp"]),
        model("156 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["156 hp"]),
        model("Feel Bold", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["136 hp"]),
        model("Shine", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["156 hp"])
      ] },
      { name: "C4 X", models: [
        model("1.2 PureTech", ["Benzin"], ["Otomatik"], ["Fastback"], ["1.2"], ["130 hp"]),
        model("1.5 BlueHDi", ["Dizel"], ["Otomatik"], ["Fastback"], ["1.5"], ["130 hp"]),
        model("1.2 Hybrid", ["Hibrit"], ["Otomatik"], ["Fastback"], ["1.2"], ["136 hp"])
      ] },
      { name: "ë-C4 X", models: [
        model("136 HP", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["136 hp"]),
        model("156 HP", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["156 hp"])
      ] },
      { name: "C5 X", models: [
        model("1.2 PureTech", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["1.2"], ["130 hp"]),
        model("1.6 PureTech", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["1.6"], ["180 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.6"], ["225 hp"])
      ] },
      { name: "C3 Aircross", models: [
        model("1.2 PureTech", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.2"], ["110 hp", "130 hp"]),
        model("1.5 BlueHDi", ["Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["110 hp", "120 hp"]),
        model("Hybrid 136", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["136 hp"]),
        model("7 Koltuklu", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.5"], ["110 hp", "136 hp"])
      ] },
      { name: "ë-C3 Aircross", models: [
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["113 hp"])
      ] },
      { name: "C5 Aircross", models: [
        model("1.5 BlueHDi", ["Dizel"], ["Otomatik"], ["SUV"], ["1.5"], ["130 hp"]),
        model("Hybrid 136", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["136 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["225 hp"]),
        model("Shine Bold", ["Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "1.6"], ["130 hp", "225 hp"]),
        model("Max", ["Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "1.6"], ["130 hp", "225 hp"])
      ] },
      { name: "ë-C5 Aircross", models: [
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["210 hp"])
      ] },
      { name: "Berlingo", models: [
        model("1.5 BlueHDi", ["Dizel"], ["Manuel", "Otomatik"], ["MPV", "Van"], ["1.5"], ["100 hp", "130 hp"]),
        model("Feel", ["Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.5"], ["100 hp", "130 hp"]),
        model("Feel Bold", ["Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.5"], ["100 hp", "130 hp"]),
        model("Shine", ["Dizel"], ["Otomatik"], ["MPV"], ["1.5"], ["130 hp"]),
        model("XTR", ["Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.5"], ["130 hp"])
      ] },
      { name: "ë-Berlingo", models: [
        model("50 kWh", ["Elektrik"], ["Otomatik"], ["MPV", "Van"], ["0"], ["136 hp"]),
        model("136 HP", ["Elektrik"], ["Otomatik"], ["MPV", "Van"], ["0"], ["136 hp"])
      ] },
      { name: "Jumpy / Spacetourer", models: [
        model("2.0 BlueHDi", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "Minibus"], ["2.0"], ["145 hp", "180 hp"]),
        model("Panelvan", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["145 hp", "180 hp"]),
        model("Cityvan", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["145 hp"]),
        model("8+1", ["Dizel"], ["Otomatik"], ["Minibus"], ["2.0"], ["180 hp"])
      ] },
      { name: "ë-Jumpy", models: [
        model("Elektrikli Panelvan", ["Elektrik"], ["Otomatik"], ["Van"], ["0"], ["136 hp"])
      ] },
      { name: "Jumper", models: [
        model("2.2 BlueHDi", ["Dizel"], ["Manuel"], ["Van"], ["2.2"], ["140 hp", "165 hp"]),
        model("L1H1", ["Dizel"], ["Manuel"], ["Van"], ["2.2"], ["140 hp"]),
        model("L2H2", ["Dizel"], ["Manuel"], ["Van"], ["2.2"], ["140 hp", "165 hp"]),
        model("L3H2", ["Dizel"], ["Manuel"], ["Van"], ["2.2"], ["140 hp", "165 hp"]),
        model("L4H3", ["Dizel"], ["Manuel"], ["Van"], ["2.2"], ["165 hp"])
      ] },
      { name: "ë-Jumper", models: [
        model("Elektrikli Ticari", ["Elektrik"], ["Otomatik"], ["Van"], ["0"], ["122 hp"])
      ] },
      { name: "C-Elysee", models: [
        model("1.2 PureTech", ["Benzin"], ["Manuel"], ["Sedan"], ["1.2"], ["82 hp"]),
        model("1.5 BlueHDi", ["Dizel"], ["Manuel"], ["Sedan"], ["1.5"], ["100 hp"]),
        model("1.6 HDi", ["Dizel"], ["Manuel"], ["Sedan"], ["1.6"], ["92 hp"])
      ] },
      { name: "C3 Pluriel", models: [
        model("Cabrio", ["Benzin"], ["Manuel"], ["Cabrio"], ["1.4", "1.6"], ["75 hp", "110 hp"])
      ] },
      { name: "C4 Cactus", models: [
        model("Airbump", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Crossover"], ["1.2", "1.6"], ["82 hp", "100 hp"])
      ] },
      { name: "C1", models: [
        model("Şehir içi Mini", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["68 hp", "72 hp"])
      ] },
      { name: "C5", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "2.0"], ["110 hp", "180 hp"]),
        model("Tourer", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.6", "2.0"], ["110 hp", "180 hp"])
      ] },
      { name: "Saxo / VTS", models: [
        model("Saxo", ["Benzin", "Dizel"], ["Manuel"], ["Hatchback"], ["1.1", "1.4", "1.5"], ["60 hp", "90 hp"]),
        model("VTS", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.6"], ["120 hp"])
      ] },
      { name: "Xsara / Xantia", models: [
        model("Xsara", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback", "Sedan"], ["1.4", "1.6", "2.0"], ["75 hp", "167 hp"]),
        model("Xantia", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.8", "2.0"], ["90 hp", "150 hp"])
      ] }
    ]
  },
  {
    name: "Cupra",
    series: [
      { name: "Formentor", models: [
        model("1.5 eTSI mHEV", ["Hibrit"], ["Otomatik"], ["SUV Coupe"], ["1.5"], ["150 hp"]),
        model("2.0 TSI VZ", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["2.0"], ["333 hp"]),
        model("1.5 e-Hybrid Plug-in", ["Hibrit"], ["Otomatik"], ["SUV Coupe"], ["1.5"], ["204 hp", "272 hp"]),
        model("Impulse", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV Coupe"], ["1.5", "2.0"], ["150 hp", "272 hp"]),
        model("Supreme", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV Coupe"], ["1.5", "2.0"], ["150 hp", "272 hp"]),
        model("VZ-Line", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV Coupe"], ["1.5", "2.0"], ["150 hp", "333 hp"])
      ] },
      { name: "Terramar", models: [
        model("1.5 eTSI mHEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]),
        model("2.0 TSI", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["204 hp", "265 hp"]),
        model("1.5 e-Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["204 hp", "272 hp"]),
        model("VZ", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["204 hp", "272 hp"]),
        model("VZ-Line", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["204 hp", "272 hp"])
      ] },
      { name: "Ateca", models: [
        model("1.5 TSI", ["Benzin"], ["Otomatik", "Manuel"], ["SUV"], ["1.5"], ["150 hp"]),
        model("2.0 TSI 300 HP", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["300 hp"]),
        model("VZ", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["300 hp"]),
        model("VZ-Line", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["300 hp"]),
        model("4Drive", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["190 hp", "300 hp"])
      ] },
      { name: "Tavascan", models: [
        model("Endurance", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["286 hp"]),
        model("VZ", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["340 hp"]),
        model("VZ3", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["340 hp"]),
        model("AWD", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["340 hp"])
      ] },
      { name: "Leon", models: [
        model("1.5 eTSI mHEV", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["150 hp"]),
        model("2.0 TSI", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["2.0"], ["190 hp", "300 hp"]),
        model("1.5 e-Hybrid", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["204 hp", "272 hp"]),
        model("V1", ["Benzin", "Hibrit"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.5", "2.0"], ["150 hp", "204 hp"]),
        model("V2", ["Benzin", "Hibrit"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.5", "2.0"], ["150 hp", "204 hp"]),
        model("VZ", ["Benzin", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5", "2.0"], ["204 hp", "300 hp"]),
        model("Shadow Edition", ["Benzin", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5", "2.0"], ["150 hp", "204 hp"])
      ] },
      { name: "Leon Sportstourer", models: [
        model("1.5 eTSI", ["Benzin", "Hibrit"], ["Otomatik", "Manuel"], ["Station Wagon"], ["1.5"], ["150 hp"]),
        model("2.0 TSI", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["190 hp", "333 hp"]),
        model("e-Hybrid", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.5"], ["204 hp", "272 hp"])
      ] },
      { name: "Born", models: [
        model("V1", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["204 hp"]),
        model("V2", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["204 hp", "231 hp"]),
        model("VZ", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["326 hp"]),
        model("e-Boost", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["231 hp"])
      ] },
      { name: "Raval", models: [
        model("Elektrikli Şehir Otomobili", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["226 hp"])
      ] },
      { name: "VZ", models: [
        model("Veloz Performans Paketi", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik"], ["Hatchback", "SUV", "SUV Coupe"], ["0", "1.5", "2.0"], ["204 hp", "340 hp"])
      ] },
      { name: "VZ5", models: [
        model("2.5 Litre 5 Silindir", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["2.5"], ["390 hp"]),
        model("Formentor VZ5", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["2.5"], ["390 hp"])
      ] },
      { name: "VZ Extreme", models: [
        model("Pist Odaklı Performans", ["Benzin"], ["Otomatik"], ["SUV Coupe", "Hatchback"], ["2.0", "2.5"], ["333 hp", "390 hp"])
      ] },
      { name: "Impulse / V1", models: [
        model("Giriş Donanım", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik", "Manuel"], ["Hatchback", "SUV", "SUV Coupe"], ["0", "1.5"], ["150 hp", "204 hp"])
      ] },
      { name: "Supreme / V2", models: [
        model("Konfor ve Teknoloji", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik", "Manuel"], ["Hatchback", "SUV", "SUV Coupe"], ["0", "1.5", "2.0"], ["150 hp", "231 hp"])
      ] },
      { name: "VZ-Line / VZ3", models: [
        model("Spor Donanım", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik"], ["Hatchback", "SUV", "SUV Coupe"], ["0", "1.5", "2.0"], ["204 hp", "340 hp"])
      ] },
      { name: "Tribe Edition", models: [
        model("Özel Tasarım", ["Benzin", "Hibrit"], ["Otomatik"], ["Hatchback", "SUV Coupe"], ["1.5", "2.0"], ["150 hp", "204 hp"])
      ] }
    ]
  },
  {
    name: "BMW",
    series: [
      { name: "1 Serisi", models: [
        model("116i", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["109 hp"]),
        model("116d", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["116 hp"]),
        model("118i", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["140 hp"]),
        model("118d", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["2.0"], ["150 hp"]),
        model("120i", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.0"], ["178 hp"]),
        model("120d", ["Dizel"], ["Otomatik"], ["Hatchback"], ["2.0"], ["190 hp"]),
        model("M135i", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.0"], ["306 hp"])
      ] },
      { name: "2 Serisi", models: [
        model("216d", ["Dizel"], ["Manuel", "Otomatik"], ["Coupe", "Gran Coupe", "Active Tourer"], ["1.5"], ["116 hp"]),
        model("218i", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe", "Gran Coupe", "Active Tourer"], ["1.5"], ["140 hp"]),
        model("220i", ["Benzin"], ["Otomatik"], ["Coupe", "Gran Coupe", "Active Tourer"], ["2.0"], ["184 hp"]),
        model("220d", ["Dizel"], ["Otomatik"], ["Coupe", "Gran Coupe", "Active Tourer"], ["2.0"], ["190 hp"]),
        model("M235i", ["Benzin"], ["Otomatik"], ["Coupe", "Gran Coupe"], ["2.0"], ["306 hp"]),
        model("M240i", ["Benzin"], ["Otomatik"], ["Coupe", "Gran Coupe"], ["3.0"], ["374 hp"])
      ] },
      { name: "3 Serisi", models: [
        model("316i", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Touring", "GT"], ["1.6"], ["136 hp"]),
        model("318i", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Touring", "GT"], ["1.5"], ["136 hp"]),
        model("320i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring", "GT"], ["2.0"], ["170 hp"]),
        model("320d", ["Dizel"], ["Otomatik"], ["Sedan", "Touring", "GT"], ["2.0"], ["190 hp"]),
        model("325i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring"], ["2.5"], ["218 hp"]),
        model("328i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring", "GT"], ["2.0"], ["245 hp"]),
        model("330i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring", "GT"], ["2.0"], ["258 hp"]),
        model("330e", ["Hibrit"], ["Otomatik"], ["Sedan", "Touring"], ["2.0"], ["292 hp"]),
        model("335i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring"], ["3.0"], ["306 hp"]),
        model("340i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring"], ["3.0"], ["374 hp"])
      ] },
      { name: "4 Serisi", models: [
        model("418i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["1.5"], ["136 hp"]),
        model("420i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["2.0"], ["184 hp"]),
        model("420d", ["Dizel"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["2.0"], ["190 hp"]),
        model("428i", ["Benzin"], ["Otomatik"], ["Coupe", "Gran Coupe"], ["2.0"], ["245 hp"]),
        model("430i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["2.0"], ["258 hp"]),
        model("435i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["3.0"], ["306 hp"]),
        model("440i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["3.0"], ["326 hp"])
      ] },
      { name: "5 Serisi", models: [
        model("520i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring", "GT"], ["1.6"], ["170 hp"]),
        model("520d", ["Dizel"], ["Otomatik"], ["Sedan", "Touring", "GT"], ["2.0"], ["190 hp"]),
        model("525d", ["Dizel"], ["Otomatik"], ["Sedan", "Touring"], ["2.0"], ["218 hp"]),
        model("528i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring"], ["2.0"], ["245 hp"]),
        model("530i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring"], ["2.0"], ["252 hp"]),
        model("530d", ["Dizel"], ["Otomatik"], ["Sedan", "Touring"], ["3.0"], ["265 hp"]),
        model("535i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring"], ["3.0"], ["306 hp"]),
        model("540i", ["Benzin"], ["Otomatik"], ["Sedan", "Touring"], ["3.0"], ["340 hp"]),
        model("545e", ["Hibrit"], ["Otomatik"], ["Sedan"], ["3.0"], ["394 hp"]),
        model("550i", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.4"], ["462 hp"])
      ] },
      { name: "6 Serisi", models: [
        model("630i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe", "GT"], ["2.0"], ["258 hp"]),
        model("640i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe", "GT"], ["3.0"], ["340 hp"]),
        model("640d", ["Dizel"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe", "GT"], ["3.0"], ["313 hp"]),
        model("650i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["4.4"], ["450 hp"])
      ] },
      { name: "7 Serisi", models: [
        model("730i", ["Benzin"], ["Otomatik"], ["Sedan", "Long"], ["2.0"], ["258 hp"]),
        model("730d", ["Dizel"], ["Otomatik"], ["Sedan", "Long"], ["3.0"], ["286 hp"]),
        model("740i", ["Benzin"], ["Otomatik"], ["Sedan", "Long"], ["3.0"], ["340 hp"]),
        model("740d", ["Dizel"], ["Otomatik"], ["Sedan", "Long"], ["3.0"], ["320 hp"]),
        model("745e", ["Hibrit"], ["Otomatik"], ["Sedan", "Long"], ["3.0"], ["394 hp"]),
        model("750i", ["Benzin"], ["Otomatik"], ["Sedan", "Long"], ["4.4"], ["530 hp"]),
        model("760i", ["Benzin"], ["Otomatik"], ["Sedan", "Long"], ["6.6"], ["610 hp"]),
        model("Long (L) Versiyonlar", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Sedan"], ["3.0"], ["340 hp"])
      ] },
      { name: "8 Serisi", models: [
        model("840i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["3.0"], ["333 hp"]),
        model("840d", ["Dizel"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["3.0"], ["320 hp"]),
        model("M850i", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Gran Coupe"], ["4.4"], ["530 hp"])
      ] },
      { name: "X1", models: [
        model("sDrive16i", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["109 hp"]),
        model("sDrive18i", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["140 hp"]),
        model("xDrive20d", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["190 hp"]),
        model("xDrive25i", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["231 hp"])
      ] },
      { name: "X2", models: [
        model("sDrive18i", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["140 hp"]),
        model("xDrive20d", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["190 hp"]),
        model("M35i", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["306 hp"])
      ] },
      { name: "X3", models: [
        model("xDrive20i", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"]),
        model("xDrive20d", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["190 hp"]),
        model("xDrive30i", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["252 hp"]),
        model("M40i", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["360 hp"])
      ] },
      { name: "X4", models: [
        model("xDrive20i", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"]),
        model("xDrive20d", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["190 hp"]),
        model("xDrive30i", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["252 hp"]),
        model("M40i", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["360 hp"])
      ] },
      { name: "X5", models: [
        model("xDrive25d", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["231 hp"]),
        model("xDrive30d", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["286 hp"]),
        model("xDrive40i", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["340 hp"]),
        model("xDrive45e", ["Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["394 hp"]),
        model("M50d", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["400 hp"])
      ] },
      { name: "X6", models: [
        model("xDrive30d", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["286 hp"]),
        model("xDrive40i", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["340 hp"]),
        model("M50i", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["530 hp"]),
        model("M50d", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["400 hp"])
      ] },
      { name: "X7", models: [
        model("xDrive30d", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["286 hp"]),
        model("xDrive40i", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["340 hp"]),
        model("M50i", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["530 hp"]),
        model("M60i", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["530 hp"])
      ] },
      { name: "XM", models: [
        model("4.4 V8 Hybrid (Label Red)", ["Hibrit"], ["Otomatik"], ["SUV"], ["4.4"], ["748 hp"])
      ] },
      { name: "M Modelleri", models: [
        model("M2", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["3.0"], ["460 hp"]),
        model("M3", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan"], ["3.0"], ["510 hp"]),
        model("M4", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe", "Cabrio"], ["3.0"], ["510 hp"]),
        model("M5", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.4"], ["625 hp"]),
        model("M6", ["Benzin"], ["Otomatik"], ["Coupe", "Gran Coupe", "Cabrio"], ["4.4"], ["560 hp"]),
        model("M8", ["Benzin"], ["Otomatik"], ["Coupe", "Gran Coupe", "Cabrio"], ["4.4"], ["625 hp"])
      ] },
      { name: "M SUV Modelleri", models: [
        model("X3 M", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["510 hp"]),
        model("X4 M", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["510 hp"]),
        model("X5 M", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["625 hp"]),
        model("X6 M", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["625 hp"])
      ] },
      { name: "Elektrikli Binek", models: [
        model("i3", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["170 hp"]),
        model("i3s", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["184 hp"]),
        model("i4 eDrive35", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["286 hp"]),
        model("i4 eDrive40", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["340 hp"]),
        model("i4 M50", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["544 hp"]),
        model("i5 eDrive40", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["340 hp"]),
        model("i5 M60", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["601 hp"]),
        model("i7 xDrive60", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["544 hp"]),
        model("i7 M70", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["660 hp"])
      ] },
      { name: "Elektrikli SUV", models: [
        model("iX1", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["313 hp"]),
        model("iX2", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["313 hp"]),
        model("iX3", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["286 hp"]),
        model("iX xDrive40", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["326 hp"]),
        model("iX xDrive50", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["523 hp"]),
        model("iX M60", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["619 hp"])
      ] },
      { name: "Hibrid Spor", models: [
        model("i8 Coupe", ["Hibrit"], ["Otomatik"], ["Coupe"], ["1.5"], ["374 hp"]),
        model("i8 Roadster", ["Hibrit"], ["Otomatik"], ["Roadster"], ["1.5"], ["374 hp"])
      ] },
      { name: "Z Serisi", models: [
        model("Z3", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["1.9"], ["140 hp"]),
        model("Z4 sDrive20i", ["Benzin"], ["Otomatik"], ["Roadster"], ["2.0"], ["197 hp"]),
        model("Z4 sDrive30i", ["Benzin"], ["Otomatik"], ["Roadster"], ["2.0"], ["258 hp"]),
        model("Z4 M40i", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.0"], ["340 hp"]),
        model("Z8", ["Benzin"], ["Manuel"], ["Roadster"], ["4.9"], ["400 hp"])
      ] }
    ]
  },
  {
    name: "Mercedes-Benz",
    series: [
      { name: "A-Serisi", models: [
        model("A 180", ["Benzin"], ["Otomatik"], ["Sedan", "Hatchback"], ["1.3"], ["136 hp"]),
        model("A 200", ["Benzin"], ["Otomatik"], ["Sedan", "Hatchback"], ["1.3"], ["163 hp"]),
        model("A 200 d", ["Dizel"], ["Otomatik"], ["Sedan", "Hatchback"], ["2.0"], ["150 hp"]),
        model("Sedan", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["1.3", "2.0"], ["136 hp", "163 hp"]),
        model("Hatchback", ["Benzin", "Dizel"], ["Otomatik"], ["Hatchback"], ["1.3", "2.0"], ["136 hp", "163 hp"])
      ] },
      { name: "B-Serisi", models: [
        model("B 180", ["Benzin"], ["Otomatik"], ["MPV"], ["1.3"], ["136 hp"]),
        model("B 200", ["Benzin"], ["Otomatik"], ["MPV"], ["1.3"], ["163 hp"]),
        model("B 200 d", ["Dizel"], ["Otomatik"], ["MPV"], ["2.0"], ["150 hp"])
      ] },
      { name: "C-Serisi", models: [
        model("C 200", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], ["1.5"], ["204 hp"]),
        model("C 300", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["258 hp"]),
        model("C 300 d", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["265 hp"]),
        model("C 300 e", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["313 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["313 hp"]),
        model("W206", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["1.5", "2.0"], ["204 hp", "313 hp"])
      ] },
      { name: "E-Serisi", models: [
        model("E 200", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["204 hp"]),
        model("E 220 d", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["197 hp"]),
        model("E 300 e", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["313 hp"]),
        model("E 400 e", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["381 hp"]),
        model("E 450", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], ["3.0"], ["381 hp"]),
        model("W214", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0", "3.0"], ["197 hp", "381 hp"])
      ] },
      { name: "S-Serisi", models: [
        model("S 400 d", ["Dizel"], ["Otomatik"], ["Sedan"], ["3.0"], ["330 hp"]),
        model("S 450", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["381 hp"]),
        model("S 500", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["435 hp"]),
        model("S 580", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.0"], ["503 hp"]),
        model("S 580 e", ["Hibrit"], ["Otomatik"], ["Sedan"], ["3.0"], ["510 hp"]),
        model("W223", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Sedan"], ["3.0", "4.0"], ["330 hp", "510 hp"])
      ] },
      { name: "CLA Serisi", models: [
        model("CLA 250", ["Benzin"], ["Otomatik"], ["Coupe", "Sedan"], ["2.0"], ["224 hp"]),
        model("CLA 250+", ["Elektrik"], ["Otomatik"], ["Coupe", "Sedan"], ["0"], ["272 hp"]),
        model("CLA 350", ["Elektrik"], ["Otomatik"], ["Coupe", "Sedan"], ["0"], ["354 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Coupe", "Sedan"], ["0"], ["272 hp", "354 hp"]),
        model("AWD", ["Elektrik"], ["Otomatik"], ["Coupe", "Sedan"], ["0"], ["354 hp"])
      ] },
      { name: "GLA / GLB", models: [
        model("200", ["Benzin"], ["Otomatik"], ["SUV"], ["1.3"], ["163 hp"]),
        model("200 d", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["150 hp"]),
        model("220 d 4MATIC", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["190 hp"])
      ] },
      { name: "GLC / GLC Coupe", models: [
        model("220 d", ["Dizel"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["197 hp"]),
        model("300", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["258 hp"]),
        model("300 e", ["Hibrit"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["313 hp"]),
        model("400 e", ["Hibrit"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["381 hp"])
      ] },
      { name: "GLE / GLE Coupe", models: [
        model("300 d", ["Dizel"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["269 hp"]),
        model("350", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["255 hp"]),
        model("450", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["3.0"], ["381 hp"]),
        model("450 e", ["Hibrit"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["381 hp"]),
        model("580", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["4.0"], ["517 hp"])
      ] },
      { name: "GLS", models: [
        model("450", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["381 hp"]),
        model("580", ["Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["517 hp"]),
        model("7 Kişilik", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0", "4.0"], ["381 hp", "517 hp"])
      ] },
      { name: "G-Serisi", models: [
        model("G 450 d", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["367 hp"]),
        model("G 500", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["449 hp"]),
        model("G 580", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["587 hp"]),
        model("EQ Teknoloji", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["587 hp"]),
        model("Elektrikli G", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["587 hp"])
      ] },
      { name: "CLE Coupe / Cabriolet", models: [
        model("CLE 200", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["2.0"], ["204 hp"]),
        model("CLE 300", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["2.0"], ["258 hp"]),
        model("CLE 450", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["3.0"], ["381 hp"])
      ] },
      { name: "AMG GT", models: [
        model("GT 43", ["Benzin"], ["Otomatik"], ["Coupe", "Sedan"], ["2.0"], ["421 hp"]),
        model("GT 53", ["Benzin"], ["Otomatik"], ["Coupe", "Sedan"], ["3.0"], ["435 hp"]),
        model("GT 63 S E Performance", ["Hibrit"], ["Otomatik"], ["Coupe", "Sedan"], ["4.0"], ["843 hp"]),
        model("4-Kapı", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["2.0", "3.0", "4.0"], ["421 hp", "843 hp"]),
        model("2-Kapı", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.0"], ["585 hp"])
      ] },
      { name: "SL Roadster", models: [
        model("SL 43", ["Benzin"], ["Otomatik"], ["Roadster"], ["2.0"], ["381 hp"]),
        model("SL 55", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.0"], ["476 hp"]),
        model("SL 63 S E Performance", ["Hibrit"], ["Otomatik"], ["Roadster"], ["4.0"], ["816 hp"])
      ] },
      { name: "EQA / EQB", models: [
        model("250+", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["190 hp"]),
        model("300", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["228 hp"]),
        model("350", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["292 hp"])
      ] },
      { name: "EQE / EQE SUV", models: [
        model("300", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["245 hp"]),
        model("350", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["292 hp"]),
        model("350+", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["292 hp"]),
        model("500", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["408 hp"])
      ] },
      { name: "EQS / EQS SUV", models: [
        model("450", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["360 hp"]),
        model("450+", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["360 hp"]),
        model("580", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["544 hp"]),
        model("Facelift", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["360 hp", "544 hp"])
      ] },
      { name: "AMG 35 / 45 S", models: [
        model("A", ["Benzin"], ["Otomatik"], ["Hatchback", "Sedan"], ["2.0"], ["306 hp", "421 hp"]),
        model("CLA", ["Benzin"], ["Otomatik"], ["Coupe", "Sedan"], ["2.0"], ["306 hp", "421 hp"]),
        model("GLA", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["306 hp", "421 hp"]),
        model("GLB", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["306 hp", "421 hp"])
      ] },
      { name: "AMG 43 / 53", models: [
        model("C", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["421 hp"]),
        model("E", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], ["3.0"], ["435 hp"]),
        model("CLE", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["3.0"], ["449 hp"]),
        model("GLE", ["Benzin"], ["Otomatik"], ["SUV", "SUV Coupe"], ["3.0"], ["435 hp"]),
        model("EQE", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["476 hp"])
      ] },
      { name: "AMG 63 / 63 S E Performance", models: [
        model("C", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["680 hp"]),
        model("E", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["4.0"], ["585 hp", "612 hp"]),
        model("S", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["4.0"], ["612 hp", "802 hp"]),
        model("G", ["Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["585 hp"]),
        model("SL", ["Hibrit"], ["Otomatik"], ["Roadster"], ["4.0"], ["816 hp"]),
        model("GT", ["Hibrit"], ["Otomatik"], ["Coupe", "Sedan"], ["4.0"], ["843 hp"]),
        model("GLC", ["Hibrit"], ["Otomatik"], ["SUV", "SUV Coupe"], ["2.0"], ["680 hp"]),
        model("GLE", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV", "SUV Coupe"], ["4.0"], ["612 hp", "634 hp"]),
        model("EQS", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV"], ["0"], ["658 hp", "761 hp"])
      ] },
      { name: "Maybach S-Serisi", models: [
        model("S 580", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.0"], ["503 hp"]),
        model("S 680", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.0"], ["612 hp"]),
        model("Edition Emerald Isle", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.0"], ["612 hp"])
      ] },
      { name: "Maybach GLS", models: [
        model("GLS 600", ["Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["557 hp"])
      ] },
      { name: "Maybach EQS SUV", models: [
        model("EQS 680", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["658 hp"])
      ] },
      { name: "Maybach SL", models: [
        model("SL 680 Monogram Series", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.0"], ["585 hp"])
      ] },
      { name: "Vito / V-Class", models: [
        model("Vito 114 CDI", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["136 hp"]),
        model("Vito 119 CDI", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["190 hp"]),
        model("V-Class 220 d", ["Dizel"], ["Otomatik"], ["MPV"], ["2.0"], ["163 hp"]),
        model("V-Class 300 d", ["Dizel"], ["Otomatik"], ["MPV"], ["2.0"], ["239 hp"])
      ] },
      { name: "Sprinter", models: [
        model("Sprinter 315 CDI", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["150 hp"]),
        model("Sprinter 417 CDI", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["170 hp"]),
        model("eSprinter", ["Elektrik"], ["Otomatik"], ["Van"], ["0"], ["136 hp"])
      ] },
      { name: "Citan", models: [
        model("Citan 110", ["Benzin"], ["Manuel"], ["Van"], ["1.3"], ["102 hp"]),
        model("Citan 112 CDI", ["Dizel"], ["Manuel"], ["Van"], ["1.5"], ["95 hp"]),
        model("eCitan", ["Elektrik"], ["Otomatik"], ["Van"], ["0"], ["122 hp"])
      ] },
      { name: "X-Class", models: [
        model("X 220 d", ["Dizel"], ["Manuel"], ["Pickup"], ["2.3"], ["163 hp"]),
        model("X 250 d", ["Dizel"], ["Otomatik", "Manuel"], ["Pickup"], ["2.3"], ["190 hp"]),
        model("X 350 d", ["Dizel"], ["Otomatik"], ["Pickup"], ["3.0"], ["258 hp"])
      ] }
    ]
  },
  {
    name: "Volkswagen",
    series: [
      { name: "Arteon", models: [
        model("Arteon", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan", "Fastback"], ["1.5", "2.0"], ["150 hp", "190 hp"])
      ] },
      { name: "Beetle", models: [
        model("1.2 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["105 hp"]),
        model("1.3", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.3"], ["50 hp"]),
        model("1.4 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4"], ["150 hp"]),
        model("1.6", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.6"], ["102 hp"]),
        model("1.6 TDI Design", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.6"], ["105 hp"]),
        model("1.9 TDI", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.9"], ["105 hp"]),
        model("2.0", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.0"], ["115 hp"])
      ] },
      { name: "Bora", models: [
        model("1.6", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.6"], ["102 hp"]),
        model("1.8", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.8"], ["125 hp"]),
        model("1.9 TDI", ["Dizel"], ["Manuel"], ["Sedan", "Station Wagon"], ["1.9"], ["90 hp", "110 hp"]),
        model("1.9 TDI Comfortline Variant", ["Dizel"], ["Manuel"], ["Station Wagon"], ["1.9"], ["110 hp"]),
        model("2.3", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.3"], ["150 hp"])
      ] },
      { name: "EOS", models: [
        model("1.4 TSI", ["Benzin"], ["Manuel"], ["Cabrio"], ["1.4"], ["122 hp"]),
        model("1.6 FSI", ["Benzin"], ["Manuel"], ["Cabrio"], ["1.6"], ["115 hp"]),
        model("2.0", ["Benzin"], ["Otomatik"], ["Cabrio"], ["2.0"], ["150 hp"])
      ] },
      { name: "Golf", models: [
        model("1.0 eTSI", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.0"], ["110 hp"]),
        model("1.0 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["110 hp"]),
        model("1.2 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["105 hp"]),
        model("1.3", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.3"], ["55 hp"]),
        model("1.4", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4"], ["75 hp"]),
        model("1.4 CDI", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.4"], ["70 hp"]),
        model("1.4 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4"], ["122 hp", "140 hp"]),
        model("1.5 eHybrid", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["204 hp"]),
        model("1.5 eTSI", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["150 hp"]),
        model("1.5 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["150 hp"]),
        model("1.6", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6"], ["102 hp"]),
        model("1.6 FSI", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.6"], ["115 hp"]),
        model("1.6 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6"], ["105 hp", "115 hp"]),
        model("1.8", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.8"], ["125 hp"]),
        model("1.8 T", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.8"], ["150 hp"]),
        model("1.9", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.9"], ["90 hp"]),
        model("1.9 TDI", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.9"], ["90 hp", "110 hp"]),
        model("2.0", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["2.0"], ["115 hp"]),
        model("2.0 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["2.0"], ["150 hp"]),
        model("2.0 TSI", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.0"], ["245 hp"]),
        model("2.5", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.5"], ["150 hp"]),
        model("3.2 R", ["Benzin"], ["Otomatik"], ["Hatchback"], ["3.2"], ["250 hp"])
      ] },
      { name: "Elektrikli", models: [
        model("ID.3", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["204 hp"]),
        model("ID.7", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["286 hp"])
      ] },
      { name: "Jetta", models: [
        model("1.2 TSI", ["Benzin"], ["Manuel"], ["Sedan"], ["1.2"], ["105 hp"]),
        model("1.2 TSI BlueMotion", ["Benzin"], ["Manuel"], ["Sedan"], ["1.2"], ["105 hp"]),
        model("1.3 GL", ["Benzin"], ["Manuel"], ["Sedan"], ["1.3"], ["55 hp"]),
        model("1.4 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.4"], ["122 hp"]),
        model("1.4 TSI BlueMotion", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.4"], ["122 hp"]),
        model("1.5", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.5"], ["150 hp"]),
        model("1.6", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["102 hp"]),
        model("1.6 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["105 hp"]),
        model("1.8", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8"], ["125 hp"]),
        model("1.9 TDI", ["Dizel"], ["Manuel"], ["Sedan"], ["1.9"], ["105 hp"]),
        model("2.0", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["115 hp"]),
        model("2.5", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["170 hp"])
      ] },
      { name: "Lupo", models: [
        model("1.4", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4"], ["75 hp"]),
        model("Oxford", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4"], ["75 hp"]),
        model("Trendline", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4"], ["75 hp"])
      ] },
      { name: "Passat", models: [
        model("1.4 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.4"], ["122 hp", "150 hp"]),
        model("1.4 TSI BlueMotion", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.4"], ["122 hp"]),
        model("1.4 TSI Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.4"], ["218 hp"]),
        model("1.5 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["150 hp"]),
        model("1.6", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["102 hp"]),
        model("1.6 FSI", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["115 hp"]),
        model("1.6 TD GL", ["Dizel"], ["Manuel"], ["Sedan"], ["1.6"], ["70 hp"]),
        model("1.6 TDI BlueMotion", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["120 hp"]),
        model("1.8", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8"], ["125 hp"]),
        model("1.8 T", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8"], ["150 hp"]),
        model("1.8 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.8"], ["160 hp"]),
        model("1.9 TDI", ["Dizel"], ["Manuel"], ["Sedan"], ["1.9"], ["105 hp", "130 hp"]),
        model("2.0", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["115 hp"]),
        model("2.0 FSI", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["150 hp"]),
        model("2.0 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["150 hp", "190 hp"]),
        model("2.0 TDI BlueMotion", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["150 hp"]),
        model("2.0 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["220 hp"]),
        model("2.5 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["2.5"], ["150 hp"]),
        model("2.8", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.8"], ["193 hp"])
      ] },
      { name: "Passat Alltrack", models: [
        model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["190 hp"]),
        model("Alltrack", ["Dizel"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["190 hp"])
      ] },
      { name: "Passat Variant", models: [
        model("1.4 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.4"], ["122 hp", "150 hp"]),
        model("1.4 TSI BlueMotion", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.4"], ["122 hp"]),
        model("1.5 eHybrid", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.5"], ["204 hp"]),
        model("1.5 eTSI", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.5"], ["150 hp"]),
        model("1.5 TSI", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["1.5"], ["150 hp"]),
        model("1.6", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.6"], ["102 hp"]),
        model("1.6 FSI", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.6"], ["115 hp"]),
        model("1.6 TDI BlueMotion", ["Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.6"], ["120 hp"]),
        model("1.6 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.6"], ["105 hp"]),
        model("1.8", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.8"], ["125 hp"]),
        model("1.8 T", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.8"], ["150 hp"]),
        model("1.8 TSI", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["1.8"], ["160 hp"]),
        model("1.9 TDI", ["Dizel"], ["Manuel"], ["Station Wagon"], ["1.9"], ["105 hp"]),
        model("2.0", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["2.0"], ["115 hp"]),
        model("2.0 TDI BlueMotion", ["Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["2.0"], ["150 hp"]),
        model("2.5 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["2.5"], ["150 hp"])
      ] },
      { name: "Diğer Seriler", models: [
        model("Phaeton", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["3.0", "3.2", "4.2", "6.0"], ["224 hp", "420 hp"]),
        model("Polo", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2", "1.4", "1.6", "1.9"], ["60 hp", "110 hp"]),
        model("Scirocco", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Coupe"], ["1.4", "2.0"], ["122 hp", "280 hp"]),
        model("Sharan", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.4", "2.0"], ["150 hp", "184 hp"]),
        model("Touran", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.5", "2.0"], ["150 hp"]),
        model("Up", ["Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "0"], ["60 hp", "83 hp"]),
        model("VW CC", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["1.8", "2.0"], ["160 hp", "177 hp"]),
        model("Vento", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["102 hp", "105 hp"])
      ] },
      { name: "Tiguan", models: [
        model("1.5 TSI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]),
        model("2.0 TDI", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["150 hp", "200 hp"])
      ] },
      { name: "Touareg", models: [
        model("Touareg", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["231 hp", "286 hp", "462 hp"])
      ] },
      { name: "T-Roc", models: [
        model("T-Roc", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.0", "1.5", "2.0"], ["110 hp", "150 hp", "190 hp"])
      ] },
      { name: "Taigo", models: [
        model("Taigo", ["Benzin"], ["Manuel", "Otomatik"], ["Crossover"], ["1.0", "1.5"], ["95 hp", "150 hp"])
      ] },
      { name: "Caddy", models: [
        model("Caddy", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hafif Ticari"], ["1.5", "2.0"], ["102 hp", "122 hp"])
      ] },
      { name: "Transporter", models: [
        model("Transporter", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Van"], ["2.0", "0"], ["110 hp", "150 hp", "204 hp"])
      ] },
      { name: "Amarok", models: [
        model("Amarok", ["Dizel", "Benzin"], ["Otomatik", "Manuel"], ["Pickup"], ["2.0", "3.0"], ["170 hp", "240 hp"])
      ] },
      { name: "Crafter", models: [
        model("Crafter", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["140 hp", "177 hp"])
      ] },
      { name: "Multivan", models: [
        model("Multivan", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["MPV"], ["1.5", "2.0"], ["136 hp", "204 hp", "245 hp"])
      ] },
      { name: "ID.4", models: [
        model("ID.4", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp", "299 hp"])
      ] },
      { name: "ID.Buzz", models: [
        model("ID.Buzz", ["Elektrik"], ["Otomatik"], ["MPV", "Van"], ["0"], ["204 hp"])
      ] }
    ]
  },
  {
    name: "Toyota",
    series: [
      { name: "Corolla", models: [
        model("1.8 Hibrit", ["Hibrit"], ["Otomatik"], ["Sedan", "Hatchback"], ["1.8"], ["140 hp"]),
        model("1.5 Dynamic Force", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.5"], ["125 hp"]),
        model("Onyx Grey", ["Hibrit", "Benzin"], ["Otomatik", "Manuel"], ["Sedan", "Hatchback"], ["1.5", "1.8"], ["125 hp", "140 hp"]),
        model("12.3 inc Dijital Gosterge", ["Hibrit", "Benzin"], ["Otomatik", "Manuel"], ["Sedan", "Hatchback"], ["1.5", "1.8"], ["125 hp", "140 hp"])
      ] },
      { name: "Corolla GR SPORT", models: [
        model("GR SPORT", ["Hibrit"], ["Otomatik"], ["Sedan", "Hatchback"], ["1.8"], ["140 hp"]),
        model("Storm Grey", ["Hibrit"], ["Otomatik"], ["Sedan", "Hatchback"], ["1.8"], ["140 hp"]),
        model("Sportif Tampon", ["Hibrit"], ["Otomatik"], ["Sedan", "Hatchback"], ["1.8"], ["140 hp"])
      ] },
      { name: "Camry", models: [
        model("5. Nesil Hibrit", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.5"], ["225 hp", "232 hp"]),
        model("225 HP FWD", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.5"], ["225 hp"]),
        model("232 HP AWD", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.5"], ["232 hp"]),
        model("12.3 inc Ekran", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.5"], ["225 hp", "232 hp"])
      ] },
      { name: "Prius / Prius Plug-in", models: [
        model("Prius", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["2.0"], ["223 hp"]),
        model("Prius Prime", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["2.0"], ["223 hp"]),
        model("PHEV", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["2.0"], ["223 hp"]),
        model("70 km+ Elektrikli Menzil", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["2.0"], ["223 hp"])
      ] },
      { name: "RAV4", models: [
        model("226 HP Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["226 hp"]),
        model("320 HP Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["320 hp"]),
        model("Core", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["226 hp", "320 hp"]),
        model("Rugged", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["226 hp", "320 hp"]),
        model("Sport", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["226 hp", "320 hp"]),
        model("GR Sport", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["226 hp", "320 hp"])
      ] },
      { name: "C-HR", models: [
        model("Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.8", "2.0"], ["140 hp", "198 hp"]),
        model("BEV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["338 hp"]),
        model("338 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["338 hp"]),
        model("460 km Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["338 hp"])
      ] },
      { name: "Corolla Cross", models: [
        model("1.8 Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.8"], ["140 hp"]),
        model("2.0 Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["197 hp"])
      ] },
      { name: "Yaris Cross", models: [
        model("B-SUV Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["116 hp"])
      ] },
      { name: "Land Cruiser / LC250 / Prado", models: [
        model("2.8L Dizel-Hibrit 48V", ["Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["2.8"], ["204 hp"]),
        model("Arazi", ["Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["2.8"], ["204 hp"])
      ] },
      { name: "bZ / bZ4X", models: [
        model("500 km+ Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp", "218 hp"]),
        model("NACS", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp", "218 hp"]),
        model("Yeni Batarya Yonetimi", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp", "218 hp"])
      ] },
      { name: "bZ3 / bZ3C", models: [
        model("Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["184 hp", "245 hp"]),
        model("Crossover-Coupe", ["Elektrik"], ["Otomatik"], ["Coupe-SUV"], ["0"], ["245 hp"])
      ] },
      { name: "Hilux BEV", models: [
        model("196 HP", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["196 hp"]),
        model("260 km Menzil", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["196 hp"]),
        model("Elektrikli Pickup", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["196 hp"])
      ] },
      { name: "Hilux 48V Hybrid", models: [
        model("2.8L Dizel", ["Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Pickup"], ["2.8"], ["204 hp"]),
        model("48V Hybrid", ["Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Pickup"], ["2.8"], ["204 hp"])
      ] },
      { name: "Proace / Proace City", models: [
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Hafif Ticari"], ["0"], ["136 hp"]),
        model("Dizel", ["Dizel"], ["Manuel", "Otomatik"], ["Hafif Ticari"], ["1.5", "2.0"], ["100 hp", "180 hp"]),
        model("Ticari", ["Elektrik", "Dizel"], ["Otomatik", "Manuel"], ["Hafif Ticari"], ["0", "1.5", "2.0"], ["100 hp", "136 hp", "180 hp"])
      ] },
      { name: "TSS 3.0", models: [
        model("Toyota Safety Sense", ["Hibrit", "Benzin", "Elektrik"], ["Otomatik", "Manuel"], ["Sedan", "SUV", "Pickup"], ["0", "1.5", "1.8", "2.5"], ["116 hp", "338 hp"])
      ] },
      { name: "5. Nesil Hibrit", models: [
        model("Hafif Batarya", ["Hibrit"], ["Otomatik"], ["Sedan", "SUV"], ["1.8", "2.0", "2.5"], ["140 hp", "197 hp", "225 hp"]),
        model("Guclu Elektrik Motoru", ["Hibrit"], ["Otomatik"], ["Sedan", "SUV"], ["1.8", "2.0", "2.5"], ["140 hp", "197 hp", "225 hp"])
      ] },
      { name: "Arene OS", models: [
        model("Yazilim Tabanli Isletim Sistemi", ["Elektrik", "Hibrit"], ["Otomatik"], ["SUV", "Sedan"], ["0", "2.0", "2.5"], ["184 hp", "245 hp"])
      ] },
      { name: "GR SPORT", models: [
        model("Sportif Donanim", ["Hibrit", "Benzin"], ["Otomatik"], ["Sedan", "SUV"], ["1.8", "2.5"], ["140 hp", "226 hp"])
      ] },
      { name: "Yaris", models: [
        model("Yaris", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.5"], ["72 hp", "116 hp"])
      ] },
      { name: "Auris", models: [
        model("Auris", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2", "1.4", "1.8"], ["99 hp", "136 hp"])
      ] },
      { name: "Avensis", models: [
        model("Avensis", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.6", "1.8", "2.0"], ["132 hp", "147 hp"])
      ] },
      { name: "Verso", models: [
        model("Verso", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.6", "1.8"], ["132 hp", "112 hp"])
      ] },
      { name: "GT86 / GR86", models: [
        model("GT86", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0"], ["200 hp"]),
        model("GR86", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.4"], ["234 hp"])
      ] },
      { name: "GR Supra", models: [
        model("GR Supra", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0", "3.0"], ["258 hp", "340 hp"])
      ] },
      { name: "GR Yaris", models: [
        model("GR Yaris", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.6"], ["280 hp"])
      ] },
      { name: "Aygo / Aygo X", models: [
        model("Aygo", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["72 hp"]),
        model("Aygo X", ["Benzin"], ["Manuel", "Otomatik"], ["Crossover"], ["1.0"], ["72 hp"])
      ] },
      { name: "Highlander", models: [
        model("Highlander", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["248 hp"])
      ] },
      { name: "4Runner", models: [
        model("4Runner", ["Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["270 hp"])
      ] },
      { name: "Sequoia", models: [
        model("Sequoia", ["Hibrit"], ["Otomatik"], ["SUV"], ["3.4"], ["437 hp"])
      ] },
      { name: "Tacoma", models: [
        model("Tacoma", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Pickup"], ["2.4"], ["228 hp", "326 hp"])
      ] },
      { name: "Tundra", models: [
        model("Tundra", ["Benzin", "Hibrit"], ["Otomatik"], ["Pickup"], ["3.4"], ["389 hp", "437 hp"])
      ] }
    ]
  },
  {
    name: "Renault",
    series: [
      { name: "Captur", models: [
        model("1.0 TCe", ["Benzin"], ["Manuel"], ["SUV"], ["1.0"], ["90 hp"]),
        model("Mild Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3"], ["140 hp"]),
        model("e-Tech Full Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["145 hp"])
      ] },
      { name: "Austral", models: [
        model("Techno", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2", "1.3"], ["140 hp", "200 hp"]),
        model("Esprit Alpine", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2", "1.3"], ["140 hp", "200 hp"]),
        model("1.2 Full Hybrid 200 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["200 hp"]),
        model("1.3 Mild Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3"], ["140 hp"])
      ] },
      { name: "Boreal", models: [
        model("Dacia Bigster Tabanli", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.2", "1.6"], ["140 hp", "155 hp"]),
        model("Genis Aile SUV", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.2", "1.6"], ["140 hp", "155 hp"])
      ] },
      { name: "Symbioz", models: [
        model("C-Segment Hibrit SUV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["145 hp"])
      ] },
      { name: "Arkana", models: [
        model("e-Tech Full Hybrid", ["Hibrit"], ["Otomatik"], ["Coupe-SUV"], ["1.6"], ["145 hp"]),
        model("Coupe-SUV", ["Benzin", "Hibrit"], ["Otomatik"], ["Coupe-SUV"], ["1.3", "1.6"], ["140 hp", "145 hp"])
      ] },
      { name: "Rafale", models: [
        model("300 HP Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV-Coupe"], ["1.2"], ["300 hp"]),
        model("e-Tech Full Hybrid", ["Hibrit"], ["Otomatik"], ["SUV-Coupe"], ["1.2"], ["200 hp"]),
        model("SUV-Coupe", ["Hibrit"], ["Otomatik"], ["SUV-Coupe"], ["1.2"], ["200 hp", "300 hp"])
      ] },
      { name: "Espace", models: [
        model("7 Kisilik Hibrit SUV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["200 hp"])
      ] },
      { name: "Filante", models: [
        model("Luks Hibrit SUV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["200 hp"])
      ] },
      { name: "Kardian", models: [
        model("Kompakt Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], ["1.0"], ["125 hp"])
      ] },
      { name: "Renault 5 / R5 e-Tech", models: [
        model("400 km Menzil", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["150 hp"]),
        model("Reno Asistan", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["150 hp"])
      ] },
      { name: "Renault 4 / R4 e-Tech", models: [
        model("Elektrikli Crossover", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["150 hp"])
      ] },
      { name: "Megane e-Tech", models: [
        model("130 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["130 hp"]),
        model("220 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["220 hp"]),
        model("Elektrikli Hatchback", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["130 hp", "220 hp"]),
        model("Elektrikli Crossover", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["220 hp"])
      ] },
      { name: "Scenic e-Tech", models: [
        model("620 km Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["220 hp"]),
        model("Elektrikli Aile Araci", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["220 hp"])
      ] },
      { name: "Twingo e-Tech", models: [
        model("Elektrikli Sehir Araci", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["95 hp"])
      ] },
      { name: "Clio", models: [
        model("1.0 Sce", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["65 hp"]),
        model("1.0 TCe", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["90 hp"]),
        model("LPG", ["Benzin", "LPG"], ["Manuel"], ["Hatchback"], ["1.0"], ["100 hp"]),
        model("e-Tech Full Hybrid 145", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.6"], ["145 hp"])
      ] },
      { name: "Taliant", models: [
        model("Joy", ["Benzin"], ["Manuel"], ["Sedan"], ["1.0"], ["90 hp"]),
        model("Touch", ["Benzin"], ["Manuel"], ["Sedan"], ["1.0"], ["90 hp"]),
        model("Ekonomik B-Sedan", ["Benzin"], ["Manuel"], ["Sedan"], ["1.0"], ["90 hp"])
      ] },
      { name: "Megane Sedan", models: [
        model("1.3 TCe", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.3"], ["140 hp"]),
        model("1.5 BlueHDi", ["Dizel"], ["Otomatik"], ["Sedan"], ["1.5"], ["115 hp"])
      ] },
      { name: "Megane Hatchback", models: [
        model("Benzinli", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.3"], ["140 hp"]),
        model("Dizel", ["Dizel"], ["Otomatik"], ["Hatchback"], ["1.5"], ["115 hp"])
      ] },
      { name: "Fluence", models: [
        model("1.5 dCi", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.5"], ["110 hp"]),
        model("1.6", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["110 hp"]),
        model("Sedan", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.5", "1.6"], ["110 hp"])
      ] },
      { name: "Symbol", models: [
        model("1.0", ["Benzin"], ["Manuel"], ["Sedan"], ["1.0"], ["72 hp"]),
        model("1.2", ["Benzin"], ["Manuel"], ["Sedan"], ["1.2"], ["75 hp"]),
        model("1.5 dCi", ["Dizel"], ["Manuel"], ["Sedan"], ["1.5"], ["85 hp"])
      ] },
      { name: "Laguna", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "2.0"], ["110 hp", "150 hp"]),
        model("Hatchback", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6", "2.0"], ["110 hp", "150 hp"]),
        model("Sport Tourer", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.6", "2.0"], ["110 hp", "150 hp"])
      ] },
      { name: "Kangoo / Kangoo e-Tech", models: [
        model("Van", ["Dizel", "Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["Hafif Ticari"], ["1.5", "1.3", "0"], ["95 hp", "115 hp", "122 hp"]),
        model("Combi", ["Dizel", "Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["MPV"], ["1.5", "1.3", "0"], ["95 hp", "115 hp", "122 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Hafif Ticari", "MPV"], ["0"], ["122 hp"])
      ] },
      { name: "Trafic / Trafic e-Tech", models: [
        model("Dizel", ["Dizel"], ["Manuel", "Otomatik"], ["Panelvan"], ["2.0"], ["130 hp", "170 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Panelvan"], ["0"], ["204 hp"]),
        model("800V Hizli Sarj", ["Elektrik"], ["Otomatik"], ["Panelvan"], ["0"], ["204 hp"])
      ] },
      { name: "Master / Master e-Tech", models: [
        model("Aerovan", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Van"], ["2.0", "0"], ["170 hp", "204 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Van"], ["0"], ["204 hp"]),
        model("Dizel", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["170 hp"])
      ] },
      { name: "Estafette", models: [
        model("SDV Elektrikli Minibus", ["Elektrik"], ["Otomatik"], ["Minibus"], ["0"], ["160 hp"])
      ] },
      { name: "Scenic Klasik", models: [
        model("MPV", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.5", "1.6", "2.0"], ["110 hp", "140 hp"])
      ] },
      { name: "Grand Scenic", models: [
        model("7 Kisilik MPV", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.3", "1.5"], ["140 hp", "115 hp"])
      ] },
      { name: "e-Tech Full Hybrid", models: [
        model("Sarjsiz Hibrit", ["Hibrit"], ["Otomatik"], ["Hatchback", "SUV"], ["1.6"], ["145 hp", "200 hp"])
      ] },
      { name: "Esprit Alpine", models: [
        model("Sportif Premium Donanim", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2", "1.3"], ["140 hp", "200 hp"])
      ] },
      { name: "OpenR Link", models: [
        model("Google Entegre Multimedya", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik"], ["SUV", "Hatchback"], ["0", "1.2", "1.6"], ["145 hp", "200 hp"])
      ] },
      { name: "Koleos", models: [
        model("Koleos", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["1.7", "2.0"], ["150 hp", "190 hp"])
      ] },
      { name: "Kadjar", models: [
        model("Kadjar", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.3", "1.5"], ["140 hp", "115 hp"])
      ] },
      { name: "Modus", models: [
        model("Modus", ["Benzin", "Dizel"], ["Manuel"], ["MPV"], ["1.2", "1.5"], ["75 hp", "85 hp"])
      ] },
      { name: "Latitude", models: [
        model("Latitude", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0", "3.0"], ["150 hp", "240 hp"])
      ] },
      { name: "Vel Satis", models: [
        model("Vel Satis", ["Benzin", "Dizel"], ["Otomatik"], ["Hatchback"], ["2.0", "3.0"], ["165 hp", "240 hp"])
      ] },
      { name: "Safrane", models: [
        model("Safrane", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0", "2.5"], ["140 hp", "170 hp"])
      ] },
      { name: "R19", models: [
        model("R19", ["Benzin", "Dizel"], ["Manuel"], ["Sedan", "Hatchback"], ["1.4", "1.7", "1.9"], ["80 hp", "92 hp"])
      ] },
      { name: "R21", models: [
        model("R21", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.7", "2.0"], ["90 hp", "120 hp"])
      ] },
      { name: "R9 / Broadway", models: [
        model("R9", ["Benzin"], ["Manuel"], ["Sedan"], ["1.4"], ["72 hp"]),
        model("Broadway", ["Benzin"], ["Manuel"], ["Sedan"], ["1.4"], ["72 hp"])
      ] },
      { name: "Twizy", models: [
        model("Twizy", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["17 hp"])
      ] }
    ]
  },
  {
    name: "Regal Raptor",
    series: [
      { name: "K4", models: [
        model("2 Kisilik", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2300W"]),
        model("2300W Motor", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2300W"]),
        model("45 km/s", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2300W"]),
        model("40-50 km Menzil", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2300W"])
      ] },
      { name: "K5 Long", models: [
        model("2500W Motor", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2500W"]),
        model("72V 60Ah", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2500W"]),
        model("60 km Menzil", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2500W"])
      ] },
      { name: "K5 Pro", models: [
        model("2500W Motor", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2500W"]),
        model("80 km Menzil", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2500W"]),
        model("100 km Menzil", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["2500W"])
      ] },
      { name: "K5 Van", models: [
        model("Tek Kisilik", ["Elektrik"], ["Otomatik"], ["Mikro Ticari"], ["0"], ["2500W"]),
        model("Kargo Hacimli", ["Elektrik"], ["Otomatik"], ["Mikro Ticari"], ["0"], ["2500W"]),
        model("Ticari", ["Elektrik"], ["Otomatik"], ["Mikro Ticari"], ["0"], ["2500W"])
      ] },
      { name: "M1", models: [
        model("3.5 kW Motor", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["3.5 kW"]),
        model("Lityum 110Ah", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["3.5 kW"]),
        model("130 km Menzil", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["3.5 kW"]),
        model("Premium", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["3.5 kW"])
      ] },
      { name: "Pilder Serisi", models: [
        model("Pilder 125", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.125"], ["14.4 HP"]),
        model("Pilder 250", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.250"], ["25 HP"]),
        model("14.4 HP", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.125"], ["14.4 HP"]),
        model("25 HP", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.250"], ["25 HP"]),
        model("6 Vites", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.125", "0.250"], ["14.4 HP", "25 HP"])
      ] },
      { name: "Daytona Serisi", models: [
        model("Daytona 250", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.250"], ["18 HP"])
      ] },
      { name: "Spyder Serisi", models: [
        model("Spyder 250", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.250"], ["18 HP"]),
        model("Long Fork", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.250"], ["18 HP"])
      ] },
      { name: "Classic Serisi", models: [
        model("Classic 150", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.150"], ["12 HP"]),
        model("Classic 250", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.250"], ["18 HP"])
      ] },
      { name: "K1", models: [
        model("3 Tekerlekli", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("Kompakt Sehir Ici", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"])
      ] },
      { name: "K3", models: [
        model("LCD Ekran", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("Kapali Kabin", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"])
      ] },
      { name: "K3-KLS", models: [
        model("4 Tekerlekli", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("Kompakt Tasarim", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"])
      ] }
    ]
  },
  {
    name: "Relive",
    series: [
      { name: "N1 / BAW01", models: [
        model("3 Kapili", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("2 Koltuklu", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("4 Koltuklu", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("170 km Menzil", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("100 km/s", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("LFP Batarya", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"])
      ] },
      { name: "EM-03", models: [
        model("Elektrikli Sehir Serisi", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"])
      ] },
      { name: "EZI", models: [
        model("Akilli ve Estetik Mobilite", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"])
      ] },
      { name: "NOMAD XL", models: [
        model("Hafif Hizmet", ["Elektrik"], ["Otomatik"], ["Ticari"], ["0"], ["0"]),
        model("Genisletilmis Kullanim", ["Elektrik"], ["Otomatik"], ["Ticari"], ["0"], ["0"])
      ] },
      { name: "T7 Light Truck", models: [
        model("1.6L", ["Benzin"], ["Manuel"], ["Hafif Ticari"], ["1.6"], ["117 HP"]),
        model("117 HP", ["Benzin"], ["Manuel"], ["Hafif Ticari"], ["1.6"], ["117 HP"]),
        model("Benzinli", ["Benzin"], ["Manuel"], ["Hafif Ticari"], ["1.6"], ["117 HP"]),
        model("N1 Sinifi", ["Benzin"], ["Manuel"], ["Hafif Ticari"], ["1.6"], ["117 HP"])
      ] },
      { name: "T7 Electric Truck", models: [
        model("Elektrikli Lojistik", ["Elektrik"], ["Otomatik"], ["Hafif Ticari"], ["0"], ["0"]),
        model("MTV Avantajli", ["Elektrik"], ["Otomatik"], ["Hafif Ticari"], ["0"], ["0"])
      ] },
      { name: "Cargo Van", models: [
        model("Cargo Van", ["Elektrik"], ["Otomatik"], ["Panelvan"], ["0"], ["0"])
      ] },
      { name: "Mini EV", models: [
        model("Mini EV", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"])
      ] },
      { name: "Urban EV", models: [
        model("Urban EV", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"])
      ] }
    ]
  },
  {
    name: "Rolls-Royce",
    series: [
      { name: "Phantom Series II", models: [
        model("6.75L V12 Twin-Turbo", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.75"], ["563 hp"])
      ] },
      { name: "Phantom Extended Series II", models: [
        model("Uzun Sasi", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.75"], ["563 hp"])
      ] },
      { name: "Ghost Series II", models: [
        model("Yeni Pantheon Izgara", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.75"], ["563 hp"]),
        model("L-Sekilli LED", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.75"], ["563 hp"])
      ] },
      { name: "Ghost Extended Series II", models: [
        model("Uzun Sasi", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.75"], ["563 hp"])
      ] },
      { name: "Cullinan Series II", models: [
        model("Modernize Tasarim", ["Benzin"], ["Otomatik"], ["SUV"], ["6.75"], ["592 hp"])
      ] },
      { name: "Black Badge Cullinan Series II", models: [
        model("600 HP+", ["Benzin"], ["Otomatik"], ["SUV"], ["6.75"], ["600+ hp"]),
        model("Duality Twill", ["Benzin"], ["Otomatik"], ["SUV"], ["6.75"], ["600+ hp"])
      ] },
      { name: "Spectre", models: [
        model("Elektrikli Super Coupe", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["580 hp"]),
        model("580 HP", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["580 hp"]),
        model("500 km Menzil", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["580 hp"])
      ] },
      { name: "Black Badge Spectre", models: [
        model("Elektrikli Performans", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["650 hp"])
      ] },
      { name: "Dawn", models: [
        model("Dawn", ["Benzin"], ["Otomatik"], ["Cabrio"], ["6.6"], ["563 hp"])
      ] },
      { name: "Wraith", models: [
        model("Wraith", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.6"], ["624 hp"])
      ] },
      { name: "Dawn Black Badge", models: [
        model("Dawn Black Badge", ["Benzin"], ["Otomatik"], ["Cabrio"], ["6.6"], ["593 hp"])
      ] },
      { name: "Wraith Black Badge", models: [
        model("Wraith Black Badge", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.6"], ["624 hp"])
      ] },
      { name: "Silver Shadow", models: [
        model("Silver Shadow", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.2", "6.75"], ["172 hp"])
      ] },
      { name: "Silver Spur", models: [
        model("Silver Spur", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.75"], ["220 hp"])
      ] },
      { name: "Corniche", models: [
        model("Corniche", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio"], ["6.75"], ["240 hp"])
      ] },
      { name: "Camargue", models: [
        model("Camargue", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.75"], ["220 hp"])
      ] }
    ]
  },
  {
    name: "Rover",
    series: [
      { name: "Rover 75", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8", "2.0", "2.5"], ["120 hp", "150 hp", "177 hp"]),
        model("Tourer", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.8", "2.0", "2.5"], ["120 hp", "150 hp", "177 hp"])
      ] },
      { name: "Rover 25 / 45 / 75", models: [
        model("Rover 25", ["Benzin", "Dizel"], ["Manuel"], ["Hatchback"], ["1.4", "1.6", "2.0"], ["84 hp", "103 hp", "101 hp"]),
        model("Rover 45", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.4", "1.6", "2.0"], ["103 hp", "150 hp"]),
        model("Rover 75", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8", "2.0", "2.5"], ["120 hp", "177 hp"])
      ] },
      { name: "Rover 200 / 400 / 600 / 800", models: [
        model("Rover 200", ["Benzin", "Dizel"], ["Manuel"], ["Hatchback"], ["1.4", "1.6", "2.0"], ["84 hp", "103 hp", "105 hp"]),
        model("Rover 400", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.4", "1.6", "2.0"], ["103 hp", "136 hp"]),
        model("Rover 600", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8", "2.0", "2.3"], ["115 hp", "158 hp"]),
        model("Rover 800", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["2.0", "2.5", "2.7"], ["136 hp", "177 hp"]),
        model("Vitesse", ["Benzin"], ["Manuel"], ["Sedan"], ["2.0"], ["180 hp"]),
        model("Sterling", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5", "2.7"], ["177 hp"]),
        model("Coupe", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0", "2.7"], ["180 hp"])
      ] },
      { name: "Rover Streetwise", models: [
        model("Crossover", ["Benzin", "Dizel"], ["Manuel"], ["Crossover"], ["1.4", "1.6", "2.0"], ["84 hp", "103 hp", "101 hp"])
      ] },
      { name: "Rover SD1", models: [
        model("3500 V8", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["3.5"], ["155 hp"]),
        model("2600", ["Benzin"], ["Manuel"], ["Sedan"], ["2.6"], ["136 hp"]),
        model("2300", ["Benzin"], ["Manuel"], ["Sedan"], ["2.3"], ["123 hp"])
      ] },
      { name: "P6 Serisi", models: [
        model("2000", ["Benzin"], ["Manuel"], ["Sedan"], ["2.0"], ["104 hp"]),
        model("2200", ["Benzin"], ["Manuel"], ["Sedan"], ["2.2"], ["115 hp"]),
        model("3500", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["3.5"], ["146 hp"])
      ] },
      { name: "P5 / P5B", models: [
        model("3.5 V8", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.5"], ["161 hp"])
      ] },
      { name: "Rover Mini", models: [
        model("Mini Cooper", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.3"], ["63 hp"]),
        model("Mini Classic", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0", "1.3"], ["41 hp", "63 hp"])
      ] }
    ]
  },
  {
    name: "Saab",
    series: [
      { name: "9-3 Serisi", models: [
        model("9-3 Aero", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0", "2.8"], ["150 hp", "210 hp", "250 hp"]),
        model("9-3 Viggen", ["Benzin"], ["Manuel"], ["Coupe"], ["2.3"], ["225 hp"]),
        model("9-3 SportCombi", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.9", "2.0"], ["150 hp", "180 hp"]),
        model("9-3 Convertible", ["Benzin"], ["Manuel", "Otomatik"], ["Cabrio"], ["2.0", "2.8"], ["175 hp", "250 hp"]),
        model("9-3 Independence Edition", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["220 hp"])
      ] },
      { name: "9-5 Serisi", models: [
        model("9-5 Aero", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.3", "2.8"], ["260 hp", "300 hp"]),
        model("9-5 Griffin", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0", "2.8"], ["220 hp", "300 hp"])
      ] },
      { name: "900 Serisi", models: [
        model("900 Turbo", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Coupe", "Cabrio"], ["2.0"], ["145 hp", "175 hp"]),
        model("900 NG / New Generation", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Coupe", "Cabrio"], ["2.0", "2.3"], ["130 hp", "185 hp"])
      ] },
      { name: "9-4X", models: [
        model("9-4X", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0", "2.8"], ["265 hp", "300 hp"])
      ] },
      { name: "9-7X", models: [
        model("9-7X", ["Benzin"], ["Otomatik"], ["SUV"], ["4.2", "5.3"], ["285 hp", "300 hp"])
      ] },
      { name: "9-7X Aero", models: [
        model("9-7X Aero", ["Benzin"], ["Otomatik"], ["SUV"], ["6.0"], ["390 hp"])
      ] },
      { name: "9000", models: [
        model("9000", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["2.0", "2.3"], ["130 hp", "225 hp"])
      ] },
      { name: "99 Turbo", models: [
        model("99 Turbo", ["Benzin"], ["Manuel"], ["Coupe", "Sedan"], ["2.0"], ["145 hp"])
      ] },
      { name: "Sonett", models: [
        model("Sonett", ["Benzin"], ["Manuel"], ["Coupe"], ["1.5", "1.7"], ["65 hp"])
      ] },
      { name: "96", models: [
        model("96", ["Benzin"], ["Manuel"], ["Sedan"], ["0.8", "1.5"], ["40 hp", "68 hp"])
      ] },
      { name: "95 Wagon", models: [
        model("95 Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.5"], ["68 hp"])
      ] },
      { name: "93 Classic", models: [
        model("93 Classic", ["Benzin"], ["Manuel"], ["Sedan"], ["0.75"], ["33 hp"])
      ] }
    ]
  },
  {
    name: "Fiat",
    series: [
      { name: "Egea Sedan", models: [
        model("1.4 Fire 95 HP", ["Benzin"], ["Manuel"], ["Sedan"], ["1.4"], ["95 hp"]),
        model("1.6 MultiJet 130 HP", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["130 hp"]),
        model("1.5 T4 Hibrit 130 HP", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["130 hp"]),
        model("Easy", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Urban", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Lounge", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Limited", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"])
      ] },
      { name: "Egea Cross", models: [
        model("1.4 Fire 95 HP", ["Benzin"], ["Manuel"], ["Crossover"], ["1.4"], ["95 hp"]),
        model("1.6 MultiJet 130 HP DCT", ["Dizel"], ["Otomatik"], ["Crossover"], ["1.6"], ["130 hp"]),
        model("1.5 T4 Hibrit 130 HP", ["Hibrit"], ["Otomatik"], ["Crossover"], ["1.5"], ["130 hp"]),
        model("Street", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Crossover"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Urban", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Crossover"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Lounge", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Crossover"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Limited", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Crossover"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"])
      ] },
      { name: "Egea Cross Wagon", models: [
        model("1.6 MultiJet 130 HP DCT", ["Dizel"], ["Otomatik"], ["Station Wagon"], ["1.6"], ["130 hp"]),
        model("1.5 T4 Hibrit 130 HP", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.5"], ["130 hp"]),
        model("Lounge", ["Dizel", "Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.5", "1.6"], ["130 hp"])
      ] },
      { name: "Egea Hatchback", models: [
        model("1.4 Fire 95 HP", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4"], ["95 hp"]),
        model("1.6 MultiJet 130 HP DCT", ["Dizel"], ["Otomatik"], ["Hatchback"], ["1.6"], ["130 hp"]),
        model("Street", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "1.6"], ["95 hp", "130 hp"]),
        model("Urban", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "1.6"], ["95 hp", "130 hp"])
      ] },
      { name: "500e", models: [
        model("87 kW", ["Elektrik"], ["Otomatik"], ["Hatchback", "Cabrio"], ["0"], ["118 hp"]),
        model("118 HP", ["Elektrik"], ["Otomatik"], ["Hatchback", "Cabrio"], ["0"], ["118 hp"]),
        model("La Prima by Bocelli", ["Elektrik"], ["Otomatik"], ["Hatchback", "Cabrio"], ["0"], ["118 hp"]),
        model("Hatchback", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["95 hp", "118 hp"]),
        model("3+1", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["118 hp"]),
        model("Cabrio", ["Elektrik"], ["Otomatik"], ["Cabrio"], ["0"], ["118 hp"])
      ] },
      { name: "500 Hibrit", models: [
        model("1.0 Firefly 70 HP", ["Hibrit"], ["Manuel"], ["Hatchback"], ["1.0"], ["70 hp"]),
        model("Dolcevita", ["Hibrit"], ["Manuel"], ["Hatchback"], ["1.0"], ["70 hp"]),
        model("Cult", ["Hibrit"], ["Manuel"], ["Hatchback"], ["1.0"], ["70 hp"])
      ] },
      { name: "600 / 600e", models: [
        model("1.2 Hibrit 100 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["100 hp"]),
        model("115 kW Elektrikli", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["156 hp"]),
        model("La Prima", ["Hibrit", "Elektrik"], ["Otomatik"], ["SUV"], ["0", "1.2"], ["100 hp", "156 hp"])
      ] },
      { name: "Topolino", models: [
        model("6 kW", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], ["0"], ["8 hp"]),
        model("8 HP", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], ["0"], ["8 hp"]),
        model("Standart", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], ["0"], ["8 hp"]),
        model("Plus", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], ["0"], ["8 hp"])
      ] },
      { name: "Grande Panda", models: [
        model("Elektrikli 113 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["113 hp"]),
        model("1.2 MHEV Hibrit 100 HP", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["100 hp"]),
        model("Icon", ["Elektrik", "Hibrit"], ["Otomatik"], ["Hatchback"], ["0", "1.2"], ["100 hp", "113 hp"]),
        model("La Prima", ["Elektrik", "Hibrit"], ["Otomatik"], ["Hatchback"], ["0", "1.2"], ["100 hp", "113 hp"])
      ] },
      { name: "Panda Klasik", models: [
        model("1.0 Hibrit 70 HP", ["Hibrit"], ["Manuel"], ["Hatchback"], ["1.0"], ["70 hp"]),
        model("City", ["Hibrit"], ["Manuel"], ["Hatchback"], ["1.0"], ["70 hp"]),
        model("Cross", ["Hibrit"], ["Manuel"], ["Hatchback"], ["1.0"], ["70 hp"]),
        model("Cross 4x4", ["Hibrit"], ["Manuel"], ["Hatchback"], ["1.0"], ["70 hp"])
      ] },
      { name: "Doblo / ë-Doblo", models: [
        model("1.5 BlueHDi 100 HP", ["Dizel"], ["Manuel"], ["Van", "Kombi"], ["1.5"], ["100 hp"]),
        model("1.5 BlueHDi 130 HP", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "Kombi"], ["1.5"], ["130 hp"]),
        model("100 kW Elektrikli", ["Elektrik"], ["Otomatik"], ["Van", "Kombi"], ["0"], ["136 hp"]),
        model("Cargo", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Van"], ["0", "1.5"], ["100 hp", "136 hp"]),
        model("Maxi", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Van"], ["0", "1.5"], ["130 hp", "136 hp"]),
        model("Kombi", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Kombi"], ["0", "1.5"], ["100 hp", "136 hp"]),
        model("Easy", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "Kombi"], ["1.5"], ["100 hp", "130 hp"]),
        model("Premio", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Van", "Kombi"], ["0", "1.5"], ["130 hp", "136 hp"])
      ] },
      { name: "Fiorino", models: [
        model("1.4 Fire LPG", ["Benzin", "LPG"], ["Manuel"], ["Van", "Kombi"], ["1.4"], ["77 hp"]),
        model("1.3 MultiJet 95 HP", ["Dizel"], ["Manuel"], ["Van", "Kombi"], ["1.3"], ["95 hp"]),
        model("Cargo", ["Benzin", "Dizel", "LPG"], ["Manuel"], ["Van"], ["1.3", "1.4"], ["77 hp", "95 hp"]),
        model("Combi", ["Benzin", "Dizel", "LPG"], ["Manuel"], ["Kombi"], ["1.3", "1.4"], ["77 hp", "95 hp"]),
        model("Pop", ["Benzin", "Dizel", "LPG"], ["Manuel"], ["Van", "Kombi"], ["1.3", "1.4"], ["77 hp", "95 hp"]),
        model("Safeline", ["Benzin", "Dizel", "LPG"], ["Manuel"], ["Van", "Kombi"], ["1.3", "1.4"], ["77 hp", "95 hp"]),
        model("Premio", ["Benzin", "Dizel", "LPG"], ["Manuel"], ["Van", "Kombi"], ["1.3", "1.4"], ["77 hp", "95 hp"])
      ] },
      { name: "Scudo / Ulysse", models: [
        model("2.0 BlueHDi 145 HP", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "Minibus"], ["2.0"], ["145 hp"]),
        model("2.0 BlueHDi 180 HP", ["Dizel"], ["Otomatik"], ["Van", "Minibus"], ["2.0"], ["180 hp"]),
        model("Panelvan", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["145 hp", "180 hp"]),
        model("8+1", ["Dizel"], ["Otomatik"], ["Minibus"], ["2.0"], ["180 hp"]),
        model("9+1", ["Dizel"], ["Otomatik"], ["Minibus"], ["2.0"], ["180 hp"])
      ] },
      { name: "Ducato / ë-Ducato", models: [
        model("2.2 MultiJet 140 HP", ["Dizel"], ["Manuel"], ["Van", "Kamyonet", "Minibüs"], ["2.2"], ["140 hp"]),
        model("2.2 MultiJet 180 HP", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "Kamyonet", "Minibüs"], ["2.2"], ["180 hp"]),
        model("Van", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Van"], ["0", "2.2"], ["122 hp", "180 hp"]),
        model("Kamyonet", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Kamyonet"], ["0", "2.2"], ["122 hp", "180 hp"]),
        model("Minibüs", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Minibüs"], ["0", "2.2"], ["122 hp", "180 hp"])
      ] },
      { name: "Linea", models: [
        model("1.3 MultiJet", ["Dizel"], ["Manuel"], ["Sedan"], ["1.3"], ["95 hp"]),
        model("1.6 MultiJet", ["Dizel"], ["Manuel"], ["Sedan"], ["1.6"], ["105 hp", "120 hp"]),
        model("Classic", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.3", "1.4", "1.6"], ["77 hp", "120 hp"]),
        model("Actual", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.3", "1.4"], ["77 hp", "95 hp"]),
        model("Pop", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.3", "1.4", "1.6"], ["77 hp", "120 hp"]),
        model("Lounge", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.3", "1.4", "1.6"], ["77 hp", "120 hp"])
      ] },
      { name: "Punto", models: [
        model("Grande Punto", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2", "1.3", "1.4"], ["65 hp", "90 hp"]),
        model("Punto Evo", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2", "1.3", "1.4"], ["65 hp", "95 hp"]),
        model("1.2", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["69 hp"]),
        model("1.4", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4"], ["77 hp"]),
        model("1.3 MultiJet", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.3"], ["75 hp", "95 hp"])
      ] },
      { name: "Bravo", models: [
        model("1.6 MultiJet", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6"], ["105 hp", "120 hp"]),
        model("Dynamic", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "1.6"], ["90 hp", "120 hp"]),
        model("Sport", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "1.6"], ["120 hp", "150 hp"])
      ] },
      { name: "Freemont", models: [
        model("2.0 MultiJet AWD", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["170 hp"])
      ] },
      { name: "500L / 500X", models: [
        model("Cross", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV", "SUV"], ["1.0", "1.3", "1.6"], ["95 hp", "120 hp"]),
        model("Living", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.3", "1.6"], ["95 hp", "120 hp"]),
        model("Trekking", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV", "SUV"], ["1.0", "1.3", "1.6"], ["95 hp", "120 hp"])
      ] }
    ]
  },
  {
    name: "Ford",
    series: [
      { name: "Focus", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.0", "1.5"], ["120 hp", "125 hp"]),
        model("Hatchback", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.5"], ["120 hp", "125 hp"]),
        model("Station Wagon", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.0", "1.5"], ["120 hp", "125 hp"]),
        model("Titanium", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback", "Station Wagon"], ["1.0", "1.5"], ["120 hp", "125 hp"]),
        model("Active", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback", "Station Wagon"], ["1.0", "1.5"], ["120 hp", "125 hp"]),
        model("ST-Line", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback", "Station Wagon"], ["1.0", "1.5"], ["125 hp", "155 hp"]),
        model("1.5L EcoBlue", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback", "Station Wagon"], ["1.5"], ["120 hp"]),
        model("1.0L EcoBoost", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback", "Station Wagon"], ["1.0"], ["125 hp"])
      ] },
      { name: "Mustang", models: [
        model("EcoBoost", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe", "Cabrio"], ["2.3"], ["315 hp"]),
        model("GT V8", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe", "Cabrio"], ["5.0"], ["446 hp", "454 hp"]),
        model("Dark Horse", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["5.0"], ["453 hp"]),
        model("Coupé", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["2.3", "5.0"], ["315 hp", "454 hp"]),
        model("Convertible", ["Benzin"], ["Otomatik", "Manuel"], ["Cabrio"], ["2.3", "5.0"], ["315 hp", "446 hp"])
      ] },
      { name: "Mustang GTD", models: [
        model("800+ HP", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["815 hp"])
      ] },
      { name: "Fiesta", models: [
        model("1.0", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["100 hp", "125 hp"]),
        model("1.1", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.1"], ["75 hp", "85 hp"]),
        model("1.5 TDCi", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.5"], ["85 hp", "120 hp"])
      ] },
      { name: "Puma", models: [
        model("Titanium", ["Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["125 hp", "155 hp"]),
        model("ST-Line", ["Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["125 hp", "155 hp"]),
        model("ST-Line X", ["Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["125 hp", "155 hp"]),
        model("1.0L EcoBoost Hibrit 125 HP", ["Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["125 hp"]),
        model("1.0L EcoBoost Hibrit 155 HP", ["Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["155 hp"])
      ] },
      { name: "Puma ST", models: [
        model("1.5L EcoBoost 200 HP", ["Benzin"], ["Manuel"], ["SUV"], ["1.5"], ["200 hp"]),
        model("1.0L 170 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.0"], ["170 hp"])
      ] },
      { name: "Kuga", models: [
        model("Titanium", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.5"], ["186 hp", "190 hp", "243 hp"]),
        model("ST-Line", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.5"], ["186 hp", "190 hp", "243 hp"]),
        model("Active", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.5"], ["186 hp", "190 hp", "243 hp"]),
        model("ST-Line X", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.5"], ["186 hp", "190 hp", "243 hp"]),
        model("1.5L EcoBoost 186 HP", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["186 hp"]),
        model("2.5L FHEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["190 hp"]),
        model("2.5L PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["243 hp"])
      ] },
      { name: "Edge", models: [
        model("Titanium", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["190 hp", "240 hp"]),
        model("ST", ["Benzin"], ["Otomatik"], ["SUV"], ["2.7"], ["335 hp"])
      ] },
      { name: "Explorer", models: [
        model("ST", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["400 hp"]),
        model("Limited", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.3", "3.3"], ["318 hp", "457 hp"]),
        model("Platinum", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["365 hp"]),
        model("2.3L", ["Benzin"], ["Otomatik"], ["SUV"], ["2.3"], ["300 hp"]),
        model("3.0L V6", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["365 hp", "400 hp"])
      ] },
      { name: "Bronco", models: [
        model("Big Bend", ["Benzin"], ["Otomatik", "Manuel"], ["SUV"], ["2.3"], ["300 hp"]),
        model("Outer Banks", ["Benzin"], ["Otomatik"], ["SUV"], ["2.3", "2.7"], ["300 hp", "330 hp"]),
        model("Badlands", ["Benzin"], ["Otomatik", "Manuel"], ["SUV"], ["2.3", "2.7"], ["300 hp", "330 hp"]),
        model("Wildtrak", ["Benzin"], ["Otomatik"], ["SUV"], ["2.7"], ["330 hp"]),
        model("Raptor", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["418 hp"])
      ] },
      { name: "Bronco Sport", models: [
        model("Big Bend", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["181 hp"]),
        model("Heritage", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["181 hp"]),
        model("Outer Banks", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["181 hp"]),
        model("Badlands", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["250 hp"])
      ] },
      { name: "Explorer EV", models: [
        model("Select", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["286 hp"]),
        model("Premium", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"])
      ] },
      { name: "Capri EV", models: [
        model("Premium", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["286 hp", "340 hp"])
      ] },
      { name: "Mustang Mach-E", models: [
        model("Select", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["269 hp"]),
        model("Premium", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["294 hp", "346 hp"]),
        model("GT", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["487 hp"]),
        model("Rally", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["487 hp"]),
        model("California Special", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["294 hp"])
      ] },
      { name: "Puma Gen-E", models: [
        model("Elektrikli Puma", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["168 hp"])
      ] },
      { name: "Ranger", models: [
        model("XLT", ["Dizel"], ["Manuel", "Otomatik"], ["Pickup"], ["2.0"], ["170 hp", "205 hp"]),
        model("Wildtrak", ["Dizel"], ["Otomatik"], ["Pickup"], ["2.0", "3.0"], ["205 hp", "240 hp"]),
        model("Platinum", ["Dizel"], ["Otomatik"], ["Pickup"], ["3.0"], ["240 hp"]),
        model("2.0L EcoBlue", ["Dizel"], ["Manuel", "Otomatik"], ["Pickup"], ["2.0"], ["170 hp", "205 hp"]),
        model("3.0L V6", ["Dizel"], ["Otomatik"], ["Pickup"], ["3.0"], ["240 hp"])
      ] },
      { name: "Ranger Raptor", models: [
        model("3.0L V6 EcoBoost 292 HP", ["Benzin"], ["Otomatik"], ["Pickup"], ["3.0"], ["292 hp"])
      ] },
      { name: "F-150", models: [
        model("XL", ["Benzin", "Hibrit"], ["Otomatik"], ["Pickup"], ["2.7", "3.5", "5.0"], ["325 hp", "430 hp"]),
        model("XLT", ["Benzin", "Hibrit"], ["Otomatik"], ["Pickup"], ["2.7", "3.5", "5.0"], ["325 hp", "430 hp"]),
        model("Lariat", ["Benzin", "Hibrit"], ["Otomatik"], ["Pickup"], ["2.7", "3.5", "5.0"], ["325 hp", "430 hp"]),
        model("King Ranch", ["Benzin", "Hibrit"], ["Otomatik"], ["Pickup"], ["3.5", "5.0"], ["400 hp", "430 hp"]),
        model("Platinum", ["Benzin", "Hibrit"], ["Otomatik"], ["Pickup"], ["3.5", "5.0"], ["400 hp", "430 hp"]),
        model("Tremor", ["Benzin"], ["Otomatik"], ["Pickup"], ["3.5"], ["400 hp"])
      ] },
      { name: "F-150 Raptor / Raptor R", models: [
        model("F-150 Raptor", ["Benzin"], ["Otomatik"], ["Pickup"], ["3.5"], ["450 hp"]),
        model("Raptor R", ["Benzin"], ["Otomatik"], ["Pickup"], ["5.2"], ["720 hp"])
      ] },
      { name: "F-150 Lightning", models: [
        model("Pro", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["452 hp"]),
        model("Flash", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["580 hp"]),
        model("Lariat", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["580 hp"]),
        model("Platinum", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["580 hp"])
      ] },
      { name: "Maverick", models: [
        model("XL", ["Benzin", "Hibrit"], ["Otomatik"], ["Pickup"], ["2.0", "2.5"], ["191 hp", "250 hp"]),
        model("XLT", ["Benzin", "Hibrit"], ["Otomatik"], ["Pickup"], ["2.0", "2.5"], ["191 hp", "250 hp"]),
        model("Lariat", ["Benzin", "Hibrit"], ["Otomatik"], ["Pickup"], ["2.0", "2.5"], ["191 hp", "250 hp"]),
        model("Hibrit", ["Hibrit"], ["Otomatik"], ["Pickup"], ["2.5"], ["191 hp"])
      ] },
      { name: "Tourneo / Transit Courier", models: [
        model("Trend", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.0", "1.5"], ["100 hp", "125 hp"]),
        model("Deluxe", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.0", "1.5"], ["100 hp", "125 hp"]),
        model("Titanium", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.0", "1.5"], ["100 hp", "125 hp"]),
        model("Active", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.0", "1.5"], ["100 hp", "125 hp"]),
        model("1.0L EcoBoost", ["Benzin"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.0"], ["125 hp"]),
        model("1.5L EcoBlue", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.5"], ["100 hp", "120 hp"])
      ] },
      { name: "Tourneo / Transit Connect", models: [
        model("Trend", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.5", "2.0"], ["100 hp", "122 hp"]),
        model("Titanium", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.5", "2.0"], ["100 hp", "122 hp"]),
        model("Active", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.5", "2.0"], ["100 hp", "122 hp"]),
        model("1.5L EcoBlue", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["1.5"], ["100 hp", "120 hp"]),
        model("2.0L EcoBlue", ["Dizel"], ["Otomatik"], ["Van", "MPV"], ["2.0"], ["122 hp"])
      ] },
      { name: "Tourneo / Transit Custom", models: [
        model("Trend", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["2.0"], ["136 hp", "170 hp"]),
        model("Titanium", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["2.0"], ["136 hp", "170 hp"]),
        model("Sport", ["Dizel"], ["Otomatik"], ["Van", "MPV"], ["2.0"], ["170 hp"]),
        model("MS-RT", ["Dizel"], ["Otomatik"], ["Van", "MPV"], ["2.0"], ["170 hp"]),
        model("2.0L EcoBlue", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "MPV"], ["2.0"], ["136 hp", "170 hp"]),
        model("AWD", ["Dizel"], ["Otomatik"], ["Van", "MPV"], ["2.0"], ["170 hp"])
      ] },
      { name: "Transit", models: [
        model("Van", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["130 hp", "165 hp"]),
        model("Kamyonet", ["Dizel"], ["Manuel", "Otomatik"], ["Kamyonet"], ["2.0"], ["130 hp", "165 hp"]),
        model("Minibüs", ["Dizel"], ["Manuel", "Otomatik"], ["Minibüs"], ["2.0"], ["130 hp", "165 hp"]),
        model("L2H2", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["130 hp", "165 hp"]),
        model("L3H2", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["130 hp", "165 hp"]),
        model("L4H3", ["Dizel"], ["Manuel", "Otomatik"], ["Van"], ["2.0"], ["130 hp", "165 hp"]),
        model("Önden Çekiş", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "Kamyonet"], ["2.0"], ["130 hp", "165 hp"]),
        model("Arkadan İtiş", ["Dizel"], ["Manuel", "Otomatik"], ["Van", "Kamyonet", "Minibüs"], ["2.0"], ["130 hp", "165 hp"])
      ] },
      { name: "E-Transit / E-Tourneo", models: [
        model("E-Transit Custom", ["Elektrik"], ["Otomatik"], ["Van"], ["0"], ["218 hp"]),
        model("E-Tourneo Custom", ["Elektrik"], ["Otomatik"], ["MPV"], ["0"], ["218 hp"]),
        model("E-Transit", ["Elektrik"], ["Otomatik"], ["Van", "Kamyonet", "Minibüs"], ["0"], ["184 hp", "269 hp"])
      ] }
    ]
  },
  {
    name: "Opel",
    series: [
      { name: "Mokka", models: [
        model("1.2 Turbo", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.2"], ["130 hp"]),
        model("Mokka Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["136 hp"]),
        model("Mokka Electric", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["156 hp"])
      ] },
      { name: "Frontera", models: [
        model("Frontera Hybrid 136 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["136 hp"]),
        model("Frontera Electric 44 kWh", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["113 hp"]),
        model("Frontera Electric 54 kWh", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["156 hp"])
      ] },
      { name: "Grandland", models: [
        model("Grandland Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["136 hp"]),
        model("Grandland Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["195 hp"]),
        model("Grandland Electric", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["213 hp"]),
        model("AWD", ["Hibrit", "Elektrik"], ["Otomatik"], ["SUV"], ["1.6", "0"], ["300 hp"]),
        model("700 km+ Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["230 hp"])
      ] },
      { name: "Crossland", models: [
        model("Crossland", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.5"], ["110 hp", "130 hp"])
      ] },
      { name: "Corsa", models: [
        model("1.2 100 HP", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["100 hp"]),
        model("Corsa Hybrid 100 HP", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["100 hp"]),
        model("Corsa Hybrid 136 HP", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["136 hp"]),
        model("Corsa Electric", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["136 hp", "156 hp"])
      ] },
      { name: "Astra", models: [
        model("Astra HB", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2", "1.5", "1.6"], ["130 hp", "136 hp", "180 hp"]),
        model("Benzinli", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["130 hp"]),
        model("Dizel", ["Dizel"], ["Otomatik"], ["Hatchback"], ["1.5"], ["130 hp"]),
        model("Hibrit", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.6"], ["180 hp"]),
        model("Astra Sports Tourer", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.2", "1.5", "1.6"], ["130 hp", "180 hp"])
      ] },
      { name: "Astra Electric", models: [
        model("Astra Electric HB", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["156 hp"]),
        model("Astra Sports Tourer Electric", ["Elektrik"], ["Otomatik"], ["Station Wagon"], ["0"], ["156 hp"])
      ] },
      { name: "Rocks Electric", models: [
        model("2 Kisilik", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["8 hp"]),
        model("Kargo Versiyonu", ["Elektrik"], ["Otomatik"], ["Ticari"], ["0"], ["8 hp"])
      ] },
      { name: "Corsa GSe", models: [
        model("281 PS", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["281 hp"]),
        model("Elektrikli Performans", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["281 hp"])
      ] },
      { name: "Mokka GSe", models: [
        model("281 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["281 hp"]),
        model("Sportif SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["281 hp"])
      ] },
      { name: "Astra GSe / Astra Sports Tourer GSe", models: [
        model("Astra GSe", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.6"], ["225 hp"]),
        model("Astra Sports Tourer GSe", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.6"], ["225 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["Hatchback", "Station Wagon"], ["1.6"], ["225 hp"])
      ] },
      { name: "Grandland GSe", models: [
        model("300 HP AWD Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["300 hp"])
      ] },
      { name: "Combo / Combo Electric", models: [
        model("Cargo", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Hafif Ticari"], ["1.5", "0"], ["100 hp", "136 hp"]),
        model("Life", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["MPV"], ["1.5", "0"], ["100 hp", "136 hp"]),
        model("Electric", ["Elektrik"], ["Otomatik"], ["Hafif Ticari", "MPV"], ["0"], ["136 hp"])
      ] },
      { name: "Vivaro / Vivaro Electric", models: [
        model("Cargo", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Panelvan"], ["2.0", "0"], ["145 hp", "177 hp"]),
        model("Crew Cab", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Panelvan"], ["2.0", "0"], ["145 hp", "177 hp"]),
        model("Combi", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Minivan"], ["2.0", "0"], ["145 hp", "177 hp"]),
        model("Electric", ["Elektrik"], ["Otomatik"], ["Panelvan", "Minivan"], ["0"], ["136 hp"])
      ] },
      { name: "Movano / Movano Electric", models: [
        model("200 kW", ["Elektrik"], ["Otomatik"], ["Van"], ["0"], ["272 hp"]),
        model("272 HP", ["Elektrik"], ["Otomatik"], ["Van"], ["0"], ["272 hp"]),
        model("Electric", ["Elektrik"], ["Otomatik"], ["Van"], ["0"], ["272 hp"])
      ] },
      { name: "Zafira / Zafira Electric", models: [
        model("Yolcu Tasima", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Minivan"], ["2.0", "0"], ["180 hp", "136 hp"]),
        model("Electric", ["Elektrik"], ["Otomatik"], ["Minivan"], ["0"], ["136 hp"])
      ] },
      { name: "Insignia", models: [
        model("Insignia", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.5", "2.0"], ["140 hp", "170 hp", "200 hp"])
      ] },
      { name: "Vectra", models: [
        model("Vectra", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "1.8", "2.0"], ["100 hp", "140 hp"])
      ] },
      { name: "Meriva", models: [
        model("Meriva", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.4", "1.6"], ["100 hp", "120 hp"])
      ] },
      { name: "Antara", models: [
        model("Antara", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["2.0", "2.2", "2.4"], ["163 hp", "184 hp"])
      ] },
      { name: "Adam", models: [
        model("Adam", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2", "1.4"], ["70 hp", "100 hp"])
      ] },
      { name: "Agila", models: [
        model("Agila", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0", "1.2"], ["68 hp", "94 hp"])
      ] },
      { name: "Tigra", models: [
        model("Tigra", ["Benzin"], ["Manuel"], ["Coupe", "Cabrio"], ["1.4", "1.8"], ["90 hp", "125 hp"])
      ] },
      { name: "Calibra", models: [
        model("Calibra", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0", "2.5"], ["115 hp", "150 hp", "170 hp"])
      ] },
      { name: "Kadett", models: [
        model("Kadett", ["Benzin", "Dizel"], ["Manuel"], ["Hatchback", "Sedan"], ["1.3", "1.6", "1.7"], ["60 hp", "75 hp"])
      ] }
    ]
  },
  {
    name: "Peugeot",
    series: [
      { name: "2008 / E-2008", models: [
        model("1.2 Hybrid 136 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["136 hp"]),
        model("1.2 Hybrid 145 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["145 hp"]),
        model("Elektrikli 115 kW", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["156 hp"]),
        model("Elektrikli 156 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["156 hp"])
      ] },
      { name: "3008 / E-3008", models: [
        model("Hybrid 136", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["136 hp"]),
        model("Plug-in Hybrid 195", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["195 hp"]),
        model("E-3008 210 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["210 hp"]),
        model("E-3008 320 HP Dual Motor", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["320 hp"]),
        model("Long Range 700 km+", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["230 hp"])
      ] },
      { name: "5008 / E-5008", models: [
        model("Hybrid 136", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["136 hp"]),
        model("Plug-in Hybrid 195", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["195 hp"]),
        model("Elektrikli E-5008", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["210 hp"]),
        model("7 Kisilik", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik"], ["SUV"], ["1.2", "1.6", "0"], ["136 hp", "195 hp", "210 hp"])
      ] },
      { name: "408 / E-408", models: [
        model("1.2 Hybrid", ["Hibrit"], ["Otomatik"], ["Fastback"], ["1.2"], ["136 hp"]),
        model("Elektrikli E-408", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["210 hp"]),
        model("Fastback", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik"], ["Fastback"], ["1.2", "0"], ["136 hp", "210 hp"])
      ] },
      { name: "208 / E-208", models: [
        model("1.2 Hybrid 100 HP", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["100 hp"]),
        model("1.2 Hybrid 136 HP", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["136 hp"]),
        model("E-208 115 kW", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["156 hp"])
      ] },
      { name: "308 / E-308 / 308 SW", models: [
        model("Hatchback", ["Benzin", "Dizel", "Elektrik"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.2", "1.5", "0"], ["130 hp", "156 hp"]),
        model("Station Wagon", ["Benzin", "Dizel", "Elektrik"], ["Otomatik"], ["Station Wagon"], ["1.2", "1.5", "0"], ["130 hp", "156 hp"]),
        model("Benzinli", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.2"], ["130 hp"]),
        model("Dizel", ["Dizel"], ["Otomatik"], ["Hatchback"], ["1.5"], ["130 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Hatchback", "Station Wagon"], ["0"], ["156 hp"])
      ] },
      { name: "508 / 508 SW", models: [
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["1.6"], ["180 hp", "225 hp"]),
        model("BlueHDi", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], ["1.5", "2.0"], ["130 hp", "180 hp"]),
        model("Sedan", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Sedan"], ["1.6", "1.5", "2.0"], ["130 hp", "180 hp", "225 hp"]),
        model("Wagon", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.6", "1.5", "2.0"], ["130 hp", "180 hp", "225 hp"])
      ] },
      { name: "301", models: [
        model("301", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.2", "1.6"], ["82 hp", "92 hp", "115 hp"])
      ] },
      { name: "206", models: [
        model("206", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.1", "1.4", "1.6", "2.0"], ["60 hp", "90 hp", "110 hp"])
      ] },
      { name: "207", models: [
        model("207", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "1.6"], ["75 hp", "90 hp", "120 hp"])
      ] },
      { name: "306", models: [
        model("306", ["Benzin", "Dizel"], ["Manuel"], ["Sedan", "Hatchback"], ["1.4", "1.6", "1.8", "2.0"], ["75 hp", "121 hp"])
      ] },
      { name: "406", models: [
        model("406", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["1.8", "2.0", "2.2", "3.0"], ["110 hp", "210 hp"])
      ] },
      { name: "RCZ", models: [
        model("RCZ", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Coupe"], ["1.6", "2.0"], ["156 hp", "200 hp", "270 hp"])
      ] },
      { name: "Partner", models: [
        model("Partner", ["Dizel", "Benzin"], ["Manuel", "Otomatik"], ["Hafif Ticari"], ["1.5", "1.2"], ["100 hp", "130 hp"])
      ] },
      { name: "Rifter", models: [
        model("Rifter", ["Dizel", "Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["MPV"], ["1.5", "1.2", "0"], ["100 hp", "130 hp", "136 hp"])
      ] },
      { name: "Expert", models: [
        model("Expert", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Panelvan"], ["2.0", "0"], ["145 hp", "177 hp", "136 hp"])
      ] },
      { name: "Boxer", models: [
        model("Boxer", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Van"], ["2.2", "0"], ["140 hp", "180 hp", "270 hp"])
      ] }
    ]
  },
  {
    name: "Pontiac",
    series: [
      { name: "Grand Prix Revival", models: [
        model("3.0L V6 Twin-Turbo", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["400 hp"]),
        model("V8 High-Performance", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.2"], ["500 hp"])
      ] },
      { name: "Grand Prix GXP", models: [
        model("Hybrid V8", ["Hibrit"], ["Otomatik"], ["Sedan"], ["6.2"], ["500 hp"]),
        model("Performans", ["Hibrit", "Benzin"], ["Otomatik"], ["Sedan"], ["6.2"], ["500 hp"])
      ] },
      { name: "G6 Modern Edition", models: [
        model("Kompakt Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["220 hp"])
      ] },
      { name: "GTO", models: [
        model("The Judge", ["Benzin"], ["Manuel"], ["Coupe"], ["6.6"], ["370 hp"]),
        model("1964-1974", ["Benzin"], ["Manuel"], ["Coupe"], ["6.4", "6.6"], ["335 hp", "370 hp"]),
        model("2004-2006", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["5.7", "6.0"], ["350 hp", "400 hp"])
      ] },
      { name: "Firebird", models: [
        model("Base", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.4", "3.8"], ["160 hp", "200 hp"]),
        model("Formula", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["5.7"], ["305 hp"]),
        model("Esprit", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.0"], ["170 hp"])
      ] },
      { name: "Trans Am", models: [
        model("Ram Air III", ["Benzin"], ["Manuel"], ["Coupe"], ["6.6"], ["335 hp"]),
        model("Ram Air IV", ["Benzin"], ["Manuel"], ["Coupe"], ["6.6"], ["370 hp"]),
        model("WS6", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["5.7"], ["325 hp"])
      ] },
      { name: "Fiero", models: [
        model("GT", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.8"], ["140 hp"]),
        model("Formula", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.8"], ["140 hp"])
      ] },
      { name: "Solstice", models: [
        model("Roadster", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.4"], ["177 hp"]),
        model("GXP Coupe", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0"], ["260 hp"])
      ] },
      { name: "Grand Am", models: [
        model("GT", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.4"], ["175 hp"]),
        model("SE", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.2"], ["140 hp"])
      ] },
      { name: "Bonneville", models: [
        model("GXP", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.6"], ["275 hp"]),
        model("SSEi", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.8"], ["240 hp"])
      ] },
      { name: "G8", models: [
        model("GXP", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["6.2"], ["415 hp"]),
        model("GT", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.0"], ["361 hp"])
      ] },
      { name: "G5 / G3", models: [
        model("G5", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.2"], ["148 hp"]),
        model("G3", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6"], ["106 hp"])
      ] },
      { name: "Aztek", models: [
        model("Crossover", ["Benzin"], ["Otomatik"], ["SUV"], ["3.4"], ["185 hp"])
      ] },
      { name: "Torrent", models: [
        model("GXP", ["Benzin"], ["Otomatik"], ["SUV"], ["3.6"], ["264 hp"])
      ] },
      { name: "Vibe", models: [
        model("GT", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.8", "2.4"], ["126 hp", "158 hp"])
      ] },
      { name: "Montana", models: [
        model("MPV", ["Benzin"], ["Otomatik"], ["MPV"], ["3.4"], ["185 hp"]),
        model("Minivan", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.4"], ["185 hp"])
      ] },
      { name: "GXP", models: [
        model("Global X-treme Performance", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["6.0", "6.2"], ["361 hp", "415 hp"])
      ] },
      { name: "Ram Air", models: [
        model("Ram Air", ["Benzin"], ["Manuel"], ["Coupe"], ["5.7", "6.6"], ["305 hp", "370 hp"])
      ] },
      { name: "WS6", models: [
        model("WS6", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["5.7"], ["325 hp"])
      ] },
      { name: "Endura", models: [
        model("Endura", ["Benzin"], ["Otomatik"], ["Sedan"], ["6.6"], ["250 hp"])
      ] },
      { name: "Catalina", models: [
        model("Catalina", ["Benzin"], ["Otomatik"], ["Sedan", "Coupe"], ["6.4"], ["300 hp"])
      ] },
      { name: "LeMans", models: [
        model("LeMans", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["5.7"], ["250 hp"])
      ] },
      { name: "Sunfire", models: [
        model("Sunfire", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe", "Sedan"], ["2.2"], ["140 hp"])
      ] },
      { name: "Tempest", models: [
        model("Tempest", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["5.3"], ["250 hp"])
      ] },
      { name: "Parisienne", models: [
        model("Parisienne", ["Benzin"], ["Otomatik"], ["Sedan"], ["5.0"], ["170 hp"])
      ] },
      { name: "Star Chief", models: [
        model("Star Chief", ["Benzin"], ["Otomatik"], ["Sedan"], ["5.2"], ["200 hp"])
      ] }
    ]
  },
  {
    name: "Porsche",
    series: [
      { name: "911 Serisi", models: [
        model("Carrera", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["394 hp"]),
        model("Carrera GTS", ["Benzin", "Hibrit"], ["Otomatik"], ["Coupe"], ["3.6"], ["541 hp"]),
        model("Carrera 4", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["394 hp"]),
        model("Carrera 4 GTS", ["Benzin", "Hibrit"], ["Otomatik"], ["Coupe"], ["3.6"], ["541 hp"]),
        model("T-Hybrid", ["Hibrit"], ["Otomatik"], ["Coupe"], ["3.6"], ["541 hp"])
      ] },
      { name: "Targa", models: [
        model("Targa 4", ["Benzin"], ["Otomatik"], ["Targa"], ["3.0"], ["394 hp"]),
        model("Targa 4 GTS", ["Benzin"], ["Otomatik"], ["Targa"], ["3.0"], ["480 hp"])
      ] },
      { name: "Turbo", models: [
        model("Turbo", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.8"], ["572 hp"]),
        model("Turbo S", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.8"], ["640 hp"])
      ] },
      { name: "GT Serisi", models: [
        model("GT3", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["4.0"], ["510 hp"]),
        model("GT3 RS", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.0"], ["525 hp"]),
        model("GT2 RS", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.8"], ["700 hp"])
      ] },
      { name: "Cabriolet", models: [
        model("Carrera Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], ["3.0"], ["394 hp"]),
        model("Carrera GTS Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], ["3.0"], ["480 hp"]),
        model("Turbo Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], ["3.8"], ["572 hp"]),
        model("Turbo S Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], ["3.8"], ["640 hp"])
      ] },
      { name: "Taycan Serisi", models: [
        model("Base", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["408 hp"]),
        model("4S", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["530 hp"]),
        model("Turbo", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["680 hp"]),
        model("Turbo S", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["761 hp"])
      ] },
      { name: "Taycan Turbo GT", models: [
        model("Weissach Package", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["1000+ hp"]),
        model("1000+ HP", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["1000+ hp"])
      ] },
      { name: "Taycan Cross Turismo", models: [
        model("4", ["Elektrik"], ["Otomatik"], ["Station Wagon"], ["0"], ["476 hp"]),
        model("4S", ["Elektrik"], ["Otomatik"], ["Station Wagon"], ["0"], ["571 hp"]),
        model("Turbo", ["Elektrik"], ["Otomatik"], ["Station Wagon"], ["0"], ["680 hp"]),
        model("Turbo S", ["Elektrik"], ["Otomatik"], ["Station Wagon"], ["0"], ["761 hp"])
      ] },
      { name: "Taycan Sport Turismo", models: [
        model("Sport Turismo", ["Elektrik"], ["Otomatik"], ["Station Wagon"], ["0"], ["408 hp", "530 hp"])
      ] },
      { name: "Macan Electric", models: [
        model("Macan 4", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["408 hp"]),
        model("Macan 4S", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["516 hp"]),
        model("Macan Turbo", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["639 hp"])
      ] },
      { name: "Macan Petrol", models: [
        model("Base", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["265 hp"]),
        model("S", ["Benzin"], ["Otomatik"], ["SUV"], ["2.9"], ["380 hp"]),
        model("GTS", ["Benzin"], ["Otomatik"], ["SUV"], ["2.9"], ["440 hp"])
      ] },
      { name: "Cayenne", models: [
        model("Base", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["353 hp"]),
        model("S", ["Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["474 hp"]),
        model("GTS", ["Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["500 hp"]),
        model("Turbo E-Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["4.0"], ["739 hp"]),
        model("739 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["4.0"], ["739 hp"])
      ] },
      { name: "Cayenne Coupe", models: [
        model("Base", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["3.0"], ["353 hp"]),
        model("S", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["4.0"], ["474 hp"]),
        model("GTS", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["4.0"], ["500 hp"]),
        model("Turbo GT", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["4.0"], ["659 hp"])
      ] },
      { name: "718 Serisi", models: [
        model("718 Cayman", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0", "2.5", "4.0"], ["300 hp", "350 hp", "400 hp", "500 hp"]),
        model("718 Boxster", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0", "2.5", "4.0"], ["300 hp", "350 hp", "400 hp", "500 hp"]),
        model("718 Electric", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["300 hp"])
      ] },
      { name: "Panamera Serisi", models: [
        model("Base", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.9"], ["353 hp"]),
        model("Panamera 4", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.9"], ["353 hp"]),
        model("Panamera GTS", ["Benzin"], ["Otomatik"], ["Sedan"], ["4.0"], ["500 hp"])
      ] },
      { name: "Panamera E-Hybrid", models: [
        model("4 E-Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.9"], ["470 hp"]),
        model("4S E-Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.9"], ["544 hp"]),
        model("Turbo E-Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], ["4.0"], ["680 hp"])
      ] },
      { name: "T-Hybrid", models: [
        model("911 GTS Hibrit", ["Hibrit"], ["Otomatik"], ["Coupe"], ["3.6"], ["541 hp"])
      ] },
      { name: "Weissach Package", models: [
        model("Karbon Fiber Pist Paketi", ["Elektrik", "Benzin"], ["Otomatik"], ["Sedan", "Coupe"], ["0", "4.0"], ["1000+ hp", "525 hp"])
      ] },
      { name: "Sport Design", models: [
        model("Sportif Tasarim Paketi", ["Benzin", "Elektrik"], ["Otomatik"], ["Coupe", "SUV", "Sedan"], ["0", "3.0"], ["394 hp", "408 hp"])
      ] },
      { name: "Chrono Package", models: [
        model("Surus Modu ve Performans Paketi", ["Benzin", "Elektrik", "Hibrit"], ["Otomatik", "Manuel"], ["Coupe", "SUV", "Sedan"], ["0", "3.0", "4.0"], ["394 hp", "761 hp"])
      ] },
      { name: "911 Dakar", models: [
        model("911 Dakar", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["480 hp"])
      ] },
      { name: "911 Speedster", models: [
        model("911 Speedster", ["Benzin"], ["Manuel"], ["Roadster"], ["4.0"], ["510 hp"])
      ] },
      { name: "911 R", models: [
        model("911 R", ["Benzin"], ["Manuel"], ["Coupe"], ["4.0"], ["500 hp"])
      ] },
      { name: "918 Spyder", models: [
        model("918 Spyder", ["Hibrit"], ["Otomatik"], ["Roadster"], ["4.6"], ["887 hp"])
      ] },
      { name: "Carrera GT", models: [
        model("Carrera GT", ["Benzin"], ["Manuel"], ["Roadster"], ["5.7"], ["612 hp"])
      ] },
      { name: "924", models: [
        model("924", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0"], ["125 hp"])
      ] },
      { name: "944", models: [
        model("944", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.5", "3.0"], ["163 hp", "250 hp"])
      ] },
      { name: "928", models: [
        model("928", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.5", "5.0"], ["240 hp", "320 hp"])
      ] },
      { name: "968", models: [
        model("968", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe", "Cabrio"], ["3.0"], ["240 hp"])
      ] }
    ]
  },
  {
    name: "Proton",
    series: [
      { name: "e.MAS 7", models: [
        model("Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"]),
        model("GEA Platformu", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"])
      ] },
      { name: "e.MAS 7 PHEV", models: [
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["245 hp"]),
        model("1000 km+ Menzil", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["245 hp"])
      ] },
      { name: "e.MAS 5", models: [
        model("Elektrikli Hatchback", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["150 hp"])
      ] },
      { name: "e.MAS 9", models: [
        model("6 Kisilik Elektrikli / Hibrit SUV", ["Elektrik", "Hibrit"], ["Otomatik"], ["SUV"], ["0", "1.5"], ["218 hp", "245 hp"])
      ] },
      { name: "X50", models: [
        model("1.5L Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp", "177 hp"]),
        model("Standard", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]),
        model("Executive", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]),
        model("Premium", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["177 hp"]),
        model("Flagship", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["177 hp"])
      ] },
      { name: "X70", models: [
        model("1.5L i-GT", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["177 hp"]),
        model("181 PS", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["181 hp"])
      ] },
      { name: "X90", models: [
        model("1.5L Mild Hybrid 48V", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["190 hp"]),
        model("7 Kisilik", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["190 hp"]),
        model("Executive", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["190 hp"]),
        model("Premium", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["190 hp"]),
        model("Flagship", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["190 hp"])
      ] },
      { name: "S70", models: [
        model("Executive", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["150 hp"]),
        model("Premium", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["150 hp"]),
        model("Flagship", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["150 hp"]),
        model("Flagship X", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["150 hp"])
      ] },
      { name: "Saga", models: [
        model("AMA Platformu", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.3"], ["95 hp"]),
        model("Ekonomik Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.3"], ["95 hp"])
      ] },
      { name: "Persona", models: [
        model("1.6L VVT", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["109 hp"])
      ] },
      { name: "Iriz", models: [
        model("Active", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.6"], ["95 hp"]),
        model("Executive", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.6"], ["95 hp"]),
        model("Sportif Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.6"], ["95 hp"])
      ] },
      { name: "Gen-2", models: [
        model("Gen-2", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6"], ["110 hp"])
      ] },
      { name: "Waja", models: [
        model("Waja", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "1.8"], ["103 hp", "120 hp"])
      ] },
      { name: "Perdana", models: [
        model("Perdana", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0", "2.4"], ["150 hp", "178 hp"])
      ] },
      { name: "Preve", models: [
        model("Preve", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["138 hp"])
      ] },
      { name: "Exora", models: [
        model("Exora", ["Benzin"], ["Otomatik"], ["MPV"], ["1.6"], ["138 hp"])
      ] },
      { name: "Savvy", models: [
        model("Savvy", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["75 hp"])
      ] },
      { name: "Satria / Satria Neo", models: [
        model("Satria", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.3", "1.5"], ["75 hp", "110 hp"]),
        model("Satria Neo", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.6"], ["125 hp"])
      ] }
    ]
  },
  {
    name: "Honda",
    series: [
      { name: "Civic Sedan", models: [
        model("1.5 VTEC Turbo", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["182 hp"]),
        model("2.0 e:HEV Hibrit", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.0"], ["184 hp"]),
        model("Executive+", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["1.5", "2.0"], ["182 hp", "184 hp"]),
        model("Elegance", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["1.5", "2.0"], ["182 hp", "184 hp"])
      ] },
      { name: "Civic Hatchback", models: [
        model("1.5 VTEC Turbo", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.5"], ["182 hp"]),
        model("2.0 e:HEV Hibrit", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["2.0"], ["184 hp"])
      ] },
      { name: "Civic Type R", models: [
        model("2.0 VTEC Turbo", ["Benzin"], ["Manuel"], ["Hatchback"], ["2.0"], ["329 hp"]),
        model("329 HP", ["Benzin"], ["Manuel"], ["Hatchback"], ["2.0"], ["329 hp"])
      ] },
      { name: "Civic Si", models: [
        model("Sportif Sedan", ["Benzin"], ["Manuel"], ["Sedan"], ["1.5"], ["200 hp"])
      ] },
      { name: "Accord", models: [
        model("1.5 VTEC Turbo", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["192 hp"]),
        model("2.0 e:HEV Hibrit", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.0"], ["204 hp"]),
        model("Executive", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["1.5", "2.0"], ["192 hp", "204 hp"]),
        model("Executive+", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["1.5", "2.0"], ["192 hp", "204 hp"])
      ] },
      { name: "City", models: [
        model("1.5 i-VTEC", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["121 hp"])
      ] },
      { name: "HR-V e:HEV", models: [
        model("1.5 Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["131 hp"]),
        model("Elegance", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["131 hp"]),
        model("Advance", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["131 hp"]),
        model("Style", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["131 hp"])
      ] },
      { name: "ZR-V e:HEV", models: [
        model("2.0 Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"])
      ] },
      { name: "CR-V e:HEV", models: [
        model("2.0 i-MMD Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"]),
        model("Advance", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"]),
        model("Elegance", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"]),
        model("4WD", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"])
      ] },
      { name: "Pilot", models: [
        model("3.5L V6", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["285 hp"]),
        model("Elite", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["285 hp"]),
        model("Black Edition", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["285 hp"])
      ] },
      { name: "Passport", models: [
        model("3.5L V6", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["280 hp"]),
        model("TrailSport", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["280 hp"]),
        model("Black Edition", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["280 hp"])
      ] },
      { name: "Elevate", models: [
        model("1.5 i-VTEC", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["121 hp"])
      ] },
      { name: "Prelude e:HEV", models: [
        model("2.0 Hibrit", ["Hibrit"], ["Otomatik"], ["Coupe"], ["2.0"], ["204 hp"])
      ] },
      { name: "Prologue", models: [
        model("EX", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["288 hp"]),
        model("Touring", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["288 hp"]),
        model("Elite", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["288 hp"])
      ] },
      { name: "Honda 0 Series Saloon", models: [
        model("Elektrikli Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["241 hp"])
      ] },
      { name: "Honda 0 Series SUV", models: [
        model("Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["241 hp"])
      ] },
      { name: "e:Ny1", models: [
        model("Elektrikli B-SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"])
      ] },
      { name: "CR-V e:FCEV", models: [
        model("Hidrojen Yakıt Hücreli", ["Hidrojen"], ["Otomatik"], ["SUV"], ["0"], ["174 hp"]),
        model("Plug-in Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["184 hp"])
      ] },
      { name: "Jazz e:HEV / Fit", models: [
        model("1.5 Hibrit", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["109 hp"]),
        model("Advance", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["109 hp"]),
        model("Elegance", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["109 hp"]),
        model("Crosstar", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["109 hp"])
      ] },
      { name: "Odyssey", models: [
        model("3.5L V6", ["Benzin"], ["Otomatik"], ["MPV"], ["3.5"], ["280 hp"])
      ] },
      { name: "Integra", models: [
        model("Integra", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.5"], ["200 hp"])
      ] },
      { name: "S2000", models: [
        model("Roadster", ["Benzin"], ["Manuel"], ["Roadster"], ["2.0", "2.2"], ["240 hp"])
      ] },
      { name: "Legend", models: [
        model("V6 Lüks Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.5"], ["295 hp"])
      ] },
      { name: "CR-Z", models: [
        model("Hibrit Spor Hatchback", ["Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["124 hp"])
      ] },
      { name: "Insight", models: [
        model("Hibrit Sedan", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["151 hp"])
      ] },
      { name: "Super Sport", models: [
        model("CBR1000RR-R Fireblade", ["Benzin"], ["Manuel"], ["Motosiklet"], ["1.0"], ["217 hp"]),
        model("CBR650R", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.65"], ["95 hp"]),
        model("CBR500R", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.5"], ["47 hp"])
      ] },
      { name: "Naked", models: [
        model("CB1000 Hornet", ["Benzin"], ["Manuel"], ["Motosiklet"], ["1.0"], ["152 hp"]),
        model("CB750 Hornet", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.75"], ["92 hp"]),
        model("CB250R", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.25"], ["27 hp"])
      ] },
      { name: "Adventure", models: [
        model("Africa Twin", ["Benzin"], ["Manuel", "Otomatik"], ["Motosiklet"], ["1.1"], ["102 hp"]),
        model("Transalp", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.75"], ["92 hp"]),
        model("NC750X", ["Benzin"], ["Manuel", "Otomatik"], ["Motosiklet"], ["0.75"], ["58 hp"]),
        model("CRF250 Rally", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.25"], ["24 hp"])
      ] },
      { name: "Scooter", models: [
        model("PCX125", ["Benzin"], ["Otomatik"], ["Scooter"], ["0.125"], ["12 hp"]),
        model("Forza 250", ["Benzin"], ["Otomatik"], ["Scooter"], ["0.25"], ["23 hp"]),
        model("Forza 750", ["Benzin"], ["Otomatik"], ["Scooter"], ["0.75"], ["58 hp"]),
        model("ADV350", ["Benzin"], ["Otomatik"], ["Scooter"], ["0.35"], ["29 hp"]),
        model("Dio", ["Benzin"], ["Otomatik"], ["Scooter"], ["0.11"], ["8 hp"])
      ] }
    ]
  },
  {
    name: "Hyundai",
    series: [
      { name: "i10", models: [
        model("1.0 MPI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["67 hp"]),
        model("1.2 MPI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["84 hp"]),
        model("Jump", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2"], ["67 hp", "84 hp"]),
        model("Style", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2"], ["67 hp", "84 hp"]),
        model("Elite", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2"], ["67 hp", "84 hp"])
      ] },
      { name: "i20", models: [
        model("1.2 MPI", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["84 hp"]),
        model("1.4 MPI", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.4"], ["100 hp"]),
        model("1.0 T-GDI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["100 hp"]),
        model("Jump", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2", "1.4"], ["84 hp", "100 hp"]),
        model("Style", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2", "1.4"], ["84 hp", "100 hp"]),
        model("Elite", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2", "1.4"], ["84 hp", "100 hp"])
      ] },
      { name: "i30 / i30 Tourer", models: [
        model("1.0 T-GDI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Station Wagon"], ["1.0"], ["120 hp"]),
        model("1.5 T-GDI Mild-Hybrid", ["Hibrit"], ["Manuel", "Otomatik"], ["Hatchback", "Station Wagon"], ["1.5"], ["160 hp"])
      ] },
      { name: "Elantra", models: [
        model("1.6 MPI", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["123 hp"]),
        model("Style", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["123 hp"]),
        model("Elite", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["123 hp"]),
        model("Elite Plus", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["123 hp"])
      ] },
      { name: "Sonata", models: [
        model("1.6 T-GDI", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["180 hp"]),
        model("2.5 T-GDI", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["290 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.0"], ["192 hp"])
      ] },
      { name: "Bayon", models: [
        model("1.4 MPI", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.4"], ["100 hp"]),
        model("1.0 T-GDI", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["100 hp"]),
        model("Jump", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0", "1.4"], ["100 hp"]),
        model("Style", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0", "1.4"], ["100 hp"]),
        model("Elite", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0", "1.4"], ["100 hp"])
      ] },
      { name: "Kona", models: [
        model("1.0 T-GDI", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["120 hp"]),
        model("1.6 T-GDI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["198 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["141 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["156 hp", "218 hp"]),
        model("Style", ["Benzin", "Hibrit", "Elektrik"], ["Manuel", "Otomatik"], ["SUV"], ["0", "1.0", "1.6"], ["120 hp", "218 hp"]),
        model("Elite", ["Benzin", "Hibrit", "Elektrik"], ["Manuel", "Otomatik"], ["SUV"], ["0", "1.0", "1.6"], ["120 hp", "218 hp"]),
        model("N Line", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["198 hp"])
      ] },
      { name: "Tucson", models: [
        model("1.6 T-GDI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["180 hp"]),
        model("1.6 CRDi", ["Dizel"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["230 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["265 hp"]),
        model("Prime", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp", "265 hp"]),
        model("Elite", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp", "265 hp"]),
        model("Elite Plus", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp", "265 hp"])
      ] },
      { name: "Santa Fe", models: [
        model("1.6 T-GDI Hybrid 4x4", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["215 hp"])
      ] },
      { name: "Palisade", models: [
        model("3.5L V6", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["291 hp"]),
        model("2.2 CRDi", ["Dizel"], ["Otomatik"], ["SUV"], ["2.2"], ["200 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["329 hp"])
      ] },
      { name: "Venue", models: [
        model("1.0 T-GDI", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["120 hp"]),
        model("1.2L", ["Benzin"], ["Manuel"], ["SUV"], ["1.2"], ["83 hp"])
      ] },
      { name: "Inster", models: [
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["97 hp", "115 hp"])
      ] },
      { name: "IONIQ 3", models: [
        model("Elektrikli Hatchback", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["170 hp"])
      ] },
      { name: "IONIQ 5", models: [
        model("125 kW", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["170 hp"]),
        model("168 kW", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["229 hp"]),
        model("239 kW", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["325 hp"]),
        model("Progressive", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["170 hp", "325 hp"]),
        model("Advance", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["170 hp", "325 hp"])
      ] },
      { name: "IONIQ 6", models: [
        model("111 kW", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["151 hp"]),
        model("168 kW", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["229 hp"]),
        model("239 kW", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["325 hp"])
      ] },
      { name: "IONIQ 9", models: [
        model("3 Sıralı Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["308 hp"])
      ] },
      { name: "i20 N", models: [
        model("1.6 T-GDI 204 HP", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.6"], ["204 hp"])
      ] },
      { name: "Elantra N", models: [
        model("2.0 T-GDI 280 HP", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan"], ["2.0"], ["280 hp"])
      ] },
      { name: "IONIQ 5 N", models: [
        model("478 kW", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["650 hp"]),
        model("650 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["650 hp"])
      ] },
      { name: "IONIQ 6 N", models: [
        model("Elektrikli Performans Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["650 hp"])
      ] },
      { name: "Staria", models: [
        model("2.2 CRDi", ["Dizel"], ["Otomatik"], ["MPV"], ["2.2"], ["177 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["MPV"], ["1.6"], ["225 hp"]),
        model("9+1", ["Dizel", "Hibrit"], ["Otomatik"], ["MPV"], ["1.6", "2.2"], ["177 hp", "225 hp"]),
        model("8+1", ["Dizel", "Hibrit"], ["Otomatik"], ["MPV"], ["1.6", "2.2"], ["177 hp", "225 hp"]),
        model("Prime", ["Dizel", "Hibrit"], ["Otomatik"], ["MPV"], ["1.6", "2.2"], ["177 hp", "225 hp"]),
        model("Elite", ["Dizel", "Hibrit"], ["Otomatik"], ["MPV"], ["1.6", "2.2"], ["177 hp", "225 hp"])
      ] },
      { name: "H-100", models: [
        model("2.5 CRDi", ["Dizel"], ["Manuel"], ["Kamyonet", "Panelvan"], ["2.5"], ["130 hp"])
      ] },
      { name: "XCIENT", models: [
        model("Ağır Ticari", ["Dizel", "Hidrojen"], ["Otomatik", "Manuel"], ["Kamyon"], ["10.0", "12.7"], ["350 hp", "540 hp"])
      ] }
    ]
  },
  {
    name: "IKCO",
    series: [
      { name: "Reera", models: [
        model("1.7L Turbo EFP-TC", ["Benzin"], ["Otomatik"], ["SUV"], ["1.7"], ["160 hp"]),
        model("160 HP", ["Benzin"], ["Otomatik"], ["SUV"], ["1.7"], ["160 hp"])
      ] },
      { name: "Reera EV", models: [
        model("Elektrikli Crossover", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["161 hp"]),
        model("161 HP", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["161 hp"]),
        model("300 Nm", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["161 hp"])
      ] },
      { name: "Tara", models: [
        model("V1", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["113 hp"]),
        model("V2", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["113 hp"]),
        model("V3", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["113 hp"]),
        model("V4", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["113 hp"]),
        model("1.6L TU5P", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["113 hp"])
      ] },
      { name: "Tara Turbo", models: [
        model("1.7L EFP-TC", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.7"], ["160 hp"])
      ] },
      { name: "Dena Javanan", models: [
        model("1.7L Turbo", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.7"], ["150 hp"])
      ] },
      { name: "Envoy", models: [
        model("Modern Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["113 hp"])
      ] },
      { name: "Samand", models: [
        model("1.6 LX", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["100 hp"]),
        model("1.6 EL", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["100 hp"])
      ] },
      { name: "Soren / Soren Plus", models: [
        model("1.7L EF7", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.7"], ["115 hp"]),
        model("1.7L Turbo", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.7"], ["150 hp"])
      ] },
      { name: "Dena / Dena Plus", models: [
        model("1.7L EF7", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.7"], ["115 hp"]),
        model("1.7L Turbo", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.7"], ["150 hp"])
      ] },
      { name: "Runna / Runna Plus", models: [
        model("1.6L TU5P", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["113 hp"])
      ] },
      { name: "Peugeot 207i", models: [
        model("1.6L", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6"], ["105 hp"])
      ] },
      { name: "TF21", models: [
        model("Kompakt Hatchback", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6"], ["113 hp"])
      ] },
      { name: "Arisun 2", models: [
        model("1.7L XU7+", ["Benzin"], ["Manuel"], ["Pickup"], ["1.7"], ["98 hp"])
      ] },
      { name: "Ataman", models: [
        model("Ağır Ticari", ["Dizel"], ["Manuel"], ["Kamyon"], ["11.9"], ["420 hp"]),
        model("Mercedes-Benz OM457", ["Dizel"], ["Manuel"], ["Kamyon"], ["11.9"], ["420 hp"])
      ] },
      { name: "Arna", models: [
        model("Hafif Ticari Kamyonet", ["Benzin"], ["Manuel"], ["Kamyonet"], ["1.7"], ["86 hp"])
      ] },
      { name: "Atros", models: [
        model("Belediye Otobüsü", ["Dizel"], ["Otomatik", "Manuel"], ["Otobüs"], ["11.9"], ["360 hp"]),
        model("Şehirler Arası Otobüs", ["Dizel"], ["Otomatik", "Manuel"], ["Otobüs"], ["11.9"], ["420 hp"])
      ] },
      { name: "Haima Serisi", models: [
        model("S5", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["161 hp"]),
        model("S7+", ["Benzin"], ["Otomatik"], ["SUV"], ["1.8"], ["170 hp"]),
        model("7X", ["Benzin"], ["Otomatik"], ["MPV"], ["1.6"], ["192 hp"]),
        model("8S", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["192 hp"])
      ] },
      { name: "Peugeot Serisi", models: [
        model("Pars", ["Benzin"], ["Manuel"], ["Sedan"], ["1.8"], ["97 hp"]),
        model("405 SLX", ["Benzin"], ["Manuel"], ["Sedan"], ["1.8"], ["100 hp"])
      ] },
      { name: "Tondar 90", models: [
        model("Dacia Logan Tabanlı", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["105 hp"])
      ] }
    ]
  },
  {
    name: "Infiniti",
    series: [
      { name: "QX80 Yeni Nesil", models: [
        model("PURE", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["450 hp"]),
        model("LUXE", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["450 hp"]),
        model("SPORT", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["450 hp"]),
        model("AUTOGRAPH", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["450 hp"]),
        model("3.5L Twin-Turbo V6", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["450 hp"]),
        model("450 HP", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["450 hp"])
      ] },
      { name: "QX60", models: [
        model("PURE", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("LUXE", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("SPORT", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("AUTOGRAPH", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("2.0L VC-Turbo 268 HP", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"])
      ] },
      { name: "QX55", models: [
        model("LUXE", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["2.0"], ["268 hp"]),
        model("ESSENTIAL", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["2.0"], ["268 hp"]),
        model("SENSORY", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["2.0"], ["268 hp"])
      ] },
      { name: "QX50", models: [
        model("PURE", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("LUXE", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("SPORT", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("SENSORY", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("AUTOGRAPH", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("2.0L VC-Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"])
      ] },
      { name: "QX65", models: [
        model("SUV Coupé", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["2.0"], ["268 hp"])
      ] },
      { name: "Vision Qe", models: [
        model("Elektrikli Lüks Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["402 hp"])
      ] },
      { name: "Vision QXe", models: [
        model("Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["408 hp"])
      ] },
      { name: "PURE", models: [
        model("Giriş Donanım", ["Benzin"], ["Otomatik"], ["SUV", "Sedan"], ["2.0", "3.5"], ["268 hp", "450 hp"])
      ] },
      { name: "LUXE", models: [
        model("Konfor ve Güvenlik", ["Benzin"], ["Otomatik"], ["SUV", "Sedan"], ["2.0", "3.5"], ["268 hp", "450 hp"])
      ] },
      { name: "SPORT", models: [
        model("Sportif Tasarım", ["Benzin"], ["Otomatik"], ["SUV", "Sedan"], ["2.0", "3.5"], ["268 hp", "450 hp"])
      ] },
      { name: "AUTOGRAPH", models: [
        model("Üst Seviye Lüks", ["Benzin"], ["Otomatik"], ["SUV", "Sedan"], ["2.0", "3.5"], ["268 hp", "450 hp"])
      ] },
      { name: "Q50", models: [
        model("Spor Sedan", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["2.0", "3.0", "3.5"], ["208 hp", "400 hp"])
      ] },
      { name: "Q60", models: [
        model("2.0t", ["Benzin"], ["Otomatik"], ["Coupe"], ["2.0"], ["208 hp"]),
        model("3.0t Red Sport", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["400 hp"]),
        model("Spor Coupé", ["Benzin"], ["Otomatik"], ["Coupe"], ["2.0", "3.0"], ["208 hp", "400 hp"])
      ] },
      { name: "QX70 / FX", models: [
        model("3.0d", ["Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["238 hp"]),
        model("3.7", ["Benzin"], ["Otomatik"], ["SUV"], ["3.7"], ["320 hp"]),
        model("5.0 V8", ["Benzin"], ["Otomatik"], ["SUV"], ["5.0"], ["390 hp"])
      ] },
      { name: "QX30", models: [
        model("Kompakt Crossover", ["Benzin", "Dizel"], ["Otomatik"], ["Crossover"], ["1.6", "2.2"], ["109 hp", "211 hp"])
      ] },
      { name: "G35 / G37", models: [
        model("G35", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan", "Coupe"], ["3.5"], ["280 hp", "306 hp"]),
        model("G37", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan", "Coupe"], ["3.7"], ["320 hp", "330 hp"])
      ] }
    ]
  },
  {
    name: "Jaguar",
    series: [
      { name: "Jaguar GT / Type 00", models: [
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Grand Tourer"], ["0"], ["800 hp", "1000 hp"]),
        model("800 HP", ["Elektrik"], ["Otomatik"], ["Grand Tourer"], ["0"], ["800 hp"]),
        model("1000 HP", ["Elektrik"], ["Otomatik"], ["Grand Tourer"], ["0"], ["1000 hp"]),
        model("4 Kapılı Grand Tourer", ["Elektrik"], ["Otomatik"], ["Grand Tourer"], ["0"], ["800 hp", "1000 hp"]),
        model("700 km+ Menzil", ["Elektrik"], ["Otomatik"], ["Grand Tourer"], ["0"], ["800 hp", "1000 hp"])
      ] },
      { name: "Jaguar Luxury SUV", models: [
        model("Elektrikli Lüks SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["600 hp"])
      ] },
      { name: "Jaguar I-Type", models: [
        model("Elektrikli Spor Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["400 hp"])
      ] },
      { name: "F-Pace", models: [
        model("S", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0", "3.0"], ["204 hp", "400 hp"]),
        model("SE", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0", "3.0"], ["204 hp", "400 hp"]),
        model("HSE", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0", "3.0"], ["204 hp", "400 hp"]),
        model("R-Dynamic", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0", "3.0"], ["204 hp", "400 hp"]),
        model("SVR", ["Benzin"], ["Otomatik"], ["SUV"], ["5.0"], ["575 hp"]),
        model("575 HP V8", ["Benzin"], ["Otomatik"], ["SUV"], ["5.0"], ["575 hp"])
      ] },
      { name: "E-Pace", models: [
        model("R-Dynamic", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["163 hp", "249 hp"]),
        model("SE", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["163 hp", "249 hp"]),
        model("HSE", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["163 hp", "249 hp"])
      ] },
      { name: "I-Pace", models: [
        model("EV400", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["400 hp"]),
        model("HSE", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["400 hp"]),
        model("Black Edition", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["400 hp"])
      ] },
      { name: "XF / XF Sportbrake", models: [
        model("R-Dynamic", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0", "3.0"], ["204 hp", "300 hp"]),
        model("HSE", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0", "3.0"], ["204 hp", "300 hp"]),
        model("Sedan", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0", "3.0"], ["204 hp", "300 hp"]),
        model("Sportbrake", ["Benzin", "Dizel"], ["Otomatik"], ["Station Wagon"], ["2.0", "3.0"], ["204 hp", "300 hp"])
      ] },
      { name: "XE", models: [
        model("R-Dynamic", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["180 hp", "250 hp"]),
        model("S", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["180 hp", "250 hp"]),
        model("SE", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], ["2.0"], ["180 hp", "250 hp"])
      ] },
      { name: "F-Type", models: [
        model("R-Dynamic", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["2.0", "5.0"], ["300 hp", "450 hp"]),
        model("R75", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["5.0"], ["450 hp"]),
        model("SVR", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["5.0"], ["575 hp"]),
        model("V6", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["3.0"], ["340 hp", "380 hp"]),
        model("V8", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["5.0"], ["450 hp", "575 hp"])
      ] },
      { name: "XJ Serisi", models: [
        model("Lüks Sedan", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Sedan"], ["2.0", "3.0", "5.0"], ["180 hp", "510 hp"])
      ] },
      { name: "SVR", models: [
        model("SVO Performans", ["Benzin"], ["Otomatik"], ["SUV", "Coupe"], ["5.0"], ["575 hp"])
      ] },
      { name: "R-Dynamic", models: [
        model("Sportif Donanım", ["Benzin", "Dizel"], ["Otomatik"], ["SUV", "Sedan", "Coupe"], ["2.0", "3.0"], ["180 hp", "400 hp"])
      ] },
      { name: "Chequered Flag", models: [
        model("Özel Seri", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["2.0", "3.0"], ["300 hp", "380 hp"])
      ] }
    ]
  },
  {
    name: "Kia",
    series: [
      { name: "Picanto", models: [
        model("1.0", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["67 hp"]),
        model("1.2", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["84 hp"]),
        model("Feel", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2"], ["67 hp", "84 hp"]),
        model("Live", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2"], ["67 hp", "84 hp"]),
        model("Cool", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2"], ["67 hp", "84 hp"]),
        model("GT-Line", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2"], ["67 hp", "84 hp"])
      ] },
      { name: "Ceed HB / Ceed SW", models: [
        model("1.0 TGDI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Station Wagon"], ["1.0"], ["120 hp"]),
        model("1.5 TGDI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Station Wagon"], ["1.5"], ["160 hp"]),
        model("Cool", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Station Wagon"], ["1.0", "1.5"], ["120 hp", "160 hp"]),
        model("Elegance", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Station Wagon"], ["1.0", "1.5"], ["120 hp", "160 hp"]),
        model("Hatchback", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.5"], ["120 hp", "160 hp"]),
        model("Station Wagon", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.0", "1.5"], ["120 hp", "160 hp"])
      ] },
      { name: "ProCeed", models: [
        model("1.5 TGDI", ["Benzin"], ["Otomatik"], ["Shooting Brake"], ["1.5"], ["160 hp"]),
        model("Shooting Brake", ["Benzin"], ["Otomatik"], ["Shooting Brake"], ["1.5"], ["160 hp"])
      ] },
      { name: "Cerato", models: [
        model("1.6 MPI", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["123 hp"]),
        model("Elegance", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["123 hp"]),
        model("Prestige", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["123 hp"])
      ] },
      { name: "K4", models: [
        model("Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6", "2.0"], ["147 hp", "190 hp"]),
        model("Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.6", "2.0"], ["147 hp", "190 hp"])
      ] },
      { name: "K5", models: [
        model("1.6 T-GDI", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["180 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.0"], ["192 hp"]),
        model("AWD", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["180 hp"])
      ] },
      { name: "Stinger", models: [
        model("Performans", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0", "3.3"], ["255 hp", "370 hp"])
      ] },
      { name: "Stonic", models: [
        model("1.4 MPI", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.4"], ["100 hp"]),
        model("1.0 TGDI", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["100 hp"]),
        model("Cool", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0", "1.4"], ["100 hp"]),
        model("Business", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0", "1.4"], ["100 hp"]),
        model("Elegance", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0", "1.4"], ["100 hp"]),
        model("Prestige", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0", "1.4"], ["100 hp"])
      ] },
      { name: "XCeed", models: [
        model("1.5 TGDI", ["Benzin"], ["Otomatik"], ["Crossover"], ["1.5"], ["160 hp"]),
        model("Mild-Hybrid", ["Hibrit"], ["Otomatik"], ["Crossover"], ["1.5"], ["160 hp"]),
        model("Elegance", ["Benzin", "Hibrit"], ["Otomatik"], ["Crossover"], ["1.5"], ["160 hp"]),
        model("Prestige", ["Benzin", "Hibrit"], ["Otomatik"], ["Crossover"], ["1.5"], ["160 hp"])
      ] },
      { name: "Sportage", models: [
        model("1.6L Benzinli", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["180 hp"]),
        model("1.6L Dizel", ["Dizel"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["230 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["265 hp"]),
        model("Elegance", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp", "265 hp"]),
        model("Prestige", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp", "265 hp"]),
        model("GT-Line", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["136 hp", "265 hp"])
      ] },
      { name: "Sorento", models: [
        model("1.6L Hybrid 4x4", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["215 hp"]),
        model("2.2L Dizel", ["Dizel"], ["Otomatik"], ["SUV"], ["2.2"], ["194 hp"]),
        model("7 Koltuklu", ["Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.6", "2.2"], ["194 hp", "215 hp"])
      ] },
      { name: "Seltos", models: [
        model("1.6L", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["121 hp"]),
        model("2.0L", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["149 hp"])
      ] },
      { name: "Telluride", models: [
        model("3.8L V6", ["Benzin"], ["Otomatik"], ["SUV"], ["3.8"], ["291 hp"])
      ] },
      { name: "EV3", models: [
        model("Elektrikli Kompakt SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"])
      ] },
      { name: "EV4", models: [
        model("Elektrikli Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["204 hp"])
      ] },
      { name: "EV5", models: [
        model("Elektrikli Orta Boy SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"])
      ] },
      { name: "EV6 / EV6 GT", models: [
        model("170 HP", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["170 hp"]),
        model("585 HP", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["585 hp"]),
        model("Hızlı Şarj", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["170 hp", "585 hp"])
      ] },
      { name: "EV9", models: [
        model("6 Koltuklu", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp", "385 hp"]),
        model("7 Koltuklu", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp", "385 hp"]),
        model("Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp", "385 hp"])
      ] },
      { name: "Niro EV", models: [
        model("150 kW", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"]),
        model("Elegance", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"]),
        model("Prestige", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"])
      ] },
      { name: "Tasman", models: [
        model("Dizel", ["Dizel"], ["Otomatik", "Manuel"], ["Pickup"], ["2.2"], ["210 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["Pickup"], ["2.5"], ["281 hp"])
      ] },
      { name: "Carnival / Carnival Hybrid", models: [
        model("MPV", ["Benzin", "Dizel"], ["Otomatik"], ["MPV"], ["2.2", "3.5"], ["202 hp", "290 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["MPV"], ["1.6"], ["242 hp"])
      ] },
      { name: "Bongo III", models: [
        model("2.5 CRDi", ["Dizel"], ["Manuel"], ["Kamyonet"], ["2.5"], ["130 hp"])
      ] },
      { name: "PV5", models: [
        model("Panelvan", ["Elektrik"], ["Otomatik"], ["Panelvan"], ["0"], ["163 hp"]),
        model("Yolcu Versiyonu", ["Elektrik"], ["Otomatik"], ["MPV"], ["0"], ["163 hp"]),
        model("Elektrikli Ticari", ["Elektrik"], ["Otomatik"], ["Panelvan", "MPV"], ["0"], ["163 hp"])
      ] }
    ]
  },
  {
    name: "Lada",
    series: [
      { name: "Iskra", models: [
        model("Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["106 hp"]),
        model("Station Wagon", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.6"], ["106 hp"]),
        model("Cross", ["Benzin"], ["Manuel", "Otomatik"], ["Crossover"], ["1.6"], ["106 hp"])
      ] },
      { name: "Azimut", models: [
        model("Kompakt SUV", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6", "1.8"], ["122 hp", "145 hp"]),
        model("Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], ["1.6", "1.8"], ["122 hp", "145 hp"])
      ] },
      { name: "Aura", models: [
        model("1.8L VVT", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.8"], ["122 hp"]),
        model("Makam Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.8"], ["122 hp"])
      ] },
      { name: "2101 Rebirth", models: [
        model("Retro Modern", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["90 hp"])
      ] },
      { name: "Niva Legend", models: [
        model("3 Kapı", ["Benzin"], ["Manuel"], ["SUV"], ["1.7"], ["83 hp"]),
        model("5 Kapı", ["Benzin"], ["Manuel"], ["SUV"], ["1.7"], ["83 hp"]),
        model("Bronto", ["Benzin"], ["Manuel"], ["SUV"], ["1.7"], ["83 hp"])
      ] },
      { name: "Niva Travel", models: [
        model("Classic", ["Benzin"], ["Manuel"], ["SUV"], ["1.7"], ["80 hp"]),
        model("Comfort", ["Benzin"], ["Manuel"], ["SUV"], ["1.7"], ["80 hp"]),
        model("Black", ["Benzin"], ["Manuel"], ["SUV"], ["1.7"], ["80 hp"]),
        model("Luxe", ["Benzin"], ["Manuel"], ["SUV"], ["1.7"], ["80 hp"])
      ] },
      { name: "Niva Sport", models: [
        model("1.6L 122 HP", ["Benzin"], ["Manuel"], ["SUV"], ["1.6"], ["122 hp"]),
        model("Off-road Performans", ["Benzin"], ["Manuel"], ["SUV"], ["1.6"], ["122 hp"])
      ] },
      { name: "Vesta Sedan", models: [
        model("Life", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "1.8"], ["106 hp", "122 hp"]),
        model("Enjoy", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "1.8"], ["106 hp", "122 hp"]),
        model("Techno", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "1.8"], ["106 hp", "122 hp"]),
        model("1.6L", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["106 hp"]),
        model("1.8L", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8"], ["122 hp"])
      ] },
      { name: "Vesta SW", models: [
        model("Station Wagon", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.6", "1.8"], ["106 hp", "122 hp"])
      ] },
      { name: "Vesta SW Cross", models: [
        model("Crossover Wagon", ["Benzin"], ["Manuel", "Otomatik"], ["Crossover"], ["1.6", "1.8"], ["106 hp", "122 hp"])
      ] },
      { name: "Vesta Sportline", models: [
        model("1.8L", ["Benzin"], ["Manuel"], ["Sedan"], ["1.8"], ["118 hp"]),
        model("Sportif Sedan", ["Benzin"], ["Manuel"], ["Sedan"], ["1.8"], ["118 hp"])
      ] },
      { name: "Granta Sedan", models: [
        model("Standart", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["90 hp", "106 hp"]),
        model("Classic", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["90 hp", "106 hp"]),
        model("Comfort", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["90 hp", "106 hp"])
      ] },
      { name: "Granta Liftback", models: [
        model("Liftback", ["Benzin"], ["Manuel", "Otomatik"], ["Liftback"], ["1.6"], ["90 hp", "106 hp"])
      ] },
      { name: "Granta Cross", models: [
        model("Yükseltilmiş Süspansiyon", ["Benzin"], ["Manuel"], ["Crossover"], ["1.6"], ["90 hp", "106 hp"])
      ] },
      { name: "Granta Sportline", models: [
        model("Sportline", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["118 hp"])
      ] },
      { name: "Largus Wagon", models: [
        model("5 Koltuklu", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.6"], ["90 hp", "106 hp"]),
        model("7 Koltuklu", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.6"], ["90 hp", "106 hp"])
      ] },
      { name: "Largus Cross", models: [
        model("Yükseltilmiş Şasi", ["Benzin"], ["Manuel"], ["Crossover"], ["1.6"], ["106 hp"])
      ] },
      { name: "e-Largus", models: [
        model("Elektrikli Ticari", ["Elektrik"], ["Otomatik"], ["Panelvan"], ["0"], ["163 hp"])
      ] },
      { name: "Largus Panelvan", models: [
        model("Panelvan", ["Benzin"], ["Manuel"], ["Panelvan"], ["1.6"], ["90 hp", "106 hp"])
      ] },
      { name: "Samara", models: [
        model("2108", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.3", "1.5"], ["65 hp", "72 hp"]),
        model("2109", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.3", "1.5"], ["65 hp", "72 hp"]),
        model("2115", ["Benzin"], ["Manuel"], ["Sedan"], ["1.5"], ["78 hp"])
      ] },
      { name: "Vega", models: [
        model("110 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], ["1.5", "1.6"], ["79 hp", "90 hp"]),
        model("111 Station", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.5", "1.6"], ["79 hp", "90 hp"]),
        model("112 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.5", "1.6"], ["79 hp", "90 hp"])
      ] },
      { name: "Kalina", models: [
        model("Hatchback", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.4", "1.6"], ["89 hp", "98 hp"]),
        model("Cross", ["Benzin"], ["Manuel", "Otomatik"], ["Crossover"], ["1.6"], ["106 hp"])
      ] },
      { name: "Priora", models: [
        model("Sedan", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["98 hp", "106 hp"]),
        model("Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.6"], ["98 hp", "106 hp"])
      ] },
      { name: "Zhiguli / Kuş Serisi", models: [
        model("2101", ["Benzin"], ["Manuel"], ["Sedan"], ["1.2"], ["64 hp"]),
        model("2105", ["Benzin"], ["Manuel"], ["Sedan"], ["1.3", "1.5"], ["65 hp", "71 hp"]),
        model("2107", ["Benzin"], ["Manuel"], ["Sedan"], ["1.5"], ["71 hp"])
      ] }
    ]
  },
  {
    name: "Lamborghini",
    series: [
      { name: "Aventador Serisi", models: [
        model("LP 700-4", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["700 hp"]),
        model("LP 720-4 50° Anniversario", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["720 hp"]),
        model("LP 750-4 SV", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["750 hp"]),
        model("LP 770-4 SVJ", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["770 hp"]),
        model("Aventador S", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["740 hp"]),
        model("Aventador Ultimae", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["780 hp"]),
        model("Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], ["6.5"], ["740 hp", "780 hp"]),
        model("Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["700 hp", "780 hp"])
      ] },
      { name: "Huracan Serisi", models: [
        model("LP 580-2", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["580 hp"]),
        model("LP 610-4", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["610 hp"]),
        model("LP 640-2", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["640 hp"]),
        model("EVO", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["640 hp"]),
        model("EVO Spyder", ["Benzin"], ["Otomatik"], ["Roadster"], ["5.2"], ["640 hp"]),
        model("Tecnica", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["640 hp"]),
        model("STO", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["640 hp"]),
        model("Sterrato", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["610 hp"]),
        model("Performante", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["5.2"], ["640 hp"])
      ] },
      { name: "Gallardo Serisi", models: [
        model("5.0", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["5.0"], ["500 hp", "520 hp"]),
        model("SE", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["5.0"], ["520 hp"]),
        model("Nera", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["5.0"], ["520 hp"]),
        model("Superleggera", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["5.0"], ["530 hp", "570 hp"]),
        model("LP 560-4", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["560 hp"]),
        model("LP 570-4", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.2"], ["570 hp"]),
        model("Spyder", ["Benzin"], ["Otomatik"], ["Roadster"], ["5.0", "5.2"], ["520 hp", "560 hp"])
      ] },
      { name: "Revuelto", models: [
        model("Revuelto", ["Hibrit"], ["Otomatik"], ["Coupe"], ["6.5"], ["1015 hp"])
      ] },
      { name: "Temerario", models: [
        model("Temerario", ["Hibrit"], ["Otomatik"], ["Coupe"], ["4.0"], ["920 hp"])
      ] },
      { name: "Urus", models: [
        model("Urus", ["Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["650 hp"]),
        model("Urus S", ["Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["666 hp"]),
        model("Urus Performante", ["Benzin"], ["Otomatik"], ["SUV"], ["4.0"], ["666 hp"]),
        model("Urus SE", ["Hibrit"], ["Otomatik"], ["SUV"], ["4.0"], ["800 hp"])
      ] },
      { name: "Murcielago", models: [
        model("Murcielago", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe", "Roadster"], ["6.2", "6.5"], ["580 hp", "670 hp"])
      ] },
      { name: "Diablo", models: [
        model("Diablo", ["Benzin"], ["Manuel"], ["Coupe", "Roadster"], ["5.7", "6.0"], ["492 hp", "595 hp"])
      ] },
      { name: "Countach", models: [
        model("Countach", ["Benzin"], ["Manuel"], ["Coupe"], ["4.0", "5.2"], ["375 hp", "455 hp"]),
        model("Countach LPI 800-4", ["Hibrit"], ["Otomatik"], ["Coupe"], ["6.5"], ["814 hp"])
      ] },
      { name: "Reventon", models: [
        model("Reventon", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["6.5"], ["650 hp"])
      ] },
      { name: "Sian", models: [
        model("Sian", ["Hibrit"], ["Otomatik"], ["Coupe", "Roadster"], ["6.5"], ["819 hp"])
      ] },
      { name: "Centenario", models: [
        model("Centenario", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["6.5"], ["770 hp"])
      ] },
      { name: "Veneno", models: [
        model("Veneno", ["Benzin"], ["Otomatik"], ["Coupe", "Roadster"], ["6.5"], ["750 hp"])
      ] },
      { name: "Essenza SCV12", models: [
        model("Essenza SCV12", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["830 hp"])
      ] }
    ]
  },
  {
    name: "Lancia",
    series: [
      { name: "Ypsilon Serisi", models: [
        model("Ypsilon Ibrida", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["110 hp"]),
        model("Ypsilon Elettrica", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["156 hp"]),
        model("Ypsilon LX", ["Hibrit", "Elektrik"], ["Otomatik"], ["Hatchback"], ["0", "1.2"], ["110 hp", "156 hp"]),
        model("Ypsilon Cassina", ["Hibrit", "Elektrik"], ["Otomatik"], ["Hatchback"], ["0", "1.2"], ["110 hp", "156 hp"]),
        model("Ypsilon HF", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["280 hp"]),
        model("Ypsilon Rally2 HF", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["212 hp"])
      ] },
      { name: "Gamma Serisi", models: [
        model("Gamma Type L74", ["Hibrit", "Elektrik"], ["Otomatik"], ["Crossover"], ["0", "1.6"], ["200 hp", "370 hp"]),
        model("Gamma Ibrida", ["Hibrit"], ["Otomatik"], ["Crossover"], ["1.6"], ["200 hp"]),
        model("Gamma Elettrica", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["245 hp"]),
        model("Gamma HF", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["370 hp"])
      ] },
      { name: "Delta Serisi", models: [
        model("Delta EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["240 hp"]),
        model("Delta Integrale", ["Benzin"], ["Manuel"], ["Hatchback"], ["2.0"], ["210 hp"]),
        model("Delta HF Turbo", ["Benzin"], ["Manuel"], ["Hatchback"], ["2.0"], ["165 hp"])
      ] },
      { name: "Thema", models: [
        model("8.32", ["Benzin"], ["Manuel"], ["Sedan"], ["2.9"], ["215 hp"]),
        model("Turbo", ["Benzin"], ["Manuel"], ["Sedan"], ["2.0"], ["165 hp"]),
        model("i.e.", ["Benzin"], ["Manuel"], ["Sedan"], ["2.0"], ["120 hp"])
      ] },
      { name: "Dedra", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.6", "1.9", "2.0"], ["90 hp", "120 hp"]),
        model("SW", ["Benzin", "Dizel"], ["Manuel"], ["Station Wagon"], ["1.6", "1.9", "2.0"], ["90 hp", "120 hp"])
      ] },
      { name: "Kappa", models: [
        model("Sedan", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0", "2.4", "3.0"], ["124 hp", "204 hp"]),
        model("SW", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["2.0", "2.4", "3.0"], ["124 hp", "204 hp"]),
        model("Coupe", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0", "3.0"], ["175 hp", "204 hp"])
      ] },
      { name: "Lybra", models: [
        model("1.6", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon"], ["1.6"], ["103 hp"]),
        model("1.9 JTD", ["Dizel"], ["Manuel"], ["Sedan", "Station Wagon"], ["1.9"], ["105 hp", "115 hp"]),
        model("2.0", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon"], ["2.0"], ["154 hp"])
      ] },
      { name: "Musa", models: [
        model("MPV", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.4", "1.9"], ["77 hp", "100 hp"])
      ] },
      { name: "Phedra", models: [
        model("MPV", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["2.0", "2.2", "3.0"], ["120 hp", "204 hp"])
      ] },
      { name: "Voyager", models: [
        model("Lüks MPV", ["Dizel"], ["Otomatik"], ["MPV"], ["2.8"], ["163 hp"])
      ] },
      { name: "Flavia", models: [
        model("Cabrio", ["Benzin"], ["Otomatik"], ["Roadster"], ["2.4"], ["175 hp"])
      ] }
    ]
  },
  {
    name: "Leapmotor",
    series: [
      { name: "T03", models: [
        model("400", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["109 hp"]),
        model("400 Comfort", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["109 hp"]),
        model("400 Luxury", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["109 hp"])
      ] },
      { name: "C10", models: [
        model("Design", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["231 hp"]),
        model("Style", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["231 hp"])
      ] },
      { name: "C11", models: [
        model("Premium", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp"]),
        model("Performance", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["544 hp"]),
        model("EREV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["272 hp"])
      ] },
      { name: "C16", models: [
        model("Intelligent", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["292 hp"]),
        model("Luxury", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["292 hp"]),
        model("6 Koltuklu", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["292 hp"])
      ] },
      { name: "B10", models: [
        model("Kompakt SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"])
      ] },
      { name: "B11", models: [
        model("Orta Boy SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["231 hp"])
      ] },
      { name: "C01", models: [
        model("525", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["272 hp"]),
        model("606", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["272 hp"]),
        model("717", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["544 hp"]),
        model("Performance", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["544 hp"])
      ] },
      { name: "B13", models: [
        model("Yeni Nesil Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["218 hp"])
      ] },
      { name: "EREV", models: [
        model("Extended Range Electric", ["Hibrit"], ["Otomatik"], ["SUV", "Sedan"], ["1.5"], ["218 hp", "272 hp"])
      ] },
      { name: "Performance", models: [
        model("Yüksek Performans", ["Elektrik"], ["Otomatik"], ["SUV", "Sedan"], ["0"], ["544 hp"])
      ] },
      { name: "Intelligent", models: [
        model("Akıllı Sürüş Paketleri", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["231 hp", "292 hp"])
      ] }
    ]
  },
  {
    name: "Land Rover",
    series: [
      { name: "Range Rover", models: [
        model("SE", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0", "4.4"], ["400 hp", "530 hp"]),
        model("Autobiography", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0", "4.4"], ["400 hp", "530 hp"]),
        model("SV", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["615 hp"]),
        model("SV Black", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["615 hp"]),
        model("P530", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["530 hp"]),
        model("P550e PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["550 hp"]),
        model("SV P615", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["615 hp"]),
        model("606 HP", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["606 hp"])
      ] },
      { name: "Range Rover Sport", models: [
        model("S", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["360 hp", "460 hp"]),
        model("Dynamic SE", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["360 hp", "460 hp"]),
        model("Dynamic HSE", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["360 hp", "460 hp"]),
        model("SV Edition One", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["635 hp"])
      ] },
      { name: "Range Rover Velar", models: [
        model("S", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["250 hp"]),
        model("Dynamic SE", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["250 hp"]),
        model("Dynamic HSE", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["250 hp"])
      ] },
      { name: "Range Rover Evoque", models: [
        model("S", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["200 hp"]),
        model("Dynamic SE", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["200 hp"])
      ] },
      { name: "Defender 90", models: [
        model("Kisa Sasi", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["300 hp", "400 hp"]),
        model("3 Kapi", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["3.0"], ["300 hp", "400 hp"])
      ] },
      { name: "Defender 110", models: [
        model("Standart Sasi", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["300 hp", "400 hp"]),
        model("5 Kapi", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["300 hp", "400 hp"])
      ] },
      { name: "Defender 130", models: [
        model("Uzun Sasi", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["300 hp", "400 hp"]),
        model("8 Kisilik", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["300 hp", "400 hp"])
      ] },
      { name: "Defender OCTA", models: [
        model("V8", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["635 hp"]),
        model("Off-road Performans", ["Benzin"], ["Otomatik"], ["SUV"], ["4.4"], ["635 hp"])
      ] },
      { name: "Discovery", models: [
        model("7 Koltuklu SUV", ["Dizel", "Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["300 hp", "360 hp"])
      ] },
      { name: "Discovery Sport", models: [
        model("Kompakt Aile SUV", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["200 hp", "249 hp"])
      ] },
      { name: "Freelander", models: [
        model("Freelander", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["2.0", "2.2"], ["150 hp", "190 hp"])
      ] },
      { name: "Range Rover Classic", models: [
        model("Range Rover Classic", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["3.5", "3.9"], ["135 hp", "182 hp"])
      ] },
      { name: "Range Rover P38", models: [
        model("Range Rover P38", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.5", "4.0", "4.6"], ["136 hp", "190 hp", "225 hp"])
      ] },
      { name: "Range Rover L322", models: [
        model("Range Rover L322", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["3.0", "3.6", "4.2", "4.4"], ["177 hp", "390 hp"])
      ] },
      { name: "Defender Classic", models: [
        model("Defender Classic", ["Dizel", "Benzin"], ["Manuel"], ["SUV"], ["2.5", "3.5"], ["122 hp", "182 hp"])
      ] }
    ]
  },
  {
    name: "Lexus",
    series: [
      { name: "IS Serisi", models: [
        model("IS 300", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["2.0", "2.5"], ["223 hp", "241 hp"]),
        model("IS 350", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.5"], ["311 hp"]),
        model("IS 500", ["Benzin"], ["Otomatik"], ["Sedan"], ["5.0"], ["472 hp"]),
        model("F Sport Performance", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.5", "5.0"], ["311 hp", "472 hp"])
      ] },
      { name: "ES Serisi", models: [
        model("ES 350h", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.5"], ["218 hp"]),
        model("ES 350e", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["224 hp"]),
        model("ES 500e", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["343 hp"]),
        model("Hibrit", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.5"], ["218 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["224 hp", "343 hp"]),
        model("AWD", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["343 hp"])
      ] },
      { name: "LS Serisi", models: [
        model("LS 500", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.5"], ["416 hp"]),
        model("LS 500h", ["Hibrit"], ["Otomatik"], ["Sedan"], ["3.5"], ["354 hp"])
      ] },
      { name: "LC Serisi", models: [
        model("LC 500", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.0"], ["471 hp"]),
        model("LC 500h", ["Hibrit"], ["Otomatik"], ["Coupe"], ["3.5"], ["354 hp"]),
        model("LC 500 Convertible", ["Benzin"], ["Otomatik"], ["Roadster"], ["5.0"], ["471 hp"])
      ] },
      { name: "RC Serisi", models: [
        model("RC 300", ["Benzin", "Hibrit"], ["Otomatik"], ["Coupe"], ["2.0", "2.5"], ["241 hp"]),
        model("RC 350", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.5"], ["311 hp"]),
        model("RC F", ["Benzin"], ["Otomatik"], ["Coupe"], ["5.0"], ["472 hp"])
      ] },
      { name: "UX Serisi", models: [
        model("UX 300h", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["199 hp"])
      ] },
      { name: "NX Serisi", models: [
        model("NX 250", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["203 hp"]),
        model("NX 350", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4"], ["279 hp"]),
        model("NX 350h", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["240 hp"]),
        model("NX 450h+", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["309 hp"])
      ] },
      { name: "RX Serisi", models: [
        model("RX 350", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4"], ["275 hp"]),
        model("RX 350h", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["246 hp"]),
        model("RX 450h+", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["309 hp"]),
        model("RX 500h", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.4"], ["367 hp"]),
        model("F Sport Performance", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.4"], ["367 hp"])
      ] },
      { name: "RZ Serisi", models: [
        model("RZ 300e", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["201 hp"]),
        model("RZ 450e", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["313 hp"]),
        model("RZ 550e", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["408 hp"]),
        model("F Sport", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["408 hp"])
      ] },
      { name: "TX Serisi", models: [
        model("TX 350", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4"], ["275 hp"]),
        model("TX 500h", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.4"], ["366 hp"]),
        model("TX 550h+", ["Hibrit"], ["Otomatik"], ["SUV"], ["3.5"], ["406 hp"]),
        model("3 Sıra Koltuklu", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.4", "3.5"], ["275 hp", "406 hp"])
      ] },
      { name: "GX Serisi", models: [
        model("GX 550", ["Benzin"], ["Otomatik"], ["SUV"], ["3.4"], ["349 hp"]),
        model("Luxury", ["Benzin"], ["Otomatik"], ["SUV"], ["3.4"], ["349 hp"]),
        model("Overtrail", ["Benzin"], ["Otomatik"], ["SUV"], ["3.4"], ["349 hp"]),
        model("Premium", ["Benzin"], ["Otomatik"], ["SUV"], ["3.4"], ["349 hp"])
      ] },
      { name: "LX Serisi", models: [
        model("LX 600", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["409 hp"]),
        model("LX 700h", ["Hibrit"], ["Otomatik"], ["SUV"], ["3.5"], ["457 hp"]),
        model("F Sport Handling", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["3.5"], ["409 hp", "457 hp"])
      ] }
    ]
  },
  {
    name: "Lincoln",
    series: [
      { name: "Navigator", models: [
        model("Navigator", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["440 hp"]),
        model("Navigator L", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["440 hp"]),
        model("Uzun Şasi", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["440 hp"])
      ] },
      { name: "Aviator", models: [
        model("Aviator", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["3.0"], ["400 hp", "494 hp"])
      ] },
      { name: "Nautilus", models: [
        model("Nautilus", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0", "2.7"], ["250 hp", "335 hp"])
      ] },
      { name: "Corsair", models: [
        model("Corsair", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0", "2.5"], ["250 hp", "266 hp"])
      ] },
      { name: "Premiere", models: [
        model("Giriş Seviyesi Modern Lüks", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0", "2.5", "3.0", "3.5"], ["250 hp", "494 hp"])
      ] },
      { name: "Reserve", models: [
        model("Konfor ve Teknoloji", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0", "2.5", "3.0", "3.5"], ["250 hp", "494 hp"])
      ] },
      { name: "Black Label", models: [
        model("Ultra Lüks Özel Tasarım", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0", "2.5", "3.0", "3.5"], ["250 hp", "494 hp"])
      ] },
      { name: "Grand Touring", models: [
        model("PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5", "3.0"], ["266 hp", "494 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5", "3.0"], ["266 hp", "494 hp"])
      ] },
      { name: "Jet Appearance Package", models: [
        model("Siyah Detaylı Sportif Paket", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0", "2.5", "3.0", "3.5"], ["250 hp", "494 hp"])
      ] }
    ]
  },
  {
    name: "Lotus",
    series: [
      { name: "Emira Serisi", models: [
        model("Emira Turbo", ["Benzin"], ["Otomatik"], ["Coupe"], ["2.0"], ["360 hp"]),
        model("Emira Turbo SE", ["Benzin"], ["Otomatik"], ["Coupe"], ["2.0"], ["400 hp"]),
        model("Emira Turbo SE Racing Line", ["Benzin"], ["Otomatik"], ["Coupe"], ["2.0"], ["400 hp"]),
        model("Emira V6 SE", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.5"], ["400 hp"]),
        model("Emira V6 SE Racing Line", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.5"], ["400 hp"]),
        model("Emira Jim Clark Edition", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.5"], ["400 hp"])
      ] },
      { name: "Eletre Serisi", models: [
        model("Eletre 600", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["603 hp"]),
        model("Eletre 600 GT", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["603 hp"]),
        model("Eletre 600 GT SE", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["603 hp"]),
        model("Eletre 600 SPORT SE", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["603 hp"]),
        model("Eletre 900 SPORT", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["905 hp"]),
        model("Eletre 900 SPORT CARBON", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["905 hp"])
      ] },
      { name: "Emeya Serisi", models: [
        model("Emeya 600", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["603 hp"]),
        model("Emeya 600 GT", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["603 hp"]),
        model("Emeya 600 GT SE", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["603 hp"]),
        model("Emeya 600 SPORT SE", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["603 hp"]),
        model("Emeya 900 SPORT", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["905 hp"]),
        model("Emeya 900 SPORT CARBON", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["905 hp"])
      ] },
      { name: "Evija Serisi", models: [
        model("Evija", ["Elektrik"], ["Otomatik"], ["Hypercar"], ["0"], ["2000 hp"]),
        model("Evija Fittipaldi", ["Elektrik"], ["Otomatik"], ["Hypercar"], ["0"], ["2000 hp"])
      ] },
      { name: "Evora", models: [
        model("GT", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.5"], ["416 hp"]),
        model("400", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.5"], ["400 hp"]),
        model("410 Sport", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.5"], ["410 hp"])
      ] },
      { name: "Exige", models: [
        model("Sport 350", ["Benzin"], ["Manuel"], ["Coupe"], ["3.5"], ["350 hp"]),
        model("Sport 410", ["Benzin"], ["Manuel"], ["Coupe"], ["3.5"], ["410 hp"]),
        model("Cup 430", ["Benzin"], ["Manuel"], ["Coupe"], ["3.5"], ["430 hp"])
      ] },
      { name: "Elise", models: [
        model("Sport 220", ["Benzin"], ["Manuel"], ["Roadster"], ["1.8"], ["220 hp"]),
        model("Cup 250", ["Benzin"], ["Manuel"], ["Roadster"], ["1.8"], ["250 hp"])
      ] },
      { name: "Esprit", models: [
        model("S1", ["Benzin"], ["Manuel"], ["Coupe"], ["2.0"], ["160 hp"]),
        model("S2", ["Benzin"], ["Manuel"], ["Coupe"], ["2.2"], ["160 hp"]),
        model("S3", ["Benzin"], ["Manuel"], ["Coupe"], ["2.2"], ["172 hp"]),
        model("Turbo", ["Benzin"], ["Manuel"], ["Coupe"], ["2.2"], ["215 hp"]),
        model("V8", ["Benzin"], ["Manuel"], ["Coupe"], ["3.5"], ["350 hp"])
      ] }
    ]
  },
  {
    name: "Maserati",
    series: [
      { name: "MCPura / Supercar", models: [
        model("MCPura", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["630 hp"]),
        model("MCPura Cielo", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.0"], ["630 hp"]),
        model("MCPura Folgore", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["761 hp"]),
        model("GT2 Stradale", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["640 hp"]),
        model("MCXtrema", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["730 hp"])
      ] },
      { name: "Grecale Serisi", models: [
        model("Grecale Modena", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0", "3.0"], ["300 hp", "330 hp"]),
        model("Grecale Trofeo", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["530 hp"]),
        model("Grecale Folgore", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["557 hp"])
      ] },
      { name: "GranTurismo / GranCabrio", models: [
        model("GranTurismo Modena", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["490 hp"]),
        model("GranTurismo Trofeo", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["550 hp"]),
        model("GranTurismo Folgore", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["761 hp"]),
        model("GranCabrio Modena", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.0"], ["490 hp"]),
        model("GranCabrio Trofeo", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.0"], ["550 hp"]),
        model("GranCabrio Folgore", ["Elektrik"], ["Otomatik"], ["Roadster"], ["0"], ["761 hp"])
      ] },
      { name: "Quattroporte Folgore", models: [
        model("Elektrikli Lüks Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["761 hp"])
      ] },
      { name: "Ghibli", models: [
        model("V6", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["350 hp", "430 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.0"], ["330 hp"])
      ] },
      { name: "Levante", models: [
        model("GT", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0", "3.0"], ["330 hp", "430 hp"]),
        model("Modena", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0"], ["350 hp"]),
        model("Trofeo", ["Benzin"], ["Otomatik"], ["SUV"], ["3.8"], ["580 hp"])
      ] },
      { name: "MC20", models: [
        model("MC20", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["630 hp"]),
        model("Cielo", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.0"], ["630 hp"])
      ] },
      { name: "Quattroporte", models: [
        model("Modena", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["350 hp"]),
        model("Trofeo", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.8"], ["580 hp"]),
        model("V6", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["350 hp", "430 hp"])
      ] },
      { name: "GranSport", models: [
        model("GranSport", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.2"], ["400 hp"])
      ] },
      { name: "GranCabrio klasik versiyonları", models: [
        model("GranCabrio Sport", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.7"], ["460 hp"]),
        model("GranCabrio MC", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.7"], ["460 hp"])
      ] }
    ]
  },
  {
    name: "Mazda",
    series: [
      { name: "CX-30", models: [
        model("2.5 S", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["191 hp"]),
        model("2.5 Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["250 hp"]),
        model("Aire Edition", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["191 hp"])
      ] },
      { name: "CX-5", models: [
        model("Pure", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0", "2.5"], ["165 hp", "194 hp"]),
        model("Evolve", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0", "2.5"], ["165 hp", "194 hp"]),
        model("GT SP", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["194 hp"]),
        model("Akari", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["194 hp"])
      ] },
      { name: "CX-50", models: [
        model("2.5 S", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["187 hp"]),
        model("2.5 Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["256 hp"]),
        model("Meridian Edition", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["256 hp"])
      ] },
      { name: "CX-50 Hybrid", models: [
        model("CX-50 Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["219 hp"])
      ] },
      { name: "CX-70", models: [
        model("3.3 Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["3.3"], ["280 hp"]),
        model("3.3 Turbo S", ["Benzin"], ["Otomatik"], ["SUV"], ["3.3"], ["340 hp"])
      ] },
      { name: "CX-70 PHEV", models: [
        model("CX-70 PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["323 hp"])
      ] },
      { name: "CX-90", models: [
        model("3.3 Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["3.3"], ["280 hp"]),
        model("3.3 Turbo S", ["Benzin"], ["Otomatik"], ["SUV"], ["3.3"], ["340 hp"])
      ] },
      { name: "CX-90 PHEV", models: [
        model("323 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["323 hp"])
      ] },
      { name: "CX-60", models: [
        model("CX-60", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["2.5", "3.3"], ["200 hp", "327 hp"])
      ] },
      { name: "CX-80", models: [
        model("CX-80", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["2.5", "3.3"], ["254 hp", "327 hp"])
      ] },
      { name: "Mazda3 Sedan", models: [
        model("2.5 S", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["191 hp"]),
        model("Select Sport", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["191 hp"]),
        model("Preferred", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["191 hp"]),
        model("Carbon Edition", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["191 hp"]),
        model("Premium", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["191 hp"]),
        model("Turbo Premium Plus", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["250 hp"])
      ] },
      { name: "Mazda3 Hatchback", models: [
        model("2.5 S", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.5"], ["191 hp"]),
        model("Carbon Edition", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.5"], ["191 hp"]),
        model("Premium", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.5"], ["191 hp"]),
        model("Manuel Vites", ["Benzin"], ["Manuel"], ["Hatchback"], ["2.5"], ["191 hp"])
      ] },
      { name: "Mazda6", models: [
        model("Mazda6", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["2.0", "2.2", "2.5"], ["145 hp", "194 hp"])
      ] },
      { name: "MX-5 Miata Soft Top", models: [
        model("Sport", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0"], ["181 hp"]),
        model("Club", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0"], ["181 hp"]),
        model("Grand Touring", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0"], ["181 hp"])
      ] },
      { name: "MX-5 Miata RF", models: [
        model("Club", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0"], ["181 hp"]),
        model("Grand Touring", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0"], ["181 hp"])
      ] },
      { name: "MX-30", models: [
        model("MX-30", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["145 hp"])
      ] },
      { name: "MX-30 R-EV", models: [
        model("MX-30 R-EV", ["Hibrit"], ["Otomatik"], ["SUV"], ["0.8"], ["170 hp"])
      ] },
      { name: "Skyactiv-G", models: [
        model("Skyactiv-G", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback", "SUV"], ["1.5", "2.0", "2.5"], ["90 hp", "194 hp"])
      ] },
      { name: "Skyactiv-X", models: [
        model("Skyactiv-X", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback", "SUV"], ["2.0"], ["186 hp"])
      ] },
      { name: "Skyactiv-D", models: [
        model("Skyactiv-D", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback", "SUV"], ["1.8", "2.2", "3.3"], ["116 hp", "254 hp"])
      ] },
      { name: "i-Activ AWD", models: [
        model("i-Activ AWD", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV", "Sedan"], ["2.5", "3.3"], ["191 hp", "340 hp"])
      ] },
      { name: "Carbon Edition", models: [
        model("Carbon Edition", ["Benzin"], ["Otomatik"], ["Sedan", "Hatchback", "SUV"], ["2.5"], ["191 hp"])
      ] },
      { name: "Carbon Turbo", models: [
        model("Carbon Turbo", ["Benzin"], ["Otomatik"], ["Sedan", "Hatchback", "SUV"], ["2.5"], ["250 hp"])
      ] },
      { name: "Homura", models: [
        model("Homura", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV", "Sedan"], ["2.0", "2.5", "3.3"], ["165 hp", "327 hp"])
      ] },
      { name: "Takumi", models: [
        model("Takumi", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV", "Sedan"], ["2.0", "2.5", "3.3"], ["165 hp", "327 hp"])
      ] },
      { name: "RX-7", models: [
        model("RX-7", ["Benzin"], ["Manuel"], ["Coupe"], ["1.3"], ["255 hp", "280 hp"])
      ] },
      { name: "RX-8", models: [
        model("RX-8", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["1.3"], ["192 hp", "231 hp"])
      ] },
      { name: "CX-3", models: [
        model("CX-3", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.5", "2.0"], ["105 hp", "150 hp"])
      ] },
      { name: "Tribute", models: [
        model("Tribute", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["2.0", "2.3", "3.0"], ["124 hp", "200 hp"])
      ] },
      { name: "BT-50", models: [
        model("BT-50", ["Dizel"], ["Manuel", "Otomatik"], ["Pickup"], ["1.9", "3.0"], ["150 hp", "190 hp"])
      ] }
    ]
  },
  {
    name: "McLaren",
    series: [
      { name: "Ultimate Series", models: [
        model("W1", ["Hibrit"], ["Otomatik"], ["Coupe"], ["4.0"], ["1275 PS"]),
        model("Solus GT", ["Benzin"], ["Otomatik"], ["Hypercar"], ["5.2"], ["840 hp"]),
        model("Speedtail", ["Hibrit"], ["Otomatik"], ["Hyper-GT"], ["4.0"], ["1070 hp"]),
        model("Elva", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.0"], ["815 hp"]),
        model("Senna", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.0"], ["800 hp"]),
        model("Senna GTR", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.0"], ["825 hp"])
      ] },
      { name: "Super Series", models: [
        model("750S Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.0"], ["750 PS"]),
        model("750S Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.0"], ["750 PS"]),
        model("765LT", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.0"], ["765 hp"]),
        model("765LT Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.0"], ["765 hp"]),
        model("720S", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.0"], ["720 hp"]),
        model("720S Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.0"], ["720 hp"])
      ] },
      { name: "High-Performance Hybrid", models: [
        model("Artura", ["Hibrit"], ["Otomatik"], ["Coupe"], ["3.0"], ["680 PS"]),
        model("Artura Spider", ["Hibrit"], ["Otomatik"], ["Roadster"], ["3.0"], ["700 PS"]),
        model("Artura Trophy", ["Hibrit"], ["Otomatik"], ["Coupe"], ["3.0"], ["680 PS"])
      ] },
      { name: "P1", models: [
        model("P1", ["Hibrit"], ["Otomatik"], ["Coupe"], ["3.8"], ["916 hp"])
      ] },
      { name: "570S", models: [
        model("570S", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.8"], ["570 hp"]),
        model("570S Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.8"], ["570 hp"])
      ] },
      { name: "600LT", models: [
        model("600LT", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.8"], ["600 hp"]),
        model("600LT Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.8"], ["600 hp"])
      ] },
      { name: "GT", models: [
        model("GT", ["Benzin"], ["Otomatik"], ["Grand Tourer"], ["4.0"], ["620 hp"])
      ] },
      { name: "MP4-12C", models: [
        model("MP4-12C", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.8"], ["600 hp"]),
        model("MP4-12C Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.8"], ["600 hp"])
      ] },
      { name: "650S", models: [
        model("650S", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.8"], ["650 hp"]),
        model("650S Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.8"], ["650 hp"])
      ] }
    ]
  },
  {
    name: "MG",
    series: [
      { name: "ZS Serisi", models: [
        model("ZS Hybrid+", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["194 hp"]),
        model("ZS EV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["177 hp"]),
        model("ZS Petrol", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["106 hp"]),
        model("1.83 kWh Batarya", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["194 hp"]),
        model("1.5L", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["106 hp", "194 hp"])
      ] },
      { name: "HS Serisi", models: [
        model("HS Hybrid+", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["224 PS"]),
        model("HS PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["258 hp"]),
        model("HS Petrol", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["170 hp"]),
        model("224 PS", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["224 PS"]),
        model("75 Mil Menzil", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["258 hp"]),
        model("1.5 Turbo", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["170 hp", "224 PS"])
      ] },
      { name: "MG 4X", models: [
        model("Elektrikli Kompakt SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"])
      ] },
      { name: "Windsor EV", models: [
        model("CUV", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["136 hp"]),
        model("Crossover Utility Vehicle", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["136 hp"])
      ] },
      { name: "MG3 Serisi", models: [
        model("MG3 Hybrid+", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.5"], ["194 hp"]),
        model("MG3 Petrol", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["115 hp"]),
        model("Excite", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["115 hp", "194 hp"]),
        model("Essence", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["115 hp", "194 hp"]),
        model("Vibe", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["115 hp", "194 hp"])
      ] },
      { name: "MG4 EV Serisi", models: [
        model("MG4 Electric", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["170 hp", "204 hp"]),
        model("MG4 XPower", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["435 hp"]),
        model("Urban", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["170 hp"]),
        model("Excite", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["204 hp"]),
        model("Essence", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["204 hp"]),
        model("435 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["435 hp"])
      ] },
      { name: "MG5 EV Serisi", models: [
        model("Elektrikli Station Wagon", ["Elektrik"], ["Otomatik"], ["Station Wagon"], ["0"], ["156 hp"])
      ] },
      { name: "MG6 EV / PHEV", models: [
        model("Sportif Sedan", ["Elektrik", "Hibrit"], ["Otomatik"], ["Sedan"], ["0", "1.5"], ["188 hp", "305 hp"]),
        model("EV", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["188 hp"]),
        model("PHEV", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["305 hp"])
      ] },
      { name: "MG 07", models: [
        model("Lüks Coupe-Sedan", ["Hibrit"], ["Otomatik"], ["Coupe", "Sedan"], ["1.5"], ["257 hp"]),
        model("AI destekli", ["Hibrit"], ["Otomatik"], ["Coupe", "Sedan"], ["1.5"], ["257 hp"])
      ] },
      { name: "Cyberster", models: [
        model("Roadster", ["Elektrik"], ["Otomatik"], ["Roadster"], ["0"], ["340 hp", "503 hp"]),
        model("Single Motor RWD", ["Elektrik"], ["Otomatik"], ["Roadster"], ["0"], ["340 hp"]),
        model("Dual Motor AWD", ["Elektrik"], ["Otomatik"], ["Roadster"], ["0"], ["503 hp"]),
        model("503 HP", ["Elektrik"], ["Otomatik"], ["Roadster"], ["0"], ["503 hp"])
      ] },
      { name: "Cyber GTS", models: [
        model("2+2 Coupe", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["544 hp"])
      ] },
      { name: "Hybrid+", models: [
        model("Hibrit Teknoloji", ["Hibrit"], ["Otomatik"], ["Hatchback", "SUV"], ["1.5"], ["194 hp", "224 PS"])
      ] },
      { name: "MG Pilot", models: [
        model("Sürüş Destek Sistemi", ["Benzin", "Elektrik", "Hibrit"], ["Otomatik"], ["Hatchback", "SUV", "Sedan"], ["0", "1.5"], ["136 hp", "257 hp"])
      ] },
      { name: "Vibe / Excite / Essence", models: [
        model("Vibe", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5"], ["115 hp", "194 hp"]),
        model("Excite", ["Benzin", "Hibrit", "Elektrik"], ["Manuel", "Otomatik"], ["Hatchback"], ["0", "1.5"], ["115 hp", "204 hp"]),
        model("Essence", ["Benzin", "Hibrit", "Elektrik"], ["Manuel", "Otomatik"], ["Hatchback"], ["0", "1.5"], ["115 hp", "204 hp"])
      ] },
      { name: "Luxury / Trophy", models: [
        model("Luxury", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik"], ["SUV", "Sedan"], ["0", "1.5"], ["170 hp", "258 hp"]),
        model("Trophy", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik"], ["SUV", "Sedan"], ["0", "1.5"], ["170 hp", "258 hp"])
      ] },
      { name: "MG One", models: [
        model("MG One", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["181 hp"])
      ] },
      { name: "MG RX5", models: [
        model("MG RX5", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["170 hp", "245 hp"])
      ] },
      { name: "MG Marvel R", models: [
        model("MG Marvel R", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["288 hp"])
      ] },
      { name: "MG EHS", models: [
        model("MG EHS", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["258 hp"])
      ] },
      { name: "MG TF", models: [
        model("MG TF", ["Benzin"], ["Manuel"], ["Roadster"], ["1.8"], ["135 hp", "160 hp"])
      ] }
    ]
  },
  {
    name: "Mini",
    series: [
      { name: "Cooper Serisi", models: [
        model("Cooper 2 Door / 3 Kapı", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.5", "2.0"], ["156 HP", "204 HP"]),
        model("Cooper C", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.5"], ["156 HP"]),
        model("Cooper S", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.0"], ["204 HP"]),
        model("156 HP", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.5"], ["156 HP"]),
        model("204 HP", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.0"], ["204 HP"])
      ] },
      { name: "Cooper 4 Door / 5 Kapı", models: [
        model("Cooper C", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.5"], ["156 HP"]),
        model("Cooper S", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.0"], ["204 HP"])
      ] },
      { name: "Cooper Convertible / Cabrio", models: [
        model("Cooper C", ["Benzin"], ["Otomatik"], ["Roadster"], ["1.5"], ["156 HP"]),
        model("Cooper S", ["Benzin"], ["Otomatik"], ["Roadster"], ["2.0"], ["204 HP"])
      ] },
      { name: "Cooper E / SE", models: [
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["184 HP", "218 HP"]),
        model("Cooper E", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["184 HP"]),
        model("Cooper SE", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["218 HP"])
      ] },
      { name: "Countryman Serisi", models: [
        model("Countryman S ALL4", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["241 HP"]),
        model("Countryman SE ALL4", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["308 HP"]),
        model("Countryman E", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 HP"]),
        model("Countryman D", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["163 HP"])
      ] },
      { name: "Aceman Serisi", models: [
        model("Aceman E", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["184 HP"]),
        model("Aceman SE", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 HP"])
      ] },
      { name: "John Cooper Works / JCW", models: [
        model("JCW 2 Door", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.0"], ["231 HP"]),
        model("JCW Convertible", ["Benzin"], ["Otomatik"], ["Roadster"], ["2.0"], ["231 HP"]),
        model("JCW Countryman ALL4", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["312 HP"]),
        model("JCW Electric", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["258 HP"])
      ] },
      { name: "Clubman", models: [
        model("Cooper", ["Benzin", "Dizel"], ["Otomatik", "Manuel"], ["Station Wagon"], ["1.5", "2.0"], ["136 HP", "192 HP"]),
        model("Cooper S", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["192 HP"]),
        model("JCW ALL4", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["306 HP"])
      ] },
      { name: "Coupe", models: [
        model("Cooper", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["1.6"], ["122 HP"]),
        model("Cooper S", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["1.6"], ["184 HP"]),
        model("JCW", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["1.6"], ["211 HP"])
      ] },
      { name: "Roadster", models: [
        model("Cooper", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["1.6"], ["122 HP"]),
        model("Cooper S", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["1.6"], ["184 HP"]),
        model("JCW", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["1.6"], ["211 HP"])
      ] },
      { name: "Paceman", models: [
        model("Cooper", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV Coupe"], ["1.6", "2.0"], ["122 HP", "184 HP"]),
        model("Cooper S", ["Benzin"], ["Manuel", "Otomatik"], ["SUV Coupe"], ["1.6"], ["184 HP"]),
        model("JCW ALL4", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["1.6"], ["218 HP"])
      ] },
      { name: "One", models: [
        model("One 3 Door", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2", "1.5"], ["102 HP"]),
        model("One 5 Door", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2", "1.5"], ["102 HP"])
      ] },
      { name: "Cooper D", models: [
        model("Cooper D 3 Door", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5", "2.0"], ["116 HP", "170 HP"]),
        model("Cooper D Countryman", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["163 HP"])
      ] }
    ]
  },
  {
    name: "Mitsubishi",
    series: [
      { name: "Outlander", models: [
        model("ES", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["181 hp"]),
        model("SE", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["181 hp"]),
        model("SEL", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["181 hp"]),
        model("Platinum Edition", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["181 hp"])
      ] },
      { name: "Outlander PHEV", models: [
        model("SEL", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.4"], ["248 hp"]),
        model("Black Edition", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.4"], ["248 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.4"], ["248 hp"])
      ] },
      { name: "ASX", models: [
        model("1.0T", ["Benzin"], ["Manuel"], ["SUV"], ["1.0"], ["91 hp"]),
        model("1.3 DI-T Mild Hybrid", ["Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.3"], ["140 hp", "158 hp"]),
        model("1.6 HEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["145 hp"])
      ] },
      { name: "Eclipse Cross", models: [
        model("ES", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["152 hp"]),
        model("LE", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["152 hp"]),
        model("SE", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["152 hp"]),
        model("SEL", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["152 hp"]),
        model("1.5 Turbo MIVEC", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["152 hp"])
      ] },
      { name: "Pajero Sport", models: [
        model("GLX", ["Dizel"], ["Otomatik", "Manuel"], ["SUV"], ["2.4"], ["181 hp"]),
        model("GLS", ["Dizel"], ["Otomatik", "Manuel"], ["SUV"], ["2.4"], ["181 hp"]),
        model("Exceed", ["Dizel"], ["Otomatik", "Manuel"], ["SUV"], ["2.4"], ["181 hp"]),
        model("4x4", ["Dizel"], ["Otomatik", "Manuel"], ["SUV"], ["2.4"], ["181 hp"])
      ] },
      { name: "Xforce", models: [
        model("Exceed", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["105 hp"]),
        model("Ultimate", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["105 hp"])
      ] },
      { name: "L200 / Triton", models: [
        model("GL", ["Dizel"], ["Manuel"], ["Pickup"], ["2.4"], ["150 hp", "184 hp"]),
        model("GLX", ["Dizel"], ["Manuel", "Otomatik"], ["Pickup"], ["2.4"], ["150 hp", "184 hp"]),
        model("GLS", ["Dizel"], ["Manuel", "Otomatik"], ["Pickup"], ["2.4"], ["150 hp", "184 hp"]),
        model("GSR", ["Dizel"], ["Otomatik"], ["Pickup"], ["2.4"], ["184 hp"]),
        model("4x2", ["Dizel"], ["Manuel", "Otomatik"], ["Pickup"], ["2.4"], ["150 hp", "184 hp"]),
        model("4x4", ["Dizel"], ["Manuel", "Otomatik"], ["Pickup"], ["2.4"], ["150 hp", "184 hp"])
      ] },
      { name: "L200 Ralliart", models: [
        model("Performance Edition", ["Dizel"], ["Otomatik"], ["Pickup"], ["2.4"], ["220 hp"])
      ] },
      { name: "Colt", models: [
        model("1.0", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["67 hp"]),
        model("1.0T", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["91 hp"]),
        model("1.6 Hybrid", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.6"], ["143 hp"])
      ] },
      { name: "Space Star / Mirage", models: [
        model("1.2L", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["71 hp", "80 hp"])
      ] },
      { name: "Ralliart", models: [
        model("Sportif Paket", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV", "Pickup"], ["1.5", "2.4"], ["105 hp", "220 hp"])
      ] },
      { name: "Black Edition", models: [
        model("Siyah Tasarım Paketi", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.4"], ["248 hp"])
      ] },
      { name: "S-AWC", models: [
        model("Super All-Wheel Control", ["Benzin", "Hibrit", "Dizel"], ["Otomatik"], ["SUV", "Pickup"], ["1.5", "2.4"], ["152 hp", "248 hp"])
      ] },
      { name: "MIVEC", models: [
        model("Değişken Valf Zamanlama", ["Benzin"], ["Manuel", "Otomatik"], ["SUV", "Sedan", "Hatchback"], ["1.5", "1.6", "2.0"], ["105 hp", "152 hp"])
      ] },
      { name: "Lancer", models: [
        model("Lancer", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "1.8", "2.0"], ["117 hp", "150 hp"])
      ] },
      { name: "Lancer Evolution / EVO", models: [
        model("EVO", ["Benzin"], ["Manuel"], ["Sedan"], ["2.0"], ["280 hp", "295 hp"])
      ] },
      { name: "Galant", models: [
        model("Galant", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0", "2.5"], ["136 hp", "163 hp"])
      ] },
      { name: "Carisma", models: [
        model("Carisma", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.6", "1.8", "1.9"], ["90 hp", "140 hp"])
      ] },
      { name: "Grandis", models: [
        model("Grandis", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["2.0", "2.4"], ["136 hp", "165 hp"])
      ] },
      { name: "Pajero", models: [
        model("Pajero", ["Dizel", "Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["3.2", "3.8"], ["190 hp", "250 hp"])
      ] },
      { name: "3000GT", models: [
        model("3000GT", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["222 hp", "286 hp", "320 hp"])
      ] }
    ]
  },
  {
    name: "Morgan",
    series: [
      { name: "Plus Four", models: [
        model("2.0L BMW TwinPower Turbo", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0"], ["255 BHP"]),
        model("255 BHP", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0"], ["255 BHP"]),
        model("Manuel", ["Benzin"], ["Manuel"], ["Roadster"], ["2.0"], ["255 BHP"]),
        model("Otomatik", ["Benzin"], ["Otomatik"], ["Roadster"], ["2.0"], ["255 BHP"])
      ] },
      { name: "Plus Six", models: [
        model("3.0L BMW Turbo I6", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.0"], ["335 BHP"]),
        model("335 BHP", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.0"], ["335 BHP"])
      ] },
      { name: "Supersport", models: [
        model("Pist Odakli", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["335 BHP"]),
        model("Sert Tavan", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["335 BHP"])
      ] },
      { name: "Supersport 400", models: [
        model("Ozel Seri", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["400 BHP"]),
        model("Hafifletilmis", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["400 BHP"])
      ] },
      { name: "Super 3", models: [
        model("1.5L Ford 3 Silindir", ["Benzin"], ["Manuel"], ["Roadster"], ["1.5"], ["118 BHP"]),
        model("118 BHP", ["Benzin"], ["Manuel"], ["Roadster"], ["1.5"], ["118 BHP"])
      ] },
      { name: "Super 3 Origins", models: [
        model("Ozel Lansman", ["Benzin"], ["Manuel"], ["Roadster"], ["1.5"], ["118 BHP"])
      ] },
      { name: "Midsummer", models: [
        model("Pininfarina", ["Benzin"], ["Otomatik"], ["Barchetta"], ["3.0"], ["335 BHP"]),
        model("Barchetta", ["Benzin"], ["Otomatik"], ["Barchetta"], ["3.0"], ["335 BHP"]),
        model("50 Adet", ["Benzin"], ["Otomatik"], ["Barchetta"], ["3.0"], ["335 BHP"])
      ] },
      { name: "Plus Four Spiaggina", models: [
        model("Sahil Tasarimi", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0"], ["255 BHP"])
      ] },
      { name: "Dynamic Handling Pack", models: [
        model("Dynamic Handling Pack", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0", "3.0"], ["255 BHP", "335 BHP"])
      ] },
      { name: "Sennheiser Audio", models: [
        model("Sennheiser Audio", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0", "3.0"], ["255 BHP", "335 BHP"])
      ] },
      { name: "Marquetry Veneers", models: [
        model("Marquetry Veneers", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0", "3.0"], ["255 BHP", "335 BHP"])
      ] },
      { name: "Mulliner-style Quilt", models: [
        model("Mulliner-style Quilt", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["2.0", "3.0"], ["255 BHP", "335 BHP"])
      ] },
      { name: "Aero 8", models: [
        model("Aero 8", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.4"], ["367 BHP"])
      ] },
      { name: "Aero GT", models: [
        model("Aero GT", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.8"], ["367 BHP"])
      ] },
      { name: "Roadster", models: [
        model("Roadster", ["Benzin"], ["Manuel"], ["Roadster"], ["3.7"], ["280 BHP"])
      ] },
      { name: "4/4", models: [
        model("4/4", ["Benzin"], ["Manuel"], ["Roadster"], ["1.6"], ["112 BHP"])
      ] },
      { name: "Plus 8", models: [
        model("Plus 8", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["4.8"], ["367 BHP"])
      ] }
    ]
  },
  {
    name: "Nissan",
    series: [
      { name: "Qashqai", models: [
        model("Mild Hybrid", ["Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.3"], ["140 hp", "158 hp"]),
        model("e-POWER", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["190 hp"]),
        model("Design", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3", "1.5"], ["158 hp", "190 hp"]),
        model("N-Design", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3", "1.5"], ["158 hp", "190 hp"]),
        model("Tekna", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3", "1.5"], ["158 hp", "190 hp"]),
        model("Platinum Premium", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["190 hp"])
      ] },
      { name: "X-Trail", models: [
        model("Mild Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["163 hp"]),
        model("e-POWER", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["204 hp"]),
        model("e-4ORCE", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["213 hp"]),
        model("4WD", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["213 hp"])
      ] },
      { name: "Juke", models: [
        model("Visia", ["Benzin"], ["Manuel"], ["SUV"], ["1.0"], ["114 hp"]),
        model("Acenta", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["114 hp"]),
        model("N-Connecta", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["114 hp"]),
        model("Tekna", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["114 hp"]),
        model("N-Design", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["114 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["150 hp"])
      ] },
      { name: "Rogue / Rogue Hybrid e-POWER", models: [
        model("Rogue", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["201 hp"]),
        model("Rogue Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["201 hp"]),
        model("e-POWER", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["201 hp"])
      ] },
      { name: "Ariya", models: [
        model("Engage", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["214 hp"]),
        model("Venture", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["238 hp"]),
        model("Evolve", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["238 hp"]),
        model("Empower", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["238 hp"]),
        model("Platinum+", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["389 hp"])
      ] },
      { name: "Armada", models: [
        model("V6 Twin-Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["425 hp"])
      ] },
      { name: "Kicks", models: [
        model("S", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["122 hp"]),
        model("SV", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["122 hp"]),
        model("SR", ["Benzin"], ["Otomatik"], ["SUV"], ["1.6"], ["122 hp"])
      ] },
      { name: "Murano", models: [
        model("Luks SUV", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["241 hp"])
      ] },
      { name: "Sentra", models: [
        model("S", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["149 hp"]),
        model("SV", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["149 hp"]),
        model("SR", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["149 hp"])
      ] },
      { name: "Altima", models: [
        model("S", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["188 hp"]),
        model("SV", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["188 hp"]),
        model("SR", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["188 hp"]),
        model("SL", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["188 hp"]),
        model("VC-Turbo", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["248 hp"])
      ] },
      { name: "Versa", models: [
        model("S", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6"], ["122 hp"]),
        model("SV", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["122 hp"]),
        model("SR", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.6"], ["122 hp"])
      ] },
      { name: "LEAF", models: [
        model("S+", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["214 hp"]),
        model("SV+", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["214 hp"]),
        model("Platinum+", ["Elektrik"], ["Otomatik"], ["SUV-Crossover"], ["0"], ["214 hp"])
      ] },
      { name: "Micra", models: [
        model("Kompakt Sehir Serisi", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["92 hp"]),
        model("1.0 IG-T", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["100 hp"]),
        model("1.5 dCi", ["Dizel"], ["Manuel"], ["Hatchback"], ["1.5"], ["90 hp"])
      ] },
      { name: "Nissan Z", models: [
        model("Sport", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["400 hp"]),
        model("Performance", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["400 hp"]),
        model("Heritage Edition", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["400 hp"])
      ] },
      { name: "Nissan Z NISMO", models: [
        model("420 HP Twin-Turbo V6", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.0"], ["420 hp"]),
        model("6-Ileri Manuel", ["Benzin"], ["Manuel"], ["Coupe"], ["3.0"], ["420 hp"]),
        model("9-Ileri Otomatik", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.0"], ["420 hp"])
      ] },
      { name: "GT-R NISMO", models: [
        model("Godzilla Performans", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.8"], ["600 hp"])
      ] },
      { name: "Ariya NISMO", models: [
        model("Elektrikli Performans SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["430 hp"])
      ] },
      { name: "Frontier", models: [
        model("S", ["Benzin"], ["Otomatik"], ["Pickup"], ["3.8"], ["310 hp"]),
        model("SV", ["Benzin"], ["Otomatik"], ["Pickup"], ["3.8"], ["310 hp"]),
        model("PRO-X", ["Benzin"], ["Otomatik"], ["Pickup"], ["3.8"], ["310 hp"]),
        model("PRO-4X", ["Benzin"], ["Otomatik"], ["Pickup"], ["3.8"], ["310 hp"]),
        model("V6", ["Benzin"], ["Otomatik"], ["Pickup"], ["3.8"], ["310 hp"])
      ] },
      { name: "Titan / Titan XD", models: [
        model("Titan", ["Benzin"], ["Otomatik"], ["Pickup"], ["5.6"], ["400 hp"]),
        model("Titan XD", ["Benzin"], ["Otomatik"], ["Pickup"], ["5.6"], ["400 hp"])
      ] },
      { name: "Townstar", models: [
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Hafif Ticari"], ["0"], ["122 hp"]),
        model("Benzinli Hafif Ticari", ["Benzin"], ["Manuel"], ["Hafif Ticari"], ["1.3"], ["130 hp"])
      ] },
      { name: "Navara", models: [
        model("Navara", ["Dizel"], ["Manuel", "Otomatik"], ["Pickup"], ["2.3"], ["163 hp", "190 hp"])
      ] },
      { name: "Patrol", models: [
        model("Patrol", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5", "5.6"], ["425 hp"])
      ] },
      { name: "Pathfinder", models: [
        model("Pathfinder", ["Benzin"], ["Otomatik"], ["SUV"], ["3.5"], ["284 hp"])
      ] },
      { name: "350Z", models: [
        model("350Z", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.5"], ["300 hp"])
      ] },
      { name: "370Z", models: [
        model("370Z", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["3.7"], ["328 hp"])
      ] },
      { name: "Skyline", models: [
        model("Skyline", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["300 hp"])
      ] },
      { name: "Note", models: [
        model("Note", ["Benzin", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["80 hp", "116 hp"])
      ] },
      { name: "Primera", models: [
        model("Primera", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "1.8", "2.0"], ["109 hp", "140 hp"])
      ] },
      { name: "Almera", models: [
        model("Almera", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.5", "1.6"], ["98 hp", "102 hp"])
      ] }
    ]
  },
  {
    name: "Nieve",
    series: [
      { name: "EVZOOM", models: [
        model("118 kW", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["150 HP"]),
        model("150 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["150 HP"]),
        model("450 km WLTP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["150 HP"]),
        model("150 km/s", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["150 HP"])
      ] },
      { name: "Q-EN", models: [
        model("2 Kisilik", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("90 km", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("120 km", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"]),
        model("45 km/s", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["0"])
      ] },
      { name: "Logistar 200", models: [
        model("Elektrikli Panelvan", ["Elektrik"], ["Otomatik"], ["Panelvan"], ["0"], ["0"]),
        model("Kamyonet", ["Elektrik"], ["Otomatik"], ["Kamyonet"], ["0"], ["0"])
      ] },
      { name: "Logistar 260", models: [
        model("Elektrikli Lojistik", ["Elektrik"], ["Otomatik"], ["Ticari"], ["0"], ["0"])
      ] }
    ]
  },
  {
    name: "Dacia",
    series: [
      { name: "Duster", models: [
        model("Essential", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.6"], ["130 hp", "140 hp", "150 hp"]),
        model("Expression", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.6"], ["130 hp", "140 hp", "150 hp"]),
        model("Journey", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.6"], ["130 hp", "140 hp", "150 hp"]),
        model("Extreme", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.6"], ["130 hp", "140 hp", "150 hp"]),
        model("1.2 Turbo", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.2"], ["130 hp"]),
        model("Hybrid 140", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["140 hp"]),
        model("Hybrid-G 150 4x4", ["Hibrit", "LPG"], ["Otomatik"], ["SUV"], ["1.2", "1.6"], ["150 hp"])
      ] },
      { name: "Bigster", models: [
        model("Expression", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.6"], ["140 hp", "150 hp"]),
        model("Journey", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.6"], ["140 hp", "150 hp"]),
        model("Extreme", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.6"], ["140 hp", "150 hp"]),
        model("Hybrid-G 150 4x4", ["Hibrit", "LPG"], ["Otomatik"], ["SUV"], ["1.2", "1.6"], ["150 hp"])
      ] },
      { name: "Sandero Stepway", models: [
        model("Essential", ["Benzin", "LPG"], ["Manuel", "Otomatik"], ["Crossover"], ["1.0"], ["100 hp", "110 hp", "120 hp"]),
        model("Expression", ["Benzin", "LPG"], ["Manuel", "Otomatik"], ["Crossover"], ["1.0"], ["100 hp", "110 hp", "120 hp"]),
        model("Extreme", ["Benzin", "LPG"], ["Manuel", "Otomatik"], ["Crossover"], ["1.0"], ["100 hp", "110 hp", "120 hp"]),
        model("TCe 100", ["Benzin"], ["Manuel"], ["Crossover"], ["1.0"], ["100 hp"]),
        model("Eco-G 100", ["Benzin", "LPG"], ["Manuel"], ["Crossover"], ["1.0"], ["100 hp"]),
        model("Eco-G 120 Auto", ["Benzin", "LPG"], ["Otomatik"], ["Crossover"], ["1.0"], ["120 hp"])
      ] },
      { name: "Spring", models: [
        model("Expression", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["45 hp", "65 hp", "70 hp"]),
        model("Extreme", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["65 hp", "70 hp"]),
        model("Elektrikli 45 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["45 hp"]),
        model("Elektrikli 65 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["65 hp"]),
        model("Elektrikli 70 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["70 hp"])
      ] },
      { name: "Sandero", models: [
        model("Essential", ["Benzin", "LPG"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["100 hp", "110 hp", "120 hp"]),
        model("Expression", ["Benzin", "LPG"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["100 hp", "110 hp", "120 hp"]),
        model("TCe 100", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["100 hp"]),
        model("Eco-G 100", ["Benzin", "LPG"], ["Manuel"], ["Hatchback"], ["1.0"], ["100 hp"]),
        model("Eco-G 120 Auto", ["Benzin", "LPG"], ["Otomatik"], ["Hatchback"], ["1.0"], ["120 hp"])
      ] },
      { name: "Logan", models: [
        model("Essential", ["Benzin", "LPG"], ["Manuel", "Otomatik"], ["Sedan"], ["1.0"], ["100 hp", "110 hp"]),
        model("Expression", ["Benzin", "LPG"], ["Manuel", "Otomatik"], ["Sedan"], ["1.0"], ["100 hp", "110 hp"]),
        model("TCe 100", ["Benzin"], ["Manuel"], ["Sedan"], ["1.0"], ["100 hp"]),
        model("Eco-G 100", ["Benzin", "LPG"], ["Manuel"], ["Sedan"], ["1.0"], ["100 hp"])
      ] },
      { name: "Jogger", models: [
        model("Expression", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["Station Wagon", "MPV"], ["1.0", "1.6"], ["110 hp", "120 hp", "140 hp"]),
        model("Extreme", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["Station Wagon", "MPV"], ["1.0", "1.6"], ["110 hp", "120 hp", "140 hp"]),
        model("5 Koltuklu", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.0", "1.6"], ["110 hp", "120 hp", "140 hp"]),
        model("7 Koltuklu", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["MPV"], ["1.0", "1.6"], ["110 hp", "120 hp", "140 hp"]),
        model("TCe 110", ["Benzin"], ["Manuel"], ["Station Wagon", "MPV"], ["1.0"], ["110 hp"]),
        model("Hybrid 140", ["Hibrit"], ["Otomatik"], ["Station Wagon", "MPV"], ["1.6"], ["140 hp"]),
        model("Eco-G 120 Auto", ["Benzin", "LPG"], ["Otomatik"], ["Station Wagon", "MPV"], ["1.0"], ["120 hp"])
      ] },
      { name: "Striker", models: [
        model("Hybrid 155", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["155 hp"])
      ] },
      { name: "Duster Cargo", models: [
        model("4x4", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Ticari SUV"], ["1.3", "1.5"], ["115 hp", "150 hp"]),
        model("Mild Hybrid", ["Hibrit"], ["Otomatik"], ["Ticari SUV"], ["1.2"], ["130 hp"])
      ] },
      { name: "Dokker", models: [
        model("Panelvan", ["Benzin", "Dizel"], ["Manuel"], ["Van"], ["1.3", "1.5"], ["95 hp", "115 hp"]),
        model("Kombi", ["Benzin", "Dizel"], ["Manuel"], ["Van"], ["1.3", "1.5"], ["95 hp", "115 hp"])
      ] },
      { name: "Lodgy", models: [
        model("7 Kişilik MPV", ["Benzin", "Dizel"], ["Manuel"], ["MPV"], ["1.3", "1.5"], ["110 hp", "115 hp"])
      ] },
      { name: "Extreme", models: [
        model("Outdoor Donanım", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["Hatchback", "SUV", "MPV"], ["1.0", "1.2", "1.6"], ["100 hp", "150 hp"])
      ] },
      { name: "Journey", models: [
        model("Konfor ve Teknoloji Donanımı", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["Hatchback", "SUV"], ["1.0", "1.2", "1.6"], ["100 hp", "150 hp"])
      ] },
      { name: "Expression", models: [
        model("Orta Seviye Donanım", ["Benzin", "Hibrit", "LPG"], ["Manuel", "Otomatik"], ["Hatchback", "Sedan", "SUV", "MPV"], ["1.0", "1.2", "1.6"], ["100 hp", "150 hp"])
      ] },
      { name: "Eco-G", models: [
        model("LPG Motor", ["Benzin", "LPG"], ["Manuel", "Otomatik"], ["Hatchback", "Sedan", "SUV", "MPV"], ["1.0"], ["100 hp", "120 hp"])
      ] },
      { name: "Hybrid-G 150 4x4", models: [
        model("LPG + Hibrit + 4x4", ["Hibrit", "LPG"], ["Otomatik"], ["SUV"], ["1.2", "1.6"], ["150 hp"])
      ] }
    ]
  },
  {
    name: "Daihatsu",
    series: [
      { name: "Sirion", models: [
        model("1.0", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["69 hp"]),
        model("1.3", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.3"], ["87 hp", "91 hp"]),
        model("1.3 Sport", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.3"], ["102 hp"]),
        model("1.5", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.5"], ["109 hp"])
      ] },
      { name: "Cuore", models: [
        model("0.8", ["Benzin"], ["Manuel"], ["Hatchback"], ["0.8"], ["44 hp"]),
        model("1.0", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["55 hp"])
      ] },
      { name: "Charade", models: [
        model("1.0", ["Benzin"], ["Manuel"], ["Hatchback", "Sedan"], ["1.0"], ["52 hp"]),
        model("1.3", ["Benzin"], ["Manuel"], ["Hatchback", "Sedan"], ["1.3"], ["84 hp"]),
        model("1.3 16V", ["Benzin"], ["Manuel"], ["Hatchback", "Sedan"], ["1.3"], ["90 hp"]),
        model("Gtti", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["101 hp"])
      ] },
      { name: "Materia", models: [
        model("1.3", ["Benzin"], ["Manuel", "Otomatik"], ["MPV"], ["1.3"], ["91 hp"]),
        model("1.5", ["Benzin"], ["Manuel", "Otomatik"], ["MPV"], ["1.5"], ["103 hp"])
      ] },
      { name: "Move", models: [
        model("0.6", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["0.6"], ["52 hp"]),
        model("1.0", ["Benzin"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.0"], ["58 hp"])
      ] },
      { name: "Mira / Domino", models: [
        model("0.6", ["Benzin"], ["Manuel"], ["Hatchback"], ["0.6"], ["42 hp"]),
        model("0.8", ["Benzin"], ["Manuel"], ["Hatchback"], ["0.8"], ["44 hp"])
      ] },
      { name: "Trevis", models: [
        model("1.0", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.0"], ["58 hp"])
      ] },
      { name: "Boon", models: [
        model("1.0", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["69 hp"]),
        model("1.3", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.3"], ["91 hp"])
      ] },
      { name: "Terios", models: [
        model("1.3", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.3"], ["83 hp", "86 hp"]),
        model("1.3 DX", ["Benzin"], ["Manuel"], ["SUV"], ["1.3"], ["83 hp"]),
        model("1.5", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["105 hp"]),
        model("Silver Edition", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["105 hp"]),
        model("Gold Edition", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["105 hp"])
      ] },
      { name: "Feroza", models: [
        model("1.6 EL", ["Benzin"], ["Manuel"], ["SUV"], ["1.6"], ["95 hp"]),
        model("1.6 SX", ["Benzin"], ["Manuel"], ["SUV"], ["1.6"], ["95 hp"])
      ] },
      { name: "Rocky", models: [
        model("2.8 D", ["Dizel"], ["Manuel"], ["SUV"], ["2.8"], ["73 hp"]),
        model("2.8 TD", ["Dizel"], ["Manuel"], ["SUV"], ["2.8"], ["88 hp"])
      ] },
      { name: "Taft", models: [
        model("1.0", ["Benzin"], ["Manuel"], ["SUV"], ["1.0"], ["58 hp"]),
        model("2.5 D", ["Dizel"], ["Manuel"], ["SUV"], ["2.5"], ["76 hp"]),
        model("2.8 D", ["Dizel"], ["Manuel"], ["SUV"], ["2.8"], ["73 hp"])
      ] },
      { name: "Bego", models: [
        model("1.5", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["109 hp"])
      ] },
      { name: "Applause", models: [
        model("1.6 GLXi", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["105 hp"])
      ] },
      { name: "Altis", models: [
        model("2.0", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["170 hp"]),
        model("2.5 Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.5"], ["178 hp"])
      ] },
      { name: "Charmant", models: [
        model("1.3", ["Benzin"], ["Manuel"], ["Sedan"], ["1.3"], ["65 hp"]),
        model("1.6", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["75 hp"])
      ] },
      { name: "Copen", models: [
        model("0.7 Turbo", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["0.7"], ["64 hp"]),
        model("1.3", ["Benzin"], ["Manuel"], ["Roadster"], ["1.3"], ["87 hp"])
      ] },
      { name: "Copen GR Sport", models: [
        model("Copen GR Sport", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], ["0.7"], ["64 hp"])
      ] },
      { name: "Atto", models: [
        model("Atto", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.0"], ["69 hp"])
      ] },
      { name: "Rocky Yeni", models: [
        model("1.0 Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["1.0"], ["98 hp"]),
        model("1.2 Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["106 hp"])
      ] },
      { name: "Ayla", models: [
        model("1.0", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["67 hp"]),
        model("1.2", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["87 hp"])
      ] },
      { name: "Thor", models: [
        model("1.0 Turbo", ["Benzin"], ["Otomatik"], ["MPV"], ["1.0"], ["98 hp"])
      ] },
      { name: "Hijet", models: [
        model("Panelvan", ["Benzin"], ["Manuel"], ["Van"], ["0.7", "1.0"], ["45 hp", "53 hp"]),
        model("Pickup", ["Benzin"], ["Manuel"], ["Pickup"], ["0.7", "1.0"], ["45 hp", "53 hp"])
      ] },
      { name: "Delta", models: [
        model("2.5 D", ["Dizel"], ["Manuel"], ["Kamyonet"], ["2.5"], ["75 hp"]),
        model("2.8 D", ["Dizel"], ["Manuel"], ["Kamyonet"], ["2.8"], ["80 hp"]),
        model("3.0 D", ["Dizel"], ["Manuel"], ["Kamyonet"], ["3.0"], ["91 hp"])
      ] },
      { name: "Gran Max", models: [
        model("Van", ["Benzin"], ["Manuel"], ["Van"], ["1.3", "1.5"], ["88 hp", "97 hp"]),
        model("Pickup", ["Benzin"], ["Manuel"], ["Pickup"], ["1.3", "1.5"], ["88 hp", "97 hp"])
      ] }
    ]
  },
  {
    name: "Dodge",
    series: [
      { name: "Charger Yeni Nesil", models: [
        model("R/T", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["420 hp"]),
        model("Scat Pack", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["550 hp"]),
        model("3.0L Twin-Turbo Sixpack I6", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["420 hp", "550 hp"])
      ] },
      { name: "Charger Daytona", models: [
        model("R/T", ["Elektrik"], ["Otomatik"], ["Coupe", "Liftback"], ["0"], ["496 hp"]),
        model("Scat Pack", ["Elektrik"], ["Otomatik"], ["Coupe", "Liftback"], ["0"], ["670 hp"]),
        model("Scat Pack Plus", ["Elektrik"], ["Otomatik"], ["Coupe", "Liftback"], ["0"], ["670 hp"]),
        model("400V", ["Elektrik"], ["Otomatik"], ["Coupe", "Liftback"], ["0"], ["496 hp"]),
        model("800V", ["Elektrik"], ["Otomatik"], ["Coupe", "Liftback"], ["0"], ["670 hp"])
      ] },
      { name: "Challenger", models: [
        model("SXT", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.6"], ["303 hp"]),
        model("GT", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.6"], ["303 hp"]),
        model("R/T", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["5.7"], ["375 hp"]),
        model("Scat Pack", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["6.4"], ["485 hp"]),
        model("Hellcat", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["6.2"], ["717 hp"]),
        model("Redeye", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.2"], ["797 hp"]),
        model("SRT Demon 170", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.2"], ["1025 hp"])
      ] },
      { name: "Hornet", models: [
        model("GT", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("GT Plus", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("2.0L Turbo", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["268 hp"]),
        model("R/T", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3"], ["288 hp"]),
        model("R/T Plus", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3"], ["288 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.3"], ["288 hp"])
      ] },
      { name: "Durango", models: [
        model("GT", ["Benzin"], ["Otomatik"], ["SUV"], ["3.6"], ["295 hp"]),
        model("R/T", ["Benzin"], ["Otomatik"], ["SUV"], ["5.7"], ["360 hp"]),
        model("R/T Plus", ["Benzin"], ["Otomatik"], ["SUV"], ["5.7"], ["360 hp"]),
        model("R/T Premium", ["Benzin"], ["Otomatik"], ["SUV"], ["5.7"], ["360 hp"]),
        model("SRT Hellcat", ["Benzin"], ["Otomatik"], ["SUV"], ["6.2"], ["710 hp"])
      ] },
      { name: "Journey", models: [
        model("SE", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4"], ["173 hp"]),
        model("SXT", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4", "3.6"], ["173 hp", "283 hp"]),
        model("Crossroad", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4", "3.6"], ["173 hp", "283 hp"]),
        model("R/T", ["Benzin"], ["Otomatik"], ["SUV"], ["3.6"], ["283 hp"])
      ] },
      { name: "Nitro", models: [
        model("2.8 CRD", ["Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["2.8"], ["177 hp"]),
        model("3.7 SE", ["Benzin"], ["Otomatik"], ["SUV"], ["3.7"], ["210 hp"]),
        model("SXT", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["2.8", "3.7"], ["177 hp", "210 hp"])
      ] },
      { name: "Magnum", models: [
        model("SXT", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["3.5"], ["250 hp"]),
        model("R/T", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["5.7"], ["340 hp"]),
        model("SRT8", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["6.1"], ["425 hp"])
      ] },
      { name: "Dart", models: [
        model("SE", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["160 hp"]),
        model("SXT", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.4"], ["184 hp"]),
        model("Aero", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.4"], ["160 hp"]),
        model("Limited", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.4"], ["184 hp"]),
        model("GT", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.4"], ["184 hp"])
      ] },
      { name: "Avenger", models: [
        model("SE", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.4"], ["173 hp"]),
        model("SXT", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.4", "3.6"], ["173 hp", "283 hp"]),
        model("R/T", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.6"], ["283 hp"])
      ] },
      { name: "Caliber", models: [
        model("SXT", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.8", "2.0"], ["148 hp", "158 hp"]),
        model("R/T", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.4"], ["172 hp"]),
        model("SRT4", ["Benzin"], ["Manuel"], ["Hatchback"], ["2.4"], ["285 hp"])
      ] },
      { name: "Neon", models: [
        model("SE", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["132 hp"]),
        model("SXT", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["132 hp"]),
        model("SRT4", ["Benzin"], ["Manuel"], ["Sedan"], ["2.4"], ["230 hp"])
      ] },
      { name: "Intrepid / Stratus", models: [
        model("Intrepid", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.7", "3.2", "3.5"], ["200 hp", "242 hp"]),
        model("Stratus", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["2.0", "2.4", "2.7"], ["133 hp", "200 hp"])
      ] },
      { name: "Grand Caravan", models: [
        model("SE", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.6"], ["283 hp"]),
        model("SXT", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.6"], ["283 hp"]),
        model("Crew", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.6"], ["283 hp"]),
        model("R/T", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.6"], ["283 hp"]),
        model("GT", ["Benzin"], ["Otomatik"], ["Minivan"], ["3.6"], ["283 hp"])
      ] },
      { name: "Viper", models: [
        model("RT/10", ["Benzin"], ["Manuel"], ["Roadster"], ["8.0"], ["400 hp"]),
        model("GTS", ["Benzin"], ["Manuel"], ["Coupe"], ["8.0"], ["450 hp"]),
        model("SRT10", ["Benzin"], ["Manuel"], ["Coupe", "Roadster"], ["8.3", "8.4"], ["500 hp", "640 hp"]),
        model("ACR", ["Benzin"], ["Manuel"], ["Coupe"], ["8.4"], ["645 hp"])
      ] },
      { name: "Coronet / Super Bee", models: [
        model("Coronet", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["5.2", "6.3", "7.0"], ["230 hp", "390 hp"]),
        model("Super Bee", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["6.3", "7.0"], ["335 hp", "425 hp"])
      ] },
      { name: "Monaco / Polara", models: [
        model("Monaco", ["Benzin"], ["Otomatik"], ["Sedan", "Coupe"], ["5.2", "6.3", "7.2"], ["230 hp", "375 hp"]),
        model("Polara", ["Benzin"], ["Otomatik"], ["Sedan", "Coupe"], ["5.2", "6.3"], ["230 hp", "330 hp"])
      ] },
      { name: "Dodge RAM 1500", models: [
        model("SLT", ["Benzin"], ["Otomatik"], ["Pickup"], ["5.7"], ["395 hp"]),
        model("Laramie", ["Benzin"], ["Otomatik"], ["Pickup"], ["5.7"], ["395 hp"]),
        model("Sport", ["Benzin"], ["Otomatik"], ["Pickup"], ["5.7"], ["395 hp"]),
        model("TRX", ["Benzin"], ["Otomatik"], ["Pickup"], ["6.2"], ["702 hp"])
      ] },
      { name: "Dodge RAM 2500 / 3500", models: [
        model("Heavy Duty", ["Benzin", "Dizel"], ["Otomatik"], ["Pickup"], ["6.4", "6.7"], ["410 hp", "420 hp"]),
        model("Cummins Dizel", ["Dizel"], ["Otomatik"], ["Pickup"], ["6.7"], ["370 hp", "420 hp"])
      ] },
      { name: "Dakota", models: [
        model("ST", ["Benzin"], ["Manuel", "Otomatik"], ["Pickup"], ["3.7"], ["210 hp"]),
        model("SXT", ["Benzin"], ["Manuel", "Otomatik"], ["Pickup"], ["3.7", "4.7"], ["210 hp", "302 hp"]),
        model("Laramie", ["Benzin"], ["Otomatik"], ["Pickup"], ["4.7"], ["302 hp"])
      ] }
    ]
  },
  {
    name: "DS Automobiles",
    series: [
      { name: "DS 4", models: [
        model("BlueHDi 130", ["Dizel"], ["Otomatik"], ["Hatchback"], ["1.5"], ["130 hp"]),
        model("PureTech 130", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.2"], ["130 hp"]),
        model("Hybrid 136", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["136 hp"]),
        model("Pallas", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2", "1.5"], ["130 hp", "136 hp"]),
        model("Etoile", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2", "1.5"], ["130 hp", "136 hp"]),
        model("Esprit de Voyage", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2", "1.5"], ["130 hp", "136 hp"])
      ] },
      { name: "DS N°4", models: [
        model("Elektrikli 213 HP", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["213 hp"]),
        model("Plug-in Hybrid 225 HP", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.6"], ["225 hp"]),
        model("Plug-in Hybrid 240 HP", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.6"], ["240 hp"]),
        model("Hybrid 145", ["Hibrit"], ["Otomatik"], ["Hatchback"], ["1.2"], ["145 hp"])
      ] },
      { name: "DS 9", models: [
        model("E-TENSE 250", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.6"], ["250 hp"]),
        model("E-TENSE 4x4 360", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.6"], ["360 hp"]),
        model("Opera", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.6"], ["250 hp", "360 hp"]),
        model("Esprit de Voyage", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.6"], ["250 hp", "360 hp"])
      ] },
      { name: "DS 3", models: [
        model("BlueHDi 130", ["Dizel"], ["Otomatik"], ["SUV"], ["1.5"], ["130 hp"]),
        model("PureTech 130", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2"], ["130 hp"]),
        model("E-TENSE", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["156 hp"]),
        model("Pallas", ["Benzin", "Dizel", "Elektrik"], ["Otomatik"], ["SUV"], ["0", "1.2", "1.5"], ["130 hp", "156 hp"]),
        model("Etoile", ["Benzin", "Dizel", "Elektrik"], ["Otomatik"], ["SUV"], ["0", "1.2", "1.5"], ["130 hp", "156 hp"])
      ] },
      { name: "DS 7", models: [
        model("BlueHDi 130", ["Dizel"], ["Otomatik"], ["SUV"], ["1.5"], ["130 hp"]),
        model("E-TENSE 225", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["225 hp"]),
        model("E-TENSE 4x4 300", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["300 hp"]),
        model("E-TENSE 4x4 360", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["360 hp"]),
        model("Pallas", ["Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "1.6"], ["130 hp", "360 hp"]),
        model("Etoile", ["Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "1.6"], ["130 hp", "360 hp"]),
        model("Esprit de Voyage", ["Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "1.6"], ["130 hp", "360 hp"])
      ] },
      { name: "DS N°7", models: [
        model("Elektrikli 260 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["260 hp"]),
        model("Elektrikli 375 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["375 hp"]),
        model("Mild-Hybrid 145", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.2"], ["145 hp"])
      ] },
      { name: "DS N°8", models: [
        model("Elektrikli AWD", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["350 hp"]),
        model("Elektrikli FWD", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["245 hp"]),
        model("740 km Menzil", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["245 hp"])
      ] },
      { name: "Pallas", models: [
        model("Rafine Teknolojik Paket", ["Benzin", "Dizel", "Hibrit", "Elektrik"], ["Otomatik"], ["Hatchback", "SUV", "Sedan"], ["0", "1.2", "1.5", "1.6"], ["130 hp", "260 hp"])
      ] },
      { name: "Etoile", models: [
        model("Lüks Alcantara Nappa Paket", ["Benzin", "Dizel", "Hibrit", "Elektrik"], ["Otomatik"], ["Hatchback", "SUV", "Sedan"], ["0", "1.2", "1.5", "1.6"], ["130 hp", "375 hp"])
      ] },
      { name: "Esprit de Voyage", models: [
        model("Özel Tasarım", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Hatchback", "SUV", "Sedan"], ["1.2", "1.5", "1.6"], ["130 hp", "360 hp"])
      ] },
      { name: "Performance Line", models: [
        model("Sportif Seri", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Hatchback", "SUV"], ["1.2", "1.5", "1.6"], ["130 hp", "360 hp"])
      ] },
      { name: "E-TENSE", models: [
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["Hatchback", "SUV", "Sedan"], ["0"], ["136 hp", "260 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["Hatchback", "SUV", "Sedan"], ["1.6"], ["225 hp", "360 hp"])
      ] },
      { name: "Hybrid 136 / 145", models: [
        model("Hybrid 136", ["Hibrit"], ["Otomatik"], ["Hatchback", "SUV"], ["1.2"], ["136 hp"]),
        model("Hybrid 145", ["Hibrit"], ["Otomatik"], ["Hatchback", "SUV"], ["1.2"], ["145 hp"])
      ] },
      { name: "AWD 300 / 360", models: [
        model("AWD 300", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.6"], ["300 hp"]),
        model("AWD 360", ["Hibrit"], ["Otomatik"], ["SUV", "Sedan"], ["1.6"], ["360 hp"])
      ] },
      { name: "DS 3 Crossback", models: [
        model("DS 3 Crossback", ["Benzin", "Dizel", "Elektrik"], ["Otomatik"], ["SUV"], ["0", "1.2", "1.5"], ["102 hp", "156 hp"])
      ] },
      { name: "DS 7 Crossback", models: [
        model("DS 7 Crossback", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.2", "1.5", "1.6"], ["130 hp", "300 hp"])
      ] },
      { name: "DS 5 / DS 5LS", models: [
        model("DS 5", ["Benzin", "Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Hatchback"], ["1.6", "2.0"], ["120 hp", "200 hp"]),
        model("DS 5LS", ["Benzin"], ["Otomatik", "Manuel"], ["Sedan"], ["1.6"], ["160 hp", "200 hp"])
      ] }
    ]
  },
  {
    name: "Eagle",
    series: [
      { name: "Talon", models: [
        model("Base", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["1.8", "2.0"], ["135 hp", "195 hp"]),
        model("ESi", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0"], ["135 hp"]),
        model("TSi", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0"], ["195 hp"]),
        model("TSi AWD", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.0"], ["195 hp"])
      ] },
      { name: "2000GTX", models: [
        model("2.0", ["Benzin"], ["Manuel"], ["Coupe"], ["2.0"], ["150 hp"])
      ] },
      { name: "Vision", models: [
        model("ESi", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.3"], ["150 hp"]),
        model("TSi", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.5"], ["214 hp"])
      ] },
      { name: "Premier", models: [
        model("LX", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5", "3.0"], ["150 hp", "150 hp"]),
        model("ES", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5", "3.0"], ["150 hp"]),
        model("Limited", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.0"], ["150 hp"])
      ] },
      { name: "Medallion", models: [
        model("DL", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.2"], ["110 hp"]),
        model("LX", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.2"], ["110 hp"])
      ] },
      { name: "Summit", models: [
        model("DL", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Sedan", "Coupe"], ["1.3", "1.5"], ["70 hp", "92 hp"]),
        model("LX", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Sedan", "Coupe"], ["1.3", "1.5"], ["70 hp", "92 hp"]),
        model("ES", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Sedan", "Coupe"], ["1.5"], ["92 hp"]),
        model("ESi", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Sedan", "Coupe"], ["1.5"], ["92 hp"]),
        model("Hatchback", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.3", "1.5"], ["70 hp", "92 hp"]),
        model("Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.3", "1.5"], ["70 hp", "92 hp"]),
        model("Coupe", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["1.5"], ["92 hp"])
      ] },
      { name: "Vista", models: [
        model("Hatchback", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.5", "1.8"], ["82 hp", "92 hp"]),
        model("Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.5", "1.8"], ["82 hp", "92 hp"])
      ] },
      { name: "Summit Wagon", models: [
        model("DL", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.5"], ["92 hp"]),
        model("LX", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.5"], ["92 hp"]),
        model("AWD", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.5"], ["92 hp"])
      ] },
      { name: "Vista Wagon", models: [
        model("Mitsubishi Chariot Tabanlı", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.8", "2.0"], ["110 hp", "136 hp"])
      ] },
      { name: "AMC Eagle", models: [
        model("Wagon", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["4.2"], ["110 hp"]),
        model("Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["4.2"], ["110 hp"]),
        model("Coupe", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["4.2"], ["110 hp"]),
        model("4x4", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon", "Sedan", "Coupe"], ["4.2"], ["110 hp"])
      ] },
      { name: "Jeep Eagle", models: [
        model("CJ-5", ["Benzin"], ["Manuel"], ["Arazi Aracı"], ["4.2"], ["112 hp"]),
        model("CJ-7", ["Benzin"], ["Manuel"], ["Arazi Aracı"], ["4.2"], ["112 hp"])
      ] }
    ]
  },
  {
    name: "Geely",
    series: [
      { name: "Galaxy L7", models: [
        model("Compact SUV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["218 hp"]),
        model("PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["218 hp"]),
        model("1.5T", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["163 hp"])
      ] },
      { name: "Galaxy L6", models: [
        model("Compact Sedan", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["218 hp"]),
        model("PHEV", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["218 hp"])
      ] },
      { name: "Galaxy E5", models: [
        model("Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"])
      ] },
      { name: "Galaxy E8", models: [
        model("Elektrikli Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["272 hp"])
      ] },
      { name: "Galaxy Starship 7", models: [
        model("PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["218 hp"]),
        model("BEV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"]),
        model("Orta Boy SUV", ["Hibrit", "Elektrik"], ["Otomatik"], ["SUV"], ["0", "1.5"], ["218 hp"])
      ] },
      { name: "Galaxy Starshine 6 / 7 / 8", models: [
        model("Starshine 6", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["218 hp"]),
        model("Starshine 7", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["218 hp"]),
        model("Starshine 8", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["272 hp"])
      ] },
      { name: "Starray / Boyue L", models: [
        model("1.5T", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["181 hp"]),
        model("2.0T", ["Benzin"], ["Otomatik"], ["SUV"], ["2.0"], ["218 hp"]),
        model("Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["245 hp"])
      ] },
      { name: "Boyue Cool", models: [
        model("Kompakt SUV", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["181 hp"])
      ] },
      { name: "Emgrand", models: [
        model("1.5L", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.5"], ["122 hp"]),
        model("Yeni Nesil Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.5"], ["122 hp"])
      ] },
      { name: "Binrui Cool", models: [
        model("Sportif Kompakt Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], ["1.5"], ["181 hp"])
      ] },
      { name: "Coolray / Binyue", models: [
        model("1.5T", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["172 hp", "181 hp"]),
        model("B-SUV", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["172 hp", "181 hp"])
      ] },
      { name: "Okavango / Haoyue", models: [
        model("7 Koltuklu SUV", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["190 hp", "218 hp"])
      ] },
      { name: "Monjaro / Xingyue L", models: [
        model("Lüks D-SUV", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["218 hp", "245 hp"]),
        model("CMA Platformu", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["218 hp", "245 hp"])
      ] },
      { name: "Tugella / Xingyue S", models: [
        model("SUV Coupé", ["Benzin"], ["Otomatik"], ["SUV Coupe"], ["2.0"], ["238 hp"])
      ] },
      { name: "Zeekr 001", models: [
        model("Shooting Brake", ["Elektrik"], ["Otomatik"], ["Station Wagon"], ["0"], ["272 hp", "544 hp"]),
        model("Yüksek Performans", ["Elektrik"], ["Otomatik"], ["Station Wagon"], ["0"], ["544 hp"])
      ] },
      { name: "Zeekr 007", models: [
        model("Premium Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["421 hp", "646 hp"])
      ] },
      { name: "Zeekr 009", models: [
        model("Elektrikli MPV", ["Elektrik"], ["Otomatik"], ["MPV"], ["0"], ["544 hp"])
      ] },
      { name: "Zeekr X", models: [
        model("Kompakt Lüks SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp", "428 hp"])
      ] },
      { name: "Zeekr 7X", models: [
        model("Aile SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["421 hp"])
      ] },
      { name: "Zeekr MIX", models: [
        model("MPV", ["Elektrik"], ["Otomatik"], ["MPV"], ["0"], ["421 hp"])
      ] },
      { name: "Lynk & Co 01", models: [
        model("Compact SUV", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik"], ["SUV"], ["0", "1.5", "2.0"], ["245 hp", "261 hp"]),
        model("Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["245 hp"]),
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp"])
      ] },
      { name: "Lynk & Co 03 / 03+", models: [
        model("03", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["1.5", "2.0"], ["180 hp", "265 hp"]),
        model("03+", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["265 hp"])
      ] },
      { name: "Lynk & Co 05", models: [
        model("Coupe SUV", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV Coupe"], ["1.5", "2.0"], ["180 hp", "265 hp"])
      ] },
      { name: "Lynk & Co 07", models: [
        model("Orta Boy Hibrit Sedan", ["Hibrit"], ["Otomatik"], ["Sedan"], ["1.5"], ["245 hp"])
      ] },
      { name: "Lynk & Co 08", models: [
        model("EM-P Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["245 hp", "593 hp"]),
        model("Orta Boy SUV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["245 hp", "593 hp"])
      ] },
      { name: "Lynk & Co 09", models: [
        model("Lüks SUV", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["254 hp", "519 hp"])
      ] },
      { name: "Lynk & Co Z10 / Z20", models: [
        model("Z10", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["272 hp", "789 hp"]),
        model("Z20", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["250 hp"])
      ] },
      { name: "Geometry Serisi", models: [
        model("E", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["82 hp"]),
        model("M6", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["136 hp"]),
        model("C", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["204 hp"])
      ] },
      { name: "Riddara / Radar RD6", models: [
        model("Elektrikli Pickup", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["272 hp", "428 hp"])
      ] },
      { name: "Panda Mini EV", models: [
        model("Mikro Elektrikli", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["41 hp"])
      ] }
    ]
  },
  {
    name: "Ferrari",
    series: [
      { name: "12Cilindri", models: [
        model("Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["830 hp"]),
        model("Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["6.5"], ["830 hp"])
      ] },
      { name: "296 Serisi", models: [
        model("296 GTB", ["Hibrit"], ["Otomatik"], ["Coupe"], ["3.0"], ["830 hp"]),
        model("296 GTS", ["Hibrit"], ["Otomatik"], ["Roadster"], ["3.0"], ["830 hp"]),
        model("296 Speciale", ["Hibrit"], ["Otomatik"], ["Coupe"], ["3.0"], ["880 hp"])
      ] },
      { name: "SF90 Serisi", models: [
        model("Stradale", ["Hibrit"], ["Otomatik"], ["Coupe"], ["4.0"], ["1000 hp"]),
        model("Spider", ["Hibrit"], ["Otomatik"], ["Roadster"], ["4.0"], ["1000 hp"]),
        model("SF90 XX", ["Hibrit"], ["Otomatik"], ["Coupe", "Roadster"], ["4.0"], ["1030 hp"])
      ] },
      { name: "Purosangue", models: [
        model("V12", ["Benzin"], ["Otomatik"], ["SUV"], ["6.5"], ["725 hp"])
      ] },
      { name: "Roma", models: [
        model("Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.9"], ["620 hp"]),
        model("Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.9"], ["620 hp"])
      ] },
      { name: "812 Serisi", models: [
        model("812 Superfast", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["800 hp"]),
        model("812 GTS", ["Benzin"], ["Otomatik"], ["Roadster"], ["6.5"], ["800 hp"]),
        model("Competizione", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.5"], ["830 hp"]),
        model("Competizione A", ["Benzin"], ["Otomatik"], ["Roadster"], ["6.5"], ["830 hp"])
      ] },
      { name: "Luce", models: [
        model("Elektrikli EV", ["Elektrik"], ["Otomatik"], ["Coupe", "Sedan"], ["0"], ["700 hp"])
      ] },
      { name: "Daytona SP3", models: [
        model("Daytona SP3", ["Benzin"], ["Otomatik"], ["Roadster"], ["6.5"], ["840 hp"])
      ] },
      { name: "Monza SP1", models: [
        model("Monza SP1", ["Benzin"], ["Otomatik"], ["Roadster"], ["6.5"], ["810 hp"])
      ] },
      { name: "Monza SP2", models: [
        model("Monza SP2", ["Benzin"], ["Otomatik"], ["Roadster"], ["6.5"], ["810 hp"])
      ] },
      { name: "F80", models: [
        model("F80", ["Hibrit"], ["Otomatik"], ["Coupe"], ["3.0"], ["1200 hp"])
      ] },
      { name: "F8 Serisi", models: [
        model("F8 Tributo", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.9"], ["720 hp"]),
        model("F8 Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.9"], ["720 hp"])
      ] },
      { name: "488 Serisi", models: [
        model("488 GTB", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.9"], ["670 hp"]),
        model("488 Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.9"], ["670 hp"]),
        model("488 Pista", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.9"], ["720 hp"]),
        model("488 Pista Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.9"], ["720 hp"])
      ] },
      { name: "458 Serisi", models: [
        model("458 Italia", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.5"], ["570 hp"]),
        model("458 Spider", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.5"], ["570 hp"]),
        model("458 Speciale", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.5"], ["605 hp"]),
        model("458 Speciale A", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.5"], ["605 hp"])
      ] },
      { name: "430 Serisi", models: [
        model("F430", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["4.3"], ["490 hp"]),
        model("F430 Spider", ["Benzin"], ["Otomatik", "Manuel"], ["Roadster"], ["4.3"], ["490 hp"]),
        model("430 Scuderia", ["Benzin"], ["Otomatik"], ["Coupe"], ["4.3"], ["510 hp"]),
        model("Scuderia Spider 16M", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.3"], ["510 hp"])
      ] },
      { name: "360 Serisi", models: [
        model("360 Modena", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["3.6"], ["400 hp"]),
        model("360 Spider", ["Benzin"], ["Otomatik", "Manuel"], ["Roadster"], ["3.6"], ["400 hp"]),
        model("Challenge Stradale", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.6"], ["425 hp"])
      ] },
      { name: "F355 Serisi", models: [
        model("Berlinetta", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["3.5"], ["380 hp"]),
        model("GTS", ["Benzin"], ["Otomatik", "Manuel"], ["Targa"], ["3.5"], ["380 hp"]),
        model("Spider", ["Benzin"], ["Otomatik", "Manuel"], ["Roadster"], ["3.5"], ["380 hp"]),
        model("F1", ["Benzin"], ["Otomatik"], ["Coupe", "Targa", "Roadster"], ["3.5"], ["380 hp"])
      ] },
      { name: "Portofino / California", models: [
        model("Portofino M", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.9"], ["620 hp"]),
        model("California T", ["Benzin"], ["Otomatik"], ["Roadster"], ["3.9"], ["560 hp"]),
        model("California", ["Benzin"], ["Otomatik"], ["Roadster"], ["4.3"], ["490 hp"])
      ] },
      { name: "F12 Serisi", models: [
        model("F12berlinetta", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.3"], ["740 hp"]),
        model("F12tdf", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.3"], ["780 hp"])
      ] },
      { name: "599 Serisi", models: [
        model("599 GTB Fiorano", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.0"], ["620 hp"]),
        model("599 GTO", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.0"], ["670 hp"]),
        model("SA Aperta", ["Benzin"], ["Otomatik"], ["Roadster"], ["6.0"], ["670 hp"])
      ] },
      { name: "550 / 575 Serisi", models: [
        model("550 Maranello", ["Benzin"], ["Manuel"], ["Coupe"], ["5.5"], ["485 hp"]),
        model("575M Maranello", ["Benzin"], ["Otomatik", "Manuel"], ["Coupe"], ["5.7"], ["515 hp"]),
        model("Superamerica", ["Benzin"], ["Otomatik"], ["Roadster"], ["5.7"], ["540 hp"])
      ] },
      { name: "FF / GTC4Lusso", models: [
        model("FF", ["Benzin"], ["Otomatik"], ["Shooting Brake"], ["6.3"], ["660 hp"]),
        model("GTC4Lusso", ["Benzin"], ["Otomatik"], ["Shooting Brake"], ["6.3"], ["690 hp"]),
        model("GTC4Lusso T", ["Benzin"], ["Otomatik"], ["Shooting Brake"], ["3.9"], ["610 hp"])
      ] },
      { name: "LaFerrari", models: [
        model("Coupe", ["Hibrit"], ["Otomatik"], ["Coupe"], ["6.3"], ["963 hp"]),
        model("Aperta", ["Hibrit"], ["Otomatik"], ["Roadster"], ["6.3"], ["963 hp"])
      ] },
      { name: "Enzo Ferrari", models: [
        model("Enzo Ferrari", ["Benzin"], ["Otomatik"], ["Coupe"], ["6.0"], ["660 hp"])
      ] },
      { name: "F50", models: [
        model("F50", ["Benzin"], ["Manuel"], ["Roadster"], ["4.7"], ["520 hp"])
      ] },
      { name: "F40", models: [
        model("F40", ["Benzin"], ["Manuel"], ["Coupe"], ["2.9"], ["478 hp"])
      ] },
      { name: "288 GTO", models: [
        model("288 GTO", ["Benzin"], ["Manuel"], ["Coupe"], ["2.9"], ["400 hp"])
      ] },
      { name: "Testarossa", models: [
        model("Testarossa", ["Benzin"], ["Manuel"], ["Coupe"], ["4.9"], ["390 hp"])
      ] },
      { name: "512 TR", models: [
        model("512 TR", ["Benzin"], ["Manuel"], ["Coupe"], ["4.9"], ["428 hp"])
      ] }
    ]
  },
  {
    name: "Daewoo",
    series: [
      { name: "Lanos", models: [
        model("1.4", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.4"], ["75 hp"]),
        model("1.5", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.5"], ["86 hp"]),
        model("1.6", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.6"], ["106 hp"]),
        model("SX", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.5", "1.6"], ["86 hp", "106 hp"]),
        model("SE", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.5", "1.6"], ["86 hp", "106 hp"]),
        model("S", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.4", "1.5"], ["75 hp", "86 hp"])
      ] },
      { name: "Nexia", models: [
        model("1.5 GL", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.5"], ["75 hp", "90 hp"]),
        model("1.5 GLX", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.5"], ["75 hp", "90 hp"]),
        model("Sedan", ["Benzin"], ["Manuel"], ["Sedan"], ["1.5"], ["75 hp", "90 hp"]),
        model("Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.5"], ["75 hp", "90 hp"])
      ] },
      { name: "Nubira", models: [
        model("1.6", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.6"], ["106 hp"]),
        model("2.0", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["133 hp"]),
        model("CDX", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.6", "2.0"], ["106 hp", "133 hp"]),
        model("SX", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.6", "2.0"], ["106 hp", "133 hp"]),
        model("Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.6", "2.0"], ["106 hp", "133 hp"]),
        model("Wagon", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.6", "2.0"], ["106 hp", "133 hp"])
      ] },
      { name: "Leganza", models: [
        model("2.0 CDX", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["131 hp"]),
        model("2.2 CDX", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.2"], ["136 hp"])
      ] },
      { name: "Espero", models: [
        model("1.5", ["Benzin"], ["Manuel"], ["Sedan"], ["1.5"], ["90 hp"]),
        model("1.8", ["Benzin"], ["Manuel"], ["Sedan"], ["1.8"], ["95 hp"]),
        model("2.0", ["Benzin"], ["Manuel"], ["Sedan"], ["2.0"], ["105 hp"])
      ] },
      { name: "Cielo", models: [
        model("1.5 GL", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.5"], ["75 hp"]),
        model("1.5 GLE", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.5"], ["90 hp"])
      ] },
      { name: "Lacetti", models: [
        model("1.4", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.4"], ["94 hp"]),
        model("1.6", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.6"], ["109 hp"])
      ] },
      { name: "Kalos", models: [
        model("1.2", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["72 hp"]),
        model("1.4", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Sedan"], ["1.4"], ["83 hp"])
      ] },
      { name: "Gentra", models: [
        model("1.2", ["Benzin"], ["Manuel"], ["Sedan"], ["1.2"], ["84 hp"]),
        model("1.5", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.5"], ["105 hp"])
      ] },
      { name: "Tosca", models: [
        model("2.0", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["144 hp"]),
        model("2.5", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["156 hp"])
      ] },
      { name: "Matiz", models: [
        model("0.8", ["Benzin"], ["Manuel"], ["Hatchback"], ["0.8"], ["52 hp"]),
        model("1.0", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0"], ["64 hp"]),
        model("SE", ["Benzin"], ["Manuel"], ["Hatchback"], ["0.8", "1.0"], ["52 hp", "64 hp"]),
        model("Van", ["Benzin"], ["Manuel"], ["Van"], ["0.8"], ["52 hp"])
      ] },
      { name: "Tico", models: [
        model("0.8", ["Benzin"], ["Manuel"], ["Hatchback"], ["0.8"], ["41 hp"])
      ] },
      { name: "Tacuma (Rezzo)", models: [
        model("1.6", ["Benzin"], ["Manuel"], ["MPV"], ["1.6"], ["107 hp"]),
        model("2.0", ["Benzin"], ["Manuel", "Otomatik"], ["MPV"], ["2.0"], ["121 hp"])
      ] },
      { name: "Musso", models: [
        model("2.9 TD", ["Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["2.9"], ["120 hp"])
      ] },
      { name: "Korando", models: [
        model("2.3", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["2.3"], ["140 hp"]),
        model("2.9", ["Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["2.9"], ["120 hp"])
      ] },
      { name: "Winstorm", models: [
        model("2.0 Dizel", ["Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["2.0"], ["150 hp"])
      ] },
      { name: "Damas", models: [
        model("0.8", ["Benzin"], ["Manuel"], ["Van"], ["0.8"], ["38 hp"])
      ] },
      { name: "Labo", models: [
        model("0.8", ["Benzin"], ["Manuel"], ["Pickup"], ["0.8"], ["38 hp"])
      ] },
      { name: "Lublin", models: [
        model("2.4", ["Dizel"], ["Manuel"], ["Kamyonet"], ["2.4"], ["70 hp"])
      ] },
      { name: "Chairman", models: [
        model("3.2", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.2"], ["220 hp"])
      ] },
      { name: "Arcadia", models: [
        model("Arcadia", ["Benzin"], ["Otomatik"], ["Sedan"], ["3.2"], ["220 hp"])
      ] },
      { name: "Royale Series", models: [
        model("Prince", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8", "2.0"], ["95 hp", "105 hp"]),
        model("Salon", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8", "2.0"], ["95 hp", "105 hp"]),
        model("Duke", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["1.8", "2.0"], ["95 hp", "105 hp"])
      ] }
    ]
  },
  {
    name: "Seat",
    series: [
      { name: "Arona", models: [
        model("1.0 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["95 hp", "110 hp"]),
        model("1.5 TSI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]),
        model("Full LED", ["Benzin"], ["Otomatik"], ["SUV"], ["1.0", "1.5"], ["110 hp", "150 hp"]),
        model("9.2 inc Multimedya", ["Benzin"], ["Otomatik"], ["SUV"], ["1.0", "1.5"], ["110 hp", "150 hp"])
      ] },
      { name: "Ateca", models: [
        model("SE", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.5", "2.0"], ["150 hp"]),
        model("SE Technology", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.5", "2.0"], ["150 hp"]),
        model("FR", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.5", "2.0"], ["150 hp", "190 hp"]),
        model("XPERIENCE", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["150 hp", "190 hp"])
      ] },
      { name: "Tarraco", models: [
        model("7 Kisilik", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["150 hp", "200 hp"]),
        model("1.5 TSI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["150 hp"]),
        model("2.0 TDI", ["Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["150 hp", "200 hp"])
      ] },
      { name: "Ibiza", models: [
        model("Liminal", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["95 hp", "110 hp"]),
        model("Oniric", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["95 hp", "110 hp"]),
        model("Hypnotic", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["95 hp", "110 hp"]),
        model("Facelift", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["95 hp", "110 hp"])
      ] },
      { name: "Leon / Leon Sportstourer", models: [
        model("Benzinli", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback", "Station Wagon"], ["1.5"], ["130 hp", "150 hp"]),
        model("Mild Hybrid eTSI", ["Hibrit"], ["Otomatik"], ["Hatchback", "Station Wagon"], ["1.5"], ["150 hp"]),
        model("Plug-in Hybrid e-Hybrid", ["Hibrit"], ["Otomatik"], ["Hatchback", "Station Wagon"], ["1.4"], ["204 hp"]),
        model("Sportstourer", ["Benzin", "Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.5", "1.4"], ["150 hp", "204 hp"])
      ] },
      { name: "MÓ 125", models: [
        model("7 kW", ["Elektrik"], ["Otomatik"], ["Scooter"], ["0"], ["7 kW"]),
        model("137 km Menzil", ["Elektrik"], ["Otomatik"], ["Scooter"], ["0"], ["7 kW"])
      ] },
      { name: "MÓ 125 Performance", models: [
        model("105 km/s", ["Elektrik"], ["Otomatik"], ["Scooter"], ["0"], ["9 kW"]),
        model("Ohlins Suspansiyon", ["Elektrik"], ["Otomatik"], ["Scooter"], ["0"], ["9 kW"]),
        model("Galfer Fren", ["Elektrik"], ["Otomatik"], ["Scooter"], ["0"], ["9 kW"])
      ] },
      { name: "Alhambra", models: [
        model("Alhambra", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.4", "2.0"], ["150 hp", "184 hp"])
      ] },
      { name: "Toledo", models: [
        model("Toledo", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["1.0", "1.4", "1.6"], ["95 hp", "125 hp"])
      ] },
      { name: "Cordoba", models: [
        model("Cordoba", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.4", "1.6", "1.9"], ["75 hp", "100 hp"])
      ] },
      { name: "Exeo", models: [
        model("Exeo", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["1.8", "2.0"], ["120 hp", "143 hp", "211 hp"])
      ] },
      { name: "Altea", models: [
        model("Altea", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["MPV"], ["1.2", "1.6", "2.0"], ["105 hp", "140 hp"])
      ] },
      { name: "Mii", models: [
        model("Mii", ["Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "0"], ["60 hp", "83 hp"])
      ] }
    ]
  },
  {
    name: "Skoda",
    series: [
      { name: "Epiq", models: [
        model("Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["150 hp"]),
        model("4.1 m", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["150 hp"]),
        model("425 km Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["150 hp"])
      ] },
      { name: "Elroq", models: [
        model("55 kWh", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["170 hp"]),
        model("63 kWh", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp"]),
        model("82 kWh", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["286 hp"]),
        model("Modern Solid", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["170 hp", "204 hp", "286 hp"])
      ] },
      { name: "Kodiaq", models: [
        model("2. Nesil", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["150 hp", "193 hp"]),
        model("Kodiaq iV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["204 hp"]),
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["204 hp"]),
        model("100 km+ Elektrikli Menzil", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["204 hp"])
      ] },
      { name: "Kamiq", models: [
        model("Makyajli", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0", "1.5"], ["95 hp", "150 hp"]),
        model("Ekonomik SUV", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.0"], ["95 hp"])
      ] },
      { name: "Karoq", models: [
        model("Makyajli", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["150 hp"]),
        model("Pratik SUV", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["150 hp"])
      ] },
      { name: "Enyaq / Enyaq Coupe iV", models: [
        model("Enyaq", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["204 hp", "286 hp"]),
        model("Enyaq Coupe iV", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["204 hp", "286 hp"]),
        model("V2L", ["Elektrik"], ["Otomatik"], ["SUV", "SUV Coupe"], ["0"], ["204 hp", "286 hp"]),
        model("LFP Batarya", ["Elektrik"], ["Otomatik"], ["SUV", "SUV Coupe"], ["0"], ["204 hp", "286 hp"]),
        model("Android Bilgi Eglence", ["Elektrik"], ["Otomatik"], ["SUV", "SUV Coupe"], ["0"], ["204 hp", "286 hp"])
      ] },
      { name: "Superb", models: [
        model("4. Nesil", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["1.5", "2.0"], ["150 hp", "193 hp", "204 hp"]),
        model("Sedan", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Sedan"], ["1.5", "2.0"], ["150 hp", "193 hp", "204 hp"]),
        model("Combi", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.5", "2.0"], ["150 hp", "193 hp", "204 hp"]),
        model("Superb iV", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["1.5"], ["204 hp"]),
        model("25.7 kWh", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["1.5"], ["204 hp"]),
        model("100 km+ Elektrikli Menzil", ["Hibrit"], ["Otomatik"], ["Sedan", "Station Wagon"], ["1.5"], ["204 hp"])
      ] },
      { name: "Octavia", models: [
        model("Facelift", ["Benzin", "Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Sedan", "Station Wagon"], ["1.5", "2.0"], ["150 hp", "265 hp"]),
        model("13 inc Ekran", ["Benzin", "Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Sedan", "Station Wagon"], ["1.5", "2.0"], ["150 hp", "265 hp"]),
        model("ChatGPT Asistan", ["Benzin", "Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Sedan", "Station Wagon"], ["1.5", "2.0"], ["150 hp", "265 hp"])
      ] },
      { name: "Fabia", models: [
        model("Monte Carlo", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.5"], ["95 hp", "150 hp"]),
        model("B-Segment", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["95 hp", "110 hp"])
      ] },
      { name: "Scala", models: [
        model("LED Matrix", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.5"], ["95 hp", "150 hp"]),
        model("Dijital Kokpit", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.5"], ["95 hp", "150 hp"])
      ] },
      { name: "Enyaq vRS / Elroq vRS", models: [
        model("Enyaq vRS", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"]),
        model("Elroq vRS", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"]),
        model("340 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"])
      ] },
      { name: "Octavia vRS", models: [
        model("2.0 TSI", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["265 hp"]),
        model("265 HP", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.0"], ["265 hp"])
      ] },
      { name: "Kodiaq vRS", models: [
        model("7 Kisilik Performans SUV", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["2.0"], ["265 hp"])
      ] },
      { name: "Rapid", models: [
        model("Rapid", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback"], ["1.0", "1.4", "1.6"], ["95 hp", "125 hp"])
      ] },
      { name: "Roomster", models: [
        model("Roomster", ["Benzin", "Dizel"], ["Manuel"], ["MPV"], ["1.2", "1.4", "1.6"], ["70 hp", "105 hp"])
      ] },
      { name: "Yeti", models: [
        model("Yeti", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.4", "2.0"], ["105 hp", "140 hp"])
      ] },
      { name: "Citigo", models: [
        model("Citigo", ["Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "0"], ["60 hp", "83 hp"])
      ] },
      { name: "Felicia", models: [
        model("Felicia", ["Benzin", "Dizel"], ["Manuel"], ["Hatchback", "Station Wagon"], ["1.3", "1.6", "1.9"], ["68 hp", "75 hp"])
      ] },
      { name: "Favorit", models: [
        model("Favorit", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.3"], ["58 hp"])
      ] }
    ]
  },
  {
    name: "Smart",
    series: [
      { name: "Smart #1", models: [
        model("Pro", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp"]),
        model("Pro+", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp"]),
        model("Premium", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp"]),
        model("BRABUS", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["428 hp"]),
        model("440 km Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp"])
      ] },
      { name: "Smart #3", models: [
        model("Coupe-SUV", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["272 hp"]),
        model("Sportif Govde", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["272 hp"])
      ] },
      { name: "Smart #5", models: [
        model("Mid-size SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"]),
        model("800V Hizli Sarj", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"]),
        model("550 km+ Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"]),
        model("Sennheiser Ses Sistemi", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"])
      ] },
      { name: "Smart #2", models: [
        model("Fortwo Ruhani Devami", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["95 hp"]),
        model("2 Kisilik Elektrikli Sehir Araci", ["Elektrik"], ["Otomatik"], ["Mikro"], ["0"], ["95 hp"])
      ] },
      { name: "Smart Fortwo", models: [
        model("450 Serisi", ["Benzin"], ["Otomatik"], ["Hatchback"], ["0.6", "0.7"], ["61 hp", "82 hp"]),
        model("451 Serisi", ["Benzin"], ["Otomatik"], ["Hatchback"], ["1.0"], ["71 hp", "84 hp"]),
        model("453 Serisi", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["0.9", "1.0"], ["71 hp", "90 hp"])
      ] },
      { name: "Smart EQ Fortwo / Forfour", models: [
        model("EQ Fortwo", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["82 hp"]),
        model("EQ Forfour", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["82 hp"]),
        model("17.6 kWh", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["82 hp"])
      ] },
      { name: "Smart Forfour", models: [
        model("4 Kapili", ["Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["Hatchback"], ["0.9", "1.0", "0"], ["71 hp", "90 hp", "82 hp"]),
        model("4 Kisilik", ["Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["Hatchback"], ["0.9", "1.0", "0"], ["71 hp", "90 hp", "82 hp"])
      ] },
      { name: "Smart Roadster / Roadster Coupe", models: [
        model("Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], ["0.7"], ["82 hp"]),
        model("Roadster Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], ["0.7"], ["82 hp"])
      ] },
      { name: "Smart Crossblade", models: [
        model("Sinirli Uretim", ["Benzin"], ["Otomatik"], ["Roadster"], ["0.6"], ["71 hp"])
      ] },
      { name: "BRABUS Performance", models: [
        model("Cift Motor", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["428 hp"]),
        model("AWD", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["428 hp"]),
        model("Performans", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["428 hp"])
      ] },
      { name: "800V Architecture", models: [
        model("Hizli Sarj", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["340 hp"])
      ] },
      { name: "Halo Roof", models: [
        model("Panoramik Cam Tavan", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp", "340 hp"])
      ] },
      { name: "CyberSpaced", models: [
        model("Genis Ic Hacim", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp", "340 hp"]),
        model("Gelismis Multimedya", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp", "340 hp"])
      ] },
      { name: "City-Coupe", models: [
        model("City-Coupe", ["Benzin"], ["Otomatik"], ["Hatchback"], ["0.6"], ["55 hp"])
      ] },
      { name: "Cabrio", models: [
        model("Cabrio", ["Benzin", "Elektrik"], ["Otomatik"], ["Cabrio"], ["0.7", "0"], ["82 hp"])
      ] },
      { name: "Electric Drive", models: [
        model("Electric Drive", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["74 hp", "82 hp"])
      ] }
    ]
  },
  {
    name: "Subaru",
    series: [
      { name: "Forester", models: [
        model("Base", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["180 hp"]),
        model("Premium", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["180 hp"]),
        model("Sport", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["180 hp"]),
        model("Limited", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["180 hp"]),
        model("Touring", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["180 hp"]),
        model("Benzinli", ["Benzin"], ["Otomatik"], ["SUV"], ["2.5"], ["180 hp"])
      ] },
      { name: "Forester Hybrid", models: [
        model("2.5L Boxer", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["194 hp"]),
        model("Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["194 hp"]),
        model("194 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["194 hp"]),
        model("900 km+ Menzil", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["194 hp"])
      ] },
      { name: "Outback", models: [
        model("2.5L", ["Benzin"], ["Otomatik"], ["Station Wagon", "Crossover"], ["2.5"], ["182 hp"]),
        model("2.4L Turbo", ["Benzin"], ["Otomatik"], ["Station Wagon", "Crossover"], ["2.4"], ["260 hp"]),
        model("Onyx", ["Benzin"], ["Otomatik"], ["Station Wagon", "Crossover"], ["2.5", "2.4"], ["182 hp", "260 hp"]),
        model("Limited", ["Benzin"], ["Otomatik"], ["Station Wagon", "Crossover"], ["2.5", "2.4"], ["182 hp", "260 hp"]),
        model("Touring", ["Benzin"], ["Otomatik"], ["Station Wagon", "Crossover"], ["2.5", "2.4"], ["182 hp", "260 hp"]),
        model("Wilderness", ["Benzin"], ["Otomatik"], ["Station Wagon", "Crossover"], ["2.4"], ["260 hp"])
      ] },
      { name: "Crosstrek", models: [
        model("Base", ["Benzin"], ["Otomatik"], ["Crossover"], ["2.0"], ["152 hp"]),
        model("Premium", ["Benzin"], ["Otomatik"], ["Crossover"], ["2.0"], ["152 hp"]),
        model("Sport", ["Benzin"], ["Otomatik"], ["Crossover"], ["2.5"], ["182 hp"]),
        model("Limited", ["Benzin"], ["Otomatik"], ["Crossover"], ["2.5"], ["182 hp"]),
        model("Wilderness", ["Benzin"], ["Otomatik"], ["Crossover"], ["2.5"], ["182 hp"])
      ] },
      { name: "Crosstrek Hybrid", models: [
        model("Sport Hybrid", ["Hibrit"], ["Otomatik"], ["Crossover"], ["2.5"], ["194 hp"]),
        model("Limited Hybrid", ["Hibrit"], ["Otomatik"], ["Crossover"], ["2.5"], ["194 hp"])
      ] },
      { name: "Ascent", models: [
        model("3 Sira Koltuk", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4"], ["260 hp"]),
        model("8 Kisilik", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4"], ["260 hp"]),
        model("Onyx Edition", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4"], ["260 hp"]),
        model("Touring", ["Benzin"], ["Otomatik"], ["SUV"], ["2.4"], ["260 hp"])
      ] },
      { name: "Solterra", models: [
        model("Premium", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["215 hp"]),
        model("Limited", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["215 hp"]),
        model("XT Performans Paketi", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["215 hp"])
      ] },
      { name: "Trailseeker", models: [
        model("375 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["375 hp"]),
        model("Cift Motor", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["375 hp"]),
        model("8.5 inc Yerden Yukseklik", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["375 hp"])
      ] },
      { name: "Uncharted", models: [
        model("Premium", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["250 hp"]),
        model("Sport", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["250 hp"]),
        model("GT", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["250 hp"]),
        model("Fastback", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["250 hp"])
      ] },
      { name: "WRX", models: [
        model("Base", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.4"], ["271 hp"]),
        model("Premium", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.4"], ["271 hp"]),
        model("Limited", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.4"], ["271 hp"]),
        model("GT", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.4"], ["271 hp"]),
        model("tS", ["Benzin"], ["Manuel"], ["Sedan"], ["2.4"], ["271 hp"]),
        model("Series.Yellow", ["Benzin"], ["Manuel"], ["Sedan"], ["2.4"], ["271 hp"]),
        model("6 Ileri Manuel", ["Benzin"], ["Manuel"], ["Sedan"], ["2.4"], ["271 hp"]),
        model("SPT", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.4"], ["271 hp"])
      ] },
      { name: "BRZ", models: [
        model("Limited", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], ["2.4"], ["228 hp"]),
        model("tS", ["Benzin"], ["Manuel"], ["Coupe"], ["2.4"], ["228 hp"]),
        model("Series.Yellow", ["Benzin"], ["Manuel"], ["Coupe"], ["2.4"], ["228 hp"]),
        model("Kaminari Edition", ["Benzin"], ["Manuel"], ["Coupe"], ["2.4"], ["228 hp"])
      ] },
      { name: "Impreza", models: [
        model("Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.0"], ["152 hp"]),
        model("RS", ["Benzin"], ["Otomatik"], ["Hatchback"], ["2.5"], ["182 hp"])
      ] },
      { name: "Legacy", models: [
        model("D-Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5", "2.4"], ["182 hp", "260 hp"])
      ] },
      { name: "Wilderness", models: [
        model("Ultra-Arazi Paketi", ["Benzin"], ["Otomatik"], ["SUV", "Crossover"], ["2.4", "2.5"], ["182 hp", "260 hp"])
      ] },
      { name: "tS / tuned by STI", models: [
        model("STI Suspansiyon", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["2.4"], ["228 hp", "271 hp"]),
        model("Brembo Fren", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Coupe"], ["2.4"], ["228 hp", "271 hp"])
      ] },
      { name: "EyeSight 4.0", models: [
        model("Surus Destek Sistemi", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV", "Sedan", "Hatchback"], ["2.0", "2.5"], ["152 hp", "194 hp"])
      ] },
      { name: "X-MODE", models: [
        model("Kar, Camur, Dik Inis Cekis Kontrolu", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV", "Crossover"], ["2.0", "2.5"], ["152 hp", "194 hp"])
      ] },
      { name: "Levorg", models: [
        model("Levorg", ["Benzin"], ["Otomatik"], ["Station Wagon"], ["1.8"], ["177 hp"])
      ] },
      { name: "XV", models: [
        model("XV", ["Benzin", "Hibrit"], ["Otomatik"], ["Crossover"], ["2.0"], ["156 hp"])
      ] },
      { name: "Tribeca", models: [
        model("Tribeca", ["Benzin"], ["Otomatik"], ["SUV"], ["3.0", "3.6"], ["245 hp", "256 hp"])
      ] },
      { name: "Baja", models: [
        model("Baja", ["Benzin"], ["Otomatik"], ["Pickup"], ["2.5"], ["165 hp", "210 hp"])
      ] },
      { name: "Justy", models: [
        model("Justy", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0", "1.2"], ["69 hp", "80 hp"])
      ] },
      { name: "SVX", models: [
        model("SVX", ["Benzin"], ["Otomatik"], ["Coupe"], ["3.3"], ["230 hp"])
      ] }
    ]
  },
  {
    name: "Suzuki",
    series: [
      { name: "e Vitara", models: [
        model("49 kWh", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["144 hp"]),
        model("61 kWh", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["174 hp"]),
        model("400 km+ Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["144 hp", "174 hp"]),
        model("ALLGRIP-e", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["174 hp"]),
        model("Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["144 hp", "174 hp"])
      ] },
      { name: "Across", models: [
        model("Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["306 hp"]),
        model("306 HP", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["306 hp"]),
        model("75 km Elektrikli Menzil", ["Hibrit"], ["Otomatik"], ["SUV"], ["2.5"], ["306 hp"])
      ] },
      { name: "Swace", models: [
        model("Full Hybrid", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.8"], ["140 hp"]),
        model("Station Wagon", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["1.8"], ["140 hp"])
      ] },
      { name: "Vitara Hibrit", models: [
        model("1.4L Boosterjet Mild-Hybrid", ["Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.4"], ["129 hp"]),
        model("1.5L Full Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["116 hp"])
      ] },
      { name: "S-Cross", models: [
        model("Hibrit", ["Hibrit"], ["Manuel", "Otomatik"], ["SUV"], ["1.4", "1.5"], ["116 hp", "129 hp"]),
        model("AllGrip Select", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.4", "1.5"], ["116 hp", "129 hp"]),
        model("DSBS II", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.4", "1.5"], ["116 hp", "129 hp"])
      ] },
      { name: "Jimny", models: [
        model("3 Kapi", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["102 hp"]),
        model("5 Kapi", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["102 hp"])
      ] },
      { name: "Jimny Sierra", models: [
        model("1.5L VVT", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["102 hp"])
      ] },
      { name: "Jimny Hybrid", models: [
        model("Hibrit", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["116 hp"])
      ] },
      { name: "Fronx", models: [
        model("1.2L Hybrid", ["Hibrit"], ["Otomatik"], ["Coupe-SUV"], ["1.2"], ["90 hp"]),
        model("1.5L Hybrid", ["Hibrit"], ["Otomatik"], ["Coupe-SUV"], ["1.5"], ["103 hp"]),
        model("Coupe-SUV", ["Hibrit"], ["Otomatik"], ["Coupe-SUV"], ["1.2", "1.5"], ["90 hp", "103 hp"])
      ] },
      { name: "Grand Vitara", models: [
        model("Hibrit SUV", ["Hibrit"], ["Otomatik"], ["SUV"], ["1.5"], ["116 hp"])
      ] },
      { name: "Swift", models: [
        model("1.2L 12V Mild-Hybrid", ["Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["82 hp"]),
        model("Life", ["Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["82 hp"]),
        model("Plus", ["Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["82 hp"]),
        model("GLX", ["Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["82 hp"])
      ] },
      { name: "Ignis", models: [
        model("Mikro-SUV", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Crossover"], ["1.2"], ["83 hp"]),
        model("Hybrid", ["Hibrit"], ["Manuel", "Otomatik"], ["Crossover"], ["1.2"], ["83 hp"])
      ] },
      { name: "Swift Sport", models: [
        model("1.4L Boosterjet Mild-Hybrid", ["Hibrit"], ["Manuel"], ["Hatchback"], ["1.4"], ["129 hp"])
      ] },
      { name: "Hayabusa", models: [
        model("40th Anniversary", ["Benzin"], ["Manuel"], ["Motosiklet"], ["1.34"], ["190 hp"]),
        model("Candy Daring Red", ["Benzin"], ["Manuel"], ["Motosiklet"], ["1.34"], ["190 hp"])
      ] },
      { name: "GSX-R Serisi", models: [
        model("GSX-R600", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.599"], ["124 hp"]),
        model("GSX-R750", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.750"], ["148 hp"]),
        model("GSX-R1000", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.999"], ["199 hp"]),
        model("Pearl Vigor Blue", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.999"], ["199 hp"])
      ] },
      { name: "V-Strom Serisi", models: [
        model("V-Strom 800", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.776"], ["84 hp"]),
        model("V-Strom 1050", ["Benzin"], ["Manuel"], ["Motosiklet"], ["1.037"], ["107 hp"]),
        model("DE", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.776", "1.037"], ["84 hp", "107 hp"]),
        model("Adventure", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.776", "1.037"], ["84 hp", "107 hp"])
      ] },
      { name: "DR-Z4S / DR-Z4SM", models: [
        model("Dual-Sport", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.398"], ["38 hp"]),
        model("Supermoto", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.398"], ["38 hp"]),
        model("ABS", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.398"], ["38 hp"]),
        model("Cekis Kontrolu", ["Benzin"], ["Manuel"], ["Motosiklet"], ["0.398"], ["38 hp"])
      ] },
      { name: "ALLGRIP SELECT / e", models: [
        model("Akilli 4x4", ["Benzin", "Hibrit", "Elektrik"], ["Manuel", "Otomatik"], ["SUV"], ["0", "1.4", "1.5"], ["116 hp", "129 hp", "174 hp"])
      ] },
      { name: "DSBS II", models: [
        model("Dual Sensor Brake Support", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV", "Crossover"], ["1.2", "1.4", "1.5"], ["90 hp", "129 hp"])
      ] },
      { name: "Heartect-e", models: [
        model("Elektrikli Sasi Mimarisi", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["144 hp", "174 hp"])
      ] },
      { name: "Baleno", models: [
        model("Baleno", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2"], ["90 hp"])
      ] },
      { name: "SX4", models: [
        model("SX4", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback", "Crossover"], ["1.6"], ["120 hp"])
      ] },
      { name: "Alto", models: [
        model("Alto", ["Benzin"], ["Manuel"], ["Hatchback"], ["0.8", "1.0"], ["68 hp"])
      ] },
      { name: "Splash", models: [
        model("Splash", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0", "1.2", "1.3"], ["65 hp", "94 hp"])
      ] },
      { name: "Celerio", models: [
        model("Celerio", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.0"], ["68 hp"])
      ] },
      { name: "Wagon R", models: [
        model("Wagon R", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["Hatchback"], ["0.66", "1.0"], ["52 hp", "67 hp"])
      ] },
      { name: "Samurai", models: [
        model("Samurai", ["Benzin", "Dizel"], ["Manuel"], ["SUV"], ["1.3", "1.9"], ["80 hp", "63 hp"])
      ] },
      { name: "Carry", models: [
        model("Carry", ["Benzin"], ["Manuel"], ["Pickup", "Hafif Ticari"], ["1.5"], ["96 hp"])
      ] }
    ]
  },
  {
    name: "Tata",
    series: [
      { name: "Sierra EV", models: [
        model("Lounge", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["200 hp"]),
        model("Panoramik Cam Tavan", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["200 hp"]),
        model("600 km+ Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["200 hp"])
      ] },
      { name: "Safari / Harrier", models: [
        model("Safari", ["Benzin", "Dizel"], ["Otomatik", "Manuel"], ["SUV"], ["1.5", "2.0"], ["170 hp"]),
        model("Harrier", ["Benzin", "Dizel"], ["Otomatik", "Manuel"], ["SUV"], ["1.5", "2.0"], ["170 hp"]),
        model("Ultra Red Dark", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], ["1.5", "2.0"], ["170 hp"]),
        model("1.2L T-GDI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.2"], ["125 hp"]),
        model("1.5L T-GDI", ["Benzin"], ["Otomatik"], ["SUV"], ["1.5"], ["170 hp"])
      ] },
      { name: "Curvv / Curvv EV", models: [
        model("SUV-Coupe", ["Benzin", "Elektrik"], ["Otomatik"], ["SUV Coupe"], ["1.2", "0"], ["125 hp", "167 hp"]),
        model("55 kWh", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["167 hp"]),
        model("ADAS Seviye 2", ["Benzin", "Elektrik"], ["Otomatik"], ["SUV Coupe"], ["1.2", "0"], ["125 hp", "167 hp"])
      ] },
      { name: "Nexon", models: [
        model("1.2L Turbo Petrol", ["Benzin"], ["Manuel", "Otomatik"], ["SUV"], ["1.2"], ["120 hp"]),
        model("1.5L Dizel", ["Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.5"], ["115 hp"]),
        model("Facelift", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "1.5"], ["120 hp", "115 hp"])
      ] },
      { name: "Punch / Punch EV", models: [
        model("Micro-SUV", ["Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "0"], ["88 hp", "121 hp"]),
        model("6 Hava Yastigi", ["Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "0"], ["88 hp", "121 hp"]),
        model("Dijital Ic Mekan", ["Benzin", "Elektrik"], ["Manuel", "Otomatik"], ["SUV"], ["1.2", "0"], ["88 hp", "121 hp"])
      ] },
      { name: "Avinya X", models: [
        model("Gen 3 Mimari", ["Elektrik"], ["Otomatik"], ["Crossover", "MPV"], ["0"], ["250 hp"]),
        model("Premium Elektrikli", ["Elektrik"], ["Otomatik"], ["Crossover", "MPV"], ["0"], ["250 hp"]),
        model("Crossover", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["250 hp"]),
        model("MPV", ["Elektrik"], ["Otomatik"], ["MPV"], ["0"], ["250 hp"])
      ] },
      { name: "Tiago EV / Tigor EV", models: [
        model("Tiago EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["74 hp"]),
        model("Tigor EV", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["74 hp"])
      ] },
      { name: "Harrier EV", models: [
        model("QWD", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["250 hp"]),
        model("AWD", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["250 hp"]),
        model("Cift Motor", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["250 hp"])
      ] },
      { name: "Altroz / Altroz Racer", models: [
        model("Premium Hatchback", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.2", "1.5"], ["88 hp", "90 hp"]),
        model("Racer", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["120 hp"]),
        model("120 HP", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.2"], ["120 hp"])
      ] },
      { name: "Tiago / Tigor iCNG", models: [
        model("Tiago iCNG", ["Benzin", "CNG"], ["Manuel"], ["Hatchback"], ["1.2"], ["73 hp"]),
        model("Tigor iCNG", ["Benzin", "CNG"], ["Manuel"], ["Sedan"], ["1.2"], ["73 hp"]),
        model("Twin-Cylinder iCNG", ["Benzin", "CNG"], ["Manuel"], ["Hatchback", "Sedan"], ["1.2"], ["73 hp"])
      ] },
      { name: "Acti.ev Architecture", models: [
        model("Elektrikli Arac Sasisi", ["Elektrik"], ["Otomatik"], ["SUV", "Hatchback", "Sedan"], ["0"], ["74 hp", "250 hp"])
      ] },
      { name: "Persona Based Interiors", models: [
        model("Joy", ["Benzin", "Elektrik"], ["Otomatik", "Manuel"], ["SUV", "Hatchback"], ["0", "1.2"], ["88 hp", "121 hp"]),
        model("Fearless", ["Benzin", "Elektrik"], ["Otomatik", "Manuel"], ["SUV", "Hatchback"], ["0", "1.2"], ["88 hp", "121 hp"]),
        model("Empowered", ["Benzin", "Elektrik"], ["Otomatik", "Manuel"], ["SUV", "Hatchback"], ["0", "1.2"], ["88 hp", "121 hp"]),
        model("Accomplished", ["Benzin", "Elektrik"], ["Otomatik", "Manuel"], ["SUV", "Hatchback"], ["0", "1.2"], ["88 hp", "121 hp"])
      ] },
      { name: "Arcade.ev", models: [
        model("Eglence Platformu", ["Elektrik"], ["Otomatik"], ["SUV", "Hatchback"], ["0"], ["121 hp", "167 hp"])
      ] },
      { name: "Twin-Cylinder iCNG", models: [
        model("Ikiz Tup Sistemi", ["Benzin", "CNG"], ["Manuel"], ["Hatchback", "Sedan"], ["1.2"], ["73 hp"])
      ] },
      { name: "Ace EV", models: [
        model("Elektrikli Mini Kamyonet", ["Elektrik"], ["Otomatik"], ["Kamyonet"], ["0"], ["36 hp"])
      ] },
      { name: "Intra V50 / V70", models: [
        model("Intra V50", ["Dizel"], ["Manuel"], ["Kamyonet"], ["1.5"], ["80 hp"]),
        model("Intra V70", ["Dizel"], ["Manuel"], ["Kamyonet"], ["1.5"], ["80 hp"])
      ] },
      { name: "Prima / Signa", models: [
        model("Prima", ["Dizel"], ["Manuel"], ["Agir Vasıta"], ["5.0", "6.7"], ["180 hp", "300 hp"]),
        model("Signa", ["Dizel"], ["Manuel"], ["Agir Vasıta"], ["5.0", "6.7"], ["180 hp", "300 hp"]),
        model("Agir Vasita", ["Dizel"], ["Manuel"], ["Agir Vasıta"], ["5.0", "6.7"], ["180 hp", "300 hp"]),
        model("Cekici", ["Dizel"], ["Manuel"], ["Agir Vasıta"], ["5.0", "6.7"], ["180 hp", "300 hp"])
      ] },
      { name: "Nano", models: [
        model("Nano", ["Benzin"], ["Manuel"], ["Hatchback"], ["0.624"], ["38 hp"])
      ] },
      { name: "Indica", models: [
        model("Indica", ["Benzin", "Dizel"], ["Manuel"], ["Hatchback"], ["1.2", "1.4"], ["65 hp", "71 hp"])
      ] },
      { name: "Indigo", models: [
        model("Indigo", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.2", "1.4"], ["65 hp", "71 hp"])
      ] },
      { name: "Manza", models: [
        model("Manza", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.3", "1.4"], ["90 hp"])
      ] },
      { name: "Hexa", models: [
        model("Hexa", ["Dizel"], ["Manuel", "Otomatik"], ["SUV"], ["2.2"], ["156 hp"])
      ] },
      { name: "Bolt", models: [
        model("Bolt", ["Benzin", "Dizel"], ["Manuel"], ["Hatchback"], ["1.2", "1.3"], ["90 hp"])
      ] },
      { name: "Zest", models: [
        model("Zest", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.2", "1.3"], ["90 hp"])
      ] }
    ]
  },
  {
    name: "TofaÅŸ",
    series: [
      { name: "Egea Sedan / Cross / Wagon", models: [
        model("Easy", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan", "Crossover", "Station Wagon"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Street", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan", "Crossover", "Station Wagon"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Urban", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan", "Crossover", "Station Wagon"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Lounge", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan", "Crossover", "Station Wagon"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("Limited", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan", "Crossover", "Station Wagon"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"]),
        model("1.6 Multijet 130 HP", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Crossover", "Station Wagon"], ["1.6"], ["130 hp"]),
        model("1.5 Hibrit 130 HP", ["Hibrit"], ["Otomatik"], ["Sedan", "Crossover", "Station Wagon"], ["1.5"], ["130 hp"])
      ] },
      { name: "Yeni Nesil Hafif Ticari K0 Platformu", models: [
        model("Kombi", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Hafif Ticari"], ["1.5", "0"], ["100 hp", "136 hp"]),
        model("Van", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Van"], ["1.5", "0"], ["100 hp", "136 hp"]),
        model("Scudo", ["Dizel", "Elektrik"], ["Manuel", "Otomatik"], ["Panelvan"], ["2.0", "0"], ["145 hp", "180 hp"]),
        model("Ulysse", ["Dizel", "Elektrik"], ["Otomatik"], ["MPV"], ["2.0", "0"], ["180 hp", "136 hp"])
      ] },
      { name: "Grande Panda / Fastback", models: [
        model("Elektrikli", ["Elektrik"], ["Otomatik"], ["SUV", "Crossover"], ["0"], ["113 hp", "156 hp"]),
        model("Hibrit", ["Hibrit"], ["Otomatik"], ["SUV", "Crossover"], ["1.2"], ["100 hp"]),
        model("SUV", ["Elektrik", "Hibrit"], ["Otomatik"], ["SUV"], ["0", "1.2"], ["113 hp", "156 hp"]),
        model("Crossover", ["Elektrik", "Hibrit"], ["Otomatik"], ["Crossover"], ["0", "1.2"], ["113 hp", "156 hp"])
      ] },
      { name: "Åžahin", models: [
        model("Åžahin 1.4", ["Benzin"], ["Manuel"], ["Sedan"], ["1.4"], ["71 hp"]),
        model("Åžahin 1.6", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["82 hp"]),
        model("Åžahin S", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["82 hp"])
      ] },
      { name: "DoÄŸan", models: [
        model("DoÄŸan L", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["82 hp"]),
        model("DoÄŸan SL", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["82 hp"]),
        model("DoÄŸan SLX", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["90 hp"]),
        model("DoÄŸan 1.6 ie", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["95 hp"])
      ] },
      { name: "Kartal", models: [
        model("Kartal L", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.6"], ["82 hp"]),
        model("Kartal SLX", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.6"], ["90 hp"]),
        model("Kartal Cargo", ["Benzin"], ["Manuel"], ["Station Wagon"], ["1.6"], ["90 hp"])
      ] },
      { name: "Murat 124 / HacÄ± Murat", models: [
        model("Murat 124", ["Benzin"], ["Manuel"], ["Sedan"], ["1.2"], ["65 hp"]),
        model("HacÄ± Murat", ["Benzin"], ["Manuel"], ["Sedan"], ["1.2"], ["65 hp"])
      ] },
      { name: "Murat 131", models: [
        model("Murat 131", ["Benzin"], ["Manuel"], ["Sedan"], ["1.3", "1.6"], ["70 hp", "82 hp"])
      ] },
      { name: "SerÃ§e", models: [
        model("1.3 Motor", ["Benzin"], ["Manuel"], ["Sedan"], ["1.3"], ["70 hp"])
      ] },
      { name: "Linea", models: [
        model("Actual", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.3", "1.4", "1.6"], ["77 hp", "95 hp", "105 hp"]),
        model("Active", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.3", "1.4", "1.6"], ["77 hp", "95 hp", "105 hp"]),
        model("Emotion", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.3", "1.4", "1.6"], ["77 hp", "95 hp", "105 hp"])
      ] },
      { name: "Albea / Palio / Siena", models: [
        model("Albea", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.2", "1.3", "1.4"], ["65 hp", "70 hp", "77 hp"]),
        model("Palio", ["Benzin", "Dizel"], ["Manuel"], ["Hatchback"], ["1.2", "1.3", "1.4"], ["65 hp", "70 hp", "77 hp"]),
        model("Siena", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.2", "1.3", "1.4"], ["65 hp", "70 hp", "77 hp"]),
        model("Sole", ["Benzin"], ["Manuel"], ["Sedan"], ["1.4"], ["77 hp"]),
        model("Fire", ["Benzin"], ["Manuel"], ["Hatchback", "Sedan"], ["1.2", "1.4"], ["65 hp", "77 hp"])
      ] },
      { name: "Tempra / Tipo", models: [
        model("Tempra", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6", "2.0"], ["90 hp", "148 hp"]),
        model("Tipo", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4", "1.6", "2.0"], ["72 hp", "90 hp", "148 hp"]),
        model("SX", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.6"], ["90 hp"]),
        model("SX AK", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.6"], ["90 hp"]),
        model("2.0 16V", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["2.0"], ["148 hp"])
      ] },
      { name: "Marea / Brava", models: [
        model("Marea", ["Benzin", "Dizel"], ["Manuel"], ["Sedan"], ["1.6", "1.9", "2.0"], ["103 hp", "105 hp", "147 hp"]),
        model("Brava", ["Benzin", "Dizel"], ["Manuel"], ["Hatchback"], ["1.6", "1.9"], ["103 hp", "105 hp"]),
        model("Liberty", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback"], ["1.6"], ["103 hp"]),
        model("Exclusive", ["Benzin"], ["Manuel"], ["Sedan"], ["2.0"], ["147 hp"])
      ] },
      { name: "Uno / Palio Go", models: [
        model("Uno", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.0", "1.4"], ["50 hp", "70 hp"]),
        model("Palio Go", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.4"], ["77 hp"])
      ] },
      { name: "Doblo Bursa Ãœretimi", models: [
        model("1. Nesil", ["Dizel", "Benzin"], ["Manuel"], ["Hafif Ticari"], ["1.3", "1.4", "1.9"], ["75 hp", "77 hp", "105 hp"]),
        model("2. Nesil", ["Dizel", "Benzin"], ["Manuel"], ["Hafif Ticari"], ["1.3", "1.6"], ["90 hp", "105 hp"]),
        model("3. Nesil", ["Dizel"], ["Manuel"], ["Hafif Ticari"], ["1.6"], ["105 hp", "120 hp"]),
        model("4. Nesil", ["Dizel"], ["Manuel", "Otomatik"], ["Hafif Ticari"], ["1.5"], ["100 hp", "130 hp"]),
        model("Premio", ["Dizel"], ["Manuel"], ["Hafif Ticari"], ["1.6"], ["120 hp"]),
        model("Trekking", ["Dizel"], ["Manuel"], ["Hafif Ticari"], ["1.6"], ["120 hp"])
      ] },
      { name: "Fiorino", models: [
        model("Pop", ["Benzin", "Dizel"], ["Manuel"], ["Hafif Ticari"], ["1.3", "1.4"], ["77 hp", "95 hp"]),
        model("Safeline", ["Benzin", "Dizel"], ["Manuel"], ["Hafif Ticari"], ["1.3", "1.4"], ["77 hp", "95 hp"]),
        model("Premio", ["Benzin", "Dizel"], ["Manuel"], ["Hafif Ticari"], ["1.3", "1.4"], ["77 hp", "95 hp"])
      ] },
      { name: "GSR", models: [
        model("Guvenlik Paketi", ["Benzin", "Dizel", "Hibrit"], ["Manuel", "Otomatik"], ["Sedan", "Crossover"], ["1.4", "1.5", "1.6"], ["95 hp", "130 hp"])
      ] },
      { name: "DCT", models: [
        model("Cift Kavramali Otomatik", ["Dizel", "Hibrit"], ["Otomatik"], ["Sedan", "Crossover", "Station Wagon"], ["1.5", "1.6"], ["130 hp"])
      ] },
      { name: "Multijet / Firefly", models: [
        model("Multijet", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Hafif Ticari"], ["1.3", "1.6"], ["95 hp", "130 hp"]),
        model("Firefly", ["Benzin", "Hibrit"], ["Manuel", "Otomatik"], ["SUV", "Crossover"], ["1.0", "1.2", "1.5"], ["70 hp", "100 hp", "130 hp"])
      ] },
      { name: "i.e.", models: [
        model("Enjeksiyonlu", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon"], ["1.6"], ["95 hp"])
      ] }
    ]
  },
  {
    name: "Togg",
    series: [
      { name: "T10X Serisi", models: [
        model("V1 RWD Standart Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"]),
        model("314 km WLTP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"]),
        model("V1 RWD Uzun Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"]),
        model("523 km WLTP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"]),
        model("V2 RWD Uzun Menzil", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["218 hp"]),
        model("V2 4More AWD / Obsidiyen", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["435 hp"]),
        model("435 HP", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["435 hp"]),
        model("AWD", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["435 hp"]),
        model("0-100 4.8 sn", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["435 hp"])
      ] },
      { name: "T10F Serisi", models: [
        model("T10F RWD Standart", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["218 hp"]),
        model("T10F RWD Uzun Menzil", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["218 hp"]),
        model("623 km", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["218 hp"]),
        model("T10F AWD / 4More", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["435 hp"]),
        model("320 kW", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["435 hp"]),
        model("435 HP", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["435 hp"])
      ] },
      { name: "T8X", models: [
        model("B-SUV", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["180 hp"])
      ] },
      { name: "T6X", models: [
        model("T6X", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["200 hp"])
      ] },
      { name: "T6F", models: [
        model("T6F", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["200 hp"])
      ] },
      { name: "T8B", models: [
        model("T8B", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["180 hp"])
      ] },
      { name: "T8CX", models: [
        model("T8CX", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["190 hp"])
      ] },
      { name: "T12X", models: [
        model("T12X", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["250 hp"])
      ] },
      { name: "T12F", models: [
        model("T12F", ["Elektrik"], ["Otomatik"], ["Fastback"], ["0"], ["250 hp"])
      ] },
      { name: "Trumore", models: [
        model("Trumore", ["Elektrik"], ["Otomatik"], ["SUV", "Fastback"], ["0"], ["218 hp", "435 hp"])
      ] },
      { name: "V2L / Vehicle-to-Load", models: [
        model("Vehicle-to-Load", ["Elektrik"], ["Otomatik"], ["SUV", "Fastback"], ["0"], ["218 hp", "435 hp"])
      ] },
      { name: "Yapay Zeka Kamerasi", models: [
        model("Yapay Zeka Kamerasi", ["Elektrik"], ["Otomatik"], ["SUV", "Fastback"], ["0"], ["218 hp", "435 hp"])
      ] },
      { name: "Uctan Uca Ekran", models: [
        model("Uctan Uca Ekran", ["Elektrik"], ["Otomatik"], ["SUV", "Fastback"], ["0"], ["218 hp", "435 hp"])
      ] },
      { name: "T10S", models: [
        model("T10S", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["220 hp"])
      ] },
      { name: "T10C", models: [
        model("T10C", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["220 hp"])
      ] },
      { name: "T10 Coupe", models: [
        model("T10 Coupe", ["Elektrik"], ["Otomatik"], ["Coupe"], ["0"], ["220 hp"])
      ] }
    ]
  },
  {
    name: "Tesla",
    series: [
      { name: "Model Y", models: [
        model("Juniper Refresh", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["299 hp", "384 hp", "534 hp"]),
        model("RWD", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["299 hp"]),
        model("Long Range AWD", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["384 hp"]),
        model("Performance", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["534 hp"]),
        model("82 kWh", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["384 hp"]),
        model("Hardware 4.5", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["384 hp"])
      ] },
      { name: "Model 3", models: [
        model("Highland", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["283 hp", "498 hp"]),
        model("RWD", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["283 hp"]),
        model("Long Range", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["498 hp"]),
        model("Performance", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["510 hp"]),
        model("Ludicrous Mode", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["510 hp"])
      ] },
      { name: "Model S", models: [
        model("Long Range", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["670 hp"]),
        model("Plaid", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["1020 hp"]),
        model("Legacy Series", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["670 hp", "1020 hp"])
      ] },
      { name: "Model X", models: [
        model("Long Range", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["670 hp"]),
        model("Plaid", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["1020 hp"]),
        model("Legacy Series", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["670 hp", "1020 hp"])
      ] },
      { name: "Cybertruck", models: [
        model("AWD", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["600 hp"]),
        model("Cyberbeast", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["845 hp"]),
        model("Global", ["Elektrik"], ["Otomatik"], ["Pickup"], ["0"], ["600 hp", "845 hp"])
      ] },
      { name: "Roadster", models: [
        model("SpaceX Package", ["Elektrik"], ["Otomatik"], ["Roadster"], ["0"], ["1000+ hp"]),
        model("0-100 km/s Alti 2 sn", ["Elektrik"], ["Otomatik"], ["Roadster"], ["0"], ["1000+ hp"]),
        model("Super Sport", ["Elektrik"], ["Otomatik"], ["Roadster"], ["0"], ["1000+ hp"])
      ] },
      { name: "Model 2 / Compact Tesla", models: [
        model("Ekonomik Hatchback", ["Elektrik"], ["Otomatik"], ["Hatchback"], ["0"], ["200 hp"]),
        model("Compact Crossover", ["Elektrik"], ["Otomatik"], ["Crossover"], ["0"], ["200 hp"]),
        model("Yuksek Otonomi", ["Elektrik"], ["Otomatik"], ["Hatchback", "Crossover"], ["0"], ["200 hp"])
      ] },
      { name: "FSD Supervised", models: [
        model("Tam Otonom Surus", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV", "Pickup"], ["0"], ["283 hp", "1020 hp"])
      ] },
      { name: "Hardware 4.5 / 5.0", models: [
        model("Hardware 4.5", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV", "Pickup"], ["0"], ["283 hp", "845 hp"]),
        model("Hardware 5.0", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV", "Pickup"], ["0"], ["283 hp", "845 hp"])
      ] },
      { name: "V2L", models: [
        model("Vehicle-to-Load", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV", "Pickup"], ["0"], ["283 hp", "845 hp"])
      ] },
      { name: "Heat Pump", models: [
        model("Isi Pompasi", ["Elektrik"], ["Otomatik"], ["Sedan", "SUV", "Pickup"], ["0"], ["283 hp", "845 hp"])
      ] },
      { name: "Semi", models: [
        model("Semi", ["Elektrik"], ["Otomatik"], ["Agir Vasıta"], ["0"], ["1000+ hp"])
      ] },
      { name: "Model Y RWD", models: [
        model("Model Y RWD", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["299 hp"])
      ] },
      { name: "Model Y Long Range", models: [
        model("Model Y Long Range", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["384 hp"])
      ] },
      { name: "Model Y Performance", models: [
        model("Model Y Performance", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["534 hp"])
      ] },
      { name: "Model 3 Standard Range", models: [
        model("Model 3 Standard Range", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["283 hp"])
      ] },
      { name: "Model 3 Long Range AWD", models: [
        model("Model 3 Long Range AWD", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["498 hp"])
      ] },
      { name: "Model 3 Performance", models: [
        model("Model 3 Performance", ["Elektrik"], ["Otomatik"], ["Sedan"], ["0"], ["510 hp"])
      ] }
    ]
  },
  {
    name: "Volvo",
    series: [
      { name: "C30", models: [
        model("1.6", ["Benzin"], ["Manuel"], ["Coupe"], ["1.6"], ["100 hp"]),
        model("1.6 D", ["Dizel"], ["Manuel"], ["Coupe"], ["1.6"], ["109 hp"])
      ] },
      { name: "C70", models: [
        model("2.0 D", ["Dizel"], ["Manuel", "Otomatik"], ["Cabrio"], ["2.0"], ["136 hp"]),
        model("2.0 T", ["Benzin"], ["Otomatik"], ["Cabrio"], ["2.0"], ["180 hp"]),
        model("2.3", ["Benzin"], ["Otomatik"], ["Cabrio"], ["2.3"], ["240 hp"]),
        model("2.5", ["Benzin"], ["Otomatik"], ["Cabrio"], ["2.5"], ["220 hp"])
      ] },
      { name: "S40", models: [
        model("1.6", ["Benzin"], ["Manuel"], ["Sedan"], ["1.6"], ["100 hp"]),
        model("1.6 D", ["Dizel"], ["Manuel"], ["Sedan"], ["1.6"], ["109 hp"]),
        model("1.8", ["Benzin"], ["Manuel"], ["Sedan"], ["1.8"], ["125 hp"]),
        model("1.9 T4", ["Benzin"], ["Manuel"], ["Sedan"], ["1.9"], ["200 hp"]),
        model("2.0", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["145 hp"]),
        model("2.0 D", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0"], ["136 hp"]),
        model("2.0 T", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["180 hp"]),
        model("2.0 T4", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.0"], ["190 hp"]),
        model("2.4", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.4"], ["170 hp"]),
        model("2.5 T5", ["Benzin"], ["Otomatik"], ["Sedan"], ["2.5"], ["220 hp"])
      ] },
      { name: "S60", models: [
        model("S60", ["Benzin", "Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Sedan"], ["2.0"], ["163 hp", "197 hp", "455 hp"])
      ] },
      { name: "S70", models: [
        model("S70", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], ["2.0", "2.5"], ["126 hp", "170 hp"])
      ] },
      { name: "S80", models: [
        model("S80", ["Benzin", "Dizel"], ["Otomatik", "Manuel"], ["Sedan"], ["2.0", "2.5", "3.0"], ["163 hp", "238 hp"])
      ] },
      { name: "S90", models: [
        model("S90", ["Benzin", "Hibrit"], ["Otomatik"], ["Sedan"], ["2.0"], ["250 hp", "455 hp"])
      ] },
      { name: "V40", models: [
        model("V40", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], ["1.6", "2.0"], ["120 hp", "190 hp"])
      ] },
      { name: "V40 Cross Country", models: [
        model("V40 Cross Country", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Crossover"], ["1.6", "2.0"], ["120 hp", "190 hp"])
      ] },
      { name: "V50", models: [
        model("V50", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Station Wagon"], ["1.6", "2.0", "2.4"], ["100 hp", "170 hp"])
      ] },
      { name: "V60", models: [
        model("V60", ["Benzin", "Dizel", "Hibrit"], ["Otomatik", "Manuel"], ["Station Wagon"], ["2.0"], ["197 hp", "455 hp"])
      ] },
      { name: "V60 Cross Country", models: [
        model("V60 Cross Country", ["Benzin", "Dizel"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["197 hp", "250 hp"])
      ] },
      { name: "V70", models: [
        model("V70", ["Benzin", "Dizel"], ["Otomatik", "Manuel"], ["Station Wagon"], ["2.0", "2.4", "2.5"], ["140 hp", "231 hp"])
      ] },
      { name: "V90 Cross Country", models: [
        model("V90 Cross Country", ["Benzin", "Dizel", "Hibrit"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["250 hp", "455 hp"])
      ] },
      { name: "440", models: [
        model("440", ["Benzin"], ["Manuel"], ["Hatchback"], ["1.7"], ["102 hp"])
      ] },
      { name: "740", models: [
        model("740", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["2.0", "2.3"], ["115 hp", "155 hp"])
      ] },
      { name: "850", models: [
        model("850", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["2.0", "2.3", "2.5"], ["126 hp", "250 hp"])
      ] },
      { name: "940", models: [
        model("940", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], ["2.0", "2.3"], ["112 hp", "165 hp"])
      ] },
      { name: "960", models: [
        model("960", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], ["2.5", "3.0"], ["170 hp", "204 hp"])
      ] },
      { name: "XC40", models: [
        model("XC40", ["Benzin", "Hibrit", "Elektrik"], ["Otomatik"], ["SUV"], ["0", "1.5", "2.0"], ["197 hp", "231 hp", "408 hp"])
      ] },
      { name: "XC60", models: [
        model("XC60", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["250 hp", "455 hp"])
      ] },
      { name: "XC70", models: [
        model("XC70", ["Benzin", "Dizel"], ["Otomatik"], ["Station Wagon"], ["2.0", "2.4"], ["163 hp", "215 hp"])
      ] },
      { name: "XC90", models: [
        model("XC90", ["Benzin", "Hibrit"], ["Otomatik"], ["SUV"], ["2.0"], ["250 hp", "455 hp"])
      ] },
      { name: "EX30", models: [
        model("EX30", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["272 hp", "428 hp"])
      ] },
      { name: "EX40", models: [
        model("EX40", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["238 hp", "408 hp"])
      ] },
      { name: "EC40", models: [
        model("EC40", ["Elektrik"], ["Otomatik"], ["SUV Coupe"], ["0"], ["238 hp", "408 hp"])
      ] },
      { name: "EX90", models: [
        model("EX90", ["Elektrik"], ["Otomatik"], ["SUV"], ["0"], ["408 hp", "517 hp"])
      ] },
      { name: "V90", models: [
        model("V90", ["Benzin", "Hibrit"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["250 hp", "455 hp"])
      ] },
      { name: "S90 Recharge", models: [
        model("S90 Recharge", ["Hibrit"], ["Otomatik"], ["Sedan"], ["2.0"], ["455 hp"])
      ] },
      { name: "V60 Recharge", models: [
        model("V60 Recharge", ["Hibrit"], ["Otomatik"], ["Station Wagon"], ["2.0"], ["455 hp"])
      ] }
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
