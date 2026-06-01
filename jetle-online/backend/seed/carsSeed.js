require("dotenv").config();

const mongoose = require("mongoose");
const CarBrand = require("../models/CarBrand");

function model(name, fuel = ["Benzin"], transmission = ["Otomatik"], body = ["Sedan"], engine = "1.6", hp = "120hp") {
  return { name, fuel, transmission, body, engine, hp };
}

const data = [
  {
    name: "Abarth",
    series: [
      { name: "124 Spider", models: [model("124 Spider", ["Benzin"], ["Otomatik"], ["Cabrio"], "1.4", "170hp"), model("124 Spider Turismo", ["Benzin"], ["Otomatik"], ["Cabrio"], "1.4", "170hp")] },
      { name: "500e", models: [model("500e Cabrio", ["Elektrik"], ["Otomatik"], ["Cabrio"], "Elektrik", "155hp"), model("500e Scorpionissima", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "155hp"), model("500e Turismo", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "155hp")] },
      { name: "595", models: [model("595", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "145hp"), model("595 Turismo", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "165hp"), model("595 Competizione", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "180hp"), model("595 Esseesse", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "180hp")] },
      { name: "600e", models: [model("600e Turismo", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "240hp"), model("600e Scorpionissima", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "240hp")] },
      { name: "695", models: [model("695", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "180hp"), model("695 Turismo", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "180hp"), model("695 Competizione", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "180hp"), model("695 Biposto", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "190hp")] },
      { name: "Punto", models: [model("Grande Punto Abarth", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "155hp"), model("Punto Evo Abarth", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "165hp")] }
    ]
  },
  {
    name: "Acura",
    series: [
      { name: "CL", models: [model("CL", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "200hp"), model("CL Type S", ["Benzin"], ["Otomatik"], ["Coupe"], "3.2", "260hp")] },
      { name: "CDX", models: [model("CDX", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "182hp")] },
      { name: "CSX", models: [model("CSX", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "155hp"), model("CSX Type S", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "197hp")] },
      { name: "EL", models: [model("EL", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "127hp")] },
      { name: "ILX", models: [model("2.0", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("ILX", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("ILX A-Spec", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "201hp"), model("ILX Premium", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "201hp")] },
      { name: "Integra", models: [model("Integra", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe", "Sedan"], "1.8", "142hp"), model("Integra GS", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe", "Sedan"], "1.8", "170hp"), model("Integra LS", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe", "Sedan"], "1.8", "140hp"), model("Integra Type R", ["Benzin"], ["Manuel"], ["Coupe"], "1.8", "195hp"), model("Integra A-Spec", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.5", "200hp"), model("Integra Type S", ["Benzin"], ["Manuel"], ["Hatchback"], "2.0", "320hp")] },
      { name: "Legend", models: [model("Legend", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "205hp"), model("Legend Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.2", "230hp")] },
      { name: "MDX", models: [model("MDX", ["Benzin"], ["Otomatik"], ["SUV"], "3.5", "290hp"), model("MDX SH-AWD", ["Benzin"], ["Otomatik"], ["SUV"], "3.5", "290hp"), model("MDX Type S", ["Benzin"], ["Otomatik"], ["SUV"], "3.0", "355hp")] },
      { name: "NSX", models: [model("NSX", ["Benzin", "Hibrit"], ["Otomatik"], ["Coupe"], "3.5", "573hp"), model("NSX Type S", ["Hibrit"], ["Otomatik"], ["Coupe"], "3.5", "600hp")] },
      { name: "RDX", models: [model("RDX", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "272hp"), model("RDX A-Spec", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "272hp")] },
      { name: "RL", models: [model("RL", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "300hp")] },
      { name: "RLX", models: [model("RLX", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "310hp"), model("RLX Sport Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], "3.5", "377hp")] },
      { name: "RSX", models: [model("RSX", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], "2.0", "160hp"), model("RSX Type S", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "200hp")] },
      { name: "SLX", models: [model("SLX", ["Benzin"], ["Otomatik"], ["SUV"], "3.2", "190hp")] },
      { name: "TL", models: [model("TL", ["Benzin"], ["Otomatik"], ["Sedan"], "3.2", "258hp"), model("TL Type S", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "286hp")] },
      { name: "TLX", models: [model("TLX", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "272hp"), model("TLX A-Spec", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "272hp"), model("TLX Type S", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "355hp")] },
      { name: "TSX", models: [model("TSX", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "201hp"), model("TSX Sport Wagon", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.4", "201hp")] },
      { name: "Vigor", models: [model("Vigor", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "176hp")] },
      { name: "ZDX", models: [model("ZDX", ["Benzin", "Elektrik"], ["Otomatik"], ["SUV"], "3.7", "300hp"), model("ZDX Type S", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "500hp")] }
    ]
  },
  {
    name: "Alfa Romeo",
    series: [
      { name: "33", models: [model("1.5", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "95hp"), model("1.7", ["Benzin"], ["Manuel"], ["Hatchback"], "1.7", "132hp"), model("33", ["Benzin"], ["Manuel"], ["Hatchback"], "1.7", "132hp"), model("33 Sportwagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.7", "132hp")] },
      { name: "75", models: [model("1.8 T", ["Benzin"], ["Manuel"], ["Sedan"], "1.8", "165hp"), model("2.0", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "148hp"), model("75 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "148hp")] },
      { name: "145", models: [model("1.4", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "90hp"), model("1.4 TB", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "120hp"), model("1.6", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "103hp"), model("1.6 JTD", ["Dizel"], ["Manuel"], ["Hatchback"], "1.6", "120hp"), model("1.7", ["Benzin"], ["Manuel"], ["Hatchback"], "1.7", "129hp"), model("145 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "103hp")] },
      { name: "146", models: [model("1.4", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "90hp"), model("1.6", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "103hp"), model("146 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "103hp"), model("2.0 Ti", ["Benzin"], ["Manuel"], ["Hatchback"], "2.0", "150hp")] },
      { name: "147", models: [model("1.6 TS", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "120hp"), model("147 3 Kapı", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "120hp"), model("147 5 Kapı", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.6", "120hp"), model("147 GTA", ["Benzin"], ["Manuel"], ["Hatchback"], "3.2", "250hp"), model("2.0 TS", ["Benzin"], ["Manuel"], ["Hatchback"], "2.0", "150hp")] },
      { name: "155", models: [model("2.0", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "141hp"), model("155 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "141hp"), model("TS", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "141hp"), model("TS Super Losso", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "141hp")] },
      { name: "156", models: [model("1.6 TS", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "120hp"), model("1.9 JTD", ["Dizel"], ["Manuel"], ["Sedan"], "1.9", "115hp"), model("156 Crosswagon Q4", ["Dizel"], ["Manuel"], ["Station Wagon"], "1.9", "150hp"), model("156 Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], "2.0", "155hp"), model("156 Sportwagon", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], "2.0", "155hp"), model("2.0 JTS", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "165hp"), model("2.0 TS", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "155hp"), model("2.5", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "190hp")] },
      { name: "159", models: [model("1.8 MPI", ["Benzin"], ["Manuel"], ["Sedan"], "1.8", "140hp"), model("1.9 JTD", ["Dizel"], ["Manuel"], ["Sedan"], "1.9", "150hp"), model("1.9 JTS", ["Benzin"], ["Manuel"], ["Sedan"], "1.9", "160hp"), model("159 Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], "1.9", "160hp"), model("159 Sportwagon", ["Benzin"], ["Manuel", "Otomatik"], ["Station Wagon"], "1.9", "160hp")] },
      { name: "164", models: [model("164 Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], "3.0", "192hp")] },
      { name: "166", models: [model("2.0", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "155hp"), model("3.0", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "220hp"), model("166 Sedan", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], "2.0", "155hp")] },
      { name: "4C", models: [model("4C Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "1.7", "240hp"), model("4C Spider", ["Benzin"], ["Otomatik"], ["Cabrio"], "1.7", "240hp")] },
      { name: "8C", models: [model("8C Competizione", ["Benzin"], ["Otomatik"], ["Coupe"], "4.7", "450hp"), model("8C Spider", ["Benzin"], ["Otomatik"], ["Cabrio"], "4.7", "450hp")] },
      { name: "Alfasud", models: [model("Alfasud Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "95hp"), model("Alfasud Sprint", ["Benzin"], ["Manuel"], ["Coupe"], "1.5", "105hp")] },
      { name: "Alfetta", models: [model("Alfetta Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "130hp"), model("Alfetta GT", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "131hp"), model("Alfetta GTV", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "150hp")] },
      { name: "Brera", models: [model("2.2 JTS", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], "2.2", "185hp"), model("Brera Coupe", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], "2.2", "185hp"), model("JTS Sky Window", ["Benzin"], ["Otomatik"], ["Coupe"], "2.2", "185hp")] },
      { name: "Giulia", models: [model("2.0 T", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "200hp"), model("Giulia Sedan", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], "2.0", "200hp"), model("Giulia Quadrifoglio", ["Benzin"], ["Otomatik"], ["Sedan"], "2.9", "510hp"), model("Giulia GT", ["Benzin"], ["Manuel"], ["Coupe"], "1.6", "109hp"), model("Giulia GTV", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "150hp"), model("Giulia Nuova Super", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "98hp")] },
      { name: "Giulia Quadrifoglio", models: [model("2.9", ["Benzin"], ["Otomatik"], ["Sedan"], "2.9", "510hp")] },
      { name: "Giulietta", models: [model("Giulietta Hatchback", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "120hp"), model("Giulietta Sprint", ["Benzin"], ["Manuel"], ["Coupe"], "1.3", "90hp"), model("Giulietta Spider", ["Benzin"], ["Manuel"], ["Cabrio"], "1.3", "90hp")] },
      { name: "GT", models: [model("1.9 JTD", ["Dizel"], ["Manuel"], ["Coupe"], "1.9", "150hp"), model("2.0 JTS", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "165hp"), model("GT Coupe", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], "2.0", "165hp")] },
      { name: "GTV", models: [model("2.0 TB", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "200hp"), model("GTV Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "150hp"), model("TS", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "150hp")] },
      { name: "Junior", models: [model("Junior Elettrica", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "156hp"), model("Junior Ibrida", ["Hibrit"], ["Otomatik"], ["SUV"], "1.2", "136hp")] },
      { name: "MiTo", models: [model("1.3 JTD", ["Dizel"], ["Manuel"], ["Hatchback"], "1.3", "95hp"), model("1.4 T", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "155hp"), model("1.6 JTD", ["Dizel"], ["Manuel"], ["Hatchback"], "1.6", "120hp"), model("MiTo Hatchback", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "105hp"), model("MiTo Quadrifoglio Verde", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "170hp")] },
      { name: "Montreal", models: [model("Montreal Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "2.6", "200hp")] },
      { name: "Spider", models: [model("2.0 TS", ["Benzin"], ["Manuel"], ["Cabrio"], "2.0", "150hp"), model("Spider 916", ["Benzin"], ["Manuel"], ["Cabrio"], "2.0", "150hp"), model("Spider 939", ["Benzin"], ["Manuel", "Otomatik"], ["Cabrio"], "2.2", "185hp"), model("Spider Duetto", ["Benzin"], ["Manuel"], ["Cabrio"], "1.6", "109hp")] },
      { name: "Sprint", models: [model("1.7 ds", ["Dizel"], ["Manuel"], ["Coupe"], "1.7", "95hp")] },
      { name: "Stelvio", models: [model("Stelvio SUV", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "2.0", "200hp"), model("Stelvio Quadrifoglio", ["Benzin"], ["Otomatik"], ["SUV"], "2.9", "510hp")] },
      { name: "Tonale", models: [model("Tonale Mild Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "160hp"), model("Tonale Plug-in Hybrid Q4", ["Hibrit"], ["Otomatik"], ["SUV"], "1.3", "280hp")] }
    ]
  },
  {
    name: "Alpine",
    series: [
      { name: "A106", models: [model("A106 Cabriolet", ["Benzin"], ["Manuel"], ["Cabrio"], "0.9", "43hp"), model("A106 Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "0.9", "43hp")] },
      { name: "A108", models: [model("A108 Cabriolet", ["Benzin"], ["Manuel"], ["Cabrio"], "1.0", "55hp"), model("A108 Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "1.0", "55hp")] },
      { name: "A110 Classic", models: [model("A110 Berlinette", ["Benzin"], ["Manuel"], ["Coupe"], "1.6", "125hp"), model("A110 Cabriolet", ["Benzin"], ["Manuel"], ["Cabrio"], "1.6", "125hp")] },
      { name: "A110 Modern", models: [model("A110 GT", ["Benzin"], ["Otomatik"], ["Coupe"], "1.8", "300hp"), model("A110 Legende", ["Benzin"], ["Otomatik"], ["Coupe"], "1.8", "252hp"), model("A110 Pure", ["Benzin"], ["Otomatik"], ["Coupe"], "1.8", "252hp"), model("A110 R", ["Benzin"], ["Otomatik"], ["Coupe"], "1.8", "300hp"), model("A110 S", ["Benzin"], ["Otomatik"], ["Coupe"], "1.8", "300hp")] },
      { name: "A290", models: [model("A290 GT", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "180hp"), model("A290 GT Performance", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "220hp"), model("A290 GTS", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "220hp"), model("A290 Hatchback", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "220hp")] },
      { name: "A310", models: [model("A310 L4", ["Benzin"], ["Manuel"], ["Coupe"], "1.6", "127hp"), model("A310 V6", ["Benzin"], ["Manuel"], ["Coupe"], "2.7", "150hp")] },
      { name: "A610", models: [model("A610 Turbo Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "3.0", "250hp")] },
      { name: "GTA", models: [model("GTA V6 GT", ["Benzin"], ["Manuel"], ["Coupe"], "2.8", "160hp"), model("GTA V6 Turbo", ["Benzin"], ["Manuel"], ["Coupe"], "2.5", "200hp")] }
    ]
  },
  {
    name: "Anadol",
    series: [
      { name: "A1", models: [model("A1 Mk I", ["Benzin"], ["Manuel"], ["Sedan"], "1.2", "58hp"), model("A1 Mk II", ["Benzin"], ["Manuel"], ["Sedan"], "1.3", "63hp")] },
      { name: "A2", models: [model("A2 Sedan SL", ["Benzin"], ["Manuel"], ["Sedan"], "1.3", "63hp")] },
      { name: "A4 STC-16", models: [model("STC-16 Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "1.6", "68hp")] },
      { name: "A5 SV-1600", models: [model("SV-1600 Station Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.6", "68hp")] },
      { name: "A6 Böcek", models: [model("Böcek Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "1.3", "63hp")] },
      { name: "A8 / 16", models: [model("A8 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "68hp")] },
      { name: "P2 Kamyonet", models: [model("P2 Otosan Kamyonet", ["Benzin"], ["Manuel"], ["Pickup"], "1.6", "68hp")] }
    ]
  },
  {
    name: "Arora",
    series: [
      { name: "Beatrix", models: [model("Beatrix 150", ["Benzin"], ["Manuel"], ["Motosiklet"], "150cc", "12hp")] },
      { name: "CG", models: [model("CG 100", ["Benzin"], ["Manuel"], ["Motosiklet"], "100cc", "8hp"), model("CG 125", ["Benzin"], ["Manuel"], ["Motosiklet"], "125cc", "10hp"), model("CG 150", ["Benzin"], ["Manuel"], ["Motosiklet"], "150cc", "12hp")] },
      { name: "Cappucino", models: [model("Cappucino 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp"), model("Cappucino 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp")] },
      { name: "Commander", models: [model("Commander 150 ATV", ["Benzin"], ["Otomatik"], ["ATV"], "150cc", "10hp"), model("Commander 200 ATV", ["Benzin"], ["Otomatik"], ["ATV"], "200cc", "14hp")] },
      { name: "Derya", models: [model("Derya Üç Tekerlekli", ["Elektrik"], ["Otomatik"], ["Elektrikli"], "Elektrik", "3hp")] },
      { name: "Formula", models: [model("Formula 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp")] },
      { name: "Freedom", models: [model("Freedom 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp"), model("Freedom 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp")] },
      { name: "Grizzly", models: [model("Grizzly 125", ["Benzin"], ["Manuel"], ["Motosiklet"], "125cc", "10hp"), model("Grizzly 200", ["Benzin"], ["Manuel"], ["Motosiklet"], "200cc", "15hp")] },
      { name: "Hunter", models: [model("Hunter 150 ATV", ["Benzin"], ["Otomatik"], ["ATV"], "150cc", "10hp"), model("Hunter 200 ATV", ["Benzin"], ["Otomatik"], ["ATV"], "200cc", "14hp")] },
      { name: "Hummer", models: [model("Hummer 125 ATV", ["Benzin"], ["Otomatik"], ["ATV"], "125cc", "9hp"), model("Hummer 250 ATV", ["Benzin"], ["Otomatik"], ["ATV"], "250cc", "18hp")] },
      { name: "Karia", models: [model("Karia 125", ["Benzin"], ["Manuel"], ["Motosiklet"], "125cc", "10hp")] },
      { name: "M6 M8 M9", models: [model("M6 Elektrikli", ["Elektrik"], ["Otomatik"], ["Elektrikli"], "Elektrik", "3hp"), model("M8 Elektrikli", ["Elektrik"], ["Otomatik"], ["Elektrikli"], "Elektrik", "4hp")] },
      { name: "Max T", models: [model("Max T 150", ["Benzin"], ["Otomatik"], ["Maxi Scooter"], "150cc", "12hp"), model("Max T 350", ["Benzin"], ["Otomatik"], ["Maxi Scooter"], "350cc", "28hp")] },
      { name: "S1 S2 S3", models: [model("S1 Elektrikli", ["Elektrik"], ["Otomatik"], ["Elektrikli"], "Elektrik", "2hp"), model("S2 Elektrikli", ["Elektrik"], ["Otomatik"], ["Elektrikli"], "Elektrik", "2hp"), model("S3 Elektrikli", ["Elektrik"], ["Otomatik"], ["Elektrikli"], "Elektrik", "3hp")] },
      { name: "Safari", models: [model("Safari 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp")] },
      { name: "Sultan", models: [model("Sultan 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp"), model("Sultan 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp")] },
      { name: "Tiger", models: [model("Tiger 200", ["Benzin"], ["Manuel"], ["Motosiklet"], "200cc", "15hp")] },
      { name: "Vesta", models: [model("Vesta 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp")] },
      { name: "Verona", models: [model("Verona 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp"), model("Verona 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp")] },
      { name: "Z003 Z004 Z005", models: [model("Z003 Elektrikli", ["Elektrik"], ["Otomatik"], ["Elektrikli"], "Elektrik", "2hp"), model("Z004 Elektrikli", ["Elektrik"], ["Otomatik"], ["Elektrikli"], "Elektrik", "2hp")] },
      { name: "Zenzero", models: [model("Zenzero 150", ["Benzin"], ["Otomatik"], ["Maxi Scooter"], "150cc", "12hp")] },
      { name: "ZR", models: [model("ZR 100", ["Benzin"], ["Manuel"], ["Motosiklet"], "100cc", "8hp"), model("ZR 125", ["Benzin"], ["Manuel"], ["Motosiklet"], "125cc", "10hp")] }
    ]
  },
  {
    name: "Aston Martin",
    series: [
      { name: "Cygnet", models: [model("Cygnet Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.3", "98hp")] },
      { name: "DB1", models: [model("DB1 Sport", ["Benzin"], ["Manuel"], ["Roadster"], "2.0", "90hp")] },
      { name: "DB2", models: [model("DB2 Drophead Coupe", ["Benzin"], ["Manuel"], ["Convertible"], "2.6", "125hp"), model("DB2 Saloon", ["Benzin"], ["Manuel"], ["Coupe"], "2.6", "125hp")] },
      { name: "DB3", models: [model("DB3", ["Benzin"], ["Manuel"], ["Roadster"], "2.6", "133hp"), model("DB3S", ["Benzin"], ["Manuel"], ["Roadster"], "2.9", "180hp")] },
      { name: "DB4", models: [model("DB4 Convertible", ["Benzin"], ["Manuel"], ["Convertible"], "3.7", "240hp"), model("DB4 GT", ["Benzin"], ["Manuel"], ["Coupe"], "3.7", "302hp"), model("DB4 Saloon", ["Benzin"], ["Manuel"], ["Coupe"], "3.7", "240hp"), model("DB4 Zagato", ["Benzin"], ["Manuel"], ["Coupe"], "3.7", "314hp")] },
      { name: "DB5", models: [model("DB5 Convertible", ["Benzin"], ["Manuel"], ["Convertible"], "4.0", "282hp"), model("DB5 Saloon", ["Benzin"], ["Manuel"], ["Coupe"], "4.0", "282hp"), model("DB5 Vantage", ["Benzin"], ["Manuel"], ["Coupe"], "4.0", "325hp")] },
      { name: "DB6", models: [model("DB6 Saloon", ["Benzin"], ["Manuel"], ["Coupe"], "4.0", "282hp"), model("DB6 Volante", ["Benzin"], ["Manuel"], ["Convertible"], "4.0", "282hp")] },
      { name: "DB7", models: [model("DB7 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.2", "335hp"), model("DB7 Vantage Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "420hp"), model("DB7 Vantage Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "5.9", "420hp"), model("DB7 Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "3.2", "335hp")] },
      { name: "DB9", models: [model("DB9 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "470hp"), model("DB9 GT 007 Bond Edition", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "540hp"), model("DB9 Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "5.9", "470hp")] },
      { name: "DB11", models: [model("DB11 AMR", ["Benzin"], ["Otomatik"], ["Coupe"], "5.2", "639hp"), model("DB11 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "535hp"), model("DB11 Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "4.0", "535hp")] },
      { name: "DB12", models: [model("DB12 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "680hp"), model("DB12 S Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "700hp"), model("DB12 Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "4.0", "680hp")] },
      { name: "DBS", models: [model("DBS Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "517hp"), model("DBS Superleggera Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.2", "725hp"), model("DBS Superleggera Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "5.2", "725hp"), model("DBS Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "5.9", "517hp")] },
      { name: "DBX", models: [model("DBX S SUV", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "727hp"), model("DBX SUV", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "550hp"), model("DBX707 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "707hp")] },
      { name: "Lagonda", models: [model("Lagonda Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.3", "280hp"), model("Lagonda Taraf", ["Benzin"], ["Otomatik"], ["Sedan"], "5.9", "540hp")] },
      { name: "One-77", models: [model("One-77 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "7.3", "750hp")] },
      { name: "Rapide", models: [model("Rapide AMR", ["Benzin"], ["Otomatik"], ["Sedan"], "5.9", "603hp"), model("Rapide S Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.9", "560hp"), model("Rapide Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.9", "477hp"), model("V12 Rapide", ["Benzin"], ["Otomatik"], ["Sedan"], "5.9", "477hp"), model("V12 Rapide AMR", ["Benzin"], ["Otomatik"], ["Sedan"], "5.9", "603hp"), model("V12 Rapide S", ["Benzin"], ["Otomatik"], ["Sedan"], "5.9", "560hp")] },
      { name: "V12 Speedster", models: [model("V12 Speedster Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "5.2", "700hp")] },
      { name: "Valhalla", models: [model("Valhalla Coupe", ["Hibrit"], ["Otomatik"], ["Coupe"], "4.0", "937hp")] },
      { name: "Valiant", models: [model("Valiant Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "5.2", "745hp")] },
      { name: "Valkyrie", models: [model("Valkyrie AMR Pro", ["Hibrit"], ["Otomatik"], ["Coupe"], "6.5", "1160hp"), model("Valkyrie Coupe", ["Hibrit"], ["Otomatik"], ["Coupe"], "6.5", "1160hp"), model("Valkyrie LM", ["Hibrit"], ["Otomatik"], ["Coupe"], "6.5", "1155hp"), model("Valkyrie Spider", ["Hibrit"], ["Otomatik"], ["Roadster"], "6.5", "1160hp")] },
      { name: "Valour", models: [model("Valour Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "5.2", "715hp")] },
      { name: "Vanquish", models: [model("V12", ["Benzin"], ["Otomatik"], ["Coupe"], "5.2", "835hp"), model("Vanquish Coupe 2001", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "466hp"), model("Vanquish Coupe 2012", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "573hp"), model("Vanquish S 2004", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "520hp"), model("Vanquish S Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "595hp"), model("Vanquish S Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "5.9", "595hp"), model("Vanquish V12 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.2", "835hp"), model("Vanquish Volante 2013", ["Benzin"], ["Otomatik"], ["Convertible"], "5.9", "573hp"), model("Vanquish Volante Yeni", ["Benzin"], ["Otomatik"], ["Convertible"], "5.2", "835hp")] },
      { name: "Vantage", models: [model("V12 Vantage Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.2", "700hp"), model("V12 Vantage Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "5.2", "700hp"), model("V8 Vantage", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "510hp"), model("V8 Vantage F1 Edition", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "535hp"), model("V8 Vantage N420C", ["Benzin"], ["Otomatik"], ["Coupe"], "4.7", "420hp"), model("V8 Vantage Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "4.0", "510hp"), model("V8 Vantage S", ["Benzin"], ["Otomatik"], ["Coupe"], "4.7", "436hp"), model("Vantage Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "510hp"), model("Vantage F1 Edition", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "535hp"), model("Vantage Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "4.0", "510hp"), model("Vantage S Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.7", "436hp"), model("Vantage S Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "4.7", "436hp")] },
      { name: "V8 Classic", models: [model("V8 Saloon", ["Benzin"], ["Otomatik"], ["Sedan"], "5.3", "310hp"), model("V8 Vantage", ["Benzin"], ["Otomatik"], ["Coupe"], "5.3", "432hp"), model("V8 Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "5.3", "305hp"), model("V8 Zagato", ["Benzin"], ["Manuel"], ["Coupe"], "5.3", "432hp")] },
      { name: "Virage", models: [model("Virage Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "490hp"), model("Virage Volante", ["Benzin"], ["Otomatik"], ["Convertible"], "5.9", "490hp")] }
    ]
  },
  {
    name: "Aion",
    series: [
      { name: "Hyper GT", models: [model("Hyper GT", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "340hp")] },
      { name: "Hyper SSR", models: [model("Hyper SSR", ["Elektrik"], ["Otomatik"], ["Coupe"], "Elektrik", "1225hp")] },
      { name: "LX", models: [model("Aion LX", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "245hp"), model("Aion LX Plus", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "245hp")] },
      { name: "S", models: [model("580", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "204hp"), model("Aion S", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "204hp"), model("Aion S Plus", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "224hp")] },
      { name: "V", models: [model("Aion V", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "224hp"), model("Aion V Plus", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "245hp")] },
      { name: "Y", models: [model("Aion Y", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "136hp"), model("Aion Y Plus", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "204hp")] }
    ]
  },
  {
    name: "BMW",
    series: [
      { name: "1 Serisi", models: [model("116d", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], "1.5", "116hp"), model("116d ED", ["Dizel"], ["Manuel"], ["Hatchback"], "1.5", "116hp"), model("116i", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.6", "136hp"), model("118d", ["Dizel"], ["Otomatik"], ["Hatchback"], "2.0", "150hp"), model("118i", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "140hp"), model("120", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "184hp"), model("120d", ["Dizel"], ["Otomatik"], ["Hatchback"], "2.0", "190hp"), model("120i", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "178hp"), model("123d", ["Dizel"], ["Otomatik"], ["Hatchback"], "2.0", "204hp"), model("125i", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "224hp"), model("128ia", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "265hp"), model("128ti", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "265hp"), model("135i", ["Benzin"], ["Otomatik"], ["Hatchback"], "3.0", "306hp")] },
      { name: "2 Serisi", models: [model("216d Active Tourer", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "116hp"), model("216d Gran Coupe", ["Dizel"], ["Otomatik"], ["Sedan"], "1.5", "116hp"), model("216d Gran Tourer", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "116hp"), model("218i", ["Benzin"], ["Otomatik"], ["Coupe"], "1.5", "140hp"), model("218i Active Tourer", ["Benzin"], ["Otomatik"], ["MPV"], "1.5", "136hp"), model("218i Gran Coupe", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "140hp"), model("218i Gran Tourer", ["Benzin"], ["Otomatik"], ["MPV"], "1.5", "140hp"), model("220 Gran Coupe", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "184hp"), model("220d", ["Dizel"], ["Otomatik"], ["Coupe"], "2.0", "190hp"), model("220i Active Tourer", ["Benzin"], ["Otomatik"], ["MPV"], "2.0", "170hp"), model("230e xDrive Active Tourer", ["Hibrit"], ["Otomatik"], ["MPV"], "1.5", "326hp"), model("2 Serisi Active Tourer", ["Benzin"], ["Otomatik"], ["MPV"], "1.5", "136hp"), model("2 Serisi Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.0", "184hp"), model("2 Serisi Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "184hp"), model("2 Serisi Gran Coupe", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "140hp"), model("Active Tourer", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "116hp"), model("First Edition M Sport", ["Dizel", "Benzin"], ["Otomatik"], ["Sedan"], "1.5", "140hp"), model("First Edition Sport Line", ["Dizel", "Benzin"], ["Otomatik"], ["Sedan"], "1.5", "140hp"), model("Gran Tourer", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "116hp"), model("Joy", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "116hp"), model("Luxury Line", ["Dizel", "Benzin"], ["Otomatik"], ["MPV"], "1.5", "116hp"), model("Luxury Plus", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "116hp"), model("M Sport", ["Dizel", "Benzin"], ["Otomatik"], ["MPV", "Sedan"], "1.5", "140hp"), model("Premium Line", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "116hp"), model("Prestige", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "116hp"), model("Sport Line", ["Dizel", "Benzin"], ["Otomatik"], ["MPV", "Sedan"], "1.5", "140hp")] },
      { name: "3 Serisi", models: [model("315", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "75hp"), model("316", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "90hp"), model("316Ci", ["Benzin"], ["Manuel", "Otomatik"], ["Coupe"], "1.8", "115hp"), model("316i", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "136hp"), model("316ti", ["Benzin"], ["Manuel"], ["Hatchback"], "1.8", "115hp"), model("318Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "143hp"), model("318d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "143hp"), model("318i", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "156hp"), model("318is", ["Benzin"], ["Manuel"], ["Coupe"], "1.8", "140hp"), model("318tds", ["Dizel"], ["Manuel"], ["Sedan"], "1.7", "90hp"), model("318ti", ["Benzin"], ["Manuel"], ["Hatchback"], "1.9", "140hp"), model("320Cd", ["Dizel"], ["Otomatik"], ["Coupe"], "2.0", "150hp"), model("320Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "2.2", "170hp"), model("320d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("320d GT", ["Dizel"], ["Otomatik"], ["GT"], "2.0", "190hp"), model("320d xDrive", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("320d xDrive GT", ["Dizel"], ["Otomatik"], ["GT"], "2.0", "190hp"), model("320i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("320i ED", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "170hp"), model("320si", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "173hp"), model("320td", ["Dizel"], ["Manuel"], ["Hatchback"], "2.0", "150hp"), model("323Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "2.5", "170hp"), model("323i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "170hp"), model("325Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "2.5", "192hp"), model("325d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "197hp"), model("325e", ["Benzin"], ["Manuel"], ["Sedan"], "2.7", "122hp"), model("325i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "218hp"), model("325i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "218hp"), model("325tds", ["Dizel"], ["Manuel"], ["Sedan"], "2.5", "143hp"), model("325ti", ["Benzin"], ["Manuel"], ["Hatchback"], "2.5", "192hp"), model("325xi", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "192hp"), model("328Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "2.8", "193hp"), model("328i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "245hp"), model("328i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "245hp"), model("330Cd", ["Dizel"], ["Otomatik"], ["Coupe"], "3.0", "204hp"), model("330Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "231hp"), model("330d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "258hp"), model("330i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "258hp"), model("330i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "258hp"), model("330xd", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "231hp"), model("330xi", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "258hp"), model("335d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "286hp"), model("335i", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "306hp"), model("340d xDrive", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "340hp"), model("340i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "326hp"), model("Advantage", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("Compact", ["Benzin"], ["Manuel"], ["Hatchback"], "1.8", "115hp"), model("Comfort", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "136hp"), model("Exclusive", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("Lifestyle Edition", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "136hp"), model("Luxury Line", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("Modern Line", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("M Sport", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("Premium", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "136hp"), model("Sport", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("Sport Line", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("Standart", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "90hp"), model("Technology", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("Techno Plus", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("Touring", ["Benzin", "Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "170hp")] },
      { name: "4 Serisi", models: [model("4 Serisi Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.0", "184hp"), model("4 Serisi Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "184hp"), model("4 Serisi Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "2.0", "184hp"), model("418d", ["Dizel"], ["Otomatik"], ["Coupe"], "2.0", "150hp"), model("418d Gran Coupe", ["Dizel"], ["Otomatik"], ["Gran Coupe"], "2.0", "150hp"), model("418i", ["Benzin"], ["Otomatik"], ["Coupe"], "1.5", "136hp"), model("418i Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "1.5", "136hp"), model("420d", ["Dizel"], ["Otomatik"], ["Coupe"], "2.0", "190hp"), model("420d Gran Coupe", ["Dizel"], ["Otomatik"], ["Gran Coupe"], "2.0", "190hp"), model("420d xDrive", ["Dizel"], ["Otomatik"], ["Coupe"], "2.0", "190hp"), model("420d xDrive Gran Coupe", ["Dizel"], ["Otomatik"], ["Gran Coupe"], "2.0", "190hp"), model("420i", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "184hp"), model("420i Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "2.0", "184hp"), model("428i", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "245hp"), model("428i Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "2.0", "245hp"), model("428i xDrive", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "245hp"), model("428i xDrive Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "2.0", "245hp"), model("430i", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "252hp"), model("430i Cabrio Edition M Sport", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.0", "252hp"), model("430i Coupe Edition M Sport", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "252hp"), model("430i xDrive", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "252hp"), model("430i xDrive Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "2.0", "252hp"), model("435i", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "306hp"), model("440i xDrive", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "326hp")] },
      { name: "5 Serisi", models: [model("518i", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], "1.8", "115hp"), model("520", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "170hp"), model("520d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("520d Gran Turismo", ["Dizel"], ["Otomatik"], ["GT"], "2.0", "190hp"), model("520d xDrive", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("520i", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "170hp"), model("520Li", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "184hp"), model("523i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "177hp"), model("524d", ["Dizel"], ["Manuel"], ["Sedan"], "2.4", "115hp"), model("524td", ["Dizel"], ["Manuel"], ["Sedan"], "2.4", "115hp"), model("525d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "218hp"), model("525d xDrive", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "218hp"), model("525i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "218hp"), model("525td", ["Dizel"], ["Manuel"], ["Sedan"], "2.5", "115hp"), model("525tds", ["Dizel"], ["Manuel"], ["Sedan"], "2.5", "143hp"), model("525 xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "218hp"), model("528i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "245hp"), model("528i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "245hp"), model("530d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "258hp"), model("530d xDrive", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "258hp"), model("530i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "252hp"), model("530i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "252hp"), model("530xd Gran Turismo", ["Dizel"], ["Otomatik"], ["GT"], "3.0", "258hp"), model("530 xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "252hp"), model("530xi", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "272hp"), model("535d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "313hp"), model("535d xDrive", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "313hp"), model("535i", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "306hp"), model("535i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "306hp"), model("540i", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "340hp"), model("540i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "340hp"), model("545i", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "333hp"), model("550d xDrive", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "381hp"), model("550i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "450hp"), model("550 xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "407hp")] },
      { name: "6 Serisi", models: [model("620d xDrive", ["Dizel"], ["Otomatik"], ["GT"], "2.0", "190hp"), model("630Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "258hp"), model("630d", ["Dizel"], ["Otomatik"], ["GT"], "3.0", "265hp"), model("630i", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "272hp"), model("630i Gran Turismo", ["Benzin"], ["Otomatik"], ["GT"], "2.0", "258hp"), model("635d", ["Dizel"], ["Otomatik"], ["Coupe"], "3.0", "286hp"), model("640d", ["Dizel"], ["Otomatik"], ["Coupe"], "3.0", "313hp"), model("640d xDrive", ["Dizel"], ["Otomatik"], ["Coupe"], "3.0", "313hp"), model("640i", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "320hp"), model("640i Gran Turismo", ["Benzin"], ["Otomatik"], ["GT"], "3.0", "340hp"), model("645Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "4.4", "333hp"), model("650Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "4.8", "367hp"), model("650i xDrive", ["Benzin"], ["Otomatik"], ["Coupe"], "4.4", "450hp"), model("6 Serisi Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "3.0", "320hp"), model("6 Serisi Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "320hp"), model("6 Serisi Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "3.0", "320hp"), model("6 Serisi Gran Turismo", ["Dizel"], ["Otomatik"], ["GT"], "3.0", "265hp")] },
      { name: "7 Serisi", models: [model("725d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "218hp"), model("725d Long", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "218hp"), model("725tds", ["Dizel"], ["Manuel"], ["Sedan"], "2.5", "143hp"), model("728i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.8", "193hp"), model("728i Long", ["Benzin"], ["Otomatik"], ["Sedan"], "2.8", "193hp"), model("730d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "265hp"), model("730d Long", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "265hp"), model("730d xDrive", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "265hp"), model("730d xDrive Long", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "265hp"), model("730i", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "258hp"), model("730i Long", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "258hp"), model("735i", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "306hp"), model("735i Long", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "306hp"), model("740d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "320hp"), model("740d xDrive", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "320hp"), model("740d xDrive Long", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "320hp"), model("740e xDrive Long", ["Hibrit"], ["Otomatik"], ["Sedan"], "2.0", "326hp"), model("740i", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "326hp"), model("740i Long", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "326hp"), model("745e", ["Hybrid"], ["Otomatik"], ["Sedan"], "3.0", "394hp"), model("745i", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "333hp"), model("745i Long", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "333hp"), model("750d xDrive Long", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "400hp"), model("750i", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "450hp"), model("750 ial", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "450hp"), model("750i Long", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "450hp"), model("750i xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "450hp"), model("750i xDrive Long", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "450hp"), model("760i Long", ["Benzin"], ["Otomatik"], ["Sedan"], "6.6", "610hp"), model("760Li", ["Benzin"], ["Otomatik"], ["Sedan"], "6.6", "610hp")] },
      { name: "8 Serisi", models: [model("840Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "4.4", "286hp"), model("840d xDrive Gran Coupe", ["Dizel"], ["Otomatik"], ["Gran Coupe"], "3.0", "320hp"), model("840i xDrive", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "340hp"), model("840i xDrive Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "3.0", "340hp"), model("850Ci", ["Benzin"], ["Otomatik"], ["Coupe"], "5.0", "300hp"), model("8 Serisi Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "3.0", "340hp"), model("8 Serisi Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "340hp"), model("8 Serisi Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "3.0", "340hp")] },
      { name: "02 Serisi", models: [model("1502", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "75hp"), model("1602", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "85hp"), model("1802", ["Benzin"], ["Manuel"], ["Sedan"], "1.8", "90hp"), model("2002 Tii", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "130hp")] },
      { name: "E9 Serisi", models: [model("2800 CS", ["Benzin"], ["Manuel"], ["Coupe"], "2.8", "170hp"), model("3.0 CSL", ["Benzin"], ["Manuel"], ["Coupe"], "3.0", "206hp")] },
      { name: "Isetta", models: [model("Isetta Mikro Otomobil", ["Benzin"], ["Manuel"], ["Mikro Otomobil"], "0.3", "13hp")] },
      { name: "Z1", models: [model("Z1", ["Benzin"], ["Manuel"], ["Roadster"], "2.5", "170hp"), model("Z1 Klasik Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "2.5", "170hp")] },
      { name: "Z3", models: [model("Z3", ["Benzin"], ["Manuel"], ["Roadster"], "1.9", "140hp"), model("Z3 Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "2.8", "193hp"), model("Z3 M Cabrio", ["Benzin"], ["Manuel"], ["Cabrio"], "3.2", "321hp"), model("Z3 M Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "3.2", "321hp"), model("Z3 Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "1.9", "140hp")] },
      { name: "Z4", models: [model("Z4", ["Benzin"], ["Otomatik"], ["Roadster"], "2.0", "258hp"), model("Z4 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "340hp"), model("Z4 Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "2.0", "258hp")] },
      { name: "Z8", models: [model("Z8 Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "5.0", "400hp")] },
      { name: "M1", models: [model("M1", ["Benzin"], ["Manuel"], ["Coupe"], "3.5", "277hp"), model("M1 Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "3.5", "277hp")] },
      { name: "M2", models: [model("M2", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "460hp"), model("M2 Competition", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "410hp"), model("M2 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "460hp"), model("M2 xDrive", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "460hp"), model("M235i xDrive", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "2.0", "306hp"), model("M240i xDrive", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "374hp")] },
      { name: "M3", models: [model("M3", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "510hp"), model("M3 Cabrio", ["Benzin"], ["Otomatik"], ["Cabrio"], "3.2", "343hp"), model("M3 Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "3.2", "343hp"), model("M3 Competition", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "510hp"), model("M3 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.2", "420hp"), model("M3 CSL", ["Benzin"], ["Otomatik"], ["Coupe"], "3.2", "360hp"), model("M3 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "510hp"), model("M3 Touring", ["Benzin"], ["Otomatik"], ["Station Wagon"], "3.0", "510hp")] },
      { name: "M4", models: [model("M4", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "510hp"), model("M4 Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "3.0", "510hp"), model("M4 Competition", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "510hp"), model("M4 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "510hp"), model("M440i xDrive", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "374hp")] },
      { name: "M5", models: [model("M5", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "727hp"), model("M5 Competition", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "625hp"), model("M5 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "727hp"), model("M5 Touring", ["Benzin"], ["Otomatik"], ["Station Wagon"], "4.4", "727hp"), model("M5 xDrive", ["Benzin"], ["Otomatik"], ["Sedan"], "4.4", "625hp")] },
      { name: "M6", models: [model("M6", ["Benzin"], ["Otomatik"], ["Coupe"], "4.4", "560hp"), model("M6 Cabrio", ["Benzin"], ["Otomatik"], ["Cabrio"], "4.4", "560hp"), model("M6 Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "4.4", "560hp"), model("M6 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.4", "560hp"), model("M6 Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "4.4", "560hp")] },
      { name: "M8", models: [model("M760e xDrive", ["Hibrit"], ["Otomatik"], ["Sedan"], "3.0", "571hp"), model("M850i xDrive", ["Benzin"], ["Otomatik"], ["Coupe"], "4.4", "530hp"), model("M8 Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "4.4", "625hp"), model("M8 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.4", "625hp"), model("M8 Coupe xDrive Competition", ["Benzin"], ["Otomatik"], ["Coupe"], "4.4", "625hp"), model("M8 Gran Coupe", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "4.4", "625hp"), model("M8 Gran Coupe xDrive Competition", ["Benzin"], ["Otomatik"], ["Gran Coupe"], "4.4", "625hp")] },
      { name: "X1", models: [model("X1 SUV", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "1.5", "136hp")] },
      { name: "X2", models: [model("X2 SAC", ["Benzin"], ["Otomatik"], ["Coupe-SUV"], "1.5", "170hp")] },
      { name: "X Serisi", models: [model("X1", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("X3", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "2.0", "190hp"), model("X5", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "286hp"), model("X6", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "340hp"), model("X7", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "352hp")] },
      { name: "X3", models: [model("X3 SUV", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "2.0", "190hp")] },
      { name: "X3 M", models: [model("X3 M SUV", ["Benzin"], ["Otomatik"], ["SUV"], "3.0", "510hp")] },
      { name: "X4", models: [model("X4 SAC", ["Benzin", "Dizel"], ["Otomatik"], ["Coupe-SUV"], "2.0", "190hp")] },
      { name: "X4 M", models: [model("X4 M SAC", ["Benzin"], ["Otomatik"], ["Coupe-SUV"], "3.0", "510hp")] },
      { name: "X5", models: [model("X5 SUV", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "298hp")] },
      { name: "X5 M", models: [model("X5 M SUV", ["Benzin"], ["Otomatik"], ["SUV"], "4.4", "625hp")] },
      { name: "X6", models: [model("X6 SAC", ["Benzin", "Dizel"], ["Otomatik"], ["Coupe-SUV"], "3.0", "340hp")] },
      { name: "X6 M", models: [model("X6 M SAC", ["Benzin"], ["Otomatik"], ["Coupe-SUV"], "4.4", "625hp")] },
      { name: "X7", models: [model("X7 Lüks SUV", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "352hp")] },
      { name: "XM", models: [model("XM Hibrit Süper SUV", ["Hibrit"], ["Otomatik"], ["SUV"], "4.4", "653hp")] },
      { name: "i3", models: [model("i3 Hatchback", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "170hp"), model("i3 Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "286hp")] },
      { name: "i4", models: [model("i4 Gran Coupe", ["Elektrik"], ["Otomatik"], ["Gran Coupe"], "Elektrik", "340hp")] },
      { name: "i5", models: [model("i5 Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "340hp"), model("i5 Touring", ["Elektrik"], ["Otomatik"], ["Station Wagon"], "Elektrik", "340hp")] },
      { name: "i7", models: [model("i7 Lüks Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "544hp")] },
      { name: "i8", models: [model("i8 Coupe", ["Hibrit"], ["Otomatik"], ["Coupe"], "1.5", "374hp"), model("i8 Roadster", ["Hibrit"], ["Otomatik"], ["Roadster"], "1.5", "374hp")] },
      { name: "iX", models: [model("iX Elektrikli Büyük SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "523hp")] },
      { name: "iX1", models: [model("iX1 Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "313hp")] },
      { name: "iX2", models: [model("iX2 Elektrikli Crossover", ["Elektrik"], ["Otomatik"], ["Crossover"], "Elektrik", "313hp")] },
      { name: "iX3", models: [model("iX3 Elektrikli SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "286hp")] },
      { name: "iX4", models: [model("iX4 Elektrikli Coupe-SUV", ["Elektrik"], ["Otomatik"], ["Coupe-SUV"], "Elektrik", "408hp")] }
    ]
  },
  {
    name: "Mercedes-Benz",
    series: [
      { name: "A Serisi", models: [model("A-Class Hatchback W176", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.6", "122hp"), model("A-Class Hatchback W177", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.3", "136hp"), model("A-Class Sedan V177", ["Benzin"], ["Otomatik"], ["Sedan"], "1.3", "136hp"), model("A 180", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.3", "136hp"), model("A 180d", ["Dizel"], ["Otomatik"], ["Hatchback"], "2.0", "116hp"), model("A 200", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.3", "163hp"), model("AMG A 35", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "306hp"), model("AMG A 45 S", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "421hp")] },
      { name: "B Serisi", models: [model("B-Class W246", ["Benzin"], ["Otomatik"], ["MPV"], "1.6", "122hp"), model("B-Class W247", ["Benzin"], ["Otomatik"], ["MPV"], "1.3", "136hp"), model("B 180", ["Benzin"], ["Otomatik"], ["MPV"], "1.3", "136hp"), model("B 180d", ["Dizel"], ["Otomatik"], ["MPV"], "2.0", "116hp"), model("B 200", ["Benzin"], ["Otomatik"], ["MPV"], "1.3", "163hp")] },
      { name: "C Serisi", models: [model("C-Class Cabriolet", ["Benzin"], ["Otomatik"], ["Cabriolet"], "2.0", "197hp"), model("C-Class Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "197hp"), model("C-Class Sedan W204", ["Benzin"], ["Otomatik"], ["Sedan"], "1.8", "156hp"), model("C-Class Sedan W205", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "184hp"), model("C-Class Sedan W206", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "204hp"), model("C-Class Station Wagon", ["Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "200hp"), model("C 180", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "170hp"), model("C 200", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "204hp"), model("C 200d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "163hp"), model("C 300", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "258hp"), model("AMG C 43", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "408hp"), model("AMG C 63 S E Performance", ["Hybrid"], ["Otomatik"], ["Sedan"], "2.0", "680hp")] },
      { name: "CLA", models: [model("CLA Coupe C117", ["Benzin"], ["Otomatik"], ["Coupe"], "1.6", "156hp"), model("CLA Coupe C118", ["Benzin"], ["Otomatik"], ["Coupe"], "1.3", "163hp"), model("CLA Coupe C174", ["Elektrik"], ["Otomatik"], ["Coupe"], "Elektrik", "272hp"), model("CLA Shooting Brake X118", ["Benzin"], ["Otomatik"], ["Station Wagon"], "1.3", "163hp"), model("CLA 180d", ["Dizel"], ["Otomatik"], ["Coupe"], "2.0", "116hp"), model("CLA 200", ["Benzin"], ["Otomatik"], ["Coupe"], "1.3", "163hp"), model("CLA 45 AMG", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "421hp"), model("CLA EV", ["Elektrik"], ["Otomatik"], ["Coupe"], "Elektrik", "272hp")] },
      { name: "Citan", models: [model("Citan Van", ["Dizel"], ["Manuel"], ["Van"], "1.5", "95hp")] },
      { name: "CLE", models: [model("CLE Cabriolet A236", ["Benzin"], ["Otomatik"], ["Cabriolet"], "2.0", "258hp"), model("CLE Coupe C236", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "258hp"), model("AMG CLE 53", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "449hp")] },
      { name: "CLS", models: [model("CLS Coupe C257", ["Dizel"], ["Otomatik"], ["Coupe"], "2.9", "330hp"), model("CLS Coupe W218", ["Dizel"], ["Otomatik"], ["Coupe"], "3.0", "258hp"), model("CLS Coupe W219", ["Benzin"], ["Otomatik"], ["Coupe"], "3.5", "272hp"), model("CLS 350", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "299hp"), model("CLS 350d", ["Dizel"], ["Otomatik"], ["Coupe"], "3.0", "286hp"), model("CLS 400d", ["Dizel"], ["Otomatik"], ["Coupe"], "3.0", "330hp"), model("CLS 53 AMG", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "435hp")] },
      { name: "Conecto", models: [model("Conecto City Bus", ["Dizel"], ["Otomatik"], ["Otobüs"], "7.7", "299hp")] },
      { name: "Actros", models: [model("Actros Çekici", ["Dizel"], ["Otomatik"], ["Truck"], "12.8", "510hp")] },
      { name: "Arocs", models: [model("Arocs Damperli", ["Dizel"], ["Otomatik"], ["Truck"], "12.8", "450hp")] },
      { name: "Atego", models: [model("Atego Kamyon", ["Dizel"], ["Otomatik"], ["Truck"], "7.7", "299hp")] },
      { name: "EQA", models: [model("EQA 250+", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "190hp"), model("EQA 350 4MATIC", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "292hp")] },
      { name: "EQB", models: [model("EQB 250+", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "190hp"), model("EQB 350 4MATIC", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "292hp")] },
      { name: "EQC", models: [model("EQC SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "408hp")] },
      { name: "EQE Sedan", models: [model("AMG EQE 53 4MATIC+", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "687hp"), model("EQE 300", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "245hp"), model("EQE 350+", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "292hp")] },
      { name: "EQE SUV", models: [model("AMG EQE 43 SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "476hp"), model("EQE SUV 350+", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "292hp"), model("EQE SUV 500 4MATIC", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "408hp")] },
      { name: "EQS Sedan", models: [model("AMG EQS 53 4MATIC+", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "658hp"), model("EQS 450+", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "360hp"), model("EQS 580 4MATIC", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "544hp")] },
      { name: "EQS SUV", models: [model("EQS SUV 450+", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "360hp"), model("EQS SUV 580 4MATIC", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "544hp"), model("Maybach EQS 680 SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "649hp")] },
      { name: "EQT", models: [model("EQT EV", ["Elektrik"], ["Otomatik"], ["Van"], "Elektrik", "122hp")] },
      { name: "EQV", models: [model("EQV VIP Van", ["Elektrik"], ["Otomatik"], ["Van"], "Elektrik", "204hp")] },
      { name: "eVito", models: [model("eVito Panelvan", ["Elektrik"], ["Otomatik"], ["Van"], "Elektrik", "116hp")] },
      { name: "E Serisi", models: [model("AMG E 53", ["Hybrid"], ["Otomatik"], ["Sedan"], "3.0", "435hp"), model("AMG E 63 S", ["Benzin"], ["Otomatik"], ["Sedan"], "4.0", "612hp"), model("E-Class All-Terrain", ["Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "197hp"), model("E-Class Estate", ["Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "197hp"), model("E-Class Sedan W211", ["Benzin"], ["Otomatik"], ["Sedan"], "1.8", "163hp"), model("E-Class Sedan W212", ["Dizel"], ["Otomatik"], ["Sedan"], "2.1", "170hp"), model("E-Class Sedan W213", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "194hp"), model("E-Class Sedan W214", ["Hybrid"], ["Otomatik"], ["Sedan"], "2.0", "204hp"), model("E 180", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "170hp"), model("E 200d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "163hp"), model("E 220d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "197hp"), model("E 300d", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "265hp"), model("E 400d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "340hp")] },
      { name: "G Serisi", models: [model("AMG G 63", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "585hp"), model("G-Class W463", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "330hp"), model("G 400d", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "330hp"), model("G 450d", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "367hp"), model("G 500", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "422hp"), model("G 580 with EQ Technology", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "587hp")] },
      { name: "GLA", models: [model("GLA H247", ["Benzin"], ["Otomatik"], ["SUV"], "1.3", "163hp"), model("GLA 180d", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "116hp"), model("GLA 200", ["Benzin"], ["Otomatik"], ["SUV"], "1.3", "163hp"), model("GLA 45 AMG", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "421hp")] },
      { name: "GLB", models: [model("GLB X247", ["Benzin"], ["Otomatik"], ["SUV"], "1.3", "163hp"), model("GLB 200", ["Benzin"], ["Otomatik"], ["SUV"], "1.3", "163hp"), model("GLB 220d 4MATIC", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "190hp")] },
      { name: "GLC", models: [model("GLC Coupe C254", ["Dizel"], ["Otomatik"], ["Coupe-SUV"], "2.0", "197hp"), model("GLC SUV X254", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "197hp"), model("GLC 220d", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "197hp"), model("GLC 300e", ["Hybrid"], ["Otomatik"], ["SUV"], "2.0", "313hp")] },
      { name: "GLE", models: [model("AMG GLE 63 S", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "612hp"), model("GLE Coupe C167", ["Dizel"], ["Otomatik"], ["Coupe-SUV"], "3.0", "367hp"), model("GLE SUV V167", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "367hp"), model("GLE 300d", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "272hp"), model("GLE 350d", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "272hp"), model("GLE 400d", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "330hp")] },
      { name: "GLS", models: [model("GLS X167", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "367hp"), model("GLS 400d", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "330hp"), model("GLS 580", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "489hp")] },
      { name: "Marco Polo", models: [model("Marco Polo Camper", ["Dizel"], ["Otomatik"], ["Van"], "2.0", "237hp")] },
      { name: "Maybach EQS", models: [model("Maybach EQS 680 SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "649hp")] },
      { name: "Maybach GLS", models: [model("Maybach GLS 600", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "558hp")] },
      { name: "Maybach S-Class", models: [model("Maybach S 580", ["Benzin"], ["Otomatik"], ["Sedan"], "4.0", "503hp"), model("Maybach S 680", ["Benzin"], ["Otomatik"], ["Sedan"], "6.0", "612hp")] },
      { name: "SLR McLaren", models: [model("Mercedes-Benz SLR McLaren", ["Benzin"], ["Otomatik"], ["Coupe"], "5.4", "626hp")] },
      { name: "SLS AMG", models: [model("SLS AMG Gullwing", ["Benzin"], ["Otomatik"], ["Coupe"], "6.2", "571hp")] },
      { name: "S Serisi", models: [model("S-Class Coupe C217", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "469hp"), model("S-Class Sedan W221", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "235hp"), model("S-Class Sedan W222", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "286hp"), model("S-Class Sedan W223", ["Hybrid"], ["Otomatik"], ["Sedan"], "3.0", "367hp"), model("S 350d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "286hp"), model("S 400d", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "330hp"), model("S 500", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "435hp"), model("S 580e", ["Hybrid"], ["Otomatik"], ["Sedan"], "3.0", "510hp"), model("S 63 E Performance", ["Hybrid"], ["Otomatik"], ["Sedan"], "4.0", "802hp")] },
      { name: "Sprinter", models: [model("Sprinter Kamyonet", ["Dizel"], ["Manuel"], ["Truck"], "2.1", "170hp"), model("Sprinter Minibüs", ["Dizel"], ["Manuel"], ["Minibüs"], "2.1", "170hp"), model("Sprinter Panelvan", ["Dizel"], ["Manuel"], ["Van"], "2.1", "170hp")] },
      { name: "SL AMG", models: [model("SL 43", ["Benzin"], ["Otomatik"], ["Roadster"], "2.0", "381hp"), model("SL 55", ["Benzin"], ["Otomatik"], ["Roadster"], "4.0", "476hp"), model("SL 63 S E Performance", ["Hybrid"], ["Otomatik"], ["Roadster"], "4.0", "816hp"), model("SL 63 V8", ["Benzin"], ["Otomatik"], ["Roadster"], "4.0", "585hp")] },
      { name: "T-Class", models: [model("T-Class Passenger", ["Dizel"], ["Manuel"], ["Van"], "1.5", "116hp")] },
      { name: "Tourismo", models: [model("Tourismo Coach", ["Dizel"], ["Otomatik"], ["Otobüs"], "10.7", "394hp")] },
      { name: "Travego", models: [model("Travego Coach", ["Dizel"], ["Otomatik"], ["Otobüs"], "12.8", "476hp")] },
      { name: "Unimog", models: [model("Unimog Offroad Truck", ["Dizel"], ["Manuel"], ["Truck"], "5.1", "231hp")] },
      { name: "Vito", models: [model("Vito Kombi", ["Dizel"], ["Manuel"], ["Van"], "2.0", "136hp"), model("Vito Mixto", ["Dizel"], ["Manuel"], ["Van"], "2.0", "136hp"), model("Vito Tourer", ["Dizel"], ["Otomatik"], ["Van"], "2.0", "190hp")] },
      { name: "V-Class", models: [model("V-Class VIP", ["Dizel"], ["Otomatik"], ["Van"], "2.0", "237hp")] },
      { name: "W114", models: [model("W114 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.3", "120hp")] },
      { name: "W115", models: [model("W115 Sedan", ["Dizel"], ["Manuel"], ["Sedan"], "2.2", "60hp")] },
      { name: "W123", models: [model("W123 200D", ["Dizel"], ["Manuel"], ["Sedan"], "2.0", "60hp"), model("W123 230E", ["Benzin"], ["Manuel"], ["Sedan"], "2.3", "136hp")] },
      { name: "W124", models: [model("W124 200E", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "136hp"), model("W124 250D", ["Dizel"], ["Manuel"], ["Sedan"], "2.5", "90hp"), model("W124 300E", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "188hp")] },
      { name: "W126", models: [model("W126 S-Class", ["Benzin"], ["Otomatik"], ["Sedan"], "5.0", "245hp")] },
      { name: "W140", models: [model("W140 S-Class", ["Benzin"], ["Otomatik"], ["Sedan"], "5.0", "320hp")] },
      { name: "W201", models: [model("W201 190D", ["Dizel"], ["Manuel"], ["Sedan"], "2.0", "75hp"), model("W201 190E", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "122hp")] },
      { name: "AMG GT New", models: [model("AMG GT 43", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "421hp"), model("AMG GT 55 V8", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "476hp"), model("AMG GT 63 S E Performance", ["Hybrid"], ["Otomatik"], ["Coupe"], "4.0", "816hp"), model("AMG GT 63 V8", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "585hp")] },
      { name: "AMG GT 4-Door", models: [model("AMG GT 43 4MATIC+", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "367hp"), model("AMG GT 53 4MATIC+", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "435hp"), model("AMG GT 63 S 4MATIC+", ["Benzin"], ["Otomatik"], ["Sedan"], "4.0", "639hp")] },
      { name: "AMG GT Classic", models: [model("AMG GT", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "476hp"), model("AMG GT Black Series", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "730hp"), model("AMG GT C", ["Benzin"], ["Otomatik"], ["Roadster"], "4.0", "557hp"), model("AMG GT R", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "585hp"), model("AMG GT S", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "522hp")] }
    ]
  },
  {
    name: "MG",
    series: [
      { name: "Cyberster", models: [model("Cyberster AWD", ["Elektrik"], ["Otomatik"], ["Roadster"], "Elektrik", "544hp"), model("Cyberster RWD", ["Elektrik"], ["Otomatik"], ["Roadster"], "Elektrik", "340hp")] },
      { name: "MG4 EV", models: [model("MG4 Comfort (64 kWh)", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "204hp"), model("MG4 Extended Range (77 kWh)", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "245hp"), model("MG4 Luxury (64 kWh)", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "204hp"), model("MG4 Standard (51 kWh)", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "170hp"), model("MG4 XPOWER", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "435hp")] },
      { name: "MG5 EV", models: [model("MG5 Electric Estate", ["Elektrik"], ["Otomatik"], ["Station Wagon"], "Elektrik", "156hp")] },
      { name: "Marvel R Electric", models: [model("Marvel R Comfort", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "180hp"), model("Marvel R Luxury", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "180hp"), model("Marvel R Performance AWD", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "288hp")] },
      { name: "HS", models: [model("HS 1.5 T-GDI Comfort", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "170hp"), model("HS 1.5 T-GDI Luxury", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "170hp")] },
      { name: "EHS", models: [model("EHS Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "258hp")] },
      { name: "ZS", models: [model("ZS 1.0 T-GDI Otomatik", ["Benzin"], ["Otomatik"], ["SUV"], "1.0", "111hp"), model("ZS 1.5 VTi-Tech Comfort", ["Benzin"], ["Manuel"], ["SUV"], "1.5", "106hp"), model("ZS 1.5 VTi-Tech Luxury", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "106hp")] },
      { name: "ZS EV", models: [model("ZS EV 44.5 kWh", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "143hp"), model("ZS EV 72.6 kWh Long Range", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "156hp")] },
      { name: "MG3", models: [model("MG3 Hybrid+ Comfort", ["Hibrit"], ["Otomatik"], ["Hatchback"], "1.5", "194hp"), model("MG3 Hybrid+ Luxury", ["Hibrit"], ["Otomatik"], ["Hatchback"], "1.5", "194hp"), model("MG3 Hybrid+ Standard", ["Hibrit"], ["Otomatik"], ["Hatchback"], "1.5", "194hp")] },
      { name: "MG5 Sedan", models: [model("MG5 Benzinli Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "118hp")] },
      { name: "MG7", models: [model("MG7 1.5T Trophy", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "188hp"), model("MG7 2.0T Trophy", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "261hp")] },
      { name: "MG Extender", models: [model("MG Extender Çift Kabin Pick-up", ["Dizel"], ["Otomatik"], ["Pick-up"], "2.0", "161hp")] },
      { name: "MG V80", models: [model("MG V80 Minibüs", ["Dizel"], ["Manuel"], ["Minibüs"], "2.5", "136hp"), model("MG V80 Panelvan", ["Dizel"], ["Manuel"], ["Van"], "2.5", "136hp")] },
      { name: "MGB", models: [model("MGB GT Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "1.8", "95hp"), model("MGB Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "1.8", "95hp")] },
      { name: "MGA", models: [model("MGA Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "1.6", "79hp")] },
      { name: "MG Midget", models: [model("MG Midget Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "1.5", "65hp")] },
      { name: "MGF", models: [model("MGF Mid-Engine Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "1.8", "120hp")] },
      { name: "MG TF", models: [model("MG TF Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "1.8", "135hp")] },
      { name: "ZR", models: [model("MG ZR Hot Hatch", ["Benzin"], ["Manuel"], ["Hatchback"], "1.8", "160hp")] },
      { name: "ZS Classic", models: [model("MG ZS Classic Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.5", "177hp")] },
      { name: "ZT", models: [model("MG ZT Sport Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "190hp")] }
    ]
  },
  {
    name: "Micro (Microlino)",
    series: [
      { name: "Microlino 1.0", models: [model("Microlino 1.0 Launch Edition", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], "Elektrik", "17hp")] },
      { name: "Microlino Dolce", models: [model("Microlino Dolce", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], "Elektrik", "17hp")] },
      { name: "Microlino Competizione", models: [model("Microlino Competizione", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], "Elektrik", "17hp")] },
      { name: "Microlino Lite", models: [model("Microlino Lite L6e", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], "Elektrik", "12hp")] }
    ]
  },
  {
    name: "MINI",
    series: [
      { name: "MINI Cooper J01", models: [model("Cooper E", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "184hp"), model("Cooper SE", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "218hp")] },
      { name: "MINI Cooper F66", models: [model("Cooper C", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "156hp"), model("Cooper S", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "204hp")] },
      { name: "MINI Aceman", models: [model("Aceman J05 EV", ["Elektrik"], ["Otomatik"], ["Crossover"], "Elektrik", "218hp")] },
      { name: "MINI Countryman U25", models: [model("Countryman U25", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "170hp"), model("Countryman U25 Electric", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "313hp")] },
      { name: "MINI F56", models: [model("F56 Cooper", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "136hp"), model("F56 Cooper S", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "192hp"), model("F56 JCW", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "231hp")] },
      { name: "MINI F55", models: [model("F55 Cooper", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "136hp"), model("F55 Cooper S", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "192hp"), model("F55 JCW", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "231hp")] },
      { name: "MINI F57", models: [model("F57 Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "1.5", "136hp"), model("F57 Cooper S Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "2.0", "192hp"), model("F57 JCW Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "2.0", "231hp")] },
      { name: "MINI F54 Clubman", models: [model("F54 Clubman", ["Benzin"], ["Otomatik"], ["Clubman"], "1.5", "136hp"), model("F54 Clubman S", ["Benzin"], ["Otomatik"], ["Clubman"], "2.0", "192hp"), model("F54 JCW Clubman", ["Benzin"], ["Otomatik"], ["Clubman"], "2.0", "306hp")] },
      { name: "MINI F60 Countryman", models: [model("F60 Countryman", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "136hp"), model("F60 Countryman S", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "192hp"), model("F60 JCW Countryman", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "306hp")] },
      { name: "MINI R56", models: [model("R56 Cooper", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "120hp"), model("R56 Cooper S", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "175hp"), model("R56 JCW", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "211hp")] },
      { name: "MINI R55 Clubman", models: [model("R55 Clubman", ["Benzin"], ["Manuel"], ["Clubman"], "1.6", "120hp"), model("R55 Clubman S", ["Benzin"], ["Manuel"], ["Clubman"], "1.6", "175hp"), model("R55 JCW Clubman", ["Benzin"], ["Manuel"], ["Clubman"], "1.6", "211hp")] },
      { name: "MINI R57", models: [model("R57 Convertible", ["Benzin"], ["Manuel"], ["Convertible"], "1.6", "120hp"), model("R57 Cooper S Convertible", ["Benzin"], ["Manuel"], ["Convertible"], "1.6", "175hp")] },
      { name: "MINI R60 Countryman", models: [model("R60 Countryman", ["Benzin"], ["Manuel"], ["SUV"], "1.6", "122hp"), model("R60 Countryman S", ["Benzin"], ["Otomatik"], ["SUV"], "1.6", "184hp"), model("R60 JCW Countryman", ["Benzin"], ["Otomatik"], ["SUV"], "1.6", "218hp")] },
      { name: "MINI R58 Coupe", models: [model("R58 Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "1.6", "122hp")] },
      { name: "MINI R59 Roadster", models: [model("R59 Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "1.6", "122hp")] }
    ]
  },
  {
    name: "Mitsubishi",
    series: [
      { name: "L200 New", models: [model("L200 New 2.4 Biturbo", ["Dizel"], ["Otomatik"], ["Pick-up"], "2.4", "204hp"), model("L200 New Double Cab", ["Dizel"], ["Otomatik"], ["Pick-up"], "2.4", "184hp"), model("L200 New Single Cab", ["Dizel"], ["Manuel"], ["Pick-up"], "2.4", "150hp")] },
      { name: "L200 Triton", models: [model("Triton Double Cab", ["Dizel"], ["Otomatik"], ["Pick-up"], "2.4", "184hp"), model("Triton Single Cab", ["Dizel"], ["Manuel"], ["Pick-up"], "2.4", "150hp")] },
      { name: "L200 5th Gen", models: [model("L200 5th Gen Double Cab", ["Dizel"], ["Otomatik"], ["Pick-up"], "2.4", "181hp"), model("L200 5th Gen Single Cab", ["Dizel"], ["Manuel"], ["Pick-up"], "2.4", "154hp")] },
      { name: "L200 Classic", models: [model("L200 K20", ["Dizel"], ["Manuel"], ["Pick-up"], "2.5", "100hp"), model("L200 K70", ["Dizel"], ["Manuel"], ["Pick-up"], "2.5", "115hp"), model("L200 KA0", ["Dizel"], ["Manuel"], ["Pick-up"], "2.5", "100hp"), model("L200 KB0", ["Dizel"], ["Manuel"], ["Pick-up"], "2.5", "136hp")] },
      { name: "Pajero", models: [model("Pajero 3.2 DI-D", ["Dizel"], ["Otomatik"], ["SUV"], "3.2", "190hp"), model("Pajero V80", ["Dizel"], ["Otomatik"], ["SUV"], "3.2", "190hp"), model("Pajero V90", ["Dizel"], ["Otomatik"], ["SUV"], "3.2", "200hp")] },
      { name: "Pajero Sport", models: [model("Pajero Sport SUV", ["Dizel"], ["Otomatik"], ["SUV"], "2.4", "181hp")] },
      { name: "Outlander", models: [model("Outlander 3rd Gen 2.0", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "150hp"), model("Outlander 3rd Gen 2.4", ["Benzin"], ["Otomatik"], ["SUV"], "2.4", "167hp"), model("Outlander 4th Gen PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], "2.4", "248hp")] },
      { name: "Eclipse Cross", models: [model("Eclipse Cross 1.5 T-GDI", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "163hp"), model("Eclipse Cross PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], "2.4", "188hp")] },
      { name: "ASX New", models: [model("ASX New Renault CMF-B", ["Benzin"], ["Otomatik"], ["SUV"], "1.0", "91hp")] },
      { name: "ASX Classic", models: [model("ASX Mitsubishi GS", ["Benzin"], ["Otomatik"], ["SUV"], "1.6", "117hp")] },
      { name: "Colt", models: [model("Colt Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.0", "91hp")] },
      { name: "Lancer", models: [model("Lancer CS0", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "98hp"), model("Lancer CY0", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "109hp")] },
      { name: "Lancer Evolution", models: [model("Lancer Evolution VII", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "280hp"), model("Lancer Evolution VIII", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "280hp"), model("Lancer Evolution IX", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "286hp"), model("Lancer Evolution X", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "295hp")] },
      { name: "Space Star", models: [model("Space Star Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "80hp")] }
    ]
  },
  {
    name: "Morgan",
    series: [
      { name: "3 Wheeler", models: [model("3 Wheeler S&S V-Twin", ["Benzin"], ["Manuel"], ["ThreeWheeler"], "2.0", "82hp")] },
      { name: "4/4", models: [model("Morgan 4/4 Classic", ["Benzin"], ["Manuel"], ["Roadster"], "1.6", "110hp")] },
      { name: "Aero 8", models: [model("Aero 8 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.4", "367hp")] },
      { name: "Plus 8", models: [model("Plus 8 Rover V8", ["Benzin"], ["Manuel"], ["Roadster"], "3.9", "190hp")] },
      { name: "Plus Four", models: [model("Plus Four BMW 2.0 Turbo", ["Benzin"], ["Manuel", "Otomatik"], ["Roadster"], "2.0", "255hp")] },
      { name: "Plus Six", models: [model("Plus Six BMW 3.0 Inline-6 Turbo", ["Benzin"], ["Otomatik"], ["Roadster"], "3.0", "340hp")] },
      { name: "Roadster", models: [model("Morgan Roadster V6", ["Benzin"], ["Manuel"], ["Roadster"], "3.7", "280hp")] },
      { name: "Super 3", models: [model("Super 3 Ford Engine", ["Benzin"], ["Manuel"], ["ThreeWheeler"], "1.5", "118hp")] }
    ]
  },
  {
    name: "Motolux",
    series: [
      { name: "Acun", models: [model("Acun 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp"), model("Acun 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp")] },
      { name: "F Series", models: [model("F5 Electric Scooter", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "1500W"), model("F7 Electric Scooter", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "2000W"), model("F9 Electric Scooter", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "3000W")] },
      { name: "GT Series", models: [model("GT 20 Electric", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "1500W"), model("GT 22 Electric", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "2000W"), model("GT 25 Electric", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "3000W")] },
      { name: "MTR Series", models: [model("MTR Offroad Electric", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "3000W")] },
      { name: "MTX Series", models: [model("MTX Fat Tire Electric", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "2000W")] },
      { name: "Retro", models: [model("Retro 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp"), model("Retro 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp")] },
      { name: "Rossi", models: [model("Rossi 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp"), model("Rossi 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp"), model("Rossi 200", ["Benzin"], ["Otomatik"], ["Scooter"], "200cc", "14hp")] },
      { name: "RX", models: [model("RX 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp"), model("RX 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp")] },
      { name: "Titan", models: [model("Titan 50", ["Benzin"], ["Otomatik"], ["Scooter"], "50cc", "4hp"), model("Titan 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "9hp")] },
      { name: "VRL Series", models: [model("VRL Electric Long Range", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "3000W")] }
    ]
  },
  {
    name: "Nieve",
    series: [
      { name: "EVZOOM", models: [model("EVZOOM Electric Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "118kW")] },
      { name: "Q-EN", models: [model("Q-EN Micro EV", ["Elektrik"], ["Otomatik"], ["MicroEV"], "Elektrik", "45km/h")] }
    ]
  },
  {
    name: "Nissan",
    series: [
      { name: "Altima", models: [model("Altima Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], "2.5", "200hp"), model("Altima Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "188hp")] },
      { name: "Ariya", models: [model("Ariya EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "242hp")] },
      { name: "Frontier", models: [model("Frontier PHEV", ["PHEV"], ["Otomatik"], ["Pick-up"], "2.4", "268hp"), model("Frontier Pick-Up", ["Benzin"], ["Otomatik"], ["Pick-up"], "3.8", "310hp"), model("Frontier Pro-4X", ["Benzin"], ["Otomatik"], ["Pick-up"], "3.8", "310hp")] },
      { name: "GT-R", models: [model("GT-R R35", ["Benzin"], ["Otomatik"], ["Coupe"], "3.8", "570hp")] },
      { name: "Juke", models: [model("Juke 1.0 DIG-T", ["Benzin"], ["Otomatik"], ["SUV"], "1.0", "114hp")] },
      { name: "LEAF", models: [model("LEAF EV 2026", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "214hp")] },
      { name: "Murano", models: [model("Murano AWD", ["Benzin"], ["Otomatik"], ["SUV"], "3.5", "260hp")] },
      { name: "N7", models: [model("N7 NEV", ["NEV"], ["Otomatik"], ["Sedan"], "Elektrik", "218hp")] },
      { name: "Navara", models: [model("Navara PHEV", ["PHEV"], ["Otomatik"], ["Pick-up"], "2.5", "250hp"), model("Navara Pick-Up", ["Dizel"], ["Otomatik"], ["Pick-up"], "2.3", "190hp"), model("Navara Pro-4X", ["Dizel"], ["Otomatik"], ["Pick-up"], "2.3", "190hp")] },
      { name: "NX8", models: [model("NX8 NEV", ["NEV"], ["Otomatik"], ["SUV"], "Elektrik", "245hp")] },
      { name: "Pathfinder", models: [model("Pathfinder SUV Facelift", ["Benzin"], ["Otomatik"], ["SUV"], "3.5", "284hp")] },
      { name: "Qashqai", models: [model("Qashqai Mild Hybrid 1.3 DIG-T", ["Mild Hybrid"], ["Otomatik"], ["SUV"], "1.3", "158hp"), model("Qashqai e-POWER", ["ePOWER"], ["Otomatik"], ["SUV"], "1.5", "190hp")] },
      { name: "Sentra", models: [model("Sentra Sedan 2026", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "149hp")] },
      { name: "Townstar", models: [model("Townstar Combi", ["Benzin"], ["Otomatik"], ["Van"], "1.3", "130hp"), model("Townstar EV", ["Elektrik"], ["Otomatik"], ["Van"], "Elektrik", "122hp"), model("Townstar Van", ["Benzin"], ["Otomatik"], ["Van"], "1.3", "130hp")] },
      { name: "Versa", models: [model("Versa Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "122hp")] },
      { name: "X-Trail", models: [model("X-Trail 1.5 VC-T Mild Hybrid", ["Mild Hybrid"], ["Otomatik"], ["SUV"], "1.5", "163hp"), model("X-Trail 5 Koltuk", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "163hp"), model("X-Trail 7 Koltuk", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "163hp")] },
      { name: "Z", models: [model("Fairlady Z Twin-Turbo", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "400hp"), model("Z NISMO", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "420hp")] }
    ]
  },
  {
    name: "Plymouth",
    series: [
      { name: "Arrow Truck", models: [model("Arrow Truck Pick-Up", ["Benzin"], ["Manuel"], ["Pick-up"], "2.0", "95hp")] },
      { name: "Barracuda", models: [model("Barracuda Convertible", ["Benzin"], ["Manuel"], ["Convertible"], "5.6", "275hp"), model("Barracuda Hardtop Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "5.2", "230hp"), model("Cuda 426 HEMI", ["Benzin"], ["Manuel"], ["Coupe"], "7.0", "425hp")] },
      { name: "Belvedere", models: [model("Belvedere Hardtop", ["Benzin"], ["Manuel"], ["Hardtop"], "5.2", "230hp"), model("Belvedere Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "5.2", "230hp")] },
      { name: "Duster", models: [model("Duster 340", ["Benzin"], ["Manuel"], ["Coupe"], "5.6", "275hp"), model("Duster Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "3.7", "145hp")] },
      { name: "Fury", models: [model("Fury Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.9", "250hp"), model("Fury Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.9", "250hp")] },
      { name: "GTX", models: [model("GTX Convertible", ["Benzin"], ["Manuel"], ["Convertible"], "7.2", "375hp"), model("GTX Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "7.2", "375hp")] },
      { name: "Road Runner", models: [model("Road Runner 440 Six Pack", ["Benzin"], ["Manuel"], ["Coupe"], "7.2", "390hp"), model("Road Runner Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "6.3", "335hp")] },
      { name: "Savoy", models: [model("Savoy Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "3.7", "145hp")] },
      { name: "Superbird", models: [model("Superbird NASCAR Edition", ["Benzin"], ["Manuel"], ["Coupe"], "7.0", "425hp")] },
      { name: "Trailduster", models: [model("Trailduster 4x4 SUV", ["Benzin"], ["Manuel"], ["SUV"], "5.2", "160hp")] },
      { name: "Valiant", models: [model("Valiant Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "3.7", "145hp"), model("Valiant Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "3.7", "145hp"), model("Valiant Slant-Six", ["Benzin"], ["Manuel"], ["Sedan"], "3.7", "145hp")] }
    ]
  },
  {
    name: "Polestar",
    series: [
      { name: "Polestar 2", models: [model("Polestar 2 Long Range Dual Motor", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "421hp"), model("Polestar 2 Long Range Single Motor", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "299hp"), model("Polestar 2 Performance Pack", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "476hp")] },
      { name: "Polestar 3", models: [model("Polestar 3 LiDAR Edition", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "517hp"), model("Polestar 3 Performance Pack", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "517hp"), model("Polestar 3 SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "489hp")] },
      { name: "Polestar 4", models: [model("Polestar 4 LiDAR Edition", ["Elektrik"], ["Otomatik"], ["CoupeSUV"], "Elektrik", "544hp"), model("Polestar 4 Performance Pack", ["Elektrik"], ["Otomatik"], ["CoupeSUV"], "Elektrik", "544hp"), model("Polestar 4 SUV Coupe", ["Elektrik"], ["Otomatik"], ["CoupeSUV"], "Elektrik", "544hp")] },
      { name: "Polestar 5", models: [model("Polestar 5 GT EV", ["Elektrik"], ["Otomatik"], ["GT"], "Elektrik", "884hp")] },
      { name: "Polestar 6", models: [model("Polestar 6 Roadster EV", ["Elektrik"], ["Otomatik"], ["Roadster"], "Elektrik", "884hp")] },
      { name: "S60 Polestar Engineered", models: [model("S60 Polestar Engineered Hybrid", ["Hibrit"], ["Otomatik"], ["Sedan"], "2.0", "455hp")] },
      { name: "V60 Polestar Engineered", models: [model("V60 Polestar Engineered Wagon", ["Hibrit"], ["Otomatik"], ["Station Wagon"], "2.0", "455hp")] },
      { name: "XC60 Polestar Engineered", models: [model("XC60 Polestar Engineered SUV", ["Hibrit"], ["Otomatik"], ["SUV"], "2.0", "455hp")] }
    ]
  },
  {
    name: "Pontiac",
    series: [
      { name: "Bonneville", models: [model("Bonneville Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "260hp")] },
      { name: "Fiero", models: [model("Fiero Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "2.5", "92hp"), model("Fiero GT", ["Benzin"], ["Manuel"], ["Coupe"], "2.8", "140hp")] },
      { name: "Firebird", models: [model("Firebird Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "5.0", "215hp"), model("Firebird Formula", ["Benzin"], ["Manuel"], ["Coupe"], "5.7", "305hp"), model("Firebird Trans Am", ["Benzin"], ["Manuel"], ["Coupe"], "5.7", "325hp")] },
      { name: "G8", models: [model("G8 GT", ["Benzin"], ["Otomatik"], ["Sedan"], "6.0", "361hp"), model("G8 GXP", ["Benzin"], ["Manuel"], ["Sedan"], "6.2", "415hp")] },
      { name: "GTO Classic", models: [model("GTO 1964", ["Benzin"], ["Manuel"], ["Coupe"], "6.4", "325hp"), model("GTO 1965", ["Benzin"], ["Manuel"], ["Coupe"], "6.4", "335hp"), model("GTO 1966", ["Benzin"], ["Manuel"], ["Coupe"], "6.4", "360hp"), model("GTO Judge", ["Benzin"], ["Manuel"], ["Coupe"], "6.6", "366hp"), model("GTO Ram Air", ["Benzin"], ["Manuel"], ["Coupe"], "6.6", "370hp")] },
      { name: "GTO Modern", models: [model("GTO LS1", ["Benzin"], ["Manuel"], ["Coupe"], "5.7", "350hp"), model("GTO LS2", ["Benzin"], ["Manuel"], ["Coupe"], "6.0", "400hp")] },
      { name: "Grand Am", models: [model("Grand Am Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.4", "170hp"), model("Grand Am Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.4", "170hp")] },
      { name: "Grand Prix", models: [model("Grand Prix Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.7", "250hp"), model("Grand Prix Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.8", "200hp")] },
      { name: "LeMans", models: [model("LeMans Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "5.3", "250hp"), model("LeMans Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "5.3", "250hp")] },
      { name: "Solstice", models: [model("Solstice GXP", ["Benzin"], ["Manuel"], ["Roadster"], "2.0", "260hp"), model("Solstice Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "2.4", "177hp")] },
      { name: "Sunfire", models: [model("Sunfire Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.2", "115hp"), model("Sunfire Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.2", "115hp")] }
    ]
  },
  {
    name: "Porsche",
    series: [
      { name: "911 964", models: [model("911 Carrera", ["Benzin"], ["Manuel"], ["Coupe"], "3.6", "250hp"), model("911 Turbo", ["Benzin"], ["Manuel"], ["Coupe"], "3.3", "320hp")] },
      { name: "911 993", models: [model("911 Carrera", ["Benzin"], ["Manuel"], ["Coupe"], "3.6", "272hp"), model("911 Turbo", ["Benzin"], ["Manuel"], ["Coupe"], "3.6", "408hp")] },
      { name: "911 996", models: [model("911 Carrera", ["Benzin"], ["Otomatik"], ["Coupe"], "3.6", "320hp"), model("911 Turbo", ["Benzin"], ["Otomatik"], ["Coupe"], "3.6", "420hp")] },
      { name: "911 997", models: [model("911 Carrera", ["Benzin"], ["Otomatik"], ["Coupe"], "3.6", "325hp"), model("911 Carrera 4S", ["Benzin"], ["Otomatik"], ["Coupe"], "3.8", "355hp"), model("911 GT3 RS", ["Benzin"], ["Otomatik"], ["Coupe"], "3.8", "450hp")] },
      { name: "911 991", models: [model("911 Carrera", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "370hp"), model("911 Carrera S", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "420hp"), model("911 GT3", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "500hp"), model("911 Turbo S", ["Benzin"], ["Otomatik"], ["Coupe"], "3.8", "580hp")] },
      { name: "911 992", models: [model("911 Carrera", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "385hp"), model("911 Carrera 4S", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "450hp"), model("911 Carrera S", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "450hp"), model("911 Carrera T", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "385hp"), model("911 GT3", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "510hp"), model("911 GT3 RS", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "525hp"), model("911 GTS", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "480hp"), model("911 T-Hybrid GTS", ["THybrid"], ["Otomatik"], ["Coupe"], "3.6", "541hp"), model("911 Turbo", ["Benzin"], ["Otomatik"], ["Coupe"], "3.8", "580hp"), model("911 Turbo S", ["Benzin"], ["Otomatik"], ["Coupe"], "3.8", "650hp")] },
      { name: "911 F-Series", models: [model("911 Early Classic", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "130hp")] },
      { name: "911 G-Series", models: [model("911 Classic Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "3.0", "180hp")] },
      { name: "718 981", models: [model("981 Boxster", ["Benzin"], ["Otomatik"], ["Roadster"], "2.7", "265hp"), model("981 Cayman", ["Benzin"], ["Otomatik"], ["Coupe"], "2.7", "275hp")] },
      { name: "718 982", models: [model("718 Boxster", ["Benzin"], ["Otomatik"], ["Roadster"], "2.0", "300hp"), model("718 Boxster S", ["Benzin"], ["Otomatik"], ["Roadster"], "2.5", "350hp"), model("718 Cayman", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "300hp"), model("718 Cayman S", ["Benzin"], ["Otomatik"], ["Coupe"], "2.5", "350hp"), model("718 GT4 RS", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "500hp"), model("718 GTS 4.0", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "400hp"), model("718 Spyder RS", ["Benzin"], ["Otomatik"], ["Roadster"], "4.0", "500hp"), model("718 Style Edition", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "300hp")] },
      { name: "718 986", models: [model("986 Boxster", ["Benzin"], ["Manuel"], ["Roadster"], "2.7", "220hp")] },
      { name: "718 987", models: [model("987 Boxster", ["Benzin"], ["Manuel"], ["Roadster"], "2.7", "240hp"), model("987 Cayman", ["Benzin"], ["Manuel"], ["Coupe"], "2.7", "245hp")] },
      { name: "Cayenne", models: [model("Cayenne Coupe", ["Benzin"], ["Otomatik"], ["SUV"], "3.0", "353hp"), model("Cayenne E-Hybrid", ["PHEV"], ["Otomatik"], ["SUV"], "3.0", "470hp"), model("Cayenne Electric", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "600hp"), model("Cayenne SUV", ["Benzin"], ["Otomatik"], ["SUV"], "3.0", "353hp"), model("Cayenne Turbo E-Hybrid", ["PHEV"], ["Otomatik"], ["SUV"], "4.0", "739hp")] },
      { name: "Macan", models: [model("Macan", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "265hp"), model("Macan Electric", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "408hp"), model("Macan S", ["Benzin"], ["Otomatik"], ["SUV"], "2.9", "380hp"), model("Macan Turbo", ["Benzin"], ["Otomatik"], ["SUV"], "2.9", "440hp")] },
      { name: "Panamera", models: [model("Panamera E-Hybrid", ["PHEV"], ["Otomatik"], ["Sedan"], "2.9", "470hp"), model("Panamera Executive", ["Benzin"], ["Otomatik"], ["Sedan"], "2.9", "353hp"), model("Panamera Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.9", "353hp")] },
      { name: "Taycan", models: [model("Taycan Cross Turismo", ["Elektrik"], ["Otomatik"], ["Turismo"], "Elektrik", "476hp"), model("Taycan Sedan", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "408hp"), model("Taycan Sport Turismo", ["Elektrik"], ["Otomatik"], ["Turismo"], "Elektrik", "517hp")] }
    ]
  },
  {
    name: "Proton",
    series: [
      { name: "315", models: [model("Proton 315 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.5", "85hp")] },
      { name: "416", models: [model("Proton 416 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "110hp")] },
      { name: "418", models: [model("Proton 418 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.8", "138hp")] },
      { name: "e.MAS 7", models: [model("e.MAS 7 EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "218hp"), model("e.MAS 7 PHEV", ["PHEV"], ["Otomatik"], ["SUV"], "1.5", "245hp")] },
      { name: "Gen 2", models: [model("Gen 2 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "110hp")] },
      { name: "Persona", models: [model("Persona Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "109hp")] },
      { name: "S70", models: [model("S70 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "150hp")] },
      { name: "Satria", models: [model("Satria Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.3", "75hp")] },
      { name: "Satria Neo", models: [model("Satria Neo Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "111hp")] },
      { name: "Savvy", models: [model("Savvy Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "75hp")] },
      { name: "Waja", models: [model("Waja Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "103hp")] },
      { name: "X50", models: [model("X50 Compact SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "177hp")] },
      { name: "X70", models: [model("X70 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "177hp")] },
      { name: "X90", models: [model("X90 7-Seater SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "190hp")] }
    ]
  },
  {
    name: "Reeder ReeV",
    series: [
      { name: "ReeV Aura", models: [model("ReeV Aura EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "80hp")] },
      { name: "ReeV Fancy", models: [model("ReeV Fancy L7e", ["Elektrik"], ["Otomatik"], ["MicroEV"], "Elektrik", "45km/h")] }
    ]
  },
  {
    name: "Regal Raptor",
    series: [
      { name: "Cafe Racer", models: [model("Cafe Racer 125", ["Benzin"], ["Manuel"], ["Chopper"], "125cc", "11hp")] },
      { name: "Classic", models: [model("Classic 125", ["Benzin"], ["Manuel"], ["Chopper"], "125cc", "11hp")] },
      { name: "Daytona", models: [model("Daytona 125", ["Benzin"], ["Manuel"], ["Cruiser"], "125cc", "11hp"), model("Daytona 250S", ["Benzin"], ["Manuel"], ["Cruiser"], "250cc", "19hp"), model("Daytona 250V", ["Benzin"], ["Manuel"], ["Cruiser"], "250cc", "19hp"), model("Daytona 350", ["Benzin"], ["Manuel"], ["Cruiser"], "350cc", "27hp")] },
      { name: "DY", models: [model("DY 250", ["Benzin"], ["Manuel"], ["Cruiser"], "250cc", "19hp")] },
      { name: "F320", models: [model("F320 ATV", ["Benzin"], ["Otomatik"], ["ATV"], "320cc", "20hp")] },
      { name: "K Series", models: [model("K4 Electric Micro Car", ["Elektrik"], ["Otomatik"], ["MicroCar"], "Elektrik", "45km/h"), model("K5 Electric Micro Car", ["Elektrik"], ["Otomatik"], ["MicroCar"], "Elektrik", "45km/h"), model("K5 Long", ["Elektrik"], ["Otomatik"], ["MicroCar"], "Elektrik", "45km/h"), model("K5 Van", ["Elektrik"], ["Otomatik"], ["Van"], "Elektrik", "45km/h")] },
      { name: "M210", models: [model("M210 ATV", ["Benzin"], ["Otomatik"], ["ATV"], "210cc", "15hp")] },
      { name: "Max", models: [model("Max 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "11hp")] },
      { name: "Pilder", models: [model("Pilder 125", ["Benzin"], ["Manuel"], ["Chopper"], "125cc", "11hp"), model("Pilder 250", ["Benzin"], ["Manuel"], ["Chopper"], "250cc", "19hp")] },
      { name: "Promax", models: [model("Promax 500 ATV", ["Benzin"], ["Otomatik"], ["ATV"], "500cc", "38hp")] },
      { name: "RG Series", models: [model("RG Electric Trike", ["Elektrik"], ["Otomatik"], ["Trike"], "Elektrik", "3000W")] },
      { name: "Shark", models: [model("Shark 250", ["Benzin"], ["Manuel"], ["Cruiser"], "250cc", "19hp")] },
      { name: "SPN", models: [model("SPN 125 Naked", ["Benzin"], ["Manuel"], ["Naked"], "125cc", "11hp")] },
      { name: "XSUV", models: [model("XSUV 125", ["Benzin"], ["Otomatik"], ["Scooter"], "125cc", "11hp"), model("XSUV 250", ["Benzin"], ["Otomatik"], ["Scooter"], "250cc", "19hp")] }
    ]
  },
  {
    name: "Relive",
    series: [
      { name: "BAW01", models: [model("Relive BAW01 EV", ["Elektrik"], ["Otomatik"], ["MicroEV"], "Elektrik", "45km/h")] },
      { name: "EZI", models: [model("Relive EZI Light Truck", ["Elektrik"], ["Otomatik"], ["LightTruck"], "Elektrik", "45km/h")] },
      { name: "N1", models: [model("Relive N1 EV", ["Elektrik"], ["Otomatik"], ["MicroEV"], "Elektrik", "45km/h")] }
    ]
  },
  {
    name: "Audi",
    series: [
      { name: "100", models: [model("Audi 100 Avant", ["Benzin"], ["Manuel"], ["Station Wagon"], "2.3", "136hp"), model("Audi 100 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.3", "136hp")] },
      { name: "200", models: [model("Audi 200 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.2", "165hp")] },
      { name: "200 Serisi", models: [model("2.2", ["Benzin"], ["Otomatik"], ["Sedan"], "2.2", "165hp")] },
      { name: "80", models: [model("Audi 80 Avant", ["Benzin"], ["Manuel"], ["Station Wagon"], "2.0", "115hp"), model("Audi 80 Cabriolet", ["Benzin"], ["Manuel"], ["Cabrio"], "2.3", "133hp"), model("Audi 80 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "115hp")] },
      { name: "80 Serisi", models: [model("1.6", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "71hp"), model("1.6 D", ["Dizel"], ["Manuel"], ["Sedan"], "1.6", "54hp"), model("1.6 TD", ["Dizel"], ["Manuel"], ["Sedan"], "1.6", "80hp"), model("1.8", ["Benzin"], ["Manuel"], ["Sedan"], "1.8", "90hp"), model("1.8 S", ["Benzin"], ["Manuel"], ["Sedan"], "1.8", "90hp"), model("1.9", ["Benzin"], ["Manuel"], ["Sedan"], "1.9", "113hp"), model("1.9 TDI", ["Dizel"], ["Manuel"], ["Sedan"], "1.9", "90hp"), model("2.0", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "115hp"), model("2.0 Quattro", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "115hp"), model("2.6", ["Benzin"], ["Otomatik"], ["Sedan"], "2.6", "150hp")] },
      { name: "90", models: [model("Audi 90 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.3", "136hp")] },
      { name: "A1", models: [model("1.4 TFSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "125hp"), model("1.6 TDI", ["Dizel"], ["Manuel"], ["Hatchback"], "1.6", "116hp"), model("25 TFSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.0", "95hp"), model("30 TFSI", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.0", "110hp"), model("35 TFSI", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "150hp"), model("A1 Allstreet", ["Benzin"], ["Otomatik"], ["Crossover"], "1.0", "110hp"), model("A1 Citycarver", ["Benzin"], ["Otomatik"], ["Crossover"], "1.0", "110hp"), model("A1 Hatchback 3 Kapı", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "86hp"), model("A1 Sportback 5 Kapı", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.4", "125hp"), model("Ambition", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "122hp"), model("Attraction", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "86hp"), model("Basic", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "95hp"), model("Dynamic", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.0", "110hp"), model("S Line", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "150hp"), model("Sport", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.4", "125hp")] },
      { name: "A2", models: [model("A2 e-tron", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "115hp"), model("A2 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "75hp")] },
      { name: "A3", models: [model("1.0 TFSI", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback", "Sportback"], "1.0", "110hp"), model("1.2 TFSI", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback", "Sportback"], "1.2", "105hp"), model("1.4 TFSI", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Hatchback", "Sportback", "Cabrio"], "1.4", "125hp"), model("1.5 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Sportback", "Cabrio"], "1.5", "150hp"), model("1.6", ["Benzin"], ["Manuel"], ["Sedan", "Hatchback", "Sportback", "Cabrio"], "1.6", "102hp"), model("1.6 FSI", ["Benzin"], ["Manuel"], ["Hatchback", "Sportback"], "1.6", "115hp"), model("1.6 TDI", ["Dizel"], ["Manuel"], ["Sedan", "Hatchback", "Sportback"], "1.6", "116hp"), model("1.8", ["Benzin"], ["Manuel"], ["Hatchback", "Sportback"], "1.8", "125hp"), model("1.8 T", ["Benzin"], ["Manuel"], ["Hatchback", "Sportback"], "1.8", "150hp"), model("1.8 TFSI", ["Benzin"], ["Otomatik"], ["Hatchback", "Sportback", "Cabrio"], "1.8", "160hp"), model("1.9 TDI", ["Dizel"], ["Manuel"], ["Hatchback", "Sportback", "Cabrio"], "1.9", "105hp"), model("2.0 FSI", ["Benzin"], ["Otomatik"], ["Hatchback", "Sportback"], "2.0", "150hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Hatchback", "Sportback"], "2.0", "150hp"), model("2.0 TFSI", ["Benzin"], ["Otomatik"], ["Sportback"], "2.0", "190hp"), model("30 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Sportback"], "2.0", "116hp"), model("30 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Hatchback"], "1.0", "110hp"), model("35 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("35 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Hatchback"], "1.5", "150hp"), model("40 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("A3 Cabrio", ["Benzin"], ["Otomatik"], ["Cabrio"], "1.5", "150hp"), model("A3 Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "1.5", "150hp"), model("A3 Hatchback", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.4", "125hp"), model("A3 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "150hp"), model("A3 Sportback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.5", "150hp"), model("S3", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "310hp")] },
      { name: "A4", models: [model("1.4 TFSI", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], "1.4", "150hp"), model("1.4 TFSI Design", ["Benzin"], ["Otomatik"], ["Sedan"], "1.4", "150hp"), model("1.4 TFSI Dynamic", ["Benzin"], ["Otomatik"], ["Sedan"], "1.4", "150hp"), model("1.4 TFSI Sport", ["Benzin"], ["Otomatik"], ["Sedan"], "1.4", "150hp"), model("1.6", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "102hp"), model("1.8", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon"], "1.8", "125hp"), model("1.8 T", ["Benzin"], ["Manuel"], ["Sedan", "Station Wagon", "Cabrio"], "1.8", "150hp"), model("1.8 T Quattro", ["Benzin"], ["Manuel"], ["Sedan"], "1.8", "163hp"), model("1.8 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], "1.8", "160hp"), model("1.9 TDI", ["Dizel"], ["Manuel"], ["Sedan", "Station Wagon"], "1.9", "130hp"), model("2.0", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "150hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon", "Cabrio"], "2.0", "150hp"), model("2.0 TDI Advanced", ["Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "163hp"), model("2.0 TDI Design", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "150hp"), model("2.0 TDI Dynamic", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "150hp"), model("2.0 TDI Quattro", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("2.0 TDI Quattro Design", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "190hp"), model("2.0 TDI Quattro Dynamic", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("2.0 TDI Quattro Sport", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "190hp"), model("2.0 TDI S Line", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("2.0 TDI Sport", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "150hp"), model("2.0 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("2.0 TFSI Quattro", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "252hp"), model("2.0 TFSI Quattro S Line", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "252hp"), model("2.4", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "170hp"), model("2.5 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon", "Cabrio"], "2.5", "180hp"), model("2.5 TDI Quattro", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.5", "180hp"), model("2.7", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.7", "193hp"), model("2.7 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.7", "190hp"), model("2.8 Quattro", ["Benzin"], ["Otomatik"], ["Sedan"], "2.8", "210hp"), model("3.0", ["Benzin"], ["Otomatik"], ["Sedan", "Cabrio"], "3.0", "220hp"), model("3.0 Quattro", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], "3.0", "272hp"), model("3.0 TDI Quattro", ["Dizel"], ["Otomatik"], ["Sedan", "Cabrio"], "3.0", "245hp"), model("3.2 FSI", ["Benzin"], ["Otomatik"], ["Sedan"], "3.2", "255hp"), model("35 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "163hp"), model("35 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("40 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "204hp"), model("40 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("45 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "245hp"), model("A4 Allroad Quattro", ["Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "204hp"), model("A4 Avant", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.0", "204hp"), model("A4 Cabrio", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.0", "220hp"), model("A4 Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.0", "220hp"), model("A4 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "204hp"), model("Advanced", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("Design", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("Quattro Advanced", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "204hp"), model("Quattro Dynamic", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "204hp"), model("Quattro S Line", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "204hp"), model("S Line", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "150hp")] },
      { name: "A5", models: [model("1.4 TFSI Design", ["Benzin"], ["Otomatik"], ["Coupe", "Sportback"], "1.4", "150hp"), model("1.4 TFSI Dynamic", ["Benzin"], ["Otomatik"], ["Coupe", "Sportback"], "1.4", "150hp"), model("1.4 TFSI Sport", ["Benzin"], ["Otomatik"], ["Coupe", "Sportback"], "1.4", "150hp"), model("1.8 TFSI", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Sportback"], "1.8", "170hp"), model("1.8 TFSI S Line", ["Benzin"], ["Otomatik"], ["Coupe"], "1.8", "170hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Coupe", "Cabrio", "Sportback"], "2.0", "190hp"), model("2.0 TDI Quattro", ["Dizel"], ["Otomatik"], ["Station Wagon", "Coupe", "Sedan", "Sportback"], "2.0", "204hp"), model("2.0 TDI Quattro Design", ["Dizel"], ["Otomatik"], ["Sportback"], "2.0", "190hp"), model("2.0 TDI Quattro Sport", ["Dizel"], ["Otomatik"], ["Sportback"], "2.0", "190hp"), model("2.0 TFSI", ["Benzin"], ["Otomatik"], ["Coupe", "Sedan", "Sportback"], "2.0", "252hp"), model("2.0 TFSI Quattro", ["Benzin"], ["Otomatik"], ["Station Wagon", "Coupe", "Cabrio", "Sedan", "Sportback"], "2.0", "252hp"), model("2.0 TFSI Quattro Sport", ["Benzin"], ["Otomatik"], ["Sportback"], "2.0", "252hp"), model("2.7 TDI", ["Dizel"], ["Otomatik"], ["Coupe"], "2.7", "190hp"), model("3.0 TDI", ["Dizel"], ["Otomatik"], ["Sportback"], "3.0", "245hp"), model("3.0 TDI Quattro", ["Dizel"], ["Otomatik"], ["Coupe", "Cabrio", "Sportback"], "3.0", "245hp"), model("3.2 FSI Quattro", ["Benzin"], ["Otomatik"], ["Sportback"], "3.2", "265hp"), model("40 TDI", ["Dizel"], ["Otomatik"], ["Coupe", "Cabrio", "Sportback"], "2.0", "204hp"), model("45 TFSI", ["Benzin"], ["Otomatik"], ["Coupe", "Cabrio", "Sportback"], "2.0", "265hp"), model("A5 Avant", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.0", "204hp"), model("A5 Cabrio", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.0", "265hp"), model("A5 Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.0", "265hp"), model("A5 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "265hp"), model("A5 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "204hp"), model("A5 Sportback", ["Benzin"], ["Otomatik"], ["Sportback"], "2.0", "204hp")] },
      { name: "A6", models: [model("1.8 T", ["Benzin"], ["Manuel"], ["Sedan"], "1.8", "150hp"), model("1.9 TDI", ["Dizel"], ["Manuel"], ["Sedan", "Station Wagon"], "1.9", "130hp"), model("2.0", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "190hp"), model("2.0 TDI Quattro", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "204hp"), model("2.0 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "252hp"), model("2.0 TFSI Quattro", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "252hp"), model("2.4", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.4", "177hp"), model("2.4 Quattro", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "177hp"), model("2.5 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Sedan", "Station Wagon"], "2.5", "180hp"), model("2.5 TDI Quattro", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.5", "180hp"), model("2.7 T", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.7", "250hp"), model("2.7 T Quattro", ["Benzin"], ["Otomatik"], ["Sedan"], "2.7", "250hp"), model("2.7 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.7", "190hp"), model("2.7 TDI Quattro", ["Dizel"], ["Otomatik"], ["Sedan"], "2.7", "190hp"), model("2.8", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.8", "204hp"), model("3.0", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "220hp"), model("3.0 Quattro", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "300hp"), model("3.0 TDI", ["Dizel"], ["Otomatik"], ["Station Wagon"], "3.0", "286hp"), model("3.0 TDI Quattro", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "3.0", "286hp"), model("3.0 TFSI Quattro", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "340hp"), model("3.2 FSI Quattro", ["Benzin"], ["Otomatik"], ["Sedan"], "3.2", "255hp"), model("35 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "163hp"), model("40 TDI", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "204hp"), model("45 TFSI", ["Benzin"], ["Otomatik"], ["Sedan", "Station Wagon"], "2.0", "265hp"), model("50 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "286hp"), model("55 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "340hp"), model("A6 Allroad Quattro", ["Dizel"], ["Otomatik"], ["Station Wagon"], "3.0", "286hp"), model("A6 Avant", ["Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "204hp"), model("A6 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "204hp"), model("4.2 FSI", ["Benzin"], ["Otomatik"], ["Station Wagon"], "4.2", "350hp")] },
      { name: "A6 e-tron", models: [model("A6 Avant e-tron", ["Elektrik"], ["Otomatik"], ["Station Wagon"], "Elektrik", "428hp"), model("A6 E-Tron Avant", ["Elektrik"], ["Otomatik"], ["Station Wagon"], "Elektrik", "428hp"), model("A6 E-Tron Sportback", ["Elektrik"], ["Otomatik"], ["Sportback"], "Elektrik", "428hp"), model("A6 Sportback e-tron", ["Elektrik"], ["Otomatik"], ["Sportback"], "Elektrik", "428hp"), model("Performance", ["Elektrik"], ["Otomatik"], ["Sportback"], "Elektrik", "428hp"), model("S6 Avant e-tron", ["Elektrik"], ["Otomatik"], ["Station Wagon"], "Elektrik", "503hp"), model("S6 Sportback e-tron", ["Elektrik"], ["Otomatik"], ["Sportback"], "Elektrik", "503hp"), model("Standart", ["Elektrik"], ["Otomatik"], ["Station Wagon", "Sportback"], "Elektrik", "381hp")] },
      { name: "A7", models: [model("2.0 TFSI", ["Benzin"], ["Otomatik"], ["Sportback"], "2.0", "252hp"), model("3.0 TDI", ["Dizel"], ["Otomatik"], ["Sportback"], "3.0", "272hp"), model("3.0 TFSI", ["Benzin"], ["Otomatik"], ["Sportback"], "3.0", "340hp"), model("40 TDI", ["Dizel"], ["Otomatik"], ["Sportback"], "2.0", "204hp"), model("45 TFSI", ["Benzin"], ["Otomatik"], ["Sportback"], "2.0", "265hp"), model("50 TDI", ["Dizel"], ["Otomatik"], ["Sportback"], "3.0", "286hp"), model("55 TFSI", ["Benzin"], ["Otomatik"], ["Sportback"], "3.0", "340hp"), model("A7 Sportback", ["Benzin"], ["Otomatik"], ["Sportback"], "3.0", "340hp")] },
      { name: "A8", models: [model("2.0 TFSI Quattro", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "252hp"), model("2.5 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.5", "150hp"), model("2.5 TDI Quattro", ["Dizel"], ["Otomatik"], ["Sedan"], "2.5", "180hp"), model("2.8", ["Benzin"], ["Otomatik"], ["Sedan"], "2.8", "193hp"), model("3.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "250hp"), model("3.7", ["Benzin"], ["Otomatik"], ["Sedan"], "3.7", "280hp"), model("4.0 TDI Quattro", ["Dizel"], ["Otomatik"], ["Sedan"], "4.0", "435hp"), model("4.0 TFSI Quattro", ["Benzin"], ["Otomatik"], ["Sedan"], "4.0", "435hp"), model("4.2", ["Benzin"], ["Otomatik"], ["Sedan"], "4.2", "310hp"), model("4.2 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "4.2", "350hp"), model("50 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "286hp"), model("55 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "340hp"), model("60 TFSI", ["Benzin"], ["Otomatik"], ["Sedan"], "4.0", "460hp"), model("A8 L", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "340hp"), model("A8 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "340hp"), model("Quattro Long", ["Benzin", "Dizel"], ["Otomatik"], ["Sedan"], "3.0", "340hp")] },
      { name: "Cabrio", models: [model("2.0", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.0", "115hp")] },
      { name: "Coupe", models: [model("Audi Coupe B2", ["Benzin"], ["Manuel"], ["Coupe"], "2.2", "115hp"), model("Audi Coupe B3", ["Benzin"], ["Manuel"], ["Coupe"], "2.3", "136hp")] },
      { name: "Q Serisi", models: [model("Q2", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("Q3", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("Q5", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "2.0", "204hp"), model("Q7", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "286hp"), model("Q8", ["Benzin", "Dizel"], ["Otomatik"], ["SUV"], "3.0", "340hp")] },
      { name: "Q2", models: [model("Q2 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("SQ2", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "300hp")] },
      { name: "Q3", models: [model("Q3 Sportback", ["Benzin"], ["Otomatik"], ["Sportback"], "1.5", "150hp"), model("Q3 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("RS Q3", ["Benzin"], ["Otomatik"], ["SUV"], "2.5", "400hp"), model("RS Q3 Sportback", ["Benzin"], ["Otomatik"], ["Sportback"], "2.5", "400hp")] },
      { name: "Q4 e-tron", models: [model("Q4 e-tron SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "204hp"), model("Q4 Sportback e-tron", ["Elektrik"], ["Otomatik"], ["Sportback"], "Elektrik", "204hp")] },
      { name: "Q5", models: [model("Q5 Sportback", ["Dizel"], ["Otomatik"], ["Sportback"], "2.0", "204hp"), model("Q5 SUV", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "204hp"), model("SQ5", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "341hp"), model("SQ5 Sportback", ["Dizel"], ["Otomatik"], ["Sportback"], "3.0", "341hp")] },
      { name: "Q6 e-tron", models: [model("Q6 e-tron SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "387hp"), model("Q6 Sportback e-tron", ["Elektrik"], ["Otomatik"], ["Sportback"], "Elektrik", "387hp"), model("SQ6 e-tron", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "517hp")] },
      { name: "Q7", models: [model("Q7 SUV", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "286hp"), model("SQ7", ["Dizel"], ["Otomatik"], ["SUV"], "4.0", "507hp")] },
      { name: "Q8", models: [model("Q8 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "3.0", "340hp"), model("RS Q8 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "600hp"), model("SQ8 SUV", ["Dizel"], ["Otomatik"], ["SUV"], "4.0", "435hp")] },
      { name: "Q8 e-tron", models: [model("Q8 e-tron SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "408hp"), model("Q8 Sportback e-tron", ["Elektrik"], ["Otomatik"], ["Sportback"], "Elektrik", "408hp"), model("SQ8 e-tron", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "503hp"), model("SQ8 Sportback e-tron", ["Elektrik"], ["Otomatik"], ["Sportback"], "Elektrik", "503hp")] },
      { name: "Q9", models: [model("Q9 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "3.0", "340hp")] },
      { name: "Quattro", models: [model("Ur-Quattro Sport", ["Benzin"], ["Manuel"], ["Coupe"], "2.1", "200hp")] },
      { name: "R8", models: [model("4.2 FSI", ["Benzin"], ["Otomatik"], ["Coupe"], "4.2", "420hp"), model("5.2 FSI", ["Benzin"], ["Otomatik"], ["Coupe"], "5.2", "525hp"), model("R8 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.2", "570hp"), model("R8 Spyder", ["Benzin"], ["Otomatik"], ["Spyder"], "5.2", "570hp")] },
      { name: "RS", models: [model("RS 3", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "400hp"), model("RS 4", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.9", "450hp"), model("RS 5", ["Benzin"], ["Otomatik"], ["Coupe"], "2.9", "450hp"), model("RS 6", ["Benzin"], ["Otomatik"], ["Station Wagon"], "4.0", "600hp"), model("RS 7", ["Benzin"], ["Otomatik"], ["Sportback"], "4.0", "630hp"), model("RS Q8", ["Benzin"], ["Otomatik"], ["SUV"], "4.0", "600hp"), model("RS3", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "400hp"), model("RS4", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.9", "450hp"), model("RS5", ["Benzin"], ["Otomatik"], ["Coupe"], "2.9", "450hp"), model("RS6", ["Benzin"], ["Otomatik"], ["Station Wagon"], "4.0", "600hp")] },
      { name: "RS 3", models: [model("RS 3 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "400hp"), model("RS 3 Sportback", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.5", "400hp")] },
      { name: "RS 4", models: [model("RS 4 Avant", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.9", "450hp")] },
      { name: "RS 5", models: [model("RS 5 Avant", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.9", "450hp"), model("RS 5 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.9", "450hp"), model("RS 5 Sportback", ["Benzin"], ["Otomatik"], ["Sportback"], "2.9", "450hp")] },
      { name: "RS 6", models: [model("RS 6 Avant", ["Benzin"], ["Otomatik"], ["Station Wagon"], "4.0", "630hp")] },
      { name: "RS 7", models: [model("RS 7 Sportback", ["Benzin"], ["Otomatik"], ["Sportback"], "4.0", "630hp")] },
      { name: "S1", models: [model("S1 Sportback", ["Benzin"], ["Manuel"], ["Hatchback"], "2.0", "231hp")] },
      { name: "S3", models: [model("S3 Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.0", "310hp"), model("S3 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "310hp"), model("S3 Sportback", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "310hp")] },
      { name: "S4", models: [model("S4 Avant", ["Dizel"], ["Otomatik"], ["Station Wagon"], "3.0", "341hp"), model("S4 Sedan", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "341hp")] },
      { name: "S5", models: [model("S5 Avant", ["Benzin"], ["Otomatik"], ["Station Wagon"], "3.0", "367hp"), model("S5 Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "3.0", "354hp"), model("S5 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "354hp"), model("S5 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "367hp"), model("S5 Sportback", ["Benzin"], ["Otomatik"], ["Sportback"], "3.0", "354hp")] },
      { name: "S6", models: [model("S6 Avant", ["Dizel"], ["Otomatik"], ["Station Wagon"], "3.0", "344hp"), model("S6 Sedan", ["Dizel"], ["Otomatik"], ["Sedan"], "3.0", "344hp")] },
      { name: "S7", models: [model("S7 Sportback", ["Benzin"], ["Otomatik"], ["Sportback"], "2.9", "444hp")] },
      { name: "S8", models: [model("S8 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "4.0", "571hp")] },
      { name: "S Serisi", models: [model("S3", ["Benzin"], ["Otomatik"], ["Sedan", "Hatchback"], "2.0", "310hp"), model("S5", ["Benzin"], ["Otomatik"], ["Coupe", "Sportback"], "3.0", "354hp"), model("S6", ["Dizel"], ["Otomatik"], ["Sedan", "Station Wagon"], "3.0", "344hp"), model("S8", ["Benzin"], ["Otomatik"], ["Sedan"], "4.0", "571hp")] },
      { name: "TT", models: [model("1.8", ["Benzin"], ["Manuel"], ["Coupe"], "1.8", "180hp"), model("2.0", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "230hp"), model("TT Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "230hp"), model("TT Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "2.0", "230hp"), model("TT RS Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.5", "400hp"), model("TT RS Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "2.5", "400hp"), model("TTS Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "320hp"), model("TTS Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "2.0", "320hp")] },
      { name: "TTS", models: [model("2.0 TFSI", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "320hp"), model("Quattro", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "320hp")] },
      { name: "e-tron", models: [model("e-tron Sportback", ["Elektrik"], ["Otomatik"], ["Sportback"], "Elektrik", "408hp"), model("e-tron SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "408hp")] },
      { name: "e-tron GT", models: [model("GT Quattro", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "530hp"), model("GT RS", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "646hp"), model("RS e-tron GT", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "646hp"), model("RS e-tron GT Performance", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "925hp"), model("S e-tron GT", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "679hp")] }
    ]
  },
  {
    name: "Bajaj",
    series: [
      { name: "Avenger Cruise", models: [model("Avenger Cruise 220", ["Benzin"], ["Manuel"], ["Motosiklet"], "220cc", "19hp")] },
      { name: "Avenger Street", models: [model("Avenger Street 150", ["Benzin"], ["Manuel"], ["Motosiklet"], "150cc", "14hp"), model("Avenger Street 180", ["Benzin"], ["Manuel"], ["Motosiklet"], "180cc", "15hp"), model("Avenger Street 220", ["Benzin"], ["Manuel"], ["Motosiklet"], "220cc", "19hp")] },
      { name: "Chetak", models: [model("Chetak Elektrikli", ["Elektrik"], ["Otomatik"], ["Scooter"], "Elektrik", "5hp")] },
      { name: "CT", models: [model("CT 100", ["Benzin"], ["Manuel"], ["Motosiklet"], "100cc", "8hp"), model("CT 125", ["Benzin"], ["Manuel"], ["Motosiklet"], "125cc", "10hp")] },
      { name: "Discover", models: [model("Discover 125", ["Benzin"], ["Manuel"], ["Motosiklet"], "125cc", "11hp"), model("Discover 150", ["Benzin"], ["Manuel"], ["Motosiklet"], "150cc", "14hp")] },
      { name: "Dominar 250", models: [model("Dominar D 250", ["Benzin"], ["Manuel"], ["Motosiklet"], "250cc", "27hp")] },
      { name: "Dominar 400", models: [model("Dominar D 400", ["Benzin"], ["Manuel"], ["Motosiklet"], "400cc", "40hp"), model("Dominar D 400 UG", ["Benzin"], ["Manuel"], ["Motosiklet"], "400cc", "40hp")] },
      { name: "Freedom", models: [model("Freedom 125", ["Benzin"], ["Manuel"], ["Motosiklet"], "125cc", "9hp")] },
      { name: "Maxima", models: [model("Maxima C", ["Benzin"], ["Manuel"], ["Ticari"], "236cc", "8hp"), model("Maxima Z", ["Benzin"], ["Manuel"], ["Ticari"], "470cc", "9hp")] },
      { name: "Platina", models: [model("Platina 100", ["Benzin"], ["Manuel"], ["Motosiklet"], "100cc", "8hp"), model("Platina 110", ["Benzin"], ["Manuel"], ["Motosiklet"], "110cc", "8hp")] },
      { name: "Pulsar 150", models: [model("Pulsar 150", ["Benzin"], ["Manuel"], ["Motosiklet"], "150cc", "14hp")] },
      { name: "Pulsar 220 F", models: [model("Pulsar 220 F", ["Benzin"], ["Manuel"], ["Motosiklet"], "220cc", "20hp")] },
      { name: "Pulsar F 250", models: [model("Pulsar F 250", ["Benzin"], ["Manuel"], ["Motosiklet"], "250cc", "24hp")] },
      { name: "Pulsar N 125", models: [model("Pulsar N 125", ["Benzin"], ["Manuel"], ["Motosiklet"], "125cc", "12hp")] },
      { name: "Pulsar N 160", models: [model("Pulsar N 160", ["Benzin"], ["Manuel"], ["Motosiklet"], "160cc", "16hp")] },
      { name: "Pulsar N 250", models: [model("Pulsar N 250", ["Benzin"], ["Manuel"], ["Motosiklet"], "250cc", "24hp")] },
      { name: "Pulsar NS 125", models: [model("Pulsar NS 125", ["Benzin"], ["Manuel"], ["Motosiklet"], "125cc", "12hp")] },
      { name: "Pulsar NS 150", models: [model("Pulsar NS 150", ["Benzin"], ["Manuel"], ["Motosiklet"], "150cc", "14hp")] },
      { name: "Pulsar NS 160", models: [model("Pulsar NS 160", ["Benzin"], ["Manuel"], ["Motosiklet"], "160cc", "16hp")] },
      { name: "Pulsar NS 200", models: [model("Pulsar NS 200", ["Benzin"], ["Manuel"], ["Motosiklet"], "200cc", "24hp"), model("Pulsar NS 200 UG", ["Benzin"], ["Manuel"], ["Motosiklet"], "200cc", "24hp"), model("Pulsar NS 200 UG2", ["Benzin"], ["Manuel"], ["Motosiklet"], "200cc", "24hp")] },
      { name: "Pulsar NS 400 Z", models: [model("Pulsar NS 400 Z", ["Benzin"], ["Manuel"], ["Motosiklet"], "400cc", "40hp")] },
      { name: "Pulsar RS 200", models: [model("Pulsar RS 200", ["Benzin"], ["Manuel"], ["Motosiklet"], "200cc", "24hp")] },
      { name: "Qute", models: [model("Qute Mikro Otomobil", ["Benzin"], ["Manuel"], ["Mikro Otomobil"], "216cc", "13hp"), model("RE 60", ["Benzin"], ["Manuel"], ["Mikro Otomobil"], "216cc", "13hp")] },
      { name: "RE", models: [model("RE 2 Zamanlı", ["Benzin"], ["Manuel"], ["Üç Teker"], "145cc", "9hp"), model("RE 4 Zamanlı", ["Benzin"], ["Manuel"], ["Üç Teker"], "236cc", "10hp")] }
    ]
  },
  {
    name: "Bentley",
    series: [
      { name: "Continental", models: [model("Flying Spur", ["Benzin"], ["Otomatik"], ["Sedan"], "4.0", "550hp"), model("Flying Spur Speed", ["Benzin"], ["Otomatik"], ["Sedan"], "6.0", "635hp"), model("GT", ["Benzin"], ["Otomatik"], ["Coupe"], "4.0", "550hp"), model("GTC", ["Benzin"], ["Otomatik"], ["Cabrio"], "4.0", "550hp"), model("GTC Speed", ["Benzin"], ["Otomatik"], ["Cabrio"], "6.0", "635hp"), model("GT Speed", ["Benzin"], ["Otomatik"], ["Coupe"], "6.0", "635hp"), model("GT Supersports", ["Benzin"], ["Otomatik"], ["Coupe"], "6.0", "710hp")] },
      { name: "Flying Spur", models: [model("4.0", ["Benzin"], ["Otomatik"], ["Sedan"], "4.0", "550hp"), model("6.0", ["Benzin"], ["Otomatik"], ["Sedan"], "6.0", "635hp")] },
      { name: "Mulsanne", models: [model("6.75", ["Benzin"], ["Otomatik"], ["Sedan"], "6.75", "512hp")] }
    ]
  },
  {
    name: "BYD",
    series: [
      { name: "Dolphin", models: [model("Comfort", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "95hp"), model("Design", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "95hp"), model("Dolphin EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "95hp"), model("Dolphin Surf", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "95hp"), model("Standart", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "95hp")] },
      { name: "Electra EV", models: [model("Electra E4", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "201hp"), model("Electra E5", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "215hp")] },
      { name: "e6", models: [model("e6 EV", ["Elektrik"], ["Otomatik"], ["MPV"], "Elektrik", "121hp")] },
      { name: "F0", models: [model("F0 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "68hp")] },
      { name: "F3", models: [model("1.6", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "100hp"), model("F3 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.5", "107hp"), model("F3R Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "107hp")] },
      { name: "F6", models: [model("F6 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "140hp")] },
      { name: "G6", models: [model("G6 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "154hp")] },
      { name: "Han", models: [model("Executive", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "517hp"), model("Han DM-i", ["Hibrit"], ["Otomatik"], ["Sedan"], "1.5", "218hp"), model("Han DM-p", ["Hibrit"], ["Otomatik"], ["Sedan"], "1.5", "489hp"), model("Han EV", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "517hp")] },
      { name: "Qin", models: [model("Qin L DM-i", ["Hibrit"], ["Otomatik"], ["Sedan"], "1.5", "215hp"), model("Qin Plus DM-i", ["Hibrit"], ["Otomatik"], ["Sedan"], "1.5", "180hp"), model("Qin Plus EV", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "136hp")] },
      { name: "Seagull", models: [model("Atto 1", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "75hp"), model("Seagull EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "75hp")] },
      { name: "Seal", models: [model("Design", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "313hp"), model("Excellence", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "313hp"), model("Seal 6 DM-i", ["Hibrit"], ["Otomatik"], ["Sedan"], "1.5", "197hp"), model("Seal 6 DM-i Touring", ["Hibrit"], ["Otomatik"], ["Station Wagon"], "1.5", "197hp"), model("Seal EV", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "313hp")] },
      { name: "Sealion", models: [model("Sealion 5 DM-i", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "194hp"), model("Sealion 6 DM-i", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "218hp"), model("Sealion 7 EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "313hp"), model("Sealion 8 DM-p", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "489hp")] },
      { name: "Seal U", models: [model("Seal U DM-i", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "218hp"), model("Seal U EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "218hp")] },
      { name: "Song", models: [model("Song L EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "313hp"), model("Song Plus DM-i", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "197hp"), model("Song Plus EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "218hp"), model("Song Pro DM-i", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "180hp")] },
      { name: "S6", models: [model("S6 SUV", ["Benzin"], ["Manuel"], ["SUV"], "2.0", "138hp")] },
      { name: "Tang", models: [model("Tang DM-i", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "218hp"), model("Tang DM-p", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "505hp"), model("Tang EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "517hp")] },
      { name: "Ti7", models: [model("Ti7 DM-p", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "489hp")] },
      { name: "Yuan / Atto", models: [model("Atto 2", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "177hp"), model("Atto 3", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "204hp"), model("Atto 3 Evo", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "218hp"), model("Yuan Plus", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "204hp"), model("Yuan Up", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "95hp")] }
    ]
  },
  {
    name: "Buick",
    series: [
      { name: "Century", models: [model("3.3", ["Benzin"], ["Otomatik"], ["Sedan"], "3.3", "170hp")] },
      { name: "Le Sabre", models: [model("3.8", ["Benzin"], ["Otomatik"], ["Sedan"], "3.8", "205hp")] },
      { name: "Park Avenue", models: [model("3.8", ["Benzin"], ["Otomatik"], ["Sedan"], "3.8", "205hp")] },
      { name: "Regal", models: [model("3.8", ["Benzin"], ["Otomatik"], ["Sedan"], "3.8", "240hp")] },
      { name: "Riviera", models: [model("3.8", ["Benzin"], ["Otomatik"], ["Coupe"], "3.8", "240hp")] },
      { name: "Roadmaster", models: [model("5.7", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "260hp")] }
    ]
  },
  {
    name: "Cadillac",
    series: [
      { name: "ATS", models: [model("ATS Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "272hp"), model("ATS Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "272hp"), model("ATS-V", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "464hp")] },
      { name: "BLS", models: [model("1.9D Elegance", ["Dizel"], ["Otomatik"], ["Sedan"], "1.9", "150hp"), model("BLS Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "175hp"), model("BLS Wagon", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.0", "175hp")] },
      { name: "Brougham", models: [model("5.7 STD", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "185hp"), model("Brougham Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.0", "140hp")] },
      { name: "Calais", models: [model("Calais Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.0", "190hp"), model("Calais Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.0", "190hp")] },
      { name: "Catera", models: [model("Catera Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "200hp")] },
      { name: "Celestiq", models: [model("Celestiq EV", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "600hp")] },
      { name: "Cimarron", models: [model("Cimarron Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.8", "88hp")] },
      { name: "CT4", models: [model("CT4 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "237hp"), model("CT4-V", ["Benzin"], ["Otomatik"], ["Sedan"], "2.7", "325hp"), model("CT4-V Blackwing", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "472hp")] },
      { name: "CT5", models: [model("CT5 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "237hp"), model("CT5-V", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "360hp"), model("CT5-V Blackwing", ["Benzin"], ["Otomatik"], ["Sedan"], "6.2", "668hp")] },
      { name: "CT6", models: [model("CT6 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "335hp"), model("CT6-V", ["Benzin"], ["Otomatik"], ["Sedan"], "4.2", "550hp")] },
      { name: "CTS", models: [model("2.0 L", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "272hp"), model("2.8", ["Benzin"], ["Otomatik"], ["Sedan"], "2.8", "210hp"), model("3.2", ["Benzin"], ["Otomatik"], ["Sedan"], "3.2", "220hp"), model("6.0", ["Benzin"], ["Otomatik"], ["Sedan"], "6.0", "400hp"), model("CTS Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.6", "318hp"), model("CTS Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "272hp"), model("CTS Sport Wagon", ["Benzin"], ["Otomatik"], ["Station Wagon"], "3.0", "270hp"), model("CTS-V", ["Benzin"], ["Otomatik"], ["Sedan"], "6.2", "640hp")] },
      { name: "DeVille", models: [model("4.6 Concours", ["Benzin"], ["Otomatik"], ["Sedan"], "4.6", "300hp"), model("4.6 DTS", ["Benzin"], ["Otomatik"], ["Sedan"], "4.6", "275hp"), model("Coupe de Ville", ["Benzin"], ["Otomatik"], ["Coupe"], "7.7", "375hp"), model("DeVille Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.9", "200hp"), model("DeVille Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "4.9", "200hp"), model("Sedan de Ville", ["Benzin"], ["Otomatik"], ["Sedan"], "7.7", "375hp")] },
      { name: "DTS", models: [model("DTS Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "4.6", "275hp")] },
      { name: "Eldorado Classic", models: [model("Eldorado Biarritz", ["Benzin"], ["Otomatik"], ["Coupe"], "8.2", "190hp"), model("Eldorado Seville", ["Benzin"], ["Otomatik"], ["Coupe"], "8.2", "190hp")] },
      { name: "Eldorado Modern", models: [model("4.9 STD", ["Benzin"], ["Otomatik"], ["Coupe"], "4.9", "200hp"), model("Eldorado Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "4.6", "300hp")] },
      { name: "Enclave", models: [model("Enclave SUV Avenir", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "310hp"), model("Enclave SUV Preferred", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "310hp"), model("Enclave SUV Sport Touring", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "310hp")] },
      { name: "Encore", models: [model("Encore GX SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.3", "155hp"), model("Encore SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.4", "138hp")] },
      { name: "Envision", models: [model("Envision SUV", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "228hp")] },
      { name: "Escalade", models: [model("Escalade ESV", ["Benzin"], ["Otomatik"], ["SUV"], "6.2", "420hp"), model("Escalade Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], "6.0", "332hp"), model("Escalade SUV", ["Benzin"], ["Otomatik"], ["SUV"], "6.2", "420hp"), model("Escalade-V", ["Benzin"], ["Otomatik"], ["SUV"], "6.2", "682hp")] },
      { name: "Escalade IQ", models: [model("Escalade IQ", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "750hp"), model("Escalade IQL", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "750hp")] },
      { name: "Fleetwood", models: [model("4.9", ["Benzin"], ["Otomatik"], ["Sedan"], "4.9", "200hp"), model("5.7", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "185hp"), model("Fleetwood Brougham", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "185hp"), model("Fleetwood Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.7", "185hp"), model("Fleetwood Limousine", ["Benzin"], ["Otomatik"], ["Sedan"], "7.0", "250hp"), model("Fleetwood Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "185hp")] },
      { name: "Lyriq", models: [model("Lyriq EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "340hp"), model("Lyriq-V EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "615hp")] },
      { name: "Optiq", models: [model("Optiq EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "300hp"), model("Optiq-V EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "519hp")] },
      { name: "Seville", models: [model("4.6 STS", ["Benzin"], ["Otomatik"], ["Sedan"], "4.6", "320hp"), model("4.9 STS", ["Benzin"], ["Otomatik"], ["Sedan"], "4.9", "200hp"), model("STS Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "4.6", "320hp"), model("Seville Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "4.6", "300hp")] },
      { name: "STS", models: [model("3.6", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "255hp"), model("4.6", ["Benzin"], ["Otomatik"], ["Sedan"], "4.6", "320hp")] },
      { name: "Sixty Special", models: [model("Sixty Special Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "6.4", "325hp")] },
      { name: "SRX", models: [model("SRX Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], "3.6", "308hp"), model("SRX SUV", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "308hp")] },
      { name: "Vistiq", models: [model("Vistiq EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "615hp")] },
      { name: "XLR", models: [model("XLR Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "4.6", "320hp"), model("XLR-V", ["Benzin"], ["Otomatik"], ["Roadster"], "4.4", "443hp")] },
      { name: "XT4", models: [model("XT4 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "235hp")] },
      { name: "XT5", models: [model("XT5 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "310hp")] },
      { name: "XT6", models: [model("XT6 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "310hp")] },
      { name: "XTS", models: [model("XTS Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "304hp")] }
    ]
  },
  {
    name: "Chery",
    series: [
      { name: "Alia", models: [model("1.6", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "119hp"), model("Acteco Forza", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "119hp"), model("Acteco Lusso", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "119hp"), model("Acteco Norma", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "119hp"), model("Alia Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "119hp")] },
      { name: "Chance", models: [model("1.6 Norma", ["Benzin"], ["Manuel"], ["Hatchback", "Sedan"], "1.6", "119hp"), model("2.0 Lusso", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "139hp"), model("Chance Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.1", "68hp"), model("Chance Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.1", "68hp")] },
      { name: "eQ1", models: [model("eQ1 Elektrikli", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "75hp")] },
      { name: "eQ7", models: [model("eQ7 Elektrikli", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "211hp")] },
      { name: "Kimo", models: [model("1.3", ["Benzin"], ["Manuel"], ["Hatchback"], "1.3", "83hp"), model("Forza", ["Benzin"], ["Manuel"], ["Hatchback"], "1.3", "83hp"), model("Kimo Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.3", "83hp"), model("Lusso", ["Benzin"], ["Manuel"], ["Hatchback"], "1.3", "83hp")] },
      { name: "Niche", models: [model("2.0 Lusso", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "139hp"), model("Niche Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.3", "83hp")] },
      { name: "Omoda", models: [model("Omoda 5", ["Benzin"], ["Otomatik"], ["SUV"], "1.6", "197hp"), model("Omoda 7", ["Benzin"], ["Otomatik"], ["SUV"], "1.6", "197hp"), model("Omoda E5", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "204hp")] },
      { name: "QQ", models: [model("QQ Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "0.8", "52hp"), model("QQ6 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.1", "68hp")] },
      { name: "Taxim", models: [model("Taxim Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.3", "83hp")] },
      { name: "Tiggo 3", models: [model("Tiggo 3 SUV", ["Benzin"], ["Manuel"], ["SUV"], "1.6", "126hp")] },
      { name: "Tiggo 4 Pro", models: [model("Tiggo 4 Pro SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "147hp")] },
      { name: "Tiggo 7", models: [model("Tiggo 7 Pro e+", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "326hp"), model("Tiggo 7 Pro Max", ["Benzin"], ["Otomatik"], ["SUV"], "1.6", "197hp"), model("Tiggo 7 Pro SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.6", "183hp")] },
      { name: "Tiggo 8", models: [model("Tiggo 8 Pro e+", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "326hp"), model("Tiggo 8 Pro Max", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "254hp"), model("Tiggo 8 Pro SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.6", "183hp")] },
      { name: "Tiggo 9", models: [model("Tiggo 9 PHEV", ["Hibrit"], ["Otomatik"], ["SUV"], "1.5", "330hp"), model("Tiggo 9 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "261hp")] }
    ]
  },
  {
    name: "Chevrolet",
    series: [
      { name: "ATS", models: [model("ATS Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "272hp")] },
      { name: "Aveo", models: [model("Aveo Hatchback 3 Kapı", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "84hp"), model("Aveo Hatchback 5 Kapı", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "84hp"), model("Aveo Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.4", "101hp")] },
      { name: "Bel Air", models: [model("Bel Air Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "5.7", "220hp"), model("Bel Air Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.7", "220hp"), model("Bel Air Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "220hp")] },
      { name: "Blazer", models: [model("Blazer SUV", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "308hp")] },
      { name: "Blazer EV", models: [model("Blazer EV SS", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "557hp"), model("Blazer EV SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "288hp")] },
      { name: "Bolt", models: [model("Bolt EUV Crossover", ["Elektrik"], ["Otomatik"], ["Crossover"], "Elektrik", "200hp"), model("Bolt EV Hatchback", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "200hp")] },
      { name: "C/K Series", models: [model("C10 Pick-up", ["Benzin"], ["Manuel"], ["Pick-up"], "4.1", "155hp"), model("C20 Pick-up", ["Benzin"], ["Manuel"], ["Pick-up"], "5.0", "175hp"), model("K10 Pick-up", ["Benzin"], ["Manuel"], ["Pick-up"], "5.0", "175hp")] },
      { name: "Camaro", models: [model("Camaro Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "6.2", "455hp"), model("Camaro Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.0", "275hp"), model("Camaro SS", ["Benzin"], ["Otomatik"], ["Coupe"], "6.2", "455hp"), model("Camaro ZL1", ["Benzin"], ["Otomatik"], ["Coupe"], "6.2", "650hp")] },
      { name: "Caprice", models: [model("Caprice Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.7", "260hp"), model("Caprice Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "260hp"), model("Caprice Station Wagon", ["Benzin"], ["Otomatik"], ["Station Wagon"], "5.7", "260hp")] },
      { name: "Captiva", models: [model("Captiva SUV", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "150hp")] },
      { name: "Chevelle", models: [model("Chevelle Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "6.5", "325hp"), model("Chevelle Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "6.5", "325hp")] },
      { name: "Chevy Van", models: [model("Chevy Van G20", ["Benzin"], ["Otomatik"], ["Van"], "5.7", "190hp"), model("Chevy Van G30", ["Benzin"], ["Otomatik"], ["Van"], "6.2", "230hp")] },
      { name: "Colorado", models: [model("Colorado Crew Cab", ["Dizel"], ["Otomatik"], ["Pick-up"], "2.8", "200hp"), model("Colorado Extended Cab", ["Dizel"], ["Otomatik"], ["Pick-up"], "2.8", "200hp")] },
      { name: "Corvette", models: [model("Corvette Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "6.2", "495hp"), model("Corvette Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "6.2", "495hp"), model("Corvette E-Ray", ["Hibrit"], ["Otomatik"], ["Coupe"], "6.2", "655hp"), model("Corvette Z06", ["Benzin"], ["Otomatik"], ["Coupe"], "5.5", "670hp"), model("Corvette ZR1", ["Benzin"], ["Otomatik"], ["Coupe"], "5.5", "1064hp")] },
      { name: "Cruze", models: [model("Cruze Hatchback", ["Dizel"], ["Otomatik"], ["Hatchback"], "1.6", "136hp"), model("Cruze Sedan", ["Dizel"], ["Otomatik"], ["Sedan"], "1.6", "136hp"), model("Cruze Station Wagon", ["Dizel"], ["Otomatik"], ["Station Wagon"], "1.6", "136hp")] },
      { name: "El Camino", models: [model("El Camino Pick-up", ["Benzin"], ["Otomatik"], ["Pick-up"], "5.7", "170hp")] },
      { name: "Epica", models: [model("Epica Sedan", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "150hp")] },
      { name: "Equinox", models: [model("Equinox SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "175hp")] },
      { name: "Equinox EV", models: [model("Equinox EV SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "213hp")] },
      { name: "Evanda", models: [model("Evanda Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "131hp")] },
      { name: "Express", models: [model("Express Cargo Van", ["Dizel"], ["Otomatik"], ["Van"], "2.8", "181hp"), model("Express Passenger Van", ["Benzin"], ["Otomatik"], ["Van"], "4.3", "276hp")] },
      { name: "Impala", models: [model("Impala Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.3", "303hp"), model("Impala Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "305hp")] },
      { name: "Kalos", models: [model("Kalos Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "72hp"), model("Kalos Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.4", "94hp")] },
      { name: "Lacetti", models: [model("Lacetti Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "109hp"), model("Lacetti Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "109hp"), model("Lacetti Station Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.6", "109hp")] },
      { name: "Malibu", models: [model("Malibu Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "163hp")] },
      { name: "Monte Carlo", models: [model("Monte Carlo Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.3", "303hp")] },
      { name: "Nova", models: [model("Nova Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.0", "145hp"), model("Nova Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.0", "145hp")] },
      { name: "Rezzo", models: [model("Rezzo Minivan", ["Benzin"], ["Manuel"], ["Minivan"], "2.0", "121hp"), model("Rezzo MPV", ["Benzin"], ["Manuel"], ["MPV"], "2.0", "121hp")] },
      { name: "Silverado", models: [model("Silverado 1500", ["Benzin"], ["Otomatik"], ["Pick-up"], "5.3", "355hp"), model("Silverado 2500 HD", ["Dizel"], ["Otomatik"], ["Pick-up"], "6.6", "470hp"), model("Silverado 3500 HD", ["Dizel"], ["Otomatik"], ["Pick-up"], "6.6", "470hp")] },
      { name: "Silverado EV", models: [model("Silverado EV Crew Cab", ["Elektrik"], ["Otomatik"], ["Pick-up"], "Elektrik", "664hp")] },
      { name: "Spark", models: [model("Spark Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "81hp")] },
      { name: "SS", models: [model("SS Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "6.2", "415hp")] },
      { name: "Suburban", models: [model("Suburban SUV", ["Benzin"], ["Otomatik"], ["SUV"], "5.3", "355hp")] },
      { name: "Tahoe", models: [model("Tahoe SUV", ["Benzin"], ["Otomatik"], ["SUV"], "5.3", "355hp")] },
      { name: "Trailblazer", models: [model("Trailblazer SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.3", "155hp")] },
      { name: "Trax", models: [model("Trax SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.4", "140hp")] },
      { name: "Traverse", models: [model("Traverse SUV", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "310hp")] },
      { name: "Volt", models: [model("Volt Sedan", ["Hibrit"], ["Otomatik"], ["Sedan"], "1.5", "149hp")] }
    ]
  },
  {
    name: "Chrysler",
    series: [
      { name: "200", models: [model("200 Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "2.4", "173hp"), model("200 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "173hp")] },
      { name: "300 / 300C", models: [model("300 SRT8", ["Benzin"], ["Otomatik"], ["Sedan"], "6.4", "470hp"), model("300 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "292hp"), model("300C Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "286hp"), model("300C Touring", ["Dizel"], ["Otomatik"], ["Station Wagon"], "3.0", "218hp")] },
      { name: "300 Letter Series", models: [model("300 Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "6.4", "380hp"), model("300 Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "6.4", "380hp"), model("300 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "6.4", "380hp")] },
      { name: "Aspen", models: [model("Aspen SUV", ["Benzin"], ["Otomatik"], ["SUV"], "5.7", "335hp")] },
      { name: "Concorde", models: [model("Concorde Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "250hp")] },
      { name: "Cordoba", models: [model("Cordoba Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.2", "150hp")] },
      { name: "Crossfire", models: [model("Crossfire Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.2", "218hp"), model("Crossfire Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "3.2", "218hp")] },
      { name: "Fifth Avenue", models: [model("Fifth Avenue Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.2", "145hp")] },
      { name: "Grand Voyager", models: [model("Grand Voyager Minivan", ["Dizel"], ["Otomatik"], ["Minivan"], "2.8", "163hp"), model("Grand Voyager MPV", ["Dizel"], ["Otomatik"], ["MPV"], "2.8", "163hp")] },
      { name: "Imperial", models: [model("Imperial Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "345hp")] },
      { name: "LHS", models: [model("LHS Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "253hp")] },
      { name: "LeBaron", models: [model("LeBaron Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "3.0", "141hp"), model("LeBaron Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "141hp"), model("LeBaron Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "100hp")] },
      { name: "Neon", models: [model("Neon Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "132hp")] },
      { name: "New Yorker", models: [model("New Yorker Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "253hp")] },
      { name: "Newport", models: [model("Newport Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "6.3", "350hp"), model("Newport Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "6.3", "350hp")] },
      { name: "Pacifica", models: [model("Pacifica Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], "3.5", "250hp"), model("Pacifica Plug-In Hybrid", ["Hibrit"], ["Otomatik"], ["Minivan"], "3.6", "260hp"), model("Pacifica V6", ["Benzin"], ["Otomatik"], ["Minivan"], "3.6", "287hp")] },
      { name: "PT Cruiser", models: [model("PT Cruiser Cabriolet", ["Benzin"], ["Otomatik"], ["Cabrio"], "2.4", "150hp"), model("PT Cruiser Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "141hp")] },
      { name: "Saratoga", models: [model("Saratoga Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "141hp")] },
      { name: "Sebring", models: [model("Sebring Convertible", ["Benzin"], ["Otomatik"], ["Convertible"], "2.7", "186hp"), model("Sebring Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "2.7", "186hp"), model("Sebring Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "173hp")] },
      { name: "Stratus", models: [model("Stratus Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "152hp")] },
      { name: "Town & Country", models: [model("Town & Country Minivan", ["Benzin"], ["Otomatik"], ["Minivan"], "3.6", "283hp")] },
      { name: "Viper", models: [model("Viper RT/10 GTS", ["Benzin"], ["Manuel"], ["Coupe"], "8.0", "450hp")] },
      { name: "Voyager", models: [model("Voyager Minivan", ["Dizel"], ["Otomatik"], ["Minivan"], "2.8", "163hp")] }
    ]
  },
  {
    name: "Citroen",
    series: [
      { name: "2CV", models: [model("2CV Convertible", ["Benzin"], ["Manuel"], ["Convertible"], "0.6", "29hp"), model("2CV Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "0.6", "29hp")] },
      { name: "Ami", models: [model("Ami Cargo", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], "Elektrik", "8hp"), model("Ami Elektrikli", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], "Elektrik", "8hp"), model("Ami Peps", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], "Elektrik", "8hp"), model("Ami Pop", ["Elektrik"], ["Otomatik"], ["Mikro Otomobil"], "Elektrik", "8hp")] },
      { name: "AX", models: [model("AX Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.1", "60hp")] },
      { name: "Berlingo", models: [model("Berlingo Kombi", ["Dizel"], ["Manuel"], ["Kombi"], "1.5", "100hp"), model("Berlingo Van", ["Dizel"], ["Manuel"], ["Van"], "1.5", "100hp"), model("ë-Berlingo", ["Elektrik"], ["Otomatik"], ["Van"], "Elektrik", "136hp")] },
      { name: "BX", models: [model("BX Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "90hp"), model("BX Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.6", "90hp")] },
      { name: "C1", models: [model("C1 Hatchback 3 Kapı", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "68hp"), model("C1 Hatchback 5 Kapı", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "68hp")] },
      { name: "C2", models: [model("C2 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "75hp")] },
      { name: "C3", models: [model("C3 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "83hp"), model("C3 Pluriel", ["Benzin"], ["Manuel"], ["Cabrio"], "1.4", "75hp"), model("ë-C3", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "113hp")] },
      { name: "C3 Aircross", models: [model("C3 Aircross SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.2", "110hp"), model("ë-C3 Aircross", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "113hp")] },
      { name: "C3 Picasso", models: [model("C3 Picasso MPV", ["Benzin"], ["Manuel"], ["MPV"], "1.4", "95hp")] },
      { name: "C4", models: [model("C4 Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "1.6", "110hp"), model("C4 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "130hp"), model("C4 L", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "115hp"), model("C4 Sedan", ["Dizel"], ["Otomatik"], ["Sedan"], "1.6", "120hp"), model("ë-C4", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "136hp")] },
      { name: "C4 Aircross", models: [model("C4 Aircross SUV", ["Dizel"], ["Otomatik"], ["SUV"], "1.6", "115hp")] },
      { name: "C4 Cactus", models: [model("C4 Cactus Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], "1.2", "110hp")] },
      { name: "C4 Picasso", models: [model("C4 Picasso 5 Kişilik", ["Dizel"], ["Otomatik"], ["MPV"], "1.6", "120hp"), model("Grand C4 Picasso 7 Kişilik", ["Dizel"], ["Otomatik"], ["MPV"], "1.6", "120hp")] },
      { name: "C4 SpaceTourer", models: [model("C4 SpaceTourer", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "130hp"), model("Grand C4 SpaceTourer", ["Dizel"], ["Otomatik"], ["MPV"], "1.5", "130hp")] },
      { name: "C4 X", models: [model("C4 X Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], "1.2", "130hp"), model("C4 X Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.2", "130hp"), model("ë-C4 X", ["Elektrik"], ["Otomatik"], ["Crossover"], "Elektrik", "136hp")] },
      { name: "C5", models: [model("C5 Sedan", ["Dizel"], ["Otomatik"], ["Sedan"], "1.6", "115hp"), model("C5 Tourer", ["Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "177hp")] },
      { name: "C5 Aircross", models: [model("C5 Aircross Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], "1.6", "225hp"), model("C5 Aircross SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.2", "130hp"), model("ë-C5 Aircross", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "210hp")] },
      { name: "C5 X", models: [model("C5 X Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], "1.6", "180hp"), model("C5 X Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["Crossover"], "1.6", "225hp")] },
      { name: "C6", models: [model("C6 Sedan", ["Dizel"], ["Otomatik"], ["Sedan"], "2.2", "204hp")] },
      { name: "C8", models: [model("C8 Minivan", ["Dizel"], ["Otomatik"], ["Minivan"], "2.0", "136hp")] },
      { name: "C-Crosser", models: [model("C-Crosser SUV", ["Dizel"], ["Otomatik"], ["SUV"], "2.2", "156hp")] },
      { name: "C-Elysée", models: [model("C-Elysée Sedan", ["Dizel"], ["Manuel"], ["Sedan"], "1.6", "92hp")] },
      { name: "CX", models: [model("CX Fastback", ["Benzin"], ["Manuel"], ["Fastback"], "2.0", "106hp"), model("CX Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "2.5", "138hp")] },
      { name: "DS3", models: [model("DS3 Cabrio", ["Benzin"], ["Otomatik"], ["Cabrio"], "1.2", "110hp"), model("DS3 Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.2", "110hp")] },
      { name: "DS4", models: [model("DS4 Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.6", "165hp")] },
      { name: "DS5", models: [model("DS5 Premium Hatchback", ["Dizel"], ["Otomatik"], ["Hatchback"], "2.0", "180hp")] },
      { name: "DS Classic", models: [model("DS Berline", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "103hp"), model("DS Cabriolet", ["Benzin"], ["Manuel"], ["Convertible"], "2.0", "103hp")] },
      { name: "Jumper", models: [model("Jumper Minibüs", ["Dizel"], ["Manuel"], ["Minibüs"], "2.2", "140hp"), model("Jumper Van", ["Dizel"], ["Manuel"], ["Van"], "2.2", "140hp"), model("Jumper Şasi Kamyonet", ["Dizel"], ["Manuel"], ["Kamyonet"], "2.2", "140hp")] },
      { name: "Jumpy", models: [model("ë-Jumpy", ["Elektrik"], ["Otomatik"], ["Van"], "Elektrik", "136hp"), model("Jumpy Bus", ["Dizel"], ["Manuel"], ["Bus"], "2.0", "145hp"), model("Jumpy Kombi", ["Dizel"], ["Manuel"], ["Kombi"], "2.0", "145hp"), model("Jumpy Van", ["Dizel"], ["Manuel"], ["Van"], "2.0", "145hp")] },
      { name: "Nemo", models: [model("Nemo Combi", ["Dizel"], ["Manuel"], ["Combi"], "1.3", "80hp"), model("Nemo Van", ["Dizel"], ["Manuel"], ["Van"], "1.3", "80hp")] },
      { name: "Saxo", models: [model("Saxo Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.1", "60hp"), model("Saxo VTR", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "90hp"), model("Saxo VTS", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "120hp")] },
      { name: "SpaceTourer", models: [model("SpaceTourer Holidays", ["Dizel"], ["Otomatik"], ["Minibüs"], "2.0", "180hp"), model("SpaceTourer Minibüs", ["Dizel"], ["Otomatik"], ["Minibüs"], "2.0", "180hp")] },
      { name: "Traction Avant", models: [model("Traction Avant Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.9", "56hp")] },
      { name: "Xantia", models: [model("Xantia Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.8", "112hp")] },
      { name: "XM", models: [model("XM Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "130hp"), model("XM Wagon", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.0", "130hp")] },
      { name: "Xsara", models: [model("Xsara Break", ["Dizel"], ["Manuel"], ["Station Wagon"], "1.6", "110hp"), model("Xsara Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "1.6", "110hp"), model("Xsara Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "110hp")] },
      { name: "Xsara Picasso", models: [model("Xsara Picasso MPV", ["Dizel"], ["Manuel"], ["MPV"], "1.6", "110hp")] },
      { name: "ZX", models: [model("ZX Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.4", "75hp")] }
    ]
  },
  {
    name: "Cupra",
    series: [
      { name: "Ateca", models: [model("Ateca SUV", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "190hp"), model("Ateca VZ", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "300hp")] },
      { name: "Born", models: [model("Born EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "231hp"), model("Born VZ EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "326hp")] },
      { name: "Formentor", models: [model("Formentor e-HYBRID", ["Hibrit"], ["Otomatik"], ["SUV"], "1.4", "245hp"), model("Formentor SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("Formentor VZ", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "310hp"), model("Formentor VZ5", ["Benzin"], ["Otomatik"], ["SUV"], "2.5", "390hp")] },
      { name: "Ibiza Cupra", models: [model("Ibiza Cupra Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.8", "192hp"), model("Ibiza Cupra R", ["Benzin"], ["Manuel"], ["Hatchback"], "1.8", "180hp")] },
      { name: "Leon", models: [model("Leon Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "245hp"), model("Leon VZ", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "300hp")] },
      { name: "Leon Cupra", models: [model("Leon Cupra Hatchback MK2", ["Benzin"], ["Manuel"], ["Hatchback"], "2.0", "240hp"), model("Leon Cupra Hatchback MK3", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "300hp"), model("Leon Cupra R", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "310hp")] },
      { name: "Leon Cupra ST", models: [model("Leon Cupra ST", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.0", "300hp")] },
      { name: "Leon Sportstourer", models: [model("Leon Sportstourer", ["Benzin"], ["Otomatik"], ["Station Wagon"], "1.5", "150hp"), model("Leon Sportstourer VZ", ["Benzin"], ["Otomatik"], ["Station Wagon"], "2.0", "310hp")] },
      { name: "Raval", models: [model("Raval EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "226hp")] },
      { name: "Tavascan", models: [model("Tavascan EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "286hp"), model("Tavascan VZ EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "340hp")] },
      { name: "Terramar", models: [model("Terramar SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("Terramar VZ", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "265hp")] }
    ]
  },
  {
    name: "Dacia",
    series: [
      { name: "1300", models: [model("1300 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.3", "54hp")] },
      { name: "1310", models: [model("1310 Kombi", ["Benzin"], ["Manuel"], ["Kombi"], "1.4", "65hp"), model("1310 Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.4", "65hp")] },
      { name: "Bigster", models: [model("Bigster SUV", ["Hibrit"], ["Otomatik"], ["SUV"], "1.2", "140hp")] },
      { name: "Dacia Pick-Up", models: [model("Dacia Pick-Up 4x4", ["Benzin"], ["Manuel"], ["Pick-Up"], "1.9", "75hp"), model("Dacia Pick-Up Tek Kabin", ["Benzin"], ["Manuel"], ["Pick-Up"], "1.9", "75hp"), model("Dacia Pick-Up Çift Kabin", ["Benzin"], ["Manuel"], ["Pick-Up"], "1.9", "75hp")] },
      { name: "Dokker", models: [model("Dokker Combi", ["Dizel"], ["Manuel"], ["Combi"], "1.5", "95hp"), model("Dokker Stepway", ["Dizel"], ["Manuel"], ["Crossover"], "1.5", "95hp"), model("Dokker Van", ["Dizel"], ["Manuel"], ["Van"], "1.5", "95hp")] },
      { name: "Duster", models: [model("Duster SUV", ["Benzin", "Dizel"], ["Manuel", "Otomatik"], ["SUV"], "1.3", "150hp")] },
      { name: "Jogger", models: [model("Jogger Crossover", ["Hibrit"], ["Otomatik"], ["Crossover"], "1.6", "140hp"), model("Jogger MPV", ["Benzin"], ["Manuel"], ["MPV"], "1.0", "110hp")] },
      { name: "Lodgy", models: [model("Lodgy MPV", ["Dizel"], ["Manuel"], ["MPV"], "1.5", "110hp")] },
      { name: "Logan", models: [model("Logan MCV", ["Dizel"], ["Manuel"], ["Station Wagon"], "1.5", "90hp"), model("Logan Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.0", "90hp")] },
      { name: "Logan Pick-Up", models: [model("Logan Pick-Up", ["Dizel"], ["Manuel"], ["Pick-Up"], "1.5", "75hp")] },
      { name: "Logan Van", models: [model("Logan Van", ["Dizel"], ["Manuel"], ["Van"], "1.5", "75hp")] },
      { name: "Nova", models: [model("Nova Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.4", "65hp")] },
      { name: "Sandero", models: [model("Sandero Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "90hp")] },
      { name: "Sandero Stepway", models: [model("Sandero Stepway Crossover", ["Benzin"], ["Manuel"], ["Crossover"], "1.0", "90hp")] },
      { name: "Solenza", models: [model("Solenza Clima", ["Benzin"], ["Manuel"], ["Sedan"], "1.4", "75hp"), model("Solenza Rapsodie", ["Benzin"], ["Manuel"], ["Sedan"], "1.4", "75hp"), model("Solenza Scala", ["Benzin"], ["Manuel"], ["Sedan"], "1.4", "75hp")] },
      { name: "Spring", models: [model("Spring EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "65hp")] },
      { name: "Striker", models: [model("Striker Crossover", ["Hibrit"], ["Otomatik"], ["Crossover"], "1.2", "140hp")] },
      { name: "SuperNova", models: [model("SuperNova Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.4", "75hp")] }
    ]
  },
  {
    name: "Daewoo",
    series: [
      { name: "Cielo", models: [model("Cielo Hatchback 3 Kapı", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "90hp"), model("Cielo Hatchback 5 Kapı", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "90hp"), model("Cielo Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.5", "90hp")] },
      { name: "Damas", models: [model("Damas Van", ["Benzin"], ["Manuel"], ["Van"], "0.8", "38hp")] },
      { name: "Espero", models: [model("Espero Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "105hp")] },
      { name: "Evanda", models: [model("Evanda Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "131hp")] },
      { name: "Kalos", models: [model("Kalos Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "72hp"), model("Kalos Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.4", "94hp")] },
      { name: "Labo", models: [model("Labo Kamyonet", ["Benzin"], ["Manuel"], ["Kamyonet"], "0.8", "38hp")] },
      { name: "Lacetti", models: [model("Lacetti Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "109hp"), model("Lacetti Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "109hp"), model("Lacetti Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.6", "109hp")] },
      { name: "Lanos", models: [model("Lanos Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "86hp"), model("Lanos Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.5", "86hp")] },
      { name: "Leganza", models: [model("Leganza Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "133hp")] },
      { name: "Lublin", models: [model("Lublin Van", ["Dizel"], ["Manuel"], ["Van"], "2.4", "90hp"), model("Lublin Şasi Kamyonet", ["Dizel"], ["Manuel"], ["Kamyonet"], "2.4", "90hp")] },
      { name: "Magnus", models: [model("Magnus Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "144hp")] },
      { name: "Matiz", models: [model("Matiz Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "0.8", "52hp")] },
      { name: "Musso", models: [model("Musso SUV", ["Dizel"], ["Manuel"], ["SUV"], "2.9", "120hp")] },
      { name: "Nexia", models: [model("Nexia Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "75hp"), model("Nexia Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.5", "75hp")] },
      { name: "Nubira", models: [model("Nubira Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "109hp"), model("Nubira Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "109hp"), model("Nubira Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.6", "109hp")] },
      { name: "Racer", models: [model("Racer Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "75hp"), model("Racer Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.5", "75hp")] },
      { name: "Rexton", models: [model("Rexton SUV", ["Dizel"], ["Otomatik"], ["SUV"], "2.7", "165hp")] },
      { name: "Tacuma", models: [model("Tacuma MPV", ["Benzin"], ["Manuel"], ["MPV"], "2.0", "121hp")] },
      { name: "Tico", models: [model("Tico Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "0.8", "41hp")] },
      { name: "Tosca", models: [model("Tosca Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "144hp")] },
      { name: "Winstorm", models: [model("Winstorm SUV", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "150hp")] }
    ]
  },
  {
    name: "Daihatsu",
    series: [
      { name: "Altis", models: [model("Altis Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "109hp")] },
      { name: "Applause", models: [model("Applause Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "105hp")] },
      { name: "Atrai", models: [model("Atrai Van", ["Benzin"], ["Otomatik"], ["Van"], "0.7", "64hp"), model("e-Atrai", ["Elektrik"], ["Otomatik"], ["Van"], "Elektrik", "64hp")] },
      { name: "Be-go", models: [model("Be-go SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "109hp")] },
      { name: "Boon", models: [model("Boon Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.0", "69hp")] },
      { name: "Charade", models: [model("Charade Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.3", "87hp")] },
      { name: "Copen", models: [model("Copen Roadster", ["Benzin"], ["Otomatik"], ["Roadster"], "0.7", "64hp")] },
      { name: "Cuore", models: [model("Cuore Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "58hp")] },
      { name: "Feroza", models: [model("Feroza 4x4 SUV", ["Benzin"], ["Manuel"], ["SUV"], "1.6", "95hp")] },
      { name: "Gran Max", models: [model("Gran Max Cargo", ["Benzin"], ["Manuel"], ["Van"], "1.5", "97hp"), model("Gran Max Truck", ["Benzin"], ["Manuel"], ["Kamyonet"], "1.5", "97hp")] },
      { name: "Hijet", models: [model("e-Hijet Cargo", ["Elektrik"], ["Otomatik"], ["Van"], "Elektrik", "64hp"), model("Hijet Truck", ["Benzin"], ["Manuel"], ["Kamyonet"], "0.7", "53hp"), model("Hijet Van", ["Benzin"], ["Manuel"], ["Van"], "0.7", "53hp")] },
      { name: "Materia", models: [model("Materia MPV", ["Benzin"], ["Otomatik"], ["MPV"], "1.5", "103hp")] },
      { name: "Midget II", models: [model("Midget II Pick-Up", ["Benzin"], ["Manuel"], ["Pick-Up"], "0.7", "31hp")] },
      { name: "Mira", models: [model("Mira Cocoa", ["Benzin"], ["Otomatik"], ["Hatchback"], "0.7", "58hp"), model("Mira e:S", ["Benzin"], ["Otomatik"], ["Hatchback"], "0.7", "49hp"), model("Mira Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "0.7", "52hp"), model("Mira Tocot", ["Benzin"], ["Otomatik"], ["Hatchback"], "0.7", "52hp")] },
      { name: "Move", models: [model("Move Canbus", ["Benzin"], ["Otomatik"], ["Hatchback"], "0.7", "52hp"), model("Move Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "0.7", "58hp")] },
      { name: "Rocky Classic", models: [model("Rocky 4x4 F70", ["Dizel"], ["Manuel"], ["SUV"], "2.8", "90hp"), model("Rocky 4x4 F80", ["Dizel"], ["Manuel"], ["SUV"], "2.8", "102hp")] },
      { name: "Rocky Modern", models: [model("Rocky e-SMART Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], "1.2", "106hp"), model("Rocky SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.0", "98hp")] },
      { name: "Sirion", models: [model("Sirion Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.3", "91hp")] },
      { name: "Taft Classic", models: [model("Taft Wildcat 4x4", ["Dizel"], ["Manuel"], ["SUV"], "2.5", "84hp")] },
      { name: "Taft Modern", models: [model("Taft SUV", ["Benzin"], ["Otomatik"], ["SUV"], "0.7", "64hp")] },
      { name: "Tanto", models: [model("Tanto Custom", ["Benzin"], ["Otomatik"], ["MPV"], "0.7", "64hp"), model("Tanto MPV", ["Benzin"], ["Otomatik"], ["MPV"], "0.7", "52hp")] },
      { name: "Terios", models: [model("Terios Gold Edition", ["Benzin"], ["Manuel"], ["SUV"], "1.5", "105hp"), model("Terios Kid", ["Benzin"], ["Otomatik"], ["SUV"], "0.7", "60hp"), model("Terios Silver Edition", ["Benzin"], ["Manuel"], ["SUV"], "1.5", "105hp"), model("Terios SUV", ["Benzin"], ["Manuel"], ["SUV"], "1.5", "105hp")] },
      { name: "Thor", models: [model("Thor MPV", ["Benzin"], ["Otomatik"], ["MPV"], "1.0", "98hp")] },
      { name: "YRV", models: [model("YRV Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.3", "87hp"), model("YRV MPV", ["Benzin"], ["Otomatik"], ["MPV"], "1.3", "87hp"), model("YRV Turbo", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.3", "140hp")] }
    ]
  },
  {
    name: "Dodge",
    series: [
      { name: "Aspen", models: [model("Aspen Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "5.2", "230hp"), model("Aspen Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.2", "230hp")] },
      { name: "Avenger", models: [model("Avenger Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "173hp")] },
      { name: "Caliber", models: [model("Caliber Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], "2.0", "156hp"), model("Caliber Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.8", "148hp"), model("Caliber SRT4", ["Benzin"], ["Manuel"], ["Hatchback"], "2.4", "285hp")] },
      { name: "Challenger", models: [model("Challenger GT", ["Benzin"], ["Otomatik"], ["Coupe"], "3.6", "305hp"), model("Challenger R/T", ["Benzin"], ["Otomatik"], ["Coupe"], "5.7", "375hp"), model("Challenger R/T Scat Pack", ["Benzin"], ["Otomatik"], ["Coupe"], "6.4", "485hp"), model("Challenger SRT Demon", ["Benzin"], ["Otomatik"], ["Coupe"], "6.2", "840hp"), model("Challenger SRT Demon 170", ["Benzin"], ["Otomatik"], ["Coupe"], "6.2", "1025hp"), model("Challenger SRT Hellcat", ["Benzin"], ["Otomatik"], ["Coupe"], "6.2", "717hp"), model("Challenger SRT Hellcat Redeye", ["Benzin"], ["Otomatik"], ["Coupe"], "6.2", "797hp"), model("Challenger SRT Super Stock", ["Benzin"], ["Otomatik"], ["Coupe"], "6.2", "807hp"), model("Challenger SRT8", ["Benzin"], ["Otomatik"], ["Coupe"], "6.4", "470hp"), model("Challenger SXT", ["Benzin"], ["Otomatik"], ["Coupe"], "3.6", "303hp")] },
      { name: "Challenger Classic", models: [model("Challenger R/T Convertible", ["Benzin"], ["Manuel"], ["Convertible"], "7.2", "390hp"), model("Challenger R/T Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "7.2", "390hp")] },
      { name: "Charger Classic", models: [model("Charger Daytona Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "7.0", "425hp"), model("Charger R/T Coupe 1968", ["Benzin"], ["Manuel"], ["Coupe"], "7.2", "375hp"), model("Charger R/T Coupe 1969", ["Benzin"], ["Manuel"], ["Coupe"], "7.2", "375hp"), model("Charger R/T Coupe 1970", ["Benzin"], ["Manuel"], ["Coupe"], "7.2", "390hp")] },
      { name: "Charger Daytona", models: [model("Charger Daytona R/T EV 2 Kapı", ["Elektrik"], ["Otomatik"], ["Coupe"], "Elektrik", "456hp"), model("Charger Daytona R/T EV 4 Kapı", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "456hp"), model("Charger Daytona Scat Pack EV 2 Kapı", ["Elektrik"], ["Otomatik"], ["Coupe"], "Elektrik", "670hp"), model("Charger Daytona Scat Pack EV 4 Kapı", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "670hp")] },
      { name: "Charger Modern", models: [model("Charger GT", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "300hp"), model("Charger Hellcat Redeye", ["Benzin"], ["Otomatik"], ["Sedan"], "6.2", "797hp"), model("Charger R/T", ["Benzin"], ["Otomatik"], ["Sedan"], "5.7", "370hp"), model("Charger Scat Pack", ["Benzin"], ["Otomatik"], ["Sedan"], "6.4", "485hp"), model("Charger SE", ["Benzin"], ["Otomatik"], ["Sedan"], "2.7", "190hp"), model("Charger SRT Hellcat", ["Benzin"], ["Otomatik"], ["Sedan"], "6.2", "717hp"), model("Charger SRT8", ["Benzin"], ["Otomatik"], ["Sedan"], "6.4", "470hp"), model("Charger SXT", ["Benzin"], ["Otomatik"], ["Sedan"], "3.6", "292hp")] },
      { name: "Charger Next Gen", models: [model("Charger R/T 2 Kapı", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "420hp"), model("Charger R/T 4 Kapı", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "420hp"), model("Charger Scat Pack 2 Kapı", ["Benzin"], ["Otomatik"], ["Coupe"], "3.0", "550hp"), model("Charger Scat Pack 4 Kapı", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "550hp")] },
      { name: "Coronet", models: [model("Coronet Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "6.3", "335hp"), model("Super Bee Muscle Car", ["Benzin"], ["Manuel"], ["Coupe"], "7.0", "390hp")] },
      { name: "Dakota", models: [model("Dakota Pick-up", ["Benzin"], ["Otomatik"], ["Pick-Up"], "4.7", "230hp")] },
      { name: "Dart", models: [model("Dart Coupe Classic", ["Benzin"], ["Manuel"], ["Coupe"], "3.7", "145hp"), model("Dart Sedan Classic", ["Benzin"], ["Manuel"], ["Sedan"], "3.7", "145hp"), model("Dart Sedan Modern", ["Benzin"], ["Otomatik"], ["Sedan"], "2.4", "184hp")] },
      { name: "Diplomat", models: [model("Diplomat Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.2", "152hp")] },
      { name: "Durango", models: [model("Durango GT", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "295hp"), model("Durango R/T", ["Benzin"], ["Otomatik"], ["SUV"], "5.7", "360hp"), model("Durango SRT 392", ["Benzin"], ["Otomatik"], ["SUV"], "6.4", "475hp"), model("Durango SRT Hellcat", ["Benzin"], ["Otomatik"], ["SUV"], "6.2", "710hp"), model("Durango SRT Hellcat Jailbreak", ["Benzin"], ["Otomatik"], ["SUV"], "6.2", "710hp"), model("Durango SXT", ["Benzin"], ["Otomatik"], ["SUV"], "3.6", "293hp")] },
      { name: "Grand Caravan", models: [model("Grand Caravan Minivan", ["Benzin"], ["Otomatik"], ["Minivan"], "3.6", "283hp")] },
      { name: "Hornet", models: [model("Hornet GT", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "268hp"), model("Hornet R/T", ["Hibrit"], ["Otomatik"], ["SUV"], "1.3", "288hp")] },
      { name: "Journey", models: [model("Journey MPV", ["Benzin"], ["Otomatik"], ["MPV"], "2.4", "173hp"), model("Journey SUV", ["Benzin"], ["Otomatik"], ["SUV"], "2.4", "173hp")] },
      { name: "Magnum", models: [model("Magnum SRT8", ["Benzin"], ["Otomatik"], ["Station Wagon"], "6.1", "425hp"), model("Magnum Station Wagon", ["Benzin"], ["Otomatik"], ["Station Wagon"], "3.5", "250hp")] },
      { name: "Monaco", models: [model("Monaco Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "5.2", "190hp")] },
      { name: "Nitro", models: [model("Nitro SUV", ["Dizel"], ["Otomatik"], ["SUV"], "2.8", "177hp")] },
      { name: "Ram", models: [model("Ram 1500 Pick-up", ["Benzin"], ["Otomatik"], ["Pick-Up"], "5.7", "395hp"), model("Ram 2500 Pick-up", ["Dizel"], ["Otomatik"], ["Pick-Up"], "6.7", "370hp"), model("Ram 3500 Pick-up", ["Dizel"], ["Otomatik"], ["Pick-Up"], "6.7", "400hp"), model("Ram SRT-10", ["Benzin"], ["Manuel"], ["Pick-Up"], "8.3", "500hp")] },
      { name: "Ramcharger", models: [model("Ramcharger SUV", ["Benzin"], ["Otomatik"], ["SUV"], "5.9", "245hp")] },
      { name: "Viper", models: [model("Viper ACR", ["Benzin"], ["Manuel"], ["Coupe"], "8.4", "645hp"), model("Viper GTS", ["Benzin"], ["Manuel"], ["Coupe"], "8.0", "450hp"), model("Viper RT/10", ["Benzin"], ["Manuel"], ["Roadster"], "8.0", "400hp"), model("Viper SRT-10 Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "8.3", "510hp"), model("Viper SRT-10 Roadster", ["Benzin"], ["Manuel"], ["Roadster"], "8.3", "510hp")] }
    ]
  },
  {
    name: "DS Automobiles",
    series: [
      { name: "DS 3", models: [model("DS 3 E-TENSE", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "156hp"), model("DS 3 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.2", "130hp")] },
      { name: "DS 3 Classic", models: [model("DS 3 Cabrio", ["Benzin"], ["Manuel"], ["Cabrio"], "1.6", "120hp"), model("DS 3 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "110hp")] },
      { name: "DS 3 Crossback", models: [model("DS 3 Crossback E-TENSE", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "136hp"), model("DS 3 Crossback SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.2", "130hp")] },
      { name: "DS 4 Classic", models: [model("DS 4 Crossback", ["Dizel"], ["Otomatik"], ["Crossover"], "1.6", "120hp"), model("DS 4 Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "165hp")] },
      { name: "DS 4 Modern", models: [model("DS 4 Cross", ["Hibrit"], ["Otomatik"], ["Crossover"], "1.6", "225hp"), model("DS 4 E-TENSE", ["Hibrit"], ["Otomatik"], ["Hatchback"], "1.6", "225hp"), model("DS 4 Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.2", "130hp")] },
      { name: "DS 4S", models: [model("DS 4S Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.6", "167hp")] },
      { name: "DS 5", models: [model("DS 5 Hatchback", ["Dizel"], ["Otomatik"], ["Hatchback"], "2.0", "180hp"), model("DS 5 Hybrid4", ["Hibrit"], ["Otomatik"], ["Hatchback"], "2.0", "200hp")] },
      { name: "DS 5LS", models: [model("DS 5LS Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "163hp")] },
      { name: "DS 6", models: [model("DS 6 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.6", "167hp")] },
      { name: "DS 7", models: [model("DS 7 Crossback SUV", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "180hp"), model("DS 7 E-TENSE 225", ["Hibrit"], ["Otomatik"], ["SUV"], "1.6", "225hp"), model("DS 7 E-TENSE 300", ["Hibrit"], ["Otomatik"], ["SUV"], "1.6", "300hp"), model("DS 7 E-TENSE 360", ["Hibrit"], ["Otomatik"], ["SUV"], "1.6", "360hp"), model("DS 7 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.2", "130hp")] },
      { name: "DS 9", models: [model("DS 9 E-TENSE", ["Hibrit"], ["Otomatik"], ["Sedan"], "1.6", "250hp"), model("DS 9 Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.6", "225hp")] },
      { name: "DS N°4", models: [model("DS N°4 Crossover", ["Benzin"], ["Otomatik"], ["Crossover"], "1.2", "136hp"), model("DS N°4 E-TENSE", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "213hp"), model("DS N°4 Hatchback", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.2", "136hp"), model("DS N°4 PHEV", ["Hibrit"], ["Otomatik"], ["Hatchback"], "1.6", "225hp")] },
      { name: "DS N°7", models: [model("DS N°7 E-TENSE 4x4", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "375hp"), model("DS N°7 Plug-in Hybrid", ["Hibrit"], ["Otomatik"], ["SUV"], "1.6", "300hp"), model("DS N°7 SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.2", "136hp")] },
      { name: "DS N°8", models: [model("DS N°8 Coupe-SUV EV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "350hp")] }
    ]
  },
  {
    name: "Eagle",
    series: [
      { name: "2000GTX", models: [model("2000GTX Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.0", "135hp")] },
      { name: "Eagle Coupe", models: [model("Eagle Coupe 2 Kapı", ["Benzin"], ["Manuel"], ["Coupe"], "4.2", "110hp")] },
      { name: "Eagle Kammback", models: [model("Eagle Kammback", ["Benzin"], ["Manuel"], ["Hatchback"], "4.2", "110hp")] },
      { name: "Eagle Sedan", models: [model("Eagle Sedan 4 Kapı", ["Benzin"], ["Manuel"], ["Sedan"], "4.2", "110hp")] },
      { name: "Eagle SX/4", models: [model("Eagle SX/4 Hatchback Crossover", ["Benzin"], ["Manuel"], ["Crossover"], "4.2", "110hp")] },
      { name: "Eagle Wagon", models: [model("Eagle Wagon Station Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "4.2", "110hp")] },
      { name: "Medallion", models: [model("Medallion Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "2.2", "110hp"), model("Medallion Station Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "2.2", "110hp")] },
      { name: "Premier", models: [model("Premier Sedan ES", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "150hp"), model("Premier Sedan LX", ["Benzin"], ["Otomatik"], ["Sedan"], "2.5", "111hp")] },
      { name: "Summit", models: [model("Summit Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "1.5", "92hp"), model("Summit Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "92hp"), model("Summit Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.5", "92hp")] },
      { name: "Summit Wagon", models: [model("Summit Wagon AWD", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.8", "111hp"), model("Summit Wagon DL", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.5", "92hp"), model("Summit Wagon LX", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.8", "111hp")] },
      { name: "Talon", models: [model("Talon Coupe DL", ["Benzin"], ["Manuel"], ["Coupe"], "1.8", "92hp"), model("Talon Coupe ES", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "135hp"), model("Talon Coupe ESi", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "140hp"), model("Talon TSi Turbo AWD", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "210hp"), model("Talon TSi Turbo FWD", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "190hp")] },
      { name: "Vision", models: [model("Vision Sedan ESI", ["Benzin"], ["Otomatik"], ["Sedan"], "3.3", "161hp"), model("Vision Sedan TSI", ["Benzin"], ["Otomatik"], ["Sedan"], "3.5", "214hp")] },
      { name: "Vista", models: [model("Vista Hatchback", ["Benzin"], ["Manuel"], ["Hatchback"], "1.5", "84hp"), model("Vista Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.5", "84hp"), model("Vista Wagon", ["Benzin"], ["Manuel"], ["Station Wagon"], "1.8", "111hp")] }
    ]
  },
  {
    name: "Ferrari",
    series: [
      { name: "12Cilindri", models: [model("12Cilindri Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "6.5", "830hp"), model("12Cilindri Spider", ["Benzin"], ["Otomatik"], ["Spider"], "6.5", "830hp")] },
      { name: "296 Serisi", models: [model("296 GTB", ["Hibrit"], ["Otomatik"], ["Coupe"], "3.0", "830hp"), model("296 GTS", ["Hibrit"], ["Otomatik"], ["Spider"], "3.0", "830hp"), model("296 Speciale", ["Hibrit"], ["Otomatik"], ["Coupe"], "3.0", "880hp"), model("296 Speciale A", ["Hibrit"], ["Otomatik"], ["Spider"], "3.0", "880hp")] },
      { name: "308 / 328 / 348 / F355", models: [model("308 GTB", ["Benzin"], ["Manuel"], ["Coupe"], "2.9", "255hp"), model("308 GTS", ["Benzin"], ["Manuel"], ["Targa"], "2.9", "255hp"), model("328 GTB", ["Benzin"], ["Manuel"], ["Coupe"], "3.2", "270hp"), model("328 GTS", ["Benzin"], ["Manuel"], ["Targa"], "3.2", "270hp"), model("348 TB", ["Benzin"], ["Manuel"], ["Coupe"], "3.4", "300hp"), model("348 TS", ["Benzin"], ["Manuel"], ["Targa"], "3.4", "300hp"), model("348 Spider", ["Benzin"], ["Manuel"], ["Spider"], "3.4", "320hp"), model("F355 Berlinetta", ["Benzin"], ["Manuel"], ["Coupe"], "3.5", "380hp"), model("F355 GTS", ["Benzin"], ["Manuel"], ["Targa"], "3.5", "380hp"), model("F355 Spider", ["Benzin"], ["Manuel"], ["Spider"], "3.5", "380hp")] },
      { name: "360 / F430", models: [model("360 Modena", ["Benzin"], ["Manuel"], ["Coupe"], "3.6", "400hp"), model("360 Spider", ["Benzin"], ["Manuel"], ["Spider"], "3.6", "400hp"), model("Challenge Stradale", ["Benzin"], ["Manuel"], ["Coupe"], "3.6", "425hp"), model("F430", ["Benzin"], ["Manuel"], ["Coupe"], "4.3", "490hp"), model("F430 Spider", ["Benzin"], ["Manuel"], ["Spider"], "4.3", "490hp"), model("430 Scuderia", ["Benzin"], ["Otomatik"], ["Coupe"], "4.3", "510hp"), model("Scuderia Spider 16M", ["Benzin"], ["Otomatik"], ["Spider"], "4.3", "510hp")] },
      { name: "365 GTB/4 Daytona", models: [model("Daytona Coupe", ["Benzin"], ["Manuel"], ["Coupe"], "4.4", "352hp"), model("Daytona Spider", ["Benzin"], ["Manuel"], ["Spider"], "4.4", "352hp")] },
      { name: "458 / 488 / F8 Serisi", models: [model("458 Italia", ["Benzin"], ["Otomatik"], ["Coupe"], "4.5", "570hp"), model("458 Spider", ["Benzin"], ["Otomatik"], ["Spider"], "4.5", "570hp"), model("458 Speciale", ["Benzin"], ["Otomatik"], ["Coupe"], "4.5", "605hp"), model("458 Speciale A", ["Benzin"], ["Otomatik"], ["Spider"], "4.5", "605hp"), model("488 GTB", ["Benzin"], ["Otomatik"], ["Coupe"], "3.9", "670hp"), model("488 Spider", ["Benzin"], ["Otomatik"], ["Spider"], "3.9", "670hp"), model("488 Pista", ["Benzin"], ["Otomatik"], ["Coupe"], "3.9", "720hp"), model("488 Pista Spider", ["Benzin"], ["Otomatik"], ["Spider"], "3.9", "720hp"), model("F8 Tributo", ["Benzin"], ["Otomatik"], ["Coupe"], "3.9", "720hp"), model("F8 Spider", ["Benzin"], ["Otomatik"], ["Spider"], "3.9", "720hp")] },
      { name: "456 / 550 / 575M Maranello", models: [model("456 GT", ["Benzin"], ["Manuel"], ["Coupe"], "5.5", "442hp"), model("456M GTA", ["Benzin"], ["Otomatik"], ["Coupe"], "5.5", "442hp"), model("550 Maranello", ["Benzin"], ["Manuel"], ["Coupe"], "5.5", "485hp"), model("575M Maranello", ["Benzin"], ["Otomatik"], ["Coupe"], "5.7", "515hp"), model("Superamerica", ["Benzin"], ["Otomatik"], ["Spider"], "5.7", "540hp")] },
      { name: "599", models: [model("599 GTB Fiorano", ["Benzin"], ["Otomatik"], ["Coupe"], "6.0", "620hp"), model("599 GTO", ["Benzin"], ["Otomatik"], ["Coupe"], "6.0", "670hp"), model("SA Aperta", ["Benzin"], ["Otomatik"], ["Spider"], "6.0", "670hp")] },
      { name: "812 / F12", models: [model("812 Superfast", ["Benzin"], ["Otomatik"], ["Coupe"], "6.5", "800hp"), model("812 GTS", ["Benzin"], ["Otomatik"], ["Spider"], "6.5", "800hp"), model("812 Competizione", ["Benzin"], ["Otomatik"], ["Coupe"], "6.5", "830hp"), model("812 Competizione A", ["Benzin"], ["Otomatik"], ["Spider"], "6.5", "830hp"), model("F12berlinetta", ["Benzin"], ["Otomatik"], ["Coupe"], "6.3", "740hp"), model("F12tdf", ["Benzin"], ["Otomatik"], ["Coupe"], "6.3", "780hp")] },
      { name: "849 Testarossa", models: [model("849 Testarossa Coupe", ["Hibrit"], ["Otomatik"], ["Coupe"], "4.0", "900hp"), model("849 Testarossa Spider", ["Hibrit"], ["Otomatik"], ["Spider"], "4.0", "900hp")] },
      { name: "Amalfi", models: [model("Amalfi Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.9", "640hp"), model("Amalfi Spider", ["Benzin"], ["Otomatik"], ["Spider"], "3.9", "640hp")] },
      { name: "California", models: [model("California", ["Benzin"], ["Otomatik"], ["Cabrio"], "4.3", "460hp"), model("California T", ["Benzin"], ["Otomatik"], ["Cabrio"], "3.9", "560hp")] },
      { name: "Dino", models: [model("Dino 206 GT", ["Benzin"], ["Manuel"], ["Coupe"], "2.0", "180hp"), model("Dino 246 GT", ["Benzin"], ["Manuel"], ["Coupe"], "2.4", "195hp"), model("Dino 246 GTS", ["Benzin"], ["Manuel"], ["Spider"], "2.4", "195hp")] },
      { name: "Enzo Ferrari", models: [model("Enzo Supercar", ["Benzin"], ["Otomatik"], ["Coupe"], "6.0", "660hp")] },
      { name: "F40 / F50", models: [model("F40 Turbo", ["Benzin"], ["Manuel"], ["Coupe"], "2.9", "478hp"), model("F50", ["Benzin"], ["Manuel"], ["Roadster"], "4.7", "520hp")] },
      { name: "F80", models: [model("F80 Hypercar", ["Hibrit"], ["Otomatik"], ["Coupe"], "3.0", "1184hp")] },
      { name: "FF / GTC4Lusso", models: [model("FF", ["Benzin"], ["Otomatik"], ["Shooting Brake"], "6.3", "660hp"), model("GTC4Lusso", ["Benzin"], ["Otomatik"], ["Shooting Brake"], "6.3", "690hp"), model("GTC4Lusso T", ["Benzin"], ["Otomatik"], ["Shooting Brake"], "3.9", "610hp")] },
      { name: "Icona Serisi", models: [model("Monza SP1", ["Benzin"], ["Otomatik"], ["Speedster"], "6.5", "810hp"), model("Monza SP2", ["Benzin"], ["Otomatik"], ["Speedster"], "6.5", "810hp"), model("Daytona SP3", ["Benzin"], ["Otomatik"], ["Coupe"], "6.5", "840hp")] },
      { name: "LaFerrari", models: [model("LaFerrari Coupe", ["Hibrit"], ["Otomatik"], ["Coupe"], "6.3", "963hp"), model("LaFerrari Aperta", ["Hibrit"], ["Otomatik"], ["Spider"], "6.3", "963hp")] },
      { name: "Luce EV", models: [model("Luce EV", ["Elektrik"], ["Otomatik"], ["Coupe"], "Elektrik", "760hp")] },
      { name: "Portofino", models: [model("Portofino", ["Benzin"], ["Otomatik"], ["Cabrio"], "3.9", "600hp"), model("Portofino M", ["Benzin"], ["Otomatik"], ["Cabrio"], "3.9", "620hp")] },
      { name: "Purosangue", models: [model("Purosangue V12", ["Benzin"], ["Otomatik"], ["SUV"], "6.5", "725hp")] },
      { name: "Roma", models: [model("Roma Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "3.9", "620hp"), model("Roma Spider", ["Benzin"], ["Otomatik"], ["Spider"], "3.9", "620hp")] },
      { name: "SF90", models: [model("SF90 Stradale", ["Hibrit"], ["Otomatik"], ["Coupe"], "4.0", "1000hp"), model("SF90 Spider", ["Hibrit"], ["Otomatik"], ["Spider"], "4.0", "1000hp"), model("SF90 XX Stradale", ["Hibrit"], ["Otomatik"], ["Coupe"], "4.0", "1030hp"), model("SF90 XX Spider", ["Hibrit"], ["Otomatik"], ["Spider"], "4.0", "1030hp")] },
      { name: "Testarossa / 512", models: [model("Testarossa", ["Benzin"], ["Manuel"], ["Coupe"], "4.9", "390hp"), model("512 TR", ["Benzin"], ["Manuel"], ["Coupe"], "4.9", "428hp"), model("F512 M", ["Benzin"], ["Manuel"], ["Coupe"], "4.9", "440hp")] }
    ]
  },
  {
    name: "Volkswagen",
    series: [
      { name: "Amarok", models: [model("Amarok Pick-Up", ["Dizel"], ["Otomatik"], ["Pickup"], "2.0", "205hp")] },
      { name: "Beetle", models: [model("Beetle Classic", ["Benzin"], ["Manuel"], ["Hatchback"], "1.6", "75hp"), model("New Beetle", ["Benzin"], ["Otomatik"], ["Hatchback"], "1.6", "102hp")] },
      { name: "Bora", models: [model("Bora Sedan", ["Benzin"], ["Manuel"], ["Sedan"], "1.6", "102hp")] },
      { name: "Caddy", models: [model("Caddy Combi", ["Dizel"], ["Otomatik"], ["MPV"], "2.0", "122hp"), model("Caddy Van", ["Dizel"], ["Manuel"], ["Van"], "2.0", "102hp")] },
      { name: "Caravelle", models: [model("Caravelle Passenger", ["Dizel"], ["Otomatik"], ["MPV"], "2.0", "150hp")] },
      { name: "CC", models: [model("Passat CC", ["Benzin"], ["Otomatik"], ["Sedan"], "1.8", "160hp")] },
      { name: "Crafter", models: [model("Crafter Van", ["Dizel"], ["Manuel"], ["Van"], "2.0", "140hp")] },
      { name: "Golf", models: [model("1.0 TSI", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "110hp"), model("1.5 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.5", "150hp"), model("1.6 TDI", ["Dizel"], ["Manuel", "Otomatik"], ["Hatchback"], "1.6", "115hp"), model("2.0 GTI", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "245hp"), model("R", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "320hp")] },
      { name: "Golf Variant", models: [model("Golf Variant Wagon", ["Benzin"], ["Otomatik"], ["Wagon"], "1.5", "150hp")] },
      { name: "ID.3", models: [model("ID.3 EV", ["Elektrik"], ["Otomatik"], ["Hatchback"], "Elektrik", "204hp")] },
      { name: "ID.4", models: [model("ID.4 EV SUV", ["Elektrik"], ["Otomatik"], ["SUV"], "Elektrik", "204hp")] },
      { name: "ID.5", models: [model("ID.5 Coupe SUV EV", ["Elektrik"], ["Otomatik"], ["CoupeSUV"], "Elektrik", "299hp")] },
      { name: "ID.7", models: [model("ID.7 Sedan EV", ["Elektrik"], ["Otomatik"], ["Sedan"], "Elektrik", "286hp"), model("ID.7 Variant EV", ["Elektrik"], ["Otomatik"], ["Wagon"], "Elektrik", "286hp")] },
      { name: "ID. Buzz", models: [model("ID. Buzz MPV", ["Elektrik"], ["Otomatik"], ["MPV"], "Elektrik", "204hp")] },
      { name: "Jetta", models: [model("Jetta Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "150hp")] },
      { name: "Passat", models: [model("1.4 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Sedan"], "1.4", "150hp"), model("1.5 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "150hp"), model("1.6 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "1.6", "120hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "150hp"), model("2.0 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "280hp")] },
      { name: "Polo", models: [model("1.0 MPI", ["Benzin"], ["Manuel"], ["Hatchback"], "1.0", "80hp"), model("1.0 TSI", ["Benzin"], ["Manuel", "Otomatik"], ["Hatchback"], "1.0", "95hp"), model("1.2 TSI", ["Benzin"], ["Manuel"], ["Hatchback"], "1.2", "90hp"), model("1.4 TDI", ["Dizel"], ["Manuel"], ["Hatchback"], "1.4", "90hp"), model("GTI", ["Benzin"], ["Otomatik"], ["Hatchback"], "2.0", "207hp")] },
      { name: "Multivan", models: [model("Multivan VIP", ["Dizel"], ["Otomatik"], ["MPV"], "2.0", "150hp")] },
      { name: "Phaeton", models: [model("Phaeton Luxury Sedan", ["Benzin"], ["Otomatik"], ["Sedan"], "3.0", "240hp")] },
      { name: "Scirocco", models: [model("Scirocco Coupe", ["Benzin"], ["Otomatik"], ["Coupe"], "1.4", "160hp")] },
      { name: "Sharan", models: [model("Sharan MPV", ["Dizel"], ["Otomatik"], ["MPV"], "2.0", "150hp")] },
      { name: "T-Cross", models: [model("T-Cross SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.0", "115hp")] },
      { name: "Taigo", models: [model("Taigo Coupe SUV", ["Benzin"], ["Otomatik"], ["CoupeSUV"], "1.0", "110hp")] },
      { name: "Tayron", models: [model("Tayron SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp")] },
      { name: "Touareg", models: [model("Touareg SUV", ["Dizel"], ["Otomatik"], ["SUV"], "3.0", "286hp")] },
      { name: "Touran", models: [model("Touran MPV", ["Dizel"], ["Otomatik"], ["MPV"], "1.6", "115hp")] },
      { name: "Transporter", models: [model("Transporter T6.1", ["Dizel"], ["Manuel"], ["Van"], "2.0", "110hp"), model("Transporter T7", ["Dizel"], ["Otomatik"], ["Van"], "2.0", "150hp")] },
      { name: "Tiguan", models: [model("1.4 TSI", ["Benzin"], ["Otomatik"], ["SUV"], "1.4", "150hp"), model("1.5 TSI", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp"), model("2.0 TSI", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "220hp"), model("1.6 TDI", ["Dizel"], ["Manuel"], ["SUV"], "1.6", "115hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["SUV"], "2.0", "150hp")] },
      { name: "T-Roc", models: [model("T-Roc R", ["Benzin"], ["Otomatik"], ["SUV"], "2.0", "300hp"), model("T-Roc SUV", ["Benzin"], ["Otomatik"], ["SUV"], "1.5", "150hp")] },
      { name: "Arteon", models: [model("1.5 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], "1.5", "150hp"), model("2.0 TSI", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "280hp"), model("2.0 TDI", ["Dizel"], ["Otomatik"], ["Sedan"], "2.0", "200hp"), model("R-Line", ["Benzin"], ["Otomatik"], ["Sedan"], "2.0", "190hp"), model("Shooting Brake", ["Benzin", "Dizel"], ["Otomatik"], ["Station Wagon"], "2.0", "200hp")] }
    ]
  }
];

const extraCatalog = [
  { name: "Toyota", series: {
    Auris: ["Auris Hatchback", "Auris Touring Sports"],
    Avensis: ["Avensis Sedan", "Avensis Wagon"],
    "Aygo X": ["Aygo X Crossover"],
    Camry: ["2.0", "2.4", "2.5", "2.5 Hybrid", "3.5 V6", "Camry Hybrid Sedan"],
    Carina: ["Carina Sedan"],
    Celica: ["Celica Coupe"],
    "C-HR": ["1.2 Turbo", "1.8 Hybrid", "2.0 Hybrid", "C-HR Hybrid", "C-HR Plug-in Hybrid", "Dynamic", "Passion"],
    Corolla: ["1.4 D-4D", "1.6", "1.8 Hybrid", "2.0 Hybrid", "Corolla Cross", "Corolla Cross Hybrid", "Corolla Hatchback", "Corolla Hybrid", "Corolla Sedan", "Corolla Touring Sports", "Cross"],
    Corona: ["Corona Sedan"],
    Cressida: ["Cressida Sedan"],
    GR86: ["GR86 Coupe"],
    GT86: ["GT86 Coupe"],
    Highlander: ["Highlander 7 Seater Hybrid"],
    Hilux: ["Hilux 4x2", "Hilux 4x4"],
    "Land Cruiser": ["Land Cruiser 300"],
    "Land Cruiser Prado": ["Land Cruiser Prado 250"],
    Mirai: ["Mirai FCEV"],
    Prius: ["Prius Hybrid", "Prius Plug-in Hybrid"],
    Proace: ["Proace City", "Proace Van", "Proace Verso"],
    RAV4: ["2.0", "2.2 D-4D", "2.5 Hybrid", "Adventure", "Prime", "RAV4 AWD-i", "RAV4 Hybrid", "RAV4 Plug-in Hybrid"],
    Supra: ["Supra A80", "Supra A90"],
    Verso: ["Verso MPV"],
    Yaris: ["1.0", "1.3", "1.5", "1.5 Hybrid", "GR", "GR Yaris", "Yaris Hatchback"],
    "Yaris Cross": ["Yaris Cross Hybrid"]
  } },
  { name: "Honda", series: {
    "Prelude New": ["Prelude e:HEV Advance", "Prelude e:HEV RS"],
    "e:Ny1": ["e:Ny1 EV"],
    Prologue: ["Prologue EV"],
    "Ye Series": ["Ye GT EV", "Ye P7 EV", "Ye S7 EV"],
    Civic: ["Civic Coupe", "Civic FC5", "Civic FD6", "Civic FE", "Civic Hatchback 3 Kapı", "Civic Hatchback 5 Kapı", "Civic Sedan 1.5 VTEC Turbo", "Civic Sedan 1.6 i-VTEC", "Civic Sedan 2.0 e:HEV"],
    City: ["City Sedan"],
    Accord: ["Accord Coupe", "Accord Sedan 1.5 VTEC Turbo", "Accord Sedan 2.0", "Accord Sedan 2.0 e:HEV", "Accord Sedan 2.4"],
    Jazz: ["Jazz Crosstar", "Jazz Hatchback"],
    Legend: ["Legend Sedan"],
    "CR-V": ["CR-V e:FCEV", "CR-V SUV 1.5 Turbo", "CR-V SUV 1.6 i-DTEC", "CR-V SUV 2.0 e:HEV", "CR-V SUV 2.0 i-VTEC", "CR-V TrailSport"],
    "HR-V": ["HR-V e:HEV", "HR-V SUV Advance", "HR-V SUV Elegance", "HR-V SUV Style+",],
    "ZR-V": ["ZR-V e:HEV"],
    Pilot: ["Pilot SUV", "Pilot TrailSport"],
    Passport: ["Passport SUV", "Passport TrailSport Elite"],
    Odyssey: ["Odyssey MPV"],
    "WR-V": ["WR-V Crossover"],
    "Civic Type R": ["Civic Type R EK9", "Civic Type R EP3", "Civic Type R FK2", "Civic Type R FK8", "Civic Type R FL5", "Civic Type R FN2"],
    S2000: ["S2000 CR", "S2000 Roadster VSA", "S2000 Roadster VSA'sız"],
    NSX: ["NSX Coupe", "NSX Hybrid"],
    Integra: ["Integra Coupe GS-R", "Integra Coupe LS", "Integra Coupe Type R", "Integra Sedan"],
    CRX: ["CRX 1.6 i-VT", "CRX del Sol Targa"],
    "Prelude Classic": ["Prelude Coupe 2.0i", "Prelude Coupe 2.2 VTEC"],
    Ridgeline: ["Ridgeline Crew Cab"],
    "Honda e": ["Honda e EV"],
    "N-Series": ["N-BOX", "N-ONE RS", "N-WGN"]
  } },
  { name: "Ford", series: {
    "Capri New": ["Capri EV 125kW", "Capri EV 250kW AWD Premium"],
    "Explorer EV": ["Explorer EV AWD", "Explorer EV Premium", "Explorer EV Select"],
    Puma: ["Puma Gen-E", "Puma ST", "Yeni Puma EcoBoost"],
    "Mustang Mach-E": ["Mustang Mach-E AWD", "Mustang Mach-E GT Premium", "Mustang Mach-E RWD"],
    "Bronco EV": ["Bronco BEV", "Bronco EREV"],
    Kuga: ["Kuga HEV", "Kuga PHEV", "Kuga SUV Active X", "Kuga SUV ST-Line X", "Kuga SUV Titanium"],
    Bronco: ["Bronco 4x4 2 Kapı", "Bronco 4x4 4 Kapı", "Bronco Raptor", "Bronco Sport"],
    EcoSport: ["EcoSport SUV"],
    Edge: ["Edge SUV EcoBoost", "Edge SUV Titanium"],
    Explorer: ["Explorer PHEV", "Explorer ST", "Explorer SUV"],
    Focus: ["Focus Active", "Focus Hatchback 3 Kapı", "Focus Hatchback 5 Kapı", "Focus RS", "Focus ST", "Focus Sedan", "Focus Station Wagon"],
    Fiesta: ["Fiesta Hatchback 3 Kapı", "Fiesta Hatchback 5 Kapı", "Fiesta ST", "Fiesta Van"],
    Mondeo: ["Mondeo Hatchback", "Mondeo Sedan", "Mondeo Station Wagon"],
    Mustang: ["Mustang Convertible", "Mustang Coupe Dark Horse", "Mustang Coupe EcoBoost", "Mustang Coupe GT", "Mustang Shelby GT350", "Mustang Shelby GT500"],
    Fusion: ["Fusion Hatchback"],
    Ka: ["Ka Hatchback", "StreetKa Cabriolet"],
    "Tourneo Courier": ["E-Tourneo Courier", "Tourneo Courier Kombi Active", "Tourneo Courier Kombi Titanium", "Tourneo Courier Kombi Trend"],
    "Transit Courier": ["E-Transit Courier", "Transit Courier Van"],
    "Tourneo Connect": ["Tourneo Connect Kombi"],
    "Transit Connect": ["Transit Connect Van"],
    "Tourneo Custom": ["Tourneo Custom Minibüs", "Tourneo Custom VIP"],
    "Transit Custom": ["E-Transit Custom", "Transit Custom Van"],
    Transit: ["E-Transit", "Transit Kamyonet Tek Kabin", "Transit Kamyonet Çift Kabin", "Transit Minibüs", "Transit Van"],
    Ranger: ["Ranger Raptor", "Ranger Super Duty", "Ranger Çift Kabin Wildtrak", "Ranger Çift Kabin XLT"],
    "F-150": ["F-150 King Ranch", "F-150 Lariat", "F-150 Lightning", "F-150 Platinum", "F-150 Raptor", "F-150 Raptor R", "F-150 STX", "F-150 XL", "F-150 XLT"],
    "F-Series Super Duty": ["F-250 Super Duty", "F-350 Super Duty", "F-450 Super Duty"],
    Maverick: ["Maverick Crew Cab"],
    Escort: ["Escort Hatchback", "Escort Sedan CL", "Escort Sedan CLX", "Escort Station Wagon"],
    Taunus: ["Taunus Otosan Kombi", "Taunus Sedan GTS", "Taunus Sedan GTS-X"],
    Granada: ["Granada Sedan"],
    Scorpio: ["Scorpio Sedan"],
    Sierra: ["Sierra Cosworth", "Sierra Hatchback", "Sierra Sedan"],
    Festiva: ["Festiva Hatchback"],
    Aspire: ["Aspire Hatchback"]
  } },
  { name: "Geely", series: {
    Coolray: ["Coolray SUV Executive", "Coolray SUV GF", "Coolray SUV Sport"],
    "Geometry C": ["Geometry C EV"],
    Starray: ["Starray EM-i", "Starray SUV"],
    Okavango: ["Okavango SUV"],
    "Galaxy E5": ["Galaxy E5 EM-i", "Galaxy E5 EV", "Geely EX5"],
    "Galaxy E8": ["Galaxy E8 Sedan EV"],
    "Galaxy L6": ["Galaxy L6 Sedan PHEV"],
    "Galaxy L7": ["Galaxy L7 SUV PHEV"],
    "Galaxy Xingyuan": ["Galaxy Xingyuan EV", "Geely EX2"],
    "Galaxy Starship 7": ["Galaxy Starship 7 SUV EM-i"],
    "Galaxy Starshine": ["Galaxy Starshine 6", "Galaxy Starshine 8"],
    "Galaxy A7": ["Galaxy A7 Sedan"],
    "Galaxy M9": ["Galaxy M9 SUV"],
    "Galaxy V900": ["Galaxy V900 MPV EREV", "Galaxy V900 MPV EV"],
    "LEVC L380": ["LEVC L380 VIP MPV"],
    "Emgrand Modern": ["Emgrand Sedan 5. Nesil"],
    Azkarra: ["Azkarra SUV"],
    Monjaro: ["Monjaro SUV"],
    Tugella: ["Tugella Coupe SUV"],
    Binray: ["Binray Sedan", "Binray Sport"],
    "Panda Mini": ["Panda Mini EV"],
    "Emgrand Classic": ["Emgrand EC7 Hatchback", "Emgrand EC7 Sedan", "Emgrand RV"],
    Echo: ["Echo Hatchback", "Echo Sedan"],
    Familia: ["Familia Hatchback", "Familia Sedan"],
    CK: ["CK Sedan"],
    MK: ["MK Hatchback", "MK Sedan"],
    FC: ["FC Sedan"],
    LC: ["LC Hatchback"]
  } },
  { name: "Renault", series: {
    "Austral": ["Austral E-Tech Full Hybrid", "Austral Mild Hybrid"],
    "Captur": ["0.9 TCe", "1.0 TCe", "1.3 TCe", "1.5 dCi", "Captur Benzin", "Captur Hybrid", "Captur LPG", "E-Tech"],
    "Clio": ["0.9 TCe", "1.0 TCe", "1.2", "1.5 dCi", "Clio V Benzin", "Clio V Hybrid", "Clio V LPG", "Clio VI Hybrid", "E-Tech"],
    "Express": ["Express Van"],
    "Fluence": ["Fluence Sedan"],
    "Kangoo": ["Kangoo Passenger", "Kangoo Van"],
    "Latitude": ["Latitude Sedan"],
    "Master": ["Master Minibus", "Master Van"],
    "Megane Classic": ["Megane I", "Megane II", "Megane III", "Megane IV"],
    "Megane E-Tech": ["Megane E-Tech EV"],
    "Rafale": ["Rafale E-Tech Full Hybrid"],
    "Scenic E-Tech": ["Scenic E-Tech EV"],
    "Symbol": ["0.9 TCe", "1.2", "1.4", "1.5 dCi", "Joy", "Symbol Sedan"],
    "Symbioz": ["Symbioz Hybrid SUV"],
    "Taliant": ["Taliant Sedan"],
    "Talisman": ["1.3 TCe", "1.5 dCi", "1.6 dCi", "1.8 TCe", "Initiale", "Talisman Estate", "Talisman Sedan"],
    "Thalia": ["Thalia Sedan"],
    "Trafic": ["Trafic Passenger", "Trafic Van"]
  } },
  { name: "RKS", series: {
    "Azure": ["Azure Scooter"],
    "Blade": ["Blade Scooter"],
    "Freccia": ["Freccia Scooter"],
    "GTR": ["GTR Maxi Scooter"],
    "K-Light": ["K-Light Cruiser"],
    "Newlight": ["Newlight Scooter"],
    "RK125S": ["RK125S Naked"],
    "RZ Series": ["RZ Naked", "RZ Touring"],
    "RZ150X": ["RZ150X Adventure"],
    "SFA Series": ["SFA ATV", "SFA UTV"],
    "SRK Series": ["SRK Naked", "SRK Touring"],
    "SRK-R Series": ["SRK-R Supersport"],
    "SRT Series": ["SRT Adventure"],
    "SRV Series": ["SRV Chopper", "SRV Cruiser"],
    "SVT650X": ["SVT650X Adventure"],
    "Vieste": ["Vieste Maxi Scooter"]
  } },
  { name: "Rolls-Royce", series: {
    "Cullinan": ["Cullinan Series II"],
    "Dawn": ["Dawn Convertible"],
    "Ghost": ["Ghost Series II"],
    "Ghost Extended": ["Ghost Extended"],
    "Phantom": ["Phantom Series II"],
    "Phantom Coupe": ["Phantom Coupe"],
    "Phantom Drophead": ["Phantom Drophead Coupe"],
    "Phantom Extended": ["Phantom Extended"],
    "Spectre": ["Spectre EV Super Coupe"],
    "Wraith": ["Wraith Coupe"]
  } },
  { name: "Rover", series: {
    "CityRover": ["CityRover Hatchback"],
    "Maestro": ["Maestro Hatchback"],
    "MG ZR": ["MG ZR Hatchback"],
    "MG ZS": ["MG ZS Sedan"],
    "MG ZT": ["MG ZT Sedan"],
    "MG ZT-T": ["MG ZT-T Estate"],
    "Mini Rover": ["Rover Mini Classic"],
    "Montego": ["Montego Estate", "Montego Sedan"],
    "P4 Series": ["Rover P4"],
    "P5 Series": ["Rover P5 3 Litre", "Rover P5 3.5 V8"],
    "P6 Series": ["Rover P6 2000", "Rover P6 2200", "Rover P6 3500 V8"],
    "Rover 25": ["Rover 25 Hatchback"],
    "Rover 45": ["Rover 45 Hatchback", "Rover 45 Sedan"],
    "Rover 75": ["Rover 75 Sedan", "Rover 75 Tourer"],
    "Rover 200 Series": ["Rover 214", "Rover 216", "Rover 220"],
    "Rover 400 Series": ["Rover 414", "Rover 416", "Rover 420"],
    "Rover 600 Series": ["Rover 620", "Rover 623"],
    "Rover 800 Series": ["Rover 820", "Rover 825", "Rover 827"],
    "SD1": ["Rover SD1 Liftback"],
    "Streetwise": ["Streetwise Crossover"]
  } },
  { name: "Saab", series: {
    "Saab 9-2X": ["9-2X Wagon"],
    "Saab 9-3": ["9-3 Convertible", "9-3 Sedan NG", "9-3 SportCombi", "9-3X Crossover"],
    "Saab 9-3 EV": ["Saab 9-3 EV NEVS"],
    "Saab 9-4X": ["9-4X SUV"],
    "Saab 9-5": ["9-5 Sedan NG", "9-5 Sedan OG", "9-5 SportCombi"],
    "Saab 9-7X": ["9-7X SUV"],
    "Saab 90": ["Saab 90 Sedan"],
    "Saab 92": ["Saab 92 Classic"],
    "Saab 93": ["Saab 93 Classic"],
    "Saab 95": ["Saab 95 Wagon"],
    "Saab 96": ["Saab 96 Two-Stroke", "Saab 96 V4"],
    "Saab 99": ["Saab 99 Sedan"],
    "Saab 900": ["Classic 900", "NG 900"],
    "Saab 9000": ["9000 Hatchback", "9000 Sedan"],
    "Saab Sonett": ["Sonett I", "Sonett II", "Sonett III"]
  } },
  { name: "Saipa", series: {
    "Ario": ["Ario Z300 Sedan"],
    "Citroen C3": ["Citroen C3 Iran Edition"],
    "Pride 131": ["Pride 131 Sedan"],
    "Pride 132": ["Pride 132 Sedan"],
    "Pride 141": ["Pride 141 Hatchback"],
    "Pride 151": ["Pride 151 Pickup"],
    "Quick": ["Quick Crossover", "Quick Hatchback"],
    "Renault Pars Tondar": ["Pars Tondar Sedan"],
    "Saipa 151 Pickup": ["151 Small Pickup"],
    "Saina": ["Saina Sedan"],
    "Shahin": ["Shahin Sedan"],
    "Tiba": ["Tiba Sedan"],
    "Tiba 2": ["Tiba 2 Hatchback"],
    "Vanet": ["Vanet Cargo", "Vanet Pickup"],
    "Z24": ["Z24 Pickup"]
  } },
  { name: "Hyundai", series: {
    "IONIQ 9": ["IONIQ 9 EV AWD Calligraphy", "IONIQ 9 EV Long Range", "IONIQ 9 EV Progressive"],
    "IONIQ 5": ["IONIQ 5 EV", "IONIQ 5 N EV"],
    "IONIQ 6": ["IONIQ 6 EV", "IONIQ 6 N Line EV"],
    "IONIQ 3": ["IONIQ 3 EV"],
    "IONIQ Classic": ["IONIQ Electric", "IONIQ Hybrid", "IONIQ Plug-In Hybrid"],
    Tucson: ["Tucson Hybrid", "Tucson N Line", "Tucson Plug-In Hybrid", "Tucson SUV CRDi", "Tucson SUV T-GDI"],
    "Santa Fe": ["Santa Fe Hybrid", "Santa Fe PHEV", "Santa Fe SUV"],
    Bayon: ["Bayon Crossover Elite", "Bayon Crossover Jump", "Bayon Crossover Style"],
    Kona: ["Kona Electric", "Kona Hybrid", "Kona SUV T-GDI"],
    Palisade: ["Palisade Hybrid", "Palisade SUV"],
    Venue: ["Venue SUV"],
    i20: ["i20 Active", "i20 Hatchback Elite", "i20 Hatchback Jump", "i20 Hatchback Style", "i20 N"],
    i10: ["i10 Hatchback"],
    Elantra: ["Elantra Hybrid", "Elantra N", "Elantra Sedan"],
    Sonata: ["Sonata Hybrid", "Sonata Sedan"],
    i30: ["i30 CW", "i30 Fastback", "i30 Fastback N", "i30 Hatchback", "i30 N"],
    Grandeur: ["Grandeur Hybrid", "Grandeur Sedan"],
    Staria: ["Staria Electric", "Staria MPV", "Staria Premium"],
    Starex: ["Starex Minibüs", "Starex Panelvan"],
    "H-1": ["H-1 Panelvan"],
    H350: ["H350 Panelvan"],
    "Santa Cruz": ["Santa Cruz Crew Cab"],
    Accent: ["Accent Admire", "Accent Blue", "Accent Era", "Accent Milenyum Kasa", "Accent Yumurta Kasa"],
    Getz: ["Getz Hatchback 1.3", "Getz Hatchback 1.4", "Getz Hatchback 1.5 CRDi"],
    Atos: ["Atos Hatchback", "Atos Prime"],
    Matrix: ["Matrix MPV"],
    "Hyundai Coupe": ["Hyundai Coupe FX"],
    "Genesis Coupe": ["Genesis Coupe V6"]
  } },
  { name: "IKCO (Samand)", series: {
    Samand: ["Samand Sarir Limuzin", "Samand Sedan EL", "Samand Sedan LX 1.6", "Samand Sedan LX 1.8", "Samand Sedan SE"],
    Tara: ["Tara EFP Turbo", "Tara Sedan V2 Manuel", "Tara Sedan V4 Otomatik"],
    Dena: ["Dena Plus Sedan", "Dena Plus Turbo Automatic", "Dena Plus Turbo Manuel", "Dena Sedan"],
    Rira: ["Rira Crossover SUV"],
    Soren: ["Soren ELX", "Soren Plus", "Soren Sedan"],
    Runna: ["Runna Plus Sedan", "Runna Sedan"],
    "Peugeot 207i IKCO": ["207i Hatchback", "207i Sedan"],
    Haima: ["Haima 7X", "Haima 8S", "Haima S5", "Haima S7"],
    Tunland: ["Tunland P201 Pick-Up"],
    "Peugeot Pars": ["Peugeot Pars TU5", "Peugeot Pars XU7"],
    Arisun: ["Arisun 2 Pick-Up", "Arisun Pick-Up"],
    Paykan: ["Paykan Sedan"],
    Bardo: ["Bardo Pick-Up"]
  } },
  { name: "Infiniti", series: {
    QX80: ["QX80 SUV Autograph", "QX80 SUV Luxe", "QX80 SUV Pure", "QX80 SUV Sport"],
    "QX60 New": ["QX60 SUV"],
    QX65: ["QX65 Coupe-SUV"],
    QX55: ["QX55 Crossover"],
    "QX50 New": ["QX50 SUV"],
    "FX Series": ["FX30d", "FX35", "FX37", "FX45", "FX50"],
    QX70: ["QX70 SUV"],
    "EX Series": ["EX25", "EX30d", "EX35", "EX37"],
    "JX Series": ["JX35", "QX60 3.5 V6"],
    Q50: ["Q50 Red Sport 400", "Q50 Sedan 2.0t", "Q50 Sedan 3.0t Twin Turbo", "Q50 Sedan 3.5 Hybrid"],
    "G Series": ["G20", "G25", "G35", "G37 Convertible", "G37 Coupe", "G37 Sedan"],
    Q60: ["Q60 Coupe", "Q60 Red Sport"],
    "M Series": ["M30d", "M35", "M37", "M45"],
    Q70: ["Q70 Sedan"],
    Q30: ["Q30 Hatchback 1.5 dCi", "Q30 Hatchback 1.6t"],
    QX30: ["QX30 Crossover AWD"],
    Q45: ["Q45 V8"]
  } },
  { name: "Jaguar", series: {
    "Type 01": ["Type 01 EV"],
    "Luxury SUV EV": ["Jaguar Luxury SUV EV"],
    "F-Pace": ["F-Pace R-Dynamic P250", "F-Pace R-Dynamic P400", "F-Pace SUV 2.0 D", "F-Pace SUV 3.0 D", "F-Pace SVR"],
    "E-Pace": ["E-Pace SUV D150 AWD", "E-Pace SUV P200", "E-Pace SUV P250"],
    "I-Pace": ["I-Pace Black Edition", "I-Pace EV400", "I-Pace HSE", "I-Pace SE"],
    XF: ["XF Sedan Luxury", "XF Sedan Portfolio", "XF Sedan Premium Luxury", "XF Sedan R-Dynamic", "XF Sportbrake"],
    XE: ["XE Sedan HSE", "XE Sedan Portfolio", "XE Sedan R-Sport"],
    "F-Type": ["F-Type Convertible", "F-Type Coupe 2.0 Turbo", "F-Type Coupe 3.0 Supercharged V6", "F-Type R", "F-Type SVR"],
    XJ: ["XJ Sedan", "XJL Long", "XJR"],
    "XK Series": ["XK8 Coupe", "XKR Coupe", "XKR-S"],
    "X-Type": ["X-Type Estate", "X-Type Sedan 2.0 Dizel", "X-Type Sedan 2.0 V6", "X-Type Sedan 2.5 V6"],
    "S-Type": ["S-Type R", "S-Type Sedan 2.7D", "S-Type Sedan 3.0 V6", "S-Type Sedan 4.2 V8"],
    "E-Type": ["E-Type Series 1 Coupe", "E-Type Series 1 Roadster", "E-Type Series 2 Coupe", "E-Type Series 2 Roadster", "E-Type Series 3 Coupe", "E-Type Series 3 Roadster"],
    XJ220: ["XJ220 Hypercar"],
    "Mark Series": ["Mark II", "Mark X"],
    Daimler: ["Daimler Eight"]
  } },
  { name: "Jiayuan", series: {
    Komi: ["Komi EV", "Komi Premium", "Komi Urban"],
    "City Spirit": ["City Spirit L6e", "City Spirit L7e"],
    "Mini Car": ["Mini Car Low Speed"],
    "City Spirit Van": ["City Spirit Van L6e", "City Spirit Van L7e"],
    "City Spirit Pick-up": ["City Spirit Pick-up L7e AWD", "City Spirit Pick-up L7e RWD"],
    "Micro Cargo": ["Micro Cargo Van"],
    "Vintage Series": ["Model T Electric Classic Car", "Vintage Shuttle 4 Koltuk", "Vintage Shuttle 6 Koltuk", "Vintage Shuttle 8 Koltuk"],
    "Sightseeing Bus": ["Sightseeing Bus 11 Koltuk", "Sightseeing Bus 14 Koltuk"]
  } },
  { name: "Joyce", series: {
    One: ["One Jazzberry", "One Joyceblues", "One Minty", "One Standart 25 km/h", "One Standart 45 km/h"],
    VC3: ["VC3 Hatchback EV"],
    Cargo: ["Cargo EV"]
  } },
  { name: "Peugeot", series: {
    "2008 New": ["2008 SUV", "E-2008 EV"],
    "208": ["1.2 PureTech", "1.4 HDi", "1.5 BlueHDi", "GT", "e-208"],
    "208 Classic": ["208 Classic Hatchback"],
    "208 New": ["208 Hatchback", "E-208 EV"],
    "206": ["206 Hatchback", "206 GTI", "206 RC", "206+"],
    "301": ["301 Sedan"],
    "306": ["306 Hatchback", "306 Sedan"],
    "308": ["1.2 PureTech", "1.5 BlueHDi", "1.6 THP", "GT", "Hybrid"],
    "308 Classic": ["308 Classic Hatchback"],
    "308 New": ["308 Hatchback", "308 SW", "E-308 EV"],
    "3008": ["1.2 PureTech", "1.5 BlueHDi", "1.6 THP", "GT", "Hybrid4"],
    "3008 Classic": ["3008 II BlueHDi", "3008 II PureTech"],
    "3008 New": ["3008 P64 Hybrid", "3008 P64 PHEV", "E-3008 EV"],
    "406": ["406 Coupe", "406 Sedan"],
    "407": ["407 SW", "407 Sedan"],
    "408": ["408 Fastback"],
    "5008": ["1.2 PureTech", "1.5 BlueHDi", "1.6 THP", "Allure", "GT"],
    "5008 Classic": ["5008 SUV Classic"],
    "5008 New": ["5008 SUV", "E-5008 EV"],
    "508": ["1.5 BlueHDi", "1.6 PureTech", "508 SW", "508 Sedan", "GT", "Hybrid", "PSE"],
    "607": ["607 Sedan"],
    Boxer: ["Boxer Van"],
    Expert: ["Expert Van"],
    Partner: ["Partner Van"],
    Rifter: ["Rifter Family"],
    Traveller: ["Traveller VIP"]
  } },
  { name: "Opel", series: {
    Adam: ["Adam Hatchback"],
    Astra: ["1.2 Turbo", "1.4 Turbo", "1.5 Diesel", "1.6 CDTI", "GTC"],
    "Astra Classic": ["Astra F", "Astra G", "Astra H", "Astra J", "Astra K"],
    "Astra New": ["Astra Electric", "Astra GSe", "Astra L Hatchback", "Astra Plug-in Hybrid", "Astra Sports Tourer"],
    Calibra: ["Calibra Coupe"],
    Combo: ["Combo Cargo", "Combo Life"],
    Corsa: ["1.0", "1.2", "1.2 Turbo", "1.3 CDTI", "e-Corsa"],
    "Corsa Classic": ["Corsa A", "Corsa B", "Corsa C", "Corsa D", "Corsa E"],
    "Corsa New": ["Corsa F", "Corsa MHEV", "Corsa-e"],
    Crossland: ["1.2", "1.2 Turbo", "1.5 Diesel", "Elegance", "Ultimate"],
    "Crossland X": ["Crossland X SUV"],
    Frontera: ["Frontera 7 Koltuk", "Frontera SUV"],
    Grandland: ["Grandland Hybrid", "Grandland SUV"],
    "Grandland X": ["Grandland X SUV"],
    Insignia: ["1.5 Turbo", "1.6 CDTI", "2.0 CDTI", "2.0 Turbo", "GSi", "Insignia B Grand Sport", "Insignia B Sedan", "Insignia Sports Tourer"],
    Karl: ["Karl Hatchback"],
    Mokka: ["1.2 Turbo", "1.4 Turbo", "1.6 CDTI", "GS Line", "Mokka", "Mokka-e"],
    Movano: ["Movano Van"],
    Omega: ["Omega Sedan"],
    "Rocks-e": ["Rocks-e Micro EV"],
    Tigra: ["Tigra Coupe", "Tigra TwinTop"],
    Vectra: ["Vectra A", "Vectra B", "Vectra C"],
    Vivaro: ["Vivaro Van", "Vivaro VIP"],
    Zafira: ["Zafira A", "Zafira B", "Zafira C"],
    "Zafira Life": ["Zafira Life VIP"]
  } },
  { name: "Fiat", series: {
    Topolino: ["Topolino EV", "Topolino Dolcevita EV"],
    "Grande Panda": ["Grande Panda EV", "Grande Panda Hybrid"],
    "Panda Fastback": ["Panda Fastback"],
    "Panda SUV": ["Panda SUV"],
    "600": ["600 Hybrid", "600e"],
    "500e": ["500e 3+1", "500e Cabrio", "500e Giorgio Armani Collector Edition", "500e Hatchback"],
    Egea: ["Egea Cross", "Egea Cross Wagon", "Egea Hatchback", "Egea Sedan", "Egea Station Wagon"],
    Linea: ["Linea Sedan Classic", "Linea Sedan Yeni Kasa"],
    Punto: ["Punto Hatchback 3 Kapı", "Punto Hatchback 5 Kapı"],
    "Grande Punto": ["Grande Punto"],
    "Punto Evo": ["Punto Evo"],
    "500": ["500 Hatchback", "500C"],
    "500L": ["500L", "500L Living"],
    "500X": ["500X SUV"],
    Panda: ["Panda 4x4", "Panda Cross", "Panda Hatchback"],
    Bravo: ["Bravo Hatchback"],
    Brava: ["Brava Hatchback"],
    Marea: ["Marea Sedan", "Marea Weekend"],
    Albea: ["Albea Sedan"],
    Palio: ["Palio Hatchback", "Palio Sole", "Palio Weekend"],
    Siena: ["Siena Sedan"],
    Idea: ["Idea MPV"],
    Stilo: ["Stilo Hatchback 3 Kapı", "Stilo Hatchback 5 Kapı", "Stilo MultiWagon"],
    Sedici: ["Sedici SUV"],
    Croma: ["Croma Crossover", "Croma Station Wagon"],
    Doblo: ["Doblo Cargo", "Doblo Kombi", "Doblo Pratico", "Doblo Van", "E-Doblo"],
    Fiorino: ["Fiorino Cargo", "Fiorino Combi"],
    Qubo: ["Qubo"],
    Scudo: ["Scudo Combi", "Scudo Van"],
    Ulysse: ["Ulysse Minib\u00fcs"],
    Ducato: ["Ducato Minib\u00fcs", "Ducato Van", "Ducato \u015easi"],
    "\u015eahin": ["\u015eahin 1.4", "\u015eahin 1.6", "\u015eahin S", "\u015eahin ie"],
    "Do\u011fan": ["Do\u011fan L", "Do\u011fan SL", "Do\u011fan SLX", "Do\u011fan ie"],
    Kartal: ["Kartal Cargo", "Kartal Station Wagon L", "Kartal Station Wagon SLX"],
    "Ser\u00e7e": ["Ser\u00e7e"],
    "Murat 124": ["Murat 124"],
    "Murat 131": ["Murat 131"],
    Uno: ["Uno Hatchback 70S", "Uno Hatchback SX", "Uno Hatchback ie"],
    Tipo: ["Tipo Hatchback MPi", "Tipo Hatchback S", "Tipo Hatchback SLX", "Tipo Hatchback SX"],
    Tempra: ["Tempra Sedan", "Tempra SW"],
    "124 Spider": ["124 Spider", "Abarth 124 Spider"],
    "Coupe Fiat": ["Coupe Fiat Turbo"],
    Barchetta: ["Barchetta Roadster"],
    Freemont: ["Freemont SUV AWD"]
  } },
  { name: "Nissan", series: { Micra: ["1.0", "1.2", "1.5 dCi", "IG-T", "Tekna"], Juke: ["1.0 DIG-T", "1.2 DIG-T", "1.5 dCi", "1.6", "Hybrid"], Qashqai: ["1.2 DIG-T", "1.3 DIG-T", "1.5 dCi", "1.6 dCi", "e-Power"], "X-Trail": ["1.6 dCi", "1.7 dCi", "2.0 dCi", "e-Power", "Tekna"], Navara: ["2.3 dCi", "2.5 dCi", "4x2", "4x4", "Platinum"] } },
  { name: "Kia", series: {
    EV2: ["EV2 Compact SUV"],
    EV3: ["EV3 GT", "EV3 Long Range", "EV3 Standard"],
    EV4: ["EV4 GT", "EV4 Sedan"],
    EV5: ["EV5 GT", "EV5 SUV"],
    EV6: ["EV6 Crossover AWD", "EV6 Crossover Long Range", "EV6 Crossover Standard", "EV6 GT"],
    EV9: ["EV9 GT", "EV9 Nightfall Edition", "EV9 SUV Earth", "EV9 SUV GT-Line"],
    PV5: ["PV5 Cargo", "PV5 Passenger"],
    PV7: ["PV7 High Roof"],
    Sportage: ["Sportage 30. Yıl Özel Serisi", "Sportage Concept Plus", "Sportage Cool", "Sportage Elegant", "Sportage HEV", "Sportage Mild-Hybrid", "Sportage PHEV", "Sportage Prestige", "Sportage SUV CRDi", "Sportage SUV GDI"],
    Sorento: ["Sorento SUV 1.6 Hybrid", "Sorento SUV 2.5 CRDi"],
    Niro: ["Niro EV", "Niro Hybrid", "Niro Plug-In Hybrid", "e-Niro"],
    Stonic: ["Stonic Crossover 1.0 T-GDI", "Stonic Crossover 1.4 MPI"],
    XCeed: ["XCeed Crossover"],
    Seltos: ["Seltos SUV"],
    Soul: ["Soul", "e-Soul"],
    Carnival: ["Carnival MPV"],
    Sedona: ["Sedona MPV"],
    Telluride: ["Telluride SUV"],
    Ceed: ["Ceed Hatchback", "Ceed Sportswagon"],
    ProCeed: ["ProCeed Shooting Brake"],
    Rio: ["Rio Hatchback Elegant", "Rio Hatchback Fancy", "Rio Hatchback Prestige"],
    Picanto: ["Picanto Hatchback"],
    Cerato: ["Cerato Sedan Classic", "Cerato Sedan Modern"],
    K4: ["K4 Hatchback", "K4 Sedan"],
    Optima: ["Optima Sedan"],
    K5: ["K5 Sedan"],
    Stinger: ["Stinger GT"],
    K8: ["K8 Sedan"],
    K9: ["K9 Sedan"],
    Opirus: ["Opirus Sedan"],
    Tasman: ["Tasman Pick-Up 4x2", "Tasman Pick-Up 4x4"],
    Bongo: ["Bongo EV", "Bongo Kamyonet K2500", "Bongo Kamyonet K2700"]
  } },
  { name: "Kuba", series: {
    City: ["City EV Plus", "City EV Standart"],
    M5: ["M5 EV"],
    Pikap: ["Pikap 200 Max"],
    K250: ["K250 Ticari"],
    Kargo: ["Kargo 180", "Kargo Scooter"],
    MT3: ["MT3 Pro", "MT3 Pro-X"],
    Hussar: ["Hussar 135 ATV", "Hussar 220 Pro ATV"],
    Altera: ["Altera 400 ATV"],
    Braves: ["Braves 110"],
    Gardentrack: ["Gardentrack ATV"],
    MX220: ["MX220 ATV"],
    Bluebird: ["Bluebird 125", "Bluebird 50", "Bluebird Pro"],
    Brilliant: ["Brilliant 125 Pro-X", "Brilliant 26E", "Brilliant 50 Pro", "Brilliant 50 Pro-Plus"],
    Newlight: ["Newlight 125 Pro", "Newlight 50"],
    Newcity: ["Newcity 125", "Newcity 50"],
    Azure: ["Azure 50 Pro"],
    Space: ["Space 50 Pro"],
    VN50: ["VN50 Pro"],
    Arome: ["Arome 125 Pro"],
    Bevely: ["Bevely 125"],
    Borelli: ["Borelli 50"],
    Grace: ["Grace 50"],
    "Çita": ["Çita 50 RX", "Çita 50 RX Gold", "Çita 50R Pro"],
    CG50: ["CG50 Pro New", "CG50 RX Pro"],
    Ege: ["Ege 50", "Ege Cub"],
    Cristal: ["Cristal 50"],
    Sniper: ["Sniper 50 Pro X"],
    SJ50: ["SJ50 Pro Cup"],
    Easy: ["Easy Pro 50"],
    TK03: ["TK03 Naked"],
    Superlight: ["Superlight 125"],
    Terra: ["Terra 125"],
    Bannry: ["Bannry 125"],
    Race: ["Race 125"],
    Neron: ["Neron X"],
    REE: ["REE1500"],
    Gree: ["Gree 08"],
    Blues: ["Blues E-Bike"]
  } },
  { name: "Lada", series: {
    Azimut: ["Azimut SUV 1.6", "Azimut SUV 1.8", "Azimut SUV 150HP Turbo"],
    Iskra: ["Iskra SW", "Iskra SW Cross", "Iskra Sedan"],
    Vesta: ["Vesta Cross Sedan", "Vesta Sedan", "Vesta Sport", "Vesta Sportline", "Vesta SW", "Vesta SW Cross"],
    Largus: ["Largus Cargo", "Largus Cross", "Largus Universal 5 Koltuk", "Largus Universal 7 Koltuk", "e-Largus"],
    "Niva Legend": ["Niva Bronto", "Niva Legend 3-Door", "Niva Legend 5-Door", "Niva Legend Urban", "Niva Pickup", "Niva Sport"],
    "Niva Travel": ["Niva Travel Black", "Niva Travel Off-Road Edition", "Niva Travel SUV"],
    Granta: ["Granta Cross", "Granta Drive Active", "Granta Hatchback", "Granta Liftback", "Granta Sedan"],
    Kalina: ["Kalina Hatchback", "Kalina SW", "Kalina Sedan"],
    Priora: ["Priora Hatchback", "Priora Sedan", "Priora Universal"],
    Vega: ["Vega Hatchback 111", "Vega Sedan 110", "Vega Station Wagon 112"],
    Samara: ["Samara Hatchback 2108", "Samara Hatchback 2109", "Samara Sedan 21099"],
    "Lada Classic": ["Lada 2101", "Lada 2102", "Lada 2103", "Lada 2104", "Lada 2105", "Lada 2106", "Lada 2107"]
  } },
  { name: "Lamborghini", series: {
    Temerario: ["Temerario Alleggerita", "Temerario Coupe"],
    Revuelto: ["Revuelto Coupe"],
    "Urus SE": ["Urus SE"],
    Lanzador: ["Lanzador EV"],
    Huracan: ["Huracan EVO", "Huracan EVO RWD", "Huracan EVO Spyder", "Huracan LP 580-2 RWD", "Huracan LP 580-2 Spyder", "Huracan LP 610-4 Coupe", "Huracan LP 610-4 Spyder", "Huracan Performante", "Huracan Performante Spyder", "Huracan Sterrato", "Huracan STO", "Huracan Tecnica"],
    Aventador: ["Aventador LP 700-4 Coupe", "Aventador LP 700-4 Roadster", "Aventador LP 750-4 SV", "Aventador LP 750-4 SV Roadster", "Aventador LP 780-4 Ultimae", "Aventador S", "Aventador S Roadster", "Aventador SVJ", "Aventador SVJ Roadster"],
    Urus: ["Urus Performante", "Urus S", "Urus V8 Twin-Turbo"],
    Gallardo: ["Gallardo LP 500-4", "Gallardo LP 500-4 Spyder", "Gallardo LP 550-2 Valentino Balboni", "Gallardo LP 560-4", "Gallardo LP 560-4 Spyder", "Gallardo LP 570-4 Spyder Performante", "Gallardo LP 570-4 Superleggera"],
    Murcielago: ["Murcielago LP 580", "Murcielago LP 580 Roadster", "Murcielago LP 640", "Murcielago LP 640 Roadster", "Murcielago LP 670-4 SV"],
    "Countach LPI": ["Countach LPI 800-4"],
    Sian: ["Sian FKP 37", "Sian Roadster"],
    Centenario: ["Centenario", "Centenario Roadster"],
    Veneno: ["Veneno", "Veneno Roadster"],
    Reventon: ["Reventon", "Reventon Roadster"],
    "Sesto Elemento": ["Sesto Elemento"],
    Diablo: ["Diablo", "Diablo GT", "Diablo SE30 Jota", "Diablo SV", "Diablo VT", "Diablo VT Roadster"],
    "Countach Classic": ["Countach 25th Anniversary", "Countach 5000 QV", "Countach LP400", "Countach LP400 S", "Countach LP500 S"],
    LM002: ["LM002 V12 Rambo Lambo"],
    Jalpa: ["Jalpa Coupe"],
    Urraco: ["Urraco Coupe"],
    Silhouette: ["Silhouette Coupe"],
    Miura: ["Miura P400", "Miura P400 S", "Miura P400 SV"],
    "350 GT": ["350 GT Coupe"],
    "400 GT": ["400 GT Coupe"],
    Espada: ["Espada GT"],
    Islero: ["Islero GT"],
    Jarama: ["Jarama GT"]
  } },
  { name: "Lancia", series: {
    "Ypsilon New": ["Ypsilon Edizione Limitata Cassina", "Ypsilon Elettrica", "Ypsilon HF", "Ypsilon HF Line", "Ypsilon Ibrida"],
    "Gamma New": ["Gamma Elettrica", "Gamma Ibrida"],
    "Ypsilon Rally4": ["Ypsilon Rally4 HF"],
    "Delta HF": ["Delta HF Integrale 16V", "Delta HF Integrale 8V", "Delta HF Integrale Evoluzione I", "Delta HF Integrale Evoluzione II", "Delta HF Integrale Giallo Ginestra", "Delta HF Integrale Martini 5", "Delta HF Integrale Martini 6", "Delta HF Turbo"],
    Stratos: ["Stratos HF Stradale"],
    "037": ["037 Rally"],
    S4: ["S4 Rally"],
    "Ypsilon Classic": ["Ypsilon 843", "Ypsilon 846", "Ypsilon Elefantino", "Ypsilon MomoDesign", "Ypsilon Unyca"],
    "Delta Modern": ["Delta 1.4 T-Jet", "Delta 1.6 Multijet", "Delta 1.9 TwinTurbo Multijet", "Delta Argento", "Delta Executive", "Delta Oro", "Delta Platino"],
    Thema: ["Thema 8.32", "Thema Sedan"],
    Voyager: ["Voyager MPV"],
    Kappa: ["Kappa Sedan"],
    Lybra: ["Lybra SW", "Lybra Sedan"],
    Thesis: ["Thesis Sedan"],
    Musa: ["Musa MPV"],
    Phedra: ["Phedra VIP Van"],
    Fulvia: ["Fulvia Coupe", "Fulvia HF"],
    Aurelia: ["Aurelia B20 Coupe", "Aurelia Spider"],
    Flavia: ["Flavia Coupe", "Flavia Sedan"],
    Flaminia: ["Flaminia Coupe", "Flaminia Sedan"]
  } },
  { name: "Leapmotor", series: {
    T03: ["T03 EV", "T03 Van EV"],
    B10: ["B10 EV", "B10 Hybrid EV", "B10 REEV"],
    B03X: ["B03X EV"],
    B05: ["B05 EV"],
    C10: ["C10 AWD", "C10 EV", "C10 Hybrid EV", "C10 Long Range", "C10 REEV"],
    C16: ["C16 EV", "C16 REEV"],
    C11: ["C11 SUV EV", "C11 SUV REEV"],
    C01: ["C01 Sedan EV", "C01 Sedan REEV"]
  } },
  { name: "LEVC (The London Taxi)", series: {
    Fairway: ["Fairway Taxi"],
    FX4: ["FX4 Classic Black Cab"],
    "LEVC TX": ["LEVC TX Range Extender Taxi"],
    "LEVC VN5": ["LEVC VN5 Electric Van"],
    TX1: ["TX1 Taxi"],
    TX4: ["TX4 Black Cab"],
    TXII: ["TXII Taxi"]
  } },
  { name: "Lexus", series: {
    TZ: ["TZ 450e", "TZ 550e AWD"],
    UX: ["UX 200", "UX 250h", "UX 300e", "UX 300h"],
    NX: ["NX 200t", "NX 300h", "NX 350h", "NX 450h+", "NX F SPORT", "NX F SPORT Handling"],
    RX: ["RX 350", "RX 350h", "RX 450h+", "RX 500h F SPORT Performance"],
    RZ: ["RZ 300e FWD", "RZ 450e AWD", "RZ 550e F SPORT AWD"],
    TX: ["TX 350", "TX 500h", "TX 550h+"],
    GX: ["GX 460 V8", "GX 550 Luxury", "GX 550 Overtrail", "GX 550 Premium", "GX 550 Twin-Turbo V6"],
    LX: ["LX 570 V8", "LX 600 Twin-Turbo V6", "LX 700h"],
    ES: ["ES 250", "ES 300h", "ES 350e", "ES 500e AWD"],
    IS: ["IS 200t", "IS 250 V6", "IS 300h", "IS 350", "IS 500 F SPORT Performance"],
    LS: ["LS 400", "LS 430", "LS 460", "LS 500", "LS 500 AWD Heritage Edition", "LS 500h"],
    LC: ["LC 500 Convertible", "LC 500 Coupe", "LC 500h"],
    RC: ["RC 200t", "RC 300h", "RC F Track Edition", "RC F V8"],
    LFA: ["LFA 4.8 V10", "LFA Nürburgring Package"],
    LFR: ["LFA II", "LFR Twin-Turbo Hybrid"],
    LM: ["LM 350h 4 Koltuk VIP", "LM 500h 7 Koltuk Executive"]
  } },
  { name: "Lincoln", series: {
    Navigator: ["Navigator Black Label", "Navigator L", "Navigator Reserve"],
    Aviator: ["Aviator Black Label", "Aviator Grand Touring", "Aviator Reserve"],
    Nautilus: ["Nautilus Black Label", "Nautilus Hybrid", "Nautilus Premiere", "Nautilus Reserve"],
    Corsair: ["Corsair Grand Touring", "Corsair Reserve", "Corsair Standard"],
    Continental: ["Continental Coach Door Edition", "Continental Sedan"],
    "Continental Mark Series": ["Mark III Coupe", "Mark IV Coupe", "Mark V Coupe", "Mark VII Coupe", "Mark VIII Coupe"],
    "Town Car": ["Town Car Cartier", "Town Car Executive", "Town Car Signature", "Town Car Stretch Limousine"],
    Zephyr: ["Zephyr Hybrid", "Zephyr Sedan"],
    MKZ: ["MKZ Hybrid", "MKZ Sedan 2.0 EcoBoost", "MKZ Sedan 3.0 V6"],
    MKS: ["MKS Sedan"],
    MKX: ["MKX Crossover"],
    MKT: ["MKT Crossover", "MKT MPV"],
    MKC: ["MKC SUV"],
    "Mark LT": ["Mark LT Pick-Up"]
  } },
  { name: "Lotus", series: {
    Eletre: ["Eletre", "Eletre Carbon", "Eletre R", "Eletre S", "Eletre X"],
    Emeya: ["Emeya 600", "Emeya 900", "Emeya R", "Emeya S"],
    Emira: ["Emira First Edition", "Emira Jim Clark Special Edition", "Emira Racing Line", "Emira Turbo", "Emira Turbo SE", "Emira V6 SE"],
    Evija: ["Evija", "Evija Fittipaldi Edition"],
    Elise: ["Elise Cup 250", "Elise Cup 260", "Elise S1", "Elise S2", "Elise S3", "Elise Sport 220", "Elise Sport 240 Final Edition"],
    Exige: ["Exige Cup 430 Final Edition", "Exige S V6", "Exige S1", "Exige S2", "Exige Sport 350", "Exige Sport 390", "Exige Sport 410"],
    Evora: ["Evora 400", "Evora 410 Sport", "Evora GT", "Evora GT410", "Evora GT430", "Evora S"],
    Europa: ["Europa S"],
    "2-Eleven": ["2-Eleven Track"],
    "3-Eleven": ["3-Eleven Track"],
    Esprit: ["Esprit S1", "Esprit S2", "Esprit S3", "Esprit V8", "Turbo Esprit"],
    Elan: ["Elan M100", "Elan Roadster"],
    Seven: ["Lotus Seven"],
    Cortina: ["Ford Lotus Cortina"]
  } },
  { name: "Luqi", series: {
    EV300: ["EV300 3000W", "EV300 Long Range"],
    EV400: ["EV400 M1", "EV400 M1 Ultra"],
    "EV600 Cargo": ["EV600 Cargo 6000W"],
    "EV600 Pickup": ["EV600 Pickup 6000W"],
    "LUQI 2.0": ["LUQI 2.0 İki Teker 2000W", "LUQI 2.0-SUV Üç Teker 2000W", "LUQI 2.0-SUV Üç Teker 3000W"],
    "HL 6.0": ["HL 6.0 25 km/h", "HL 6.0 45 km/h", "HL 6.0 V1 1500W", "HL 6.0 V2 2000W", "HL 6.0 V2 3000W"],
    "HL 5.0": ["HL 5.0 4000W"],
    "HL 3.0": ["HL 3.0 1500W", "HL 3.0 3000W"],
    "HL 3.1": ["HL 3.1 Three-Wheel"],
    "HL 3.2": ["HL 3.2 Three-Wheel"]
  } },
  { name: "Marcos", series: {
    TSO: ["TSO GT", "TSO GT2", "TSO GTC", "TSO Spyder"],
    "Mantis Modern": ["Mantis Coupe", "Mantis GT Thruxton", "Mantis Spyder"],
    Mantra: ["Mantra Coupe", "Mantra Spyder"],
    "LM Series": ["LM400", "LM500", "LM600"],
    Mantula: ["Mantula Coupe", "Mantula Spyder"],
    Martina: ["Martina Coupe"],
    "Marcos 3 Litre": ["Marcos 3 Litre GT"],
    "Marcos 2.5 Litre": ["Marcos 2.5 Litre GT"],
    "Marcos GT": ["Marcos GT 1500", "Marcos GT 1600", "Marcos GT 2 Litre", "Marcos GT 3 Litre"],
    "Mini Marcos": ["Mini Marcos Mark I", "Mini Marcos Mark II", "Mini Marcos Mark III", "Mini Marcos Mark IV", "Mini Marcos Mark V"],
    "Luton Gullwing": ["Marcos Luton Gullwing"]
  } },
  { name: "Maserati", series: {
    MC20: ["MC20 Cielo", "MC20 Coupe", "MC20 GT2 Stradale"],
    MCPura: ["MCPura Cielo", "MCPura Coupe"],
    "GranTurismo New": ["GranTurismo Folgore", "GranTurismo Modena", "GranTurismo Trofeo"],
    "GranCabrio New": ["GranCabrio Folgore", "GranCabrio Trofeo"],
    Grecale: ["Grecale Folgore", "Grecale GT", "Grecale Modena", "Grecale Trofeo"],
    "Urus SE": ["Urus SE"],
    Lanzador: ["Lanzador EV"],
    Levante: ["Levante Diesel", "Levante GT", "Levante GTS", "Levante Modena", "Levante Trofeo"],
    "Ghibli Modern": ["Ghibli Diesel", "Ghibli Hybrid", "Ghibli S", "Ghibli S Q4", "Ghibli Trofeo"],
    "Quattroporte Modern": ["Quattroporte Diesel", "Quattroporte GT", "Quattroporte GTS", "Quattroporte Modena", "Quattroporte Trofeo"],
    "GranTurismo Classic": ["GranTurismo MC Stradale", "GranTurismo S", "GranTurismo Sport"],
    "GranCabrio Classic": ["GranCabrio Sport"],
    "3200 GT": ["3200 GT Coupe"],
    Coupe: ["Coupe Cambiocorsa"],
    Spyder: ["Spyder Cambiocorsa"],
    "Quattroporte Classic": ["Quattroporte 5th Gen"],
    Biturbo: ["Biturbo Coupe", "Biturbo Sedan"],
    "Ghibli Classic": ["Ghibli Classic Coupe"],
    Khamsin: ["Khamsin Coupe"],
    Bora: ["Bora Coupe"],
    Merak: ["Merak Coupe"]
  } },
  { name: "Mazda", series: {
    "CX-60": ["CX-60 e-Skyactiv D", "CX-60 e-Skyactiv PHEV"],
    "CX-80": ["CX-80 e-Skyactiv D", "CX-80 e-Skyactiv PHEV"],
    "CX-70": ["CX-70 e-Skyactiv G", "CX-70 PHEV"],
    "CX-90": ["CX-90 e-Skyactiv G", "CX-90 PHEV"],
    "CX-5": ["CX-5 2.0 Skyactiv-G", "CX-5 2.2 Skyactiv-D", "CX-5 2.5 Skyactiv-G", "CX-5 Black Edition", "CX-5 Elite Plus", "CX-5 Motion", "CX-5 Power Sense", "CX-5 Reflex"],
    "CX-30": ["CX-30 e-Skyactiv G", "CX-30 e-Skyactiv X"],
    "CX-50": ["CX-50 2.5 Turbo", "CX-50 Hybrid AWD"],
    "CX-3": ["CX-3 1.5 Skyactiv-D", "CX-3 2.0 Skyactiv-G", "CX-3 Motion", "CX-3 Power", "CX-3 Reflex"],
    "CX-4": ["CX-4 SUV"],
    "CX-8": ["CX-8 SUV"],
    "CX-9": ["CX-9 SUV"],
    "MX-30": ["MX-30 e-Skyactiv R-EV", "MX-30 EV"],
    "EZ-6": ["EZ-6 EREV", "EZ-6 EV"],
    "Mazda 3": ["Mazda 3 Hatchback", "Mazda 3 Sedan", "Mazda 3 Skyactiv-G", "Mazda 3 Skyactiv-X"],
    "Mazda 6": ["Mazda 6 Sedan 2.0", "Mazda 6 Sedan 2.2 Dizel", "Mazda 6 Sedan 2.5"],
    "Mazda 2": ["Mazda 2 Hatchback", "Mazda 2 Hybrid"],
    "MX-5": ["MX-5 NA", "MX-5 NB", "MX-5 NC", "MX-5 ND", "MX-5 RF", "MX-5 Roadster"],
    "323": ["323 Familia", "323 Hatchback", "323 Lantia", "323 Practica", "323 Sedan"],
    "626": ["626 Hatchback", "626 Sedan", "626 Station Wagon"],
    "929": ["929 Sedan"],
    "Xedos 6": ["Xedos 6 Sedan"],
    "Xedos 9": ["Xedos 9 Sedan"],
    "RX-7": ["RX-7 FD3S", "RX-7 Turbo Rotary"],
    "RX-8": ["RX-8 1.3 Renesis Rotary"]
  } },
  { name: "McLaren", series: {
    W1: ["W1 Hypercar"],
    Speedtail: ["Speedtail Hyper-GT"],
    Senna: ["Senna", "Senna GTR"],
    Elva: ["Elva Roadster"],
    P1: ["P1", "P1 GTR", "P1 LM"],
    "750S": ["750S Coupe", "750S Spider"],
    Artura: ["Artura Coupe", "Artura Spider"],
    "720S": ["720S Coupe", "720S Spider"],
    "765LT": ["765LT Coupe", "765LT Spider"],
    "650S": ["650S Coupe", "650S Spider"],
    "675LT": ["675LT Coupe", "675LT Spider"],
    "MP4-12C": ["MP4-12C Coupe", "MP4-12C Spider"],
    GTS: ["GTS Coupe"],
    GT: ["McLaren GT"],
    "570S": ["570GT", "570S Coupe", "570S Spider"],
    "600LT": ["600LT Coupe", "600LT Spider"],
    "McLaren F1": ["McLaren F1 Central Seating"],
    "Mercedes-Benz SLR McLaren": ["SLR McLaren Coupe", "SLR McLaren Roadster"]
  } },
  { name: "Mahindra", series: {
    "XEV 9e": ["XEV 9e Coupe SUV EV"],
    "XEV 9S": ["XEV 9S 7 Seater SUV EV"]
  } },
  { name: "Skoda", series: {
    "105 Series": ["Skoda 105"],
    "120 Series": ["Skoda 120"],
    "130 Series": ["Skoda 130"],
    Citigo: ["Citigo City Car"],
    Elroq: ["Elroq Compact EV SUV"],
    Enyaq: ["Enyaq EV"],
    "Enyaq Coupe": ["Enyaq Coupe EV"],
    Fabia: ["1.0 MPI", "1.0 TSI", "1.2 TSI", "1.4 TDI", "Fabia Combi", "Fabia Hatchback", "Monte Carlo"],
    Favorit: ["Favorit Hatchback"],
    Felicia: ["Felicia Combi", "Felicia Hatchback"],
    Forman: ["Forman Wagon"],
    Kamiq: ["Kamiq SUV"],
    Karoq: ["1.0 TSI", "1.5 TSI", "1.6 TDI", "2.0 TDI", "Karoq SUV", "Sportline"],
    Kodiaq: ["1.5 TSI", "2.0 TDI", "2.0 TSI", "Kodiaq 7 Koltuk", "Kodiaq SUV", "RS", "Scout"],
    Octavia: ["1.0 TSI", "1.4 TSI", "1.5 TSI", "1.6 TDI", "Octavia Combi", "Octavia RS", "Octavia Sedan", "Octavia iV", "RS"],
    Praktik: ["Praktik Van"],
    Rapid: ["Rapid Sedan", "Rapid Spaceback"],
    Roomster: ["Roomster MPV"],
    Scala: ["Scala Hatchback"],
    Superb: ["1.5 TSI", "1.6 TDI", "2.0 TDI", "2.0 TSI", "L&K", "Superb Combi", "Superb L&K", "Superb Sedan"],
    Yeti: ["Yeti Crossover"]
  } },
  { name: "Smart", series: {
    Crossblade: ["Crossblade Special Edition"],
    Forfour: ["Forfour 453", "Forfour 454"],
    "Forfour EQ": ["Forfour EQ EV"],
    Fortwo: ["Fortwo 450", "Fortwo 451", "Fortwo 453"],
    "Fortwo EQ": ["Fortwo EQ EV"],
    Roadster: ["Roadster Cabrio", "Roadster Coupe"],
    "Smart #1": ["Smart #1 Brabus", "Smart #1 Premium", "Smart #1 Pro", "Smart #1 Pro+"],
    "Smart #3": ["Smart #3 Brabus", "Smart #3 Premium", "Smart #3 Pro"],
    "Smart #5": ["Smart #5 Brabus", "Smart #5 Premium SUV"]
  } },
  { name: "Subaru", series: {
    BRZ: ["BRZ Coupe"],
    Crosstrek: ["Crosstrek AWD"],
    Domingo: ["Domingo Van"],
    Forester: ["Forester AWD"],
    Impreza: ["Impreza Hatchback"],
    Justy: ["Justy Hatchback"],
    Legacy: ["Legacy Sedan", "Legacy Wagon"],
    Leone: ["Leone AWD"],
    Libero: ["Libero Microbus"],
    Outback: ["Outback Crossover", "Outback Wagon"],
    Solterra: ["Solterra EV AWD"],
    SVX: ["SVX Coupe"],
    Tribeca: ["Tribeca SUV"],
    Vivio: ["Vivio Kei Car"],
    WRX: ["WRX Sedan"],
    "WRX STI": ["WRX STI Performance"],
    XV: ["XV Crossover"]
  } },
  { name: "Suzuki", series: {
    Across: ["Across Plug-in Hybrid"],
    Alto: ["Alto City Car"],
    Baleno: ["Baleno Hatchback"],
    Celerio: ["Celerio City Car"],
    "Grand Vitara": ["Grand Vitara SUV"],
    "Grand Vitara XL-7": ["Grand Vitara XL-7 7 Seater"],
    Ignis: ["Ignis Micro SUV"],
    Jimny: ["Jimny 3 Door", "Jimny 5 Door", "Jimny AllGrip"],
    Liana: ["Liana Hatchback", "Liana Sedan"],
    "S-Cross": ["S-Cross 4x2", "S-Cross AllGrip", "S-Cross Mild Hybrid"],
    Samurai: ["Samurai 4x4"],
    "SJ Series": ["SJ410", "SJ413"],
    Splash: ["Splash Mini MPV"],
    Swace: ["Swace Hybrid Wagon"],
    Swift: ["Swift Hatchback", "Swift Mild Hybrid", "Swift Sport"],
    SX4: ["SX4 Crossover", "SX4 Sedan"],
    Vitara: ["Vitara 4x2", "Vitara AllGrip", "Vitara Mild Hybrid"],
    "Wagon R": ["Wagon R MPV", "Wagon R+ MPV"]
  } },
  { name: "Tata", series: {
    Altroz: ["Altroz Hatchback"],
    Curvv: ["Curvv Coupe SUV", "Curvv EV"],
    Harrier: ["Harrier SUV"],
    Indigo: ["Indigo Sedan"],
    Marina: ["Marina Station Wagon"],
    Manza: ["Manza Sedan"],
    Nexon: ["Nexon Dizel", "Nexon EV", "Nexon Petrol"],
    Punch: ["Punch Micro SUV"],
    "Safari Classic": ["Safari Classic 4x4"],
    "Safari New": ["Safari 7 Seater SUV"],
    Sumo: ["Sumo MPV", "Sumo SUV"],
    Telcoline: ["Telcoline Pick-Up"],
    Tiago: ["Tiago EV", "Tiago Hatchback"],
    Tigor: ["Tigor EV", "Tigor Sedan"],
    Vista: ["Vista Hatchback"],
    Xenon: ["Xenon Pick-Up"]
  } },
  { name: "Tofaş", series: {
    Albea: ["Albea Sedan"],
    Brava: ["Brava Hatchback"],
    Ducato: ["Ducato Hafif Ticari"],
    "Doblò": ["Doblò Hafif Ticari"],
    Doğan: ["Doğan L", "Doğan SL", "Doğan SLX"],
    Egea: ["Egea Cross", "Egea Cross Wagon", "Egea Hatchback", "Egea Sedan"],
    Fiorino: ["Fiorino Hafif Ticari"],
    Kartal: ["Kartal L", "Kartal SLX"],
    Linea: ["Linea Sedan"],
    Marea: ["Marea Sedan"],
    "Murat 124": ["Murat 124"],
    "Murat 131": ["Murat 131"],
    Palio: ["Palio Hatchback"],
    Scudo: ["Scudo Hafif Ticari"],
    Serçe: ["Serçe"],
    Tempra: ["Tempra Sedan"],
    Uno: ["Uno Hatchback"],
    Şahin: ["Şahin", "Şahin 1.4 ie", "Şahin 1.6 ie", "Şahin L", "Şahin S"]
  } },
  { name: "Togg", series: {
    T10F: ["T10F Fastback AWD", "T10F Fastback RWD"],
    T10X: ["T10X Launch Edition", "T10X V1 RWD Standard Range", "T10X V2 AWD Long Range", "T10X V2 RWD Long Range"],
    T8X: ["T8X Compact SUV EV"]
  } },
  { name: "Vanderhall", series: {
    Brawley: ["Brawley EV 4x4"],
    Carmel: ["Carmel Touring"],
    Edison: ["Edison EV"],
    Speedster: ["Speedster Single Seat"],
    Venice: ["Venice 1.5 Turbo"]
  } },
  { name: "Volta", series: {
    EV1: ["Volta EV1 L6e"],
    EV2: ["Volta EV2 L7e"],
    "VB Series": ["VB1 E-Bike", "VB2 E-Bike", "VB3 E-Bike"],
    "VJ Series": ["VJ1 Electric Scooter", "VJ2 Electric Scooter"],
    VM: ["VM4 Electric Scooter", "VM6 Electric Scooter"],
    VS2: ["VS2 Electric Moped"],
    VSC: ["VSC Electric Scooter"],
    VSM: ["VSM Electric Scooter"]
  } },
  { name: "Volvo", series: {
    EX30: ["EX30 Compact SUV"],
    EX40: ["EX40 Electric SUV"],
    EX60: ["EX60 Electric SUV"],
    EX90: ["EX90 7 Seater Electric SUV"],
    XC40: ["B4", "T3", "T4", "T5", "XC40 Mild Hybrid"],
    XC60: ["D4", "D5", "Recharge", "T5", "XC60 Mild Hybrid", "XC60 Plug-in Hybrid"],
    XC90: ["XC90 Mild Hybrid", "XC90 Plug-in Hybrid"],
    "V60 Cross Country": ["V60 Cross Country Wagon"],
    S60: ["T3", "T4", "T5", "B4", "Recharge"],
    S90: ["D4", "D5", "T5", "B5", "Recharge"],
    V40: ["T2", "T3", "T4", "D2", "D3"]
  } },
  { name: "XEV", series: {
    Yoyo: ["XEV Yoyo L7e", "XEV Yoyo Swappable Battery"]
  } },
  { name: "Yuki Motor", series: {
    "Sport Series": ["Sport 50", "Sport 125", "Sport 250"],
    "Scooter Series": ["Scooter 50", "Scooter 125"],
    "Commuter Series": ["Commuter 50", "Commuter 125"],
    "Chopper Series": ["Chopper 125", "Cruiser 250"],
    "Electric Scooter": ["Electric Scooter 250W", "Electric Scooter 1000W", "Electric Scooter 3000W"],
    "Electric Bicycle": ["Electric City Bike", "Electric Folding Bike"],
    "Electric Trike": ["Electric Trike Cargo", "Electric Trike Passenger"],
    "Cargo Tricycle": ["Electric Cargo Tricycle", "Petrol Cargo Tricycle"]
  } },
  { name: "Zlin Motors", series: {
    Sahin: ["Sahin 1 Electric Moped"],
    Feniks: ["Feniks Electric Moped"],
    "Z Series": ["Z-1 Electric Moped"],
    Troya: ["Troya Electric Trike"],
    Luna: ["Luna Electric Trike"],
    Thor: ["Thor Electric Cargo Trike"],
    Spark: ["Zlin Spark Mini EV"]
  } },
  { name: "Tesla", series: {
    Cybertruck: ["Cybertruck AWD", "Cybertruck Cyberbeast"],
    "Model 3": ["Highland", "Model 3 Highland", "Model 3 Long Range AWD", "Model 3 Performance", "Model 3 RWD", "Performance", "Rear-Wheel Drive", "Standard Range"],
    "Model S": ["60", "75D", "90D", "Long Range", "Model S Long Range", "Model S Plaid", "Model S Standard", "Plaid"],
    "Model X": ["75D", "90D", "100D", "Long Range", "Model X Long Range", "Model X Plaid", "Plaid"],
    "Model Y": ["Juniper", "Long Range", "Model Y Long Range AWD", "Model Y Performance", "Model Y RWD", "Performance", "Rear-Wheel Drive", "Standard Range"],
    Roadster: ["Tesla Roadster Next Gen"],
    Semi: ["Tesla Semi Truck"]
  } },
  { name: "Dacia", series: { Sandero: ["1.0", "1.0 TCe", "1.5 dCi", "Stepway", "Essential"], Duster: ["1.0 TCe", "1.3 TCe", "1.5 dCi", "4x2", "4x4"], Logan: ["1.0", "1.2", "1.5 dCi", "MCV", "Stepway"], Jogger: ["1.0 TCe", "Hybrid", "Extreme", "Expression", "Essential"], Spring: ["Electric 45", "Electric 65", "Comfort", "Extreme", "Business"] } },
  { name: "Seat", series: {
    Altea: ["Altea MPV"],
    "Altea XL": ["Altea XL MPV"],
    Arona: ["Arona B-SUV", "FR", "Style", "Xcellence"],
    Arosa: ["Arosa City Car"],
    Ateca: ["Ateca C-SUV", "FR", "Style"],
    Cordoba: ["Cordoba Sedan", "Cordoba Vario"],
    Exeo: ["Exeo Sedan"],
    Freetrack: ["Freetrack Crossover"],
    Fura: ["Fura Classic"],
    Ibiza: ["1.0 MPI", "1.0 TSI", "1.2 TSI", "1.4 TDI", "FR", "Ibiza B-Segmenti", "Style"],
    Inca: ["Inca Ticari"],
    Leon: ["1.0 TSI", "1.4 TSI", "1.5 TSI", "1.6 TDI", "FR", "Leon C-Segmenti Hatchback", "Leon Sportstourer ST", "Style"],
    Malaga: ["Malaga Classic"],
    Marbella: ["Marbella Classic"],
    Mii: ["Mii City Car"],
    Ronda: ["Ronda Classic"],
    Tarraco: ["2.0 TDI", "2.0 TSI", "FR", "Style", "Tarraco D-SUV", "Xcellence"],
    Toledo: ["Toledo Sedan"]
  } },
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

function ensureSeriesModels(brandName, seriesName, entries) {
  const brand = data.find((item) => item.name === brandName);
  if (!brand) return;

  let series = brand.series.find((item) => item.name === seriesName);
  if (!series) {
    series = { name: seriesName, models: [] };
    brand.series.push(series);
  }

  entries.forEach((entry) => {
    if (series.models.some((item) => item.name === entry.name)) return;
    series.models.push(
      model(
        entry.name,
        entry.fuels || ["Benzin"],
        entry.transmissions || ["Otomatik"],
        entry.bodyTypes || ["Sedan"],
        entry.engine || "2.0",
        entry.power || "150hp"
      )
    );
  });
}

ensureSeriesModels("Chevrolet", "Aveo", [
  { name: "1.2", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "84hp" },
  { name: "1.3 D", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp" },
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.4", power: "101hp" }
]);
ensureSeriesModels("Chevrolet", "Camaro", [
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "275hp" },
  { name: "3.6", bodyTypes: ["Coupe"], engine: "3.6", power: "335hp" },
  { name: "6.2", bodyTypes: ["Coupe"], engine: "6.2", power: "455hp" },
  { name: "RS", bodyTypes: ["Coupe"], engine: "3.6", power: "335hp" },
  { name: "SS", bodyTypes: ["Coupe"], engine: "6.2", power: "455hp" },
  { name: "Z28", bodyTypes: ["Coupe"], engine: "7.0", power: "505hp" }
]);
ensureSeriesModels("Chevrolet", "Caprice", [
  { name: "3.6", bodyTypes: ["Sedan"], engine: "3.6", power: "301hp" },
  { name: "5.0 LS", bodyTypes: ["Sedan"], engine: "5.0", power: "170hp" }
]);
ensureSeriesModels("Chevrolet", "Celebrity", [
  { name: "2.8", bodyTypes: ["Sedan"], engine: "2.8", power: "130hp" },
  { name: "3.1", bodyTypes: ["Sedan"], engine: "3.1", power: "140hp" }
]);
ensureSeriesModels("Chevrolet", "Corvette", [
  { name: "C4", bodyTypes: ["Coupe"], engine: "5.7", power: "250hp" },
  { name: "C5", bodyTypes: ["Coupe"], engine: "5.7", power: "345hp" },
  { name: "C6", bodyTypes: ["Coupe"], engine: "6.2", power: "436hp" },
  { name: "C7", bodyTypes: ["Coupe"], engine: "6.2", power: "466hp" },
  { name: "C8", bodyTypes: ["Coupe"], engine: "6.2", power: "495hp" },
  { name: "Z06", bodyTypes: ["Coupe"], engine: "5.5", power: "670hp" }
]);
ensureSeriesModels("Chevrolet", "Cruze", [
  { name: "1.4 T", bodyTypes: ["Sedan", "Hatchback"], engine: "1.4", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "124hp", fuels: ["Benzin", "Dizel"], transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "141hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 D", bodyTypes: ["Sedan"], engine: "2.0", power: "163hp", fuels: ["Dizel"] }
]);
ensureSeriesModels("Chevrolet", "Epica", [
  { name: "2.0 D LT", bodyTypes: ["Sedan"], engine: "2.0", power: "150hp", fuels: ["Dizel"] },
  { name: "2.0 LT", bodyTypes: ["Sedan"], engine: "2.0", power: "143hp" }
]);
ensureSeriesModels("Chevrolet", "Evanda", [
  { name: "2.0 CDX", bodyTypes: ["Sedan"], engine: "2.0", power: "131hp" },
  { name: "2.0 Platinum", bodyTypes: ["Sedan"], engine: "2.0", power: "131hp" }
]);
ensureSeriesModels("Chevrolet", "Impala", [
  { name: "3.8", bodyTypes: ["Sedan"], engine: "3.8", power: "200hp" },
  { name: "5.7", bodyTypes: ["Sedan"], engine: "5.7", power: "260hp" }
]);
ensureSeriesModels("Chevrolet", "Kalos", [
  { name: "1.2", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "72hp" },
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.4", power: "94hp" }
]);
ensureSeriesModels("Chevrolet", "Lacetti", [
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.4", power: "95hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "109hp" }
]);
ensureSeriesModels("Chevrolet", "Rezzo", [
  { name: "1.6 SX Comfort", transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.6", power: "107hp" }
]);
ensureSeriesModels("Chevrolet", "Spark", [
  { name: "0.8", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.8", power: "52hp" },
  { name: "1.0", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.0", power: "68hp" },
  { name: "1.2", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "81hp" }
]);
ensureSeriesModels("Chrysler", "300 C", [
  { name: "2.7", bodyTypes: ["Sedan"], engine: "2.7", power: "193hp" },
  { name: "3.0 CRD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "218hp" },
  { name: "3.5", bodyTypes: ["Sedan"], engine: "3.5", power: "250hp" },
  { name: "5.7", bodyTypes: ["Sedan"], engine: "5.7", power: "340hp" },
  { name: "6.1 SRT", bodyTypes: ["Sedan"], engine: "6.1", power: "425hp" }
]);
ensureSeriesModels("Chrysler", "300 M", [
  { name: "3.5", bodyTypes: ["Sedan"], engine: "3.5", power: "253hp" }
]);
ensureSeriesModels("Chrysler", "Concorde", [
  { name: "3.3", bodyTypes: ["Sedan"], engine: "3.3", power: "161hp" },
  { name: "3.5", bodyTypes: ["Sedan"], engine: "3.5", power: "214hp" }
]);
ensureSeriesModels("Chrysler", "Crossfire", [
  { name: "Roadster 3.2", bodyTypes: ["Roadster"], engine: "3.2", power: "218hp" }
]);
ensureSeriesModels("Chrysler", "LHS", [
  { name: "3.5", bodyTypes: ["Sedan"], engine: "3.5", power: "253hp" }
]);
ensureSeriesModels("Chrysler", "Neon", [
  { name: "2.0", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "2.0", power: "132hp" },
  { name: "LE", bodyTypes: ["Sedan"], engine: "2.0", power: "133hp" },
  { name: "LX", bodyTypes: ["Sedan"], engine: "2.0", power: "133hp" }
]);
ensureSeriesModels("Chrysler", "PT Cruiser", [
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "116hp" },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "141hp" },
  { name: "2.2 CRD", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "2.2", power: "150hp" },
  { name: "2.4", bodyTypes: ["Hatchback"], engine: "2.4", power: "143hp" }
]);
ensureSeriesModels("Chrysler", "Sebring", [
  { name: "2.0 CRD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "140hp" },
  { name: "2.4 Limited", bodyTypes: ["Sedan"], engine: "2.4", power: "173hp" },
  { name: "2.5 LXI", bodyTypes: ["Sedan"], engine: "2.5", power: "163hp" },
  { name: "2.7 Limited", bodyTypes: ["Sedan"], engine: "2.7", power: "203hp" },
  { name: "2.7 LX", bodyTypes: ["Sedan"], engine: "2.7", power: "203hp" }
]);
ensureSeriesModels("Chrysler", "Stratus", [
  { name: "2.5", bodyTypes: ["Sedan"], engine: "2.5", power: "163hp" },
  { name: "LE", bodyTypes: ["Sedan"], engine: "2.0", power: "133hp" },
  { name: "LX", bodyTypes: ["Sedan"], engine: "2.5", power: "163hp" }
]);
ensureSeriesModels("Citroen", "Ami", [
  { name: "Buggy", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "8hp" },
  { name: "Electric", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "8hp" },
  { name: "Peps", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "8hp" },
  { name: "Pop", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "8hp" },
  { name: "Tonic", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "8hp" }
]);
ensureSeriesModels("Citroen", "C-Elysée", [
  { name: "1.2", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.2", power: "72hp" },
  { name: "1.5 BlueHDI", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.5", power: "100hp" },
  { name: "1.6 BlueHDI", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "100hp" },
  { name: "1.2 VTi", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.2", power: "82hp" },
  { name: "1.6 HDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "92hp" },
  { name: "1.6 VTi", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "115hp" }
]);
ensureSeriesModels("Citroen", "C1", [
  { name: "1.0", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.0", power: "68hp" },
  { name: "1.0 VTi", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.0", power: "72hp" },
  { name: "1.4 HDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "55hp" }
]);
ensureSeriesModels("Citroen", "C2", [
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp" },
  { name: "1.4 HDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "68hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "110hp" }
]);
ensureSeriesModels("Citroen", "C3", [
  { name: "1.2 PureTech", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "82hp" },
  { name: "1.2 VTi", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "82hp" },
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp" },
  { name: "1.4 e-HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.4", power: "70hp" },
  { name: "1.4 HDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "68hp" },
  { name: "1.4 VTi", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "95hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "110hp" },
  { name: "1.6 BlueHDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "100hp" },
  { name: "1.6 HDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "92hp" },
  { name: "1.6 VTİ", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp" }
]);
ensureSeriesModels("Citroen", "e-C3", [
  { name: "Max", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "113hp" },
  { name: "Plus", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "113hp" }
]);
ensureSeriesModels("Citroen", "C3 Picasso", [
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.4", power: "95hp" },
  { name: "1.6 e-HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.6", power: "92hp" },
  { name: "1.6 HDİ", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.6", power: "90hp" }
]);
ensureSeriesModels("Citroen", "C4", [
  { name: "1.2 Hybrid", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.2", power: "136hp" },
  { name: "1.2 PureTech", transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.2", power: "130hp" },
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "90hp" },
  { name: "1.4 VTi", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "95hp" },
  { name: "1.5 BlueHDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.5", power: "130hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "110hp" },
  { name: "1.6 BlueHDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp" },
  { name: "1.6 e-HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.6", power: "115hp" },
  { name: "1.6 HDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "110hp" },
  { name: "2.0", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "2.0", power: "143hp" }
]);
ensureSeriesModels("Citroen", "C4 Grand Picasso", [
  { name: "1.6 BlueHDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.6", power: "120hp" },
  { name: "1.6 e-HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.6", power: "115hp" },
  { name: "1.6 HDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.6", power: "110hp" },
  { name: "1.6 THP", transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.6", power: "156hp" }
]);
ensureSeriesModels("Citroen", "C4 Picasso", [
  { name: "1.6 BlueHDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.6", power: "120hp" },
  { name: "1.6 e-HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.6", power: "115hp" },
  { name: "1.6 HDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.6", power: "110hp" },
  { name: "1.6 THP", transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.6", power: "156hp" }
]);
ensureSeriesModels("Citroen", "C4 X", [
  { name: "1.2 Hybrid", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "1.2", power: "136hp" },
  { name: "1.2 PureTech", transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "1.2", power: "130hp" },
  { name: "1.5 BlueHDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "1.5", power: "130hp" }
]);
ensureSeriesModels("Citroen", "e-C4", [
  { name: "Max", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "156hp" },
  { name: "Shine Bold", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "156hp" }
]);
ensureSeriesModels("Citroen", "e-C4 X", [
  { name: "Max", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "156hp" },
  { name: "Shine Bold", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "156hp" }
]);
ensureSeriesModels("Citroen", "C5", [
  { name: "1.6 e-HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "1.6", power: "112hp" },
  { name: "1.6 HDi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "110hp" },
  { name: "1.6 THP", transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "1.6", power: "156hp" },
  { name: "2.0", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "2.0", power: "143hp" },
  { name: "2.0 HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "2.0", power: "163hp" },
  { name: "2.2 HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "2.2", power: "204hp" },
  { name: "2.7 HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "2.7", power: "208hp" },
  { name: "3.0", transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "3.0", power: "211hp" }
]);
ensureSeriesModels("Citroen", "C6", [
  { name: "2.7 HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "2.7", power: "208hp" }
]);
ensureSeriesModels("Citroen", "C8", [
  { name: "2.0 HDi Collection", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Minivan"], engine: "2.0", power: "136hp" },
  { name: "2.0 HDi SX", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Minivan"], engine: "2.0", power: "136hp" },
  { name: "2.0 X", transmissions: ["Manuel"], bodyTypes: ["Minivan"], engine: "2.0", power: "136hp" }
]);
ensureSeriesModels("Citroen", "Saxo", [
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp" },
  { name: "1.5D", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "58hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "90hp" }
]);
ensureSeriesModels("Citroen", "Xsara", [
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.4", power: "75hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "90hp" },
  { name: "1.8", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "112hp" },
  { name: "2.0", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "132hp" },
  { name: "Picasso 1.6", transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.6", power: "110hp" },
  { name: "Picasso 1.8", transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.8", power: "117hp" },
  { name: "Picasso 2.0", transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "2.0", power: "136hp" }
]);
ensureSeriesModels("Citroen", "BX", [
  { name: "16", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "94hp" },
  { name: "TRS", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "90hp" }
]);
ensureSeriesModels("Citroen", "Evasion", [
  { name: "1.9 TD SX", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.9", power: "90hp" },
  { name: "2.0 X", transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "2.0", power: "121hp" }
]);
ensureSeriesModels("Citroen", "Xantia", [
  { name: "1.9", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.9", power: "110hp" },
  { name: "2.0XM", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "2.0", power: "121hp" },
  { name: "2.0", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "2.0", power: "132hp" },
  { name: "2.1", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "2.1", power: "109hp" }
]);
ensureSeriesModels("Citroen", "XM", [
  { name: "2.0", transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "2.0", power: "130hp" },
  { name: "2.1", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "2.1", power: "109hp" }
]);
ensureSeriesModels("Citroen", "ZX", [
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "88hp" },
  { name: "1.8", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.8", power: "103hp" },
  { name: "2.0", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "2.0", power: "123hp" }
]);
ensureSeriesModels("Cupra", "Born", [
  { name: "150 kW", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "204hp" }
]);
ensureSeriesModels("Cupra", "Leon", [
  { name: "1.5 eTSI", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.5", power: "150hp" },
  { name: "Impulse", bodyTypes: ["Hatchback"], engine: "2.0", power: "245hp" },
  { name: "Standart", bodyTypes: ["Hatchback"], engine: "2.0", power: "245hp" },
  { name: "Supreme", bodyTypes: ["Hatchback"], engine: "2.0", power: "245hp" },
  { name: "VZ Line", bodyTypes: ["Hatchback"], engine: "2.0", power: "300hp" }
]);
ensureSeriesModels("Dacia", "Jogger", [
  { name: "1.0 ECO-G", fuels: ["LPG", "Benzin"], transmissions: ["Manuel"], bodyTypes: ["MPV", "Crossover"], engine: "1.0", power: "100hp" },
  { name: "1.0 TCe", transmissions: ["Manuel"], bodyTypes: ["MPV", "Crossover"], engine: "1.0", power: "110hp" },
  { name: "1.6 Hybrid", fuels: ["Hibrit"], transmissions: ["Otomatik"], bodyTypes: ["MPV", "Crossover"], engine: "1.6", power: "140hp" }
]);
ensureSeriesModels("Dacia", "Lodgy", [
  { name: "1.3 TCE", transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.3", power: "130hp" },
  { name: "1.5 BlueDCI", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.5", power: "115hp" },
  { name: "1.5 dCi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.5", power: "110hp" },
  { name: "1.6 ECO-G", fuels: ["LPG", "Benzin"], transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.6", power: "110hp" },
  { name: "1.6 SCE", transmissions: ["Manuel"], bodyTypes: ["MPV"], engine: "1.6", power: "102hp" }
]);
ensureSeriesModels("Dacia", "Logan", [
  { name: "0.9 Tce MCV", transmissions: ["Manuel"], bodyTypes: ["Station Wagon"], engine: "0.9", power: "90hp" },
  { name: "1.0 MCV", transmissions: ["Manuel"], bodyTypes: ["Station Wagon"], engine: "1.0", power: "75hp" },
  { name: "1.2", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.2", power: "75hp" },
  { name: "1.2 MCV", transmissions: ["Manuel"], bodyTypes: ["Station Wagon"], engine: "1.2", power: "75hp" },
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.4", power: "75hp" },
  { name: "1.5 dCi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.5", power: "90hp" },
  { name: "1.5 dCi MCV", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Station Wagon"], engine: "1.5", power: "90hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "90hp" },
  { name: "1.6 MCV", transmissions: ["Manuel"], bodyTypes: ["Station Wagon"], engine: "1.6", power: "105hp" }
]);
ensureSeriesModels("Dacia", "Sandero", [
  { name: "0.9 ECO-G", fuels: ["LPG", "Benzin"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.9", power: "90hp" },
  { name: "1310", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "54hp" },
  { name: "1310 L", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "65hp" },
  { name: "0.9 TCe", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.9", power: "90hp" },
  { name: "1.0 Sce", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.0", power: "75hp" },
  { name: "1.0 TCe", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.0", power: "90hp" },
  { name: "1.0 TCe ECO-G", fuels: ["LPG", "Benzin"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.0", power: "100hp" },
  { name: "1.2", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "75hp" },
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp" },
  { name: "1.5 BlueDCI", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "95hp" }
]);
ensureSeriesModels("Dacia", "Solenza", [
  { name: "1.4", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.4", power: "75hp" },
  { name: "Clima", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.4", power: "75hp" },
  { name: "Comfort", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.4", power: "75hp" },
  { name: "Prima", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.4", power: "75hp" },
  { name: "Rapsodie", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.4", power: "75hp" },
  { name: "Scala", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.4", power: "75hp" },
  { name: "1.5 dCi", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.5", power: "65hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "90hp" }
]);
ensureSeriesModels("Daewoo", "Nexia", [
  { name: "1.5", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "75hp" },
  { name: "GL", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.5", power: "75hp" },
  { name: "GLE", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.5", power: "75hp" },
  { name: "GLX", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.5", power: "75hp" },
  { name: "GTX", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.5", power: "90hp" }
]);
ensureSeriesModels("Daewoo", "Nubira", [
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "109hp" },
  { name: "2.0", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "2.0", power: "133hp" }
]);
ensureSeriesModels("Daewoo", "Espero", [
  { name: "2.0i", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "2.0", power: "105hp" }
]);
ensureSeriesModels("Daewoo", "Lanos", [
  { name: "1.3", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.3", power: "75hp" },
  { name: "1.5", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "86hp" },
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "106hp" }
]);
ensureSeriesModels("Daewoo", "Leganza", [
  { name: "2.0", transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "2.0", power: "133hp" },
  { name: "CDX", transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "2.0", power: "133hp" },
  { name: "SX", transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "2.0", power: "133hp" }
]);
ensureSeriesModels("Daewoo", "Matiz", [
  { name: "0.8", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.8", power: "52hp" },
  { name: "S", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.8", power: "52hp" },
  { name: "SE", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.8", power: "52hp" }
]);
ensureSeriesModels("Daewoo", "Racer", [
  { name: "1.5i", transmissions: ["Manuel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "75hp" }
]);
ensureSeriesModels("Daewoo", "Super Saloon", [
  { name: "2.0", transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "2.0", power: "110hp" }
]);
ensureSeriesModels("Daewoo", "Tico", [
  { name: "0.8", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.8", power: "41hp" },
  { name: "SL", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.8", power: "41hp" },
  { name: "SX", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.8", power: "41hp" }
]);
ensureSeriesModels("Daihatsu", "Cuore", [
  { name: "0.9", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "0.9", power: "42hp" },
  { name: "1.0", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.0", power: "58hp" }
]);
ensureSeriesModels("Daihatsu", "Materia", [
  { name: "1.5", transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.5", power: "103hp" },
  { name: "Gold", transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.5", power: "103hp" }
]);
ensureSeriesModels("Daihatsu", "Move", [
  { name: "1.5", transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.5", power: "99hp" },
  { name: "Gran Move", transmissions: ["Otomatik"], bodyTypes: ["MPV"], engine: "1.5", power: "90hp" }
]);
ensureSeriesModels("Daihatsu", "Sirion", [
  { name: "1.0", transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.0", power: "69hp" },
  { name: "1.3", transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.3", power: "91hp" }
]);
ensureSeriesModels("Daihatsu", "Applause", [
  { name: "1.6", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "105hp" },
  { name: "Li", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "105hp" },
  { name: "X", transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "1.6", power: "105hp" }
]);
ensureSeriesModels("Daihatsu", "Charade", [
  { name: "1.3", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "87hp" },
  { name: "1.5", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "100hp" }
]);
ensureSeriesModels("Daihatsu", "Copen", [
  { name: "1.3", transmissions: ["Otomatik"], bodyTypes: ["Roadster"], engine: "1.3", power: "87hp" },
  { name: "Sport", transmissions: ["Otomatik"], bodyTypes: ["Roadster"], engine: "0.7", power: "64hp" }
]);
ensureSeriesModels("Daihatsu", "YRV", [
  { name: "1.3", transmissions: ["Otomatik"], bodyTypes: ["Hatchback", "MPV"], engine: "1.3", power: "87hp" },
  { name: "Plus", transmissions: ["Otomatik"], bodyTypes: ["Hatchback", "MPV"], engine: "1.3", power: "87hp" },
  { name: "Turbo", transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.3", power: "140hp" }
]);
ensureSeriesModels("Dodge", "Avenger", [
  { name: "2.0 CRD", fuels: ["Dizel"], transmissions: ["Manuel"], bodyTypes: ["Sedan"], engine: "2.0", power: "140hp" },
  { name: "2.4 SXT", transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "2.4", power: "170hp" }
]);
ensureSeriesModels("Dodge", "Challenger", [
  { name: "GT", bodyTypes: ["Coupe"], engine: "3.6", power: "305hp" },
  { name: "R/T", bodyTypes: ["Coupe"], engine: "5.7", power: "375hp" },
  { name: "SE", bodyTypes: ["Coupe"], engine: "3.6", power: "305hp" },
  { name: "SRT8", bodyTypes: ["Coupe"], engine: "6.4", power: "470hp" },
  { name: "SRT Hellcat", bodyTypes: ["Coupe"], engine: "6.2", power: "717hp" },
  { name: "SXT Plus", bodyTypes: ["Coupe"], engine: "3.6", power: "305hp" }
]);
ensureSeriesModels("Dodge", "Charger", [
  { name: "3.6", bodyTypes: ["Sedan"], engine: "3.6", power: "292hp" },
  { name: "6.2", bodyTypes: ["Sedan"], engine: "6.2", power: "717hp" },
  { name: "6.4", bodyTypes: ["Sedan"], engine: "6.4", power: "485hp" }
]);
ensureSeriesModels("Dodge", "Magnum", [
  { name: "5.7", bodyTypes: ["Station Wagon"], engine: "5.7", power: "340hp" }
]);
ensureSeriesModels("DS Automobiles", "DS 3 Classic", [
  { name: "1.2 PureTech", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "110hp" },
  { name: "1.2 VTi", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "82hp" },
  { name: "1.6 e-HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.6", power: "92hp" },
  { name: "1.6 THP", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "156hp" },
  { name: "1.6 VTi", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp" }
]);
ensureSeriesModels("DS Automobiles", "DS 4 Classic", [
  { name: "1.6 e-HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.6", power: "115hp" },
  { name: "1.6 THP", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "165hp" },
  { name: "1.6 VTi", transmissions: ["Manuel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp" }
]);
ensureSeriesModels("DS Automobiles", "DS 4 Modern", [
  { name: "1.2 Puretech", transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.2", power: "130hp" },
  { name: "1.5 BlueHDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.5", power: "130hp" },
  { name: "1.6 BlueHDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp" },
  { name: "1.6 Puretech", transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.6", power: "180hp" }
]);
ensureSeriesModels("DS Automobiles", "DS 5", [
  { name: "1.6 BlueHDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp" },
  { name: "1.6 e-HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.6", power: "115hp" },
  { name: "1.6 THP", transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "1.6", power: "165hp" },
  { name: "2.0 HDi", fuels: ["Dizel"], transmissions: ["Otomatik"], bodyTypes: ["Hatchback"], engine: "2.0", power: "180hp" }
]);
ensureSeriesModels("DS Automobiles", "DS 9", [
  { name: "1.6 E-Tense", fuels: ["Hibrit"], transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "1.6", power: "250hp" },
  { name: "1.6 Puretech", transmissions: ["Otomatik"], bodyTypes: ["Sedan"], engine: "1.6", power: "225hp" }
]);
ensureSeriesModels("Ferrari", "296 Serisi", [
  { name: "GTB", bodyTypes: ["Coupe"], engine: "3.0", power: "830hp" },
  { name: "GTS", bodyTypes: ["Roadster"], engine: "3.0", power: "830hp" }
]);
ensureSeriesModels("Ferrari", "360 / F430", [
  { name: "Modena F1", bodyTypes: ["Coupe"], engine: "3.6", power: "400hp" },
  { name: "F430", bodyTypes: ["Coupe"], engine: "4.3", power: "490hp" },
  { name: "F430 Spider", bodyTypes: ["Roadster"], engine: "4.3", power: "490hp" }
]);
ensureSeriesModels("Ferrari", "458 / 488 / F8 Serisi", [
  { name: "Italia", bodyTypes: ["Coupe"], engine: "4.5", power: "570hp" },
  { name: "Spider", bodyTypes: ["Roadster"], engine: "4.5", power: "570hp" },
  { name: "Pista", bodyTypes: ["Coupe"], engine: "3.9", power: "720hp" },
  { name: "Berlinetta", bodyTypes: ["Coupe"], engine: "6.3", power: "740hp" },
  { name: "Tributo", bodyTypes: ["Coupe"], engine: "3.9", power: "720hp" }
]);
ensureSeriesModels("Ferrari", "456 / 550 / 575M Maranello", [
  { name: "575M Maranello", bodyTypes: ["Coupe"], engine: "5.7", power: "515hp" }
]);
ensureSeriesModels("Ferrari", "599", [
  { name: "599 GTB F1", bodyTypes: ["Coupe"], engine: "6.0", power: "620hp" }
]);
ensureSeriesModels("Ferrari", "812 / F12", [
  { name: "GTS", bodyTypes: ["Roadster"], engine: "6.5", power: "800hp" }
]);
ensureSeriesModels("Ferrari", "California", [
  { name: "4.3", bodyTypes: ["Convertible"], engine: "4.3", power: "460hp" },
  { name: "T", bodyTypes: ["Convertible"], engine: "3.9", power: "560hp" }
]);
ensureSeriesModels("Ferrari", "12Cilindri", [
  { name: "6.5", bodyTypes: ["Coupe"], engine: "6.5", power: "830hp" },
  { name: "Standart", bodyTypes: ["Coupe"], engine: "6.5", power: "830hp" },
  { name: "Spider", bodyTypes: ["Roadster"], engine: "6.5", power: "830hp" }
]);
ensureSeriesModels("Ferrari", "308 / 328 / 348 / F355", [
  { name: "Spider", bodyTypes: ["Roadster"], engine: "3.5", power: "380hp" }
]);
ensureSeriesModels("Ferrari", "FF / GTC4Lusso", [
  { name: "6.3", bodyTypes: ["Coupe"], engine: "6.3", power: "660hp" }
]);
ensureSeriesModels("Ferrari", "Portofino", [
  { name: "3.9", bodyTypes: ["Convertible"], engine: "3.9", power: "600hp" }
]);
ensureSeriesModels("Ferrari", "Roma", [
  { name: "3.9", bodyTypes: ["Coupe"], engine: "3.9", power: "620hp" }
]);
ensureSeriesModels("Ferrari", "SF90", [
  { name: "Spider 4.0", fuels: ["Hibrit"], bodyTypes: ["Roadster"], engine: "4.0", power: "1000hp" },
  { name: "Stradale 4.0", fuels: ["Hibrit"], bodyTypes: ["Coupe"], engine: "4.0", power: "1000hp" }
]);
ensureSeriesModels("Fiat", "124 Spider", [
  { name: "1.4 T Multiair", bodyTypes: ["Roadster"], engine: "1.4", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Lusso", bodyTypes: ["Roadster"], engine: "1.4", power: "140hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Fiat", "Albea", [
  { name: "1.2", bodyTypes: ["Sedan"], engine: "1.2", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.3", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4 Fire", bodyTypes: ["Sedan"], engine: "1.4", power: "77hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] },
  { name: "Sole 1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.3", power: "70hp", transmissions: ["Manuel"] },
  { name: "Sole 1.4 Fire", bodyTypes: ["Sedan"], engine: "1.4", power: "77hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Brava", [
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] },
  { name: "ELX", bodyTypes: ["Hatchback"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] },
  { name: "SX", bodyTypes: ["Hatchback"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Bravo", [
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 Multiair", bodyTypes: ["Hatchback"], engine: "1.4", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 T-Jet", bodyTypes: ["Hatchback"], engine: "1.4", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.4 Turbo", bodyTypes: ["Hatchback"], engine: "1.4", power: "150hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] },
  { name: "1.6 Mjet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "165hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "126 Bis", [
  { name: "126", bodyTypes: ["Hatchback"], engine: "0.7", power: "26hp", transmissions: ["Manuel"] },
  { name: "650", bodyTypes: ["Hatchback"], engine: "0.7", power: "24hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Coupe Fiat", [
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "142hp", transmissions: ["Manuel"] },
  { name: "2.0 Turbo", bodyTypes: ["Coupe"], engine: "2.0", power: "220hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Croma", [
  { name: "1.9 JTD", fuels: ["Dizel"], bodyTypes: ["Station Wagon", "Crossover"], engine: "1.9", power: "150hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Fiat", "500", [
  { name: "500 1.0 Hybrid", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.0", power: "70hp", transmissions: ["Manuel"] },
  { name: "500 1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "69hp", transmissions: ["Manuel"] },
  { name: "500 1.3 Mjet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "95hp", transmissions: ["Manuel"] },
  { name: "500 1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "100hp", transmissions: ["Manuel"] },
  { name: "500 Abarth", bodyTypes: ["Hatchback"], engine: "1.4", power: "145hp", transmissions: ["Manuel"] },
  { name: "500C 1.2", bodyTypes: ["Cabrio"], engine: "1.2", power: "69hp", transmissions: ["Manuel"] },
  { name: "500C 1.3 Mjet", fuels: ["Dizel"], bodyTypes: ["Cabrio"], engine: "1.3", power: "95hp", transmissions: ["Manuel"] },
  { name: "500C 1.4", bodyTypes: ["Cabrio"], engine: "1.4", power: "100hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "500e", [
  { name: "500E", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "118hp" }
]);
ensureSeriesModels("Fiat", "500L", [
  { name: "500L 0.9 TwinAir", bodyTypes: ["MPV"], engine: "0.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "500L 1.3 Mjet", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.3", power: "95hp", transmissions: ["Manuel"] },
  { name: "500L 1.4", bodyTypes: ["MPV"], engine: "1.4", power: "95hp", transmissions: ["Manuel"] },
  { name: "500L 1.6 Mjet", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "120hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Egea", [
  { name: "1.0 Firefly", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.3", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.4 Fire", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.4", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.4 T-Jet", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.4", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.5 T4 Hibrit", fuels: ["Hibrit"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.5", power: "130hp", transmissions: ["Otomatik"] },
  { name: "1.6 E-Torq", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Otomatik"] },
  { name: "1.6 Multijet", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Fiat", "Idea", [
  { name: "1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.3", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["MPV"], engine: "1.4", power: "95hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Linea", [
  { name: "1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.3", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.4 Fire", bodyTypes: ["Sedan"], engine: "1.4", power: "77hp", transmissions: ["Manuel"] },
  { name: "1.4 Turbo", bodyTypes: ["Sedan"], engine: "1.4", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.6 Multijet", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Mirafiori", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "131hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Multipla", [
  { name: "1.9 JTD Active", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Palio", [
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "77hp", transmissions: ["Manuel"] },
  { name: "1.4 Fire", bodyTypes: ["Hatchback"], engine: "1.4", power: "77hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Panda", [
  { name: "0.9 TwinAir", bodyTypes: ["Hatchback"], engine: "0.9", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.0 Hybrid", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.0", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.1 Active", bodyTypes: ["Hatchback"], engine: "1.1", power: "54hp", transmissions: ["Manuel"] },
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "69hp", transmissions: ["Manuel"] },
  { name: "1.2 Fire", bodyTypes: ["Hatchback"], engine: "1.2", power: "60hp", transmissions: ["Manuel"] },
  { name: "1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Punto", [
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "69hp", transmissions: ["Manuel"] },
  { name: "1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "77hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] },
  { name: "1.9 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "80hp", transmissions: ["Manuel"] },
  { name: "EVO 1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "69hp", transmissions: ["Manuel"] },
  { name: "EVO 1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "EVO 1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "77hp", transmissions: ["Manuel"] },
  { name: "Grande 1.2 S5", bodyTypes: ["Hatchback"], engine: "1.2", power: "65hp", transmissions: ["Manuel"] },
  { name: "Grande 1.3 Multijet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "Grande 1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "77hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Sedici", [
  { name: "1.6", bodyTypes: ["SUV"], engine: "1.6", power: "107hp", transmissions: ["Manuel"] },
  { name: "Emotion", bodyTypes: ["SUV"], engine: "1.6", power: "107hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Siena", [
  { name: "1.2", bodyTypes: ["Sedan"], engine: "1.2", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Sedan"], engine: "1.4", power: "77hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Stilo", [
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Hatchback"], engine: "1.8", power: "133hp", transmissions: ["Manuel"] },
  { name: "1.9 JTD", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Tempra", [
  { name: "1.6", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Tipo", [
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "78hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "82hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "145hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Fiat", "Topolino", [
  { name: "Topolino", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "8hp" },
  { name: "Topolino Plus", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "8hp" }
]);
ensureSeriesModels("Fiat", "Uno", [
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4 ie", bodyTypes: ["Hatchback"], engine: "1.4", power: "71hp", transmissions: ["Manuel"] },
  { name: "1.4 ie 70 S", bodyTypes: ["Hatchback"], engine: "1.4", power: "71hp", transmissions: ["Manuel"] },
  { name: "1.4 ie Hobby", bodyTypes: ["Hatchback"], engine: "1.4", power: "71hp", transmissions: ["Manuel"] },
  { name: "1.4 ie S", bodyTypes: ["Hatchback"], engine: "1.4", power: "71hp", transmissions: ["Manuel"] },
  { name: "1.4 ie SX", bodyTypes: ["Hatchback"], engine: "1.4", power: "71hp", transmissions: ["Manuel"] },
  { name: "60 S", bodyTypes: ["Hatchback"], engine: "1.1", power: "58hp", transmissions: ["Manuel"] },
  { name: "60 SX", bodyTypes: ["Hatchback"], engine: "1.1", power: "58hp", transmissions: ["Manuel"] },
  { name: "70 S", bodyTypes: ["Hatchback"], engine: "1.4", power: "71hp", transmissions: ["Manuel"] },
  { name: "70 SX", bodyTypes: ["Hatchback"], engine: "1.4", power: "71hp", transmissions: ["Manuel"] },
  { name: "70 SXie", bodyTypes: ["Hatchback"], engine: "1.4", power: "71hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "B-Max", [
  { name: "1.0", bodyTypes: ["MPV"], engine: "1.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["MPV"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.5 TDCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.5", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 TDCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "95hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "C-Max", [
  { name: "1.0 EcoBoost", bodyTypes: ["MPV"], engine: "1.0", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["MPV"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 TDCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.5", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 EcoBoost", bodyTypes: ["MPV"], engine: "1.6", power: "150hp", transmissions: ["Manuel"] },
  { name: "1.6 TDCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "145hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Ford", "Escort", [
  { name: "1.3", bodyTypes: ["Sedan", "Hatchback"], engine: "1.3", power: "60hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Sedan", "Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "105hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Fiesta", [
  { name: "1.0 EcoBoost", bodyTypes: ["Hatchback"], engine: "1.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.0 EcoBoost Hybrid", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.0", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.0 GTDi", bodyTypes: ["Hatchback"], engine: "1.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.1", bodyTypes: ["Hatchback"], engine: "1.1", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.25", bodyTypes: ["Hatchback"], engine: "1.25", power: "82hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "96hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "68hp", transmissions: ["Manuel"] },
  { name: "1.5 EcoBoost", bodyTypes: ["Hatchback"], engine: "1.5", power: "200hp", transmissions: ["Manuel"] },
  { name: "1.5 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.6 Ti-VCT", bodyTypes: ["Hatchback"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.8", power: "60hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Focus", [
  { name: "1.0 EcoBoost Hybrid", fuels: ["Hibrit"], bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.0", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.0 EcoBoost GTDi", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.0", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.5 EcoBlue", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.5", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.5 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.5", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.5 Ti-VCT", bodyTypes: ["Hatchback", "Sedan"], engine: "1.5", power: "123hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Sedan"], engine: "1.6", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 SCTi", bodyTypes: ["Hatchback"], engine: "1.6", power: "150hp", transmissions: ["Manuel"] },
  { name: "1.6 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 Ti-VCT", bodyTypes: ["Hatchback", "Sedan"], engine: "1.6", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Hatchback", "Sedan"], engine: "1.8", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.8 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.8", power: "115hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback", "Sedan"], engine: "2.0", power: "145hp", transmissions: ["Otomatik"] },
  { name: "2.0 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "2.0", power: "163hp", transmissions: ["Otomatik"] },
  { name: "2.3", bodyTypes: ["Hatchback"], engine: "2.3", power: "280hp", transmissions: ["Manuel"] },
  { name: "2.5", bodyTypes: ["Hatchback"], engine: "2.5", power: "305hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Fusion", [
  { name: "1.4 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "68hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.6 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Galaxy", [
  { name: "1.9 TDi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "115hp", transmissions: ["Manuel"] },
  { name: "2.0i", bodyTypes: ["MPV"], engine: "2.0", power: "145hp", transmissions: ["Manuel"] },
  { name: "2.0 TDCi Ghia", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Otomatik"] },
  { name: "2.0 TDCi Titanium", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "163hp", transmissions: ["Otomatik"] },
  { name: "2.3 16 V", bodyTypes: ["MPV"], engine: "2.3", power: "161hp", transmissions: ["Otomatik"] },
  { name: "2.8i VR6", bodyTypes: ["MPV"], engine: "2.8", power: "174hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Ford", "Grand C-Max", [
  { name: "1.5", bodyTypes: ["MPV"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 TDCI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.5", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.6 EcoBoost", bodyTypes: ["MPV"], engine: "1.6", power: "150hp", transmissions: ["Manuel"] },
  { name: "1.6 TDCI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Ka", [
  { name: "1.2 Titanium", bodyTypes: ["Hatchback"], engine: "1.2", power: "69hp", transmissions: ["Manuel"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "60hp", transmissions: ["Manuel"] },
  { name: "1.3 TDCi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.6 Street", bodyTypes: ["Cabrio"], engine: "1.6", power: "95hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Mondeo", [
  { name: "1.5 Ecoboost", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.5", power: "160hp", transmissions: ["Otomatik"] },
  { name: "1.5 TDCI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.5", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.6 Ecoboost", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "160hp", transmissions: ["Manuel"] },
  { name: "1.6 TDCi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.8", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.8 TDCi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.8", power: "125hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "2.0", power: "145hp", transmissions: ["Otomatik"] },
  { name: "2.0 TDCi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "2.0", power: "163hp", transmissions: ["Otomatik"] },
  { name: "2.2 TDCi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "2.2", power: "200hp", transmissions: ["Otomatik"] },
  { name: "2.5", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "2.5", power: "220hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Ford", "Mustang", [
  { name: "2.3 Convertible", bodyTypes: ["Convertible"], engine: "2.3", power: "317hp", transmissions: ["Otomatik"] },
  { name: "2.3 EcoBoost", bodyTypes: ["Coupe"], engine: "2.3", power: "317hp", transmissions: ["Otomatik"] },
  { name: "3.7 V6", bodyTypes: ["Coupe"], engine: "3.7", power: "305hp", transmissions: ["Otomatik"] },
  { name: "3.8", bodyTypes: ["Coupe"], engine: "3.8", power: "145hp", transmissions: ["Manuel"] },
  { name: "4.0", bodyTypes: ["Coupe"], engine: "4.0", power: "210hp", transmissions: ["Otomatik"] },
  { name: "4.0 GT", bodyTypes: ["Coupe"], engine: "4.0", power: "210hp", transmissions: ["Otomatik"] },
  { name: "4.6 GT", bodyTypes: ["Coupe"], engine: "4.6", power: "300hp", transmissions: ["Manuel"] },
  { name: "5.0 Convertible", bodyTypes: ["Convertible"], engine: "5.0", power: "450hp", transmissions: ["Otomatik"] },
  { name: "5.0 Fastback", bodyTypes: ["Coupe"], engine: "5.0", power: "450hp", transmissions: ["Otomatik"] },
  { name: "5.0 GT", bodyTypes: ["Coupe"], engine: "5.0", power: "450hp", transmissions: ["Otomatik"] },
  { name: "5.0 GT Premium", bodyTypes: ["Coupe"], engine: "5.0", power: "450hp", transmissions: ["Otomatik"] },
  { name: "Shelby GT 500", bodyTypes: ["Coupe"], engine: "5.2", power: "760hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Ford", "S-Max", [
  { name: "1.6 TDCi Titanium", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 Titanium", bodyTypes: ["MPV"], engine: "1.6", power: "160hp", transmissions: ["Manuel"] },
  { name: "2.0i Titanium", bodyTypes: ["MPV"], engine: "2.0", power: "145hp", transmissions: ["Otomatik"] },
  { name: "2.0 TDCi Titanium", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "163hp", transmissions: ["Otomatik"] },
  { name: "2.0 Trend", bodyTypes: ["MPV"], engine: "2.0", power: "145hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Taurus", [
  { name: "3.0 V6 GL", bodyTypes: ["Sedan"], engine: "3.0", power: "140hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Ford", "Cougar", [
  { name: "2.5i", bodyTypes: ["Coupe"], engine: "2.5", power: "170hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Festiva", [
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "63hp", transmissions: ["Manuel"] },
  { name: "GL", bodyTypes: ["Hatchback"], engine: "1.3", power: "63hp", transmissions: ["Manuel"] },
  { name: "XL", bodyTypes: ["Hatchback"], engine: "1.3", power: "63hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Granada", [
  { name: "1.7", bodyTypes: ["Sedan"], engine: "1.7", power: "75hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "101hp", transmissions: ["Manuel"] },
  { name: "2.3", bodyTypes: ["Sedan"], engine: "2.3", power: "114hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Ford", "Orion", [
  { name: "1.6 CL", bodyTypes: ["Sedan"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Probe", [
  { name: "2.5", bodyTypes: ["Coupe"], engine: "2.5", power: "163hp", transmissions: ["Manuel"] },
  { name: "3.0i", bodyTypes: ["Coupe"], engine: "3.0", power: "145hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Puma", [
  { name: "1.7", bodyTypes: ["Coupe"], engine: "1.7", power: "125hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Scorpio", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "115hp", transmissions: ["Manuel"] },
  { name: "2.3", bodyTypes: ["Sedan"], engine: "2.3", power: "147hp", transmissions: ["Otomatik"] },
  { name: "2.9", bodyTypes: ["Sedan"], engine: "2.9", power: "145hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Ford", "Sierra", [
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "75hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "105hp", transmissions: ["Manuel"] },
  { name: "XR 2000", bodyTypes: ["Hatchback"], engine: "2.0", power: "105hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Taunus", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "72hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "98hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Ford", "Thunderbird", [
  { name: "3.8", bodyTypes: ["Coupe"], engine: "3.8", power: "140hp", transmissions: ["Otomatik"] },
  { name: "3.9", bodyTypes: ["Convertible"], engine: "3.9", power: "252hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Geely", "Echo", [
  { name: "1.3", bodyTypes: ["Hatchback", "Sedan"], engine: "1.3", power: "86hp", transmissions: ["Manuel"] },
  { name: "Basic", bodyTypes: ["Hatchback", "Sedan"], engine: "1.3", power: "86hp", transmissions: ["Manuel"] },
  { name: "Comfort", bodyTypes: ["Hatchback", "Sedan"], engine: "1.3", power: "86hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Geely", "Emgrand", [
  { name: "1.5", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "103hp", transmissions: ["Manuel"] },
  { name: "GS", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "103hp", transmissions: ["Manuel"] },
  { name: "GSL Basic", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "103hp", transmissions: ["Manuel"] },
  { name: "GSL Premium", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "103hp", transmissions: ["Manuel"] },
  { name: "GSL Premium SR", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "103hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Geely", "Familia", [
  { name: "1.5", bodyTypes: ["Hatchback", "Sedan"], engine: "1.5", power: "94hp", transmissions: ["Manuel"] },
  { name: "Comfort", bodyTypes: ["Hatchback", "Sedan"], engine: "1.5", power: "94hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Geely", "FC", [
  { name: "1.5", bodyTypes: ["Sedan"], engine: "1.5", power: "103hp", transmissions: ["Manuel"] },
  { name: "GSL", bodyTypes: ["Sedan"], engine: "1.5", power: "103hp", transmissions: ["Manuel"] },
  { name: "Comfort", bodyTypes: ["Sedan"], engine: "1.5", power: "103hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Honda", "Accord", [
  { name: "1.5 VTEC", bodyTypes: ["Sedan"], engine: "1.5", power: "182hp", transmissions: ["Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "136hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "156hp", transmissions: ["Otomatik"] },
  { name: "2.2", bodyTypes: ["Sedan"], engine: "2.2", power: "150hp", transmissions: ["Manuel"] },
  { name: "2.3", bodyTypes: ["Sedan"], engine: "2.3", power: "154hp", transmissions: ["Otomatik"] },
  { name: "2.4", bodyTypes: ["Sedan"], engine: "2.4", power: "190hp", transmissions: ["Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "240hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Honda", "City", [
  { name: "1.4", bodyTypes: ["Sedan"], engine: "1.4", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.5 i-VTEC", bodyTypes: ["Sedan"], engine: "1.5", power: "121hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Honda", "Civic", [
  { name: "1.4", bodyTypes: ["Sedan", "Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 VTEC", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "182hp", transmissions: ["Otomatik"] },
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6i DTEC", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.6i VTEC", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.6 VTEC", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "140hp", transmissions: ["Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "158hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Honda", "CR-Z", [
  { name: "GT", fuels: ["Hibrit"], bodyTypes: ["Coupe"], engine: "1.5", power: "124hp", transmissions: ["Manuel"] },
  { name: "Sport", fuels: ["Hibrit"], bodyTypes: ["Coupe"], engine: "1.5", power: "124hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Honda", "CRX", [
  { name: "1.6", bodyTypes: ["Coupe"], engine: "1.6", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.6i", bodyTypes: ["Coupe"], engine: "1.6", power: "125hp", transmissions: ["Manuel"] },
  { name: "VTi", bodyTypes: ["Coupe"], engine: "1.6", power: "160hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Honda", "Integra", [
  { name: "1.6", bodyTypes: ["Coupe", "Sedan"], engine: "1.6", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Coupe", "Sedan"], engine: "1.8", power: "142hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Honda", "Jazz", [
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "130hp", transmissions: ["Otomatik"] },
  { name: "1.5 HEV", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.5", power: "109hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Honda", "Legend", [
  { name: "3.2", bodyTypes: ["Sedan"], engine: "3.2", power: "205hp", transmissions: ["Otomatik"] },
  { name: "3.5", bodyTypes: ["Sedan"], engine: "3.5", power: "295hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Honda", "Logo", [
  { name: "1.3i", bodyTypes: ["Hatchback"], engine: "1.3", power: "65hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Honda", "Prelude Classic", [
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "133hp", transmissions: ["Manuel"] },
  { name: "2.2 VTi", bodyTypes: ["Coupe"], engine: "2.2", power: "185hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Honda", "Prelude New", [
  { name: "2.0 HEV", fuels: ["Hibrit"], bodyTypes: ["Coupe"], engine: "2.0", power: "184hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Honda", "S2000", [
  { name: "2.0 Vtec", bodyTypes: ["Roadster"], engine: "2.0", power: "240hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Honda", "Shuttle", [
  { name: "2.2", bodyTypes: ["Station Wagon"], engine: "2.2", power: "150hp", transmissions: ["Otomatik"] },
  { name: "2.3", bodyTypes: ["Station Wagon"], engine: "2.3", power: "150hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Honda", "Stream", [
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "156hp", transmissions: ["Otomatik"] },
  { name: "Si", bodyTypes: ["MPV"], engine: "2.0", power: "156hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Honda", "Odyssey", [
  { name: "3.5", bodyTypes: ["MPV"], engine: "3.5", power: "280hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Accent", [
  { name: "1.3", bodyTypes: ["Sedan"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Sedan"], engine: "1.5", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.5 CRDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.5", power: "82hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Accent Blue", [
  { name: "1.4 CVVT", bodyTypes: ["Sedan"], engine: "1.4", power: "109hp", transmissions: ["Manuel"] },
  { name: "1.4 D-CVVT", bodyTypes: ["Sedan"], engine: "1.4", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.6 CRDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "128hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Accent Era", [
  { name: "1.4", bodyTypes: ["Sedan"], engine: "1.4", power: "97hp", transmissions: ["Manuel"] },
  { name: "1.5 CRDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.5", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.5 CRDi-VGT", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.5", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "112hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Atos", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "58hp", transmissions: ["Manuel"] },
  { name: "1.1", bodyTypes: ["Hatchback"], engine: "1.1", power: "63hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Hyundai", "Centennial", [
  { name: "4.5", bodyTypes: ["Sedan"], engine: "4.5", power: "270hp", transmissions: ["Otomatik"] },
  { name: "VL450", bodyTypes: ["Sedan"], engine: "4.5", power: "270hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Hyundai Coupe", [
  { name: "1.6", bodyTypes: ["Coupe"], engine: "1.6", power: "114hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "143hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.7 FX", bodyTypes: ["Coupe"], engine: "2.7", power: "167hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Elantra", [
  { name: "1.5", bodyTypes: ["Sedan"], engine: "1.5", power: "107hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "126hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 CRDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "136hp", transmissions: ["Otomatik"] },
  { name: "1.6 D-CVVT", bodyTypes: ["Sedan"], engine: "1.6", power: "132hp", transmissions: ["Otomatik"] },
  { name: "1.6 MPI", bodyTypes: ["Sedan"], engine: "1.6", power: "127hp", transmissions: ["Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "150hp", transmissions: ["Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "149hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Excel", [
  { name: "1.5", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "88hp", transmissions: ["Manuel"] },
  { name: "GLS", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "88hp", transmissions: ["Manuel"] },
  { name: "LS", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "88hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Hyundai", "Genesis", [
  { name: "2.0L TCI", bodyTypes: ["Coupe", "Sedan"], engine: "2.0", power: "210hp", transmissions: ["Otomatik"] },
  { name: "3.8", bodyTypes: ["Coupe", "Sedan"], engine: "3.8", power: "303hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Getz", [
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "82hp", transmissions: ["Manuel"] },
  { name: "1.4 DOHC", bodyTypes: ["Hatchback"], engine: "1.4", power: "97hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 CRDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "88hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "105hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Grandeur", [
  { name: "3.0i", bodyTypes: ["Sedan"], engine: "3.0", power: "188hp", transmissions: ["Otomatik"] },
  { name: "3.3", bodyTypes: ["Sedan"], engine: "3.3", power: "235hp", transmissions: ["Otomatik"] },
  { name: "3.5i", bodyTypes: ["Sedan"], engine: "3.5", power: "194hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "i10", [
  { name: "1.0 D-CVVT", bodyTypes: ["Hatchback"], engine: "1.0", power: "66hp", transmissions: ["Manuel"] },
  { name: "1.0 MPI", bodyTypes: ["Hatchback"], engine: "1.0", power: "67hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.1", bodyTypes: ["Hatchback"], engine: "1.1", power: "69hp", transmissions: ["Manuel"] },
  { name: "1.1 CRDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.1", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.2 D-CVVT", bodyTypes: ["Hatchback"], engine: "1.2", power: "87hp", transmissions: ["Manuel"] },
  { name: "1.2 MPI", bodyTypes: ["Hatchback"], engine: "1.2", power: "84hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Hyundai", "i20", [
  { name: "1.0 T-GDI", bodyTypes: ["Hatchback"], engine: "1.0", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 D-CVVT", bodyTypes: ["Hatchback"], engine: "1.2", power: "84hp", transmissions: ["Manuel"] },
  { name: "1.2 MPI", bodyTypes: ["Hatchback"], engine: "1.2", power: "84hp", transmissions: ["Manuel"] },
  { name: "1.4 CRDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 CVVT", bodyTypes: ["Hatchback"], engine: "1.4", power: "100hp", transmissions: ["Otomatik"] },
  { name: "1.4 MPI", bodyTypes: ["Hatchback"], engine: "1.4", power: "100hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "i20 Active", [
  { name: "1.0 T-GDI", bodyTypes: ["Crossover"], engine: "1.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.4 MPI", bodyTypes: ["Crossover"], engine: "1.4", power: "100hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "i20 N", [
  { name: "1.6 T-GDI", bodyTypes: ["Hatchback"], engine: "1.6", power: "204hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Hyundai", "i20 Troy", [
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "78hp", transmissions: ["Manuel"] },
  { name: "1.2 DOHC", bodyTypes: ["Hatchback"], engine: "1.2", power: "78hp", transmissions: ["Manuel"] },
  { name: "1.4 CRDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 CVVT", bodyTypes: ["Hatchback"], engine: "1.4", power: "100hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "i30", [
  { name: "1.4", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.4 CVVT", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "109hp", transmissions: ["Manuel"] },
  { name: "1.4 MPI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.4 T-GDI", bodyTypes: ["Hatchback", "Fastback"], engine: "1.4", power: "140hp", transmissions: ["Otomatik"] },
  { name: "1.5 T-GDI Mhev", fuels: ["Hibrit"], bodyTypes: ["Hatchback", "Fastback"], engine: "1.5", power: "160hp", transmissions: ["Otomatik"] },
  { name: "1.6 CRDi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "136hp", transmissions: ["Otomatik"] },
  { name: "1.6 CVVT", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "122hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 DOHC", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "126hp", transmissions: ["Manuel"] },
  { name: "1.6 GDi", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "135hp", transmissions: ["Otomatik"] },
  { name: "1.6 T-GDI", bodyTypes: ["Hatchback", "Fastback"], engine: "1.6", power: "204hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "i40", [
  { name: "1.6 GDI Prime", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "135hp", transmissions: ["Manuel"] },
  { name: "1.7 CRDi Executive", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.7", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "IONIQ Classic", [
  { name: "1.6 GDI", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.6", power: "141hp", transmissions: ["Otomatik"] },
  { name: "Elite Plus", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.6", power: "141hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "IONIQ 6", [
  { name: "Advance", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "229hp", transmissions: ["Otomatik"] },
  { name: "Progressive", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "325hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "iX20", [
  { name: "1.4", bodyTypes: ["MPV"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 CRDi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "125hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Matrix", [
  { name: "1.5 CRDi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.5", power: "82hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Hyundai", "S-Coupe", [
  { name: "1.5 LS", bodyTypes: ["Coupe"], engine: "1.5", power: "92hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Hyundai", "Sonata", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "137hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 CRDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "140hp", transmissions: ["Otomatik"] },
  { name: "2.0 CVVT", bodyTypes: ["Sedan"], engine: "2.0", power: "152hp", transmissions: ["Otomatik"] },
  { name: "2.5", bodyTypes: ["Sedan"], engine: "2.5", power: "180hp", transmissions: ["Otomatik"] },
  { name: "2.7", bodyTypes: ["Sedan"], engine: "2.7", power: "173hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Hyundai", "Trajet", [
  { name: "2.0 CRDi GLS", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "112hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Infiniti", "Q30", [
  { name: "1.5 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "109hp", transmissions: ["Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "211hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Infiniti", "Q50", [
  { name: "2.0T", bodyTypes: ["Sedan"], engine: "2.0", power: "211hp", transmissions: ["Otomatik"] },
  { name: "2.2d", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.2", power: "170hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Infiniti", "Q60", [
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "211hp", transmissions: ["Otomatik"] },
  { name: "Sport Tech", bodyTypes: ["Coupe"], engine: "3.0", power: "405hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Infiniti", "G Series", [
  { name: "G35", bodyTypes: ["Sedan", "Coupe"], engine: "3.5", power: "280hp", transmissions: ["Otomatik"] },
  { name: "G37 GT", bodyTypes: ["Coupe"], engine: "3.7", power: "320hp", transmissions: ["Otomatik"] },
  { name: "G37 S", bodyTypes: ["Coupe"], engine: "3.7", power: "320hp", transmissions: ["Otomatik"] },
  { name: "G37 X", bodyTypes: ["Sedan"], engine: "3.7", power: "320hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Infiniti", "I30", [
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "227hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Infiniti", "M Series", [
  { name: "M30d", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "238hp", transmissions: ["Otomatik"] },
  { name: "M30d GT", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "238hp", transmissions: ["Otomatik"] },
  { name: "M30d S", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "238hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "Daimler", [
  { name: "4.0", bodyTypes: ["Sedan"], engine: "4.0", power: "245hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "F-Type", [
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "300hp", transmissions: ["Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Coupe"], engine: "2.0", power: "300hp", transmissions: ["Otomatik"] },
  { name: "3.0 S", bodyTypes: ["Coupe"], engine: "3.0", power: "380hp", transmissions: ["Otomatik"] },
  { name: "5.0 S", bodyTypes: ["Coupe"], engine: "5.0", power: "495hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "Sovereign", [
  { name: "4.0", bodyTypes: ["Sedan"], engine: "4.0", power: "245hp", transmissions: ["Otomatik"] },
  { name: "4.0 Long", bodyTypes: ["Sedan"], engine: "4.0", power: "245hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "X-Type", [
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "130hp", transmissions: ["Manuel"] },
  { name: "2.1", bodyTypes: ["Sedan"], engine: "2.1", power: "157hp", transmissions: ["Otomatik"] },
  { name: "2.2", bodyTypes: ["Sedan"], engine: "2.2", power: "155hp", transmissions: ["Manuel"] },
  { name: "2.2 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.2", power: "155hp", transmissions: ["Manuel"] },
  { name: "2.5", bodyTypes: ["Sedan"], engine: "2.5", power: "196hp", transmissions: ["Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "XE", [
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "180hp", transmissions: ["Otomatik"] },
  { name: "Portfollio", bodyTypes: ["Sedan"], engine: "2.0", power: "200hp", transmissions: ["Otomatik"] },
  { name: "Prestige", bodyTypes: ["Sedan"], engine: "2.0", power: "200hp", transmissions: ["Otomatik"] },
  { name: "R-Dynamic SE", bodyTypes: ["Sedan"], engine: "2.0", power: "250hp", transmissions: ["Otomatik"] },
  { name: "R-Sport", bodyTypes: ["Sedan"], engine: "2.0", power: "180hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "XF", [
  { name: "2.0", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "250hp", transmissions: ["Otomatik"] },
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "180hp", transmissions: ["Otomatik"] },
  { name: "2.2 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.2", power: "200hp", transmissions: ["Otomatik"] },
  { name: "2.7 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.7", power: "207hp", transmissions: ["Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "340hp", transmissions: ["Otomatik"] },
  { name: "3.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "3.0", power: "300hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "XJ", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "240hp", transmissions: ["Otomatik"] },
  { name: "2.0i", bodyTypes: ["Sedan"], engine: "2.0", power: "240hp", transmissions: ["Otomatik"] },
  { name: "3.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "275hp", transmissions: ["Otomatik"] },
  { name: "3.2", bodyTypes: ["Sedan"], engine: "3.2", power: "240hp", transmissions: ["Otomatik"] },
  { name: "4.0", bodyTypes: ["Sedan"], engine: "4.0", power: "290hp", transmissions: ["Otomatik"] },
  { name: "5.0", bodyTypes: ["Sedan"], engine: "5.0", power: "385hp", transmissions: ["Otomatik"] },
  { name: "XJ6", bodyTypes: ["Sedan"], engine: "3.0", power: "238hp", transmissions: ["Otomatik"] },
  { name: "XJ8", bodyTypes: ["Sedan"], engine: "4.0", power: "290hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "XJR", [
  { name: "4.0", bodyTypes: ["Sedan"], engine: "4.0", power: "370hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "XJS", [
  { name: "6.0", bodyTypes: ["Coupe"], engine: "6.0", power: "318hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "XK8", [
  { name: "4.0", bodyTypes: ["Coupe"], engine: "4.0", power: "290hp", transmissions: ["Otomatik"] },
  { name: "4.2", bodyTypes: ["Coupe"], engine: "4.2", power: "300hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Jaguar", "XKR", [
  { name: "4.2", bodyTypes: ["Coupe"], engine: "4.2", power: "420hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Capital", [
  { name: "1.5 GLX", bodyTypes: ["Sedan"], engine: "1.5", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "105hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Kia", "Carens", [
  { name: "2.0 CRDi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Manuel"] },
  { name: "CRDi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Manuel"] },
  { name: "EX", bodyTypes: ["MPV"], engine: "2.0", power: "145hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Carnival", [
  { name: "2.9 CRDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.9", power: "144hp", transmissions: ["Otomatik"] },
  { name: "2.9 TD", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.9", power: "126hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Kia", "Ceed", [
  { name: "1.0", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.4 T-GDI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "140hp", transmissions: ["Otomatik"] },
  { name: "1.5", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.5", power: "160hp", transmissions: ["Otomatik"] },
  { name: "1.5 Hibrit", fuels: ["Hibrit"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.5", power: "141hp", transmissions: ["Otomatik"] },
  { name: "1.5 T-GDI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.5", power: "160hp", transmissions: ["Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "126hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 CRDi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "136hp", transmissions: ["Otomatik"] },
  { name: "1.6 GDI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "135hp", transmissions: ["Otomatik"] },
  { name: "1.6 Hybrid", fuels: ["Hibrit"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "141hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Cerato", [
  { name: "1.5 CRDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.5", power: "102hp", transmissions: ["Manuel"] },
  { name: "1.6 CRDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "128hp", transmissions: ["Otomatik"] },
  { name: "1.6 EX", bodyTypes: ["Sedan"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "1.6 GSL", bodyTypes: ["Sedan"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "1.6 LX", bodyTypes: ["Sedan"], engine: "1.6", power: "122hp", transmissions: ["Manuel"] },
  { name: "1.6 MPI", bodyTypes: ["Sedan"], engine: "1.6", power: "128hp", transmissions: ["Otomatik"] },
  { name: "2.0 CRD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "112hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Kia", "Joice", [
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "139hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Kia", "Clarus", [
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "116hp", transmissions: ["Manuel"] },
  { name: "2.0 GLX", bodyTypes: ["Sedan"], engine: "2.0", power: "133hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Magentis", [
  { name: "2.0 CRDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "140hp", transmissions: ["Otomatik"] },
  { name: "2.0 LX", bodyTypes: ["Sedan"], engine: "2.0", power: "144hp", transmissions: ["Otomatik"] },
  { name: "2.0 SE", bodyTypes: ["Sedan"], engine: "2.0", power: "144hp", transmissions: ["Otomatik"] },
  { name: "2.5", bodyTypes: ["Sedan"], engine: "2.5", power: "169hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Opirus", [
  { name: "3.5 V6", bodyTypes: ["Sedan"], engine: "3.5", power: "203hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Optima", [
  { name: "1.7 CRDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.7", power: "136hp", transmissions: ["Otomatik"] },
  { name: "2.0 T-GDI", bodyTypes: ["Sedan"], engine: "2.0", power: "245hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Picanto", [
  { name: "1.0L Cool", bodyTypes: ["Hatchback"], engine: "1.0", power: "67hp", transmissions: ["Manuel"] },
  { name: "1.0L Feel", bodyTypes: ["Hatchback"], engine: "1.0", power: "67hp", transmissions: ["Manuel"] },
  { name: "1.0 Live", bodyTypes: ["Hatchback"], engine: "1.0", power: "67hp", transmissions: ["Manuel"] },
  { name: "1.0L Live", bodyTypes: ["Hatchback"], engine: "1.0", power: "67hp", transmissions: ["Manuel"] },
  { name: "1.1 EX", bodyTypes: ["Hatchback"], engine: "1.1", power: "65hp", transmissions: ["Manuel"] },
  { name: "1.1 EX Advance", bodyTypes: ["Hatchback"], engine: "1.1", power: "65hp", transmissions: ["Manuel"] },
  { name: "1.1 EX Comfort", bodyTypes: ["Hatchback"], engine: "1.1", power: "65hp", transmissions: ["Manuel"] },
  { name: "1.1 EX Sport", bodyTypes: ["Hatchback"], engine: "1.1", power: "65hp", transmissions: ["Manuel"] },
  { name: "1.1 Hiper", bodyTypes: ["Hatchback"], engine: "1.1", power: "65hp", transmissions: ["Manuel"] },
  { name: "1.25 EX", bodyTypes: ["Hatchback"], engine: "1.25", power: "84hp", transmissions: ["Otomatik"] },
  { name: "1.25 MPI Comfort", bodyTypes: ["Hatchback"], engine: "1.25", power: "84hp", transmissions: ["Otomatik"] },
  { name: "1.2 Cool", bodyTypes: ["Hatchback"], engine: "1.2", power: "84hp", transmissions: ["Otomatik"] },
  { name: "1.2 Feel", bodyTypes: ["Hatchback"], engine: "1.2", power: "84hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Pride", [
  { name: "1.3", bodyTypes: ["Sedan", "Hatchback"], engine: "1.3", power: "72hp", transmissions: ["Manuel"] },
  { name: "1.3 DLX", bodyTypes: ["Sedan", "Hatchback"], engine: "1.3", power: "72hp", transmissions: ["Manuel"] },
  { name: "1.3 GLXi", bodyTypes: ["Sedan", "Hatchback"], engine: "1.3", power: "72hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Kia", "ProCeed", [
  { name: "1.6", bodyTypes: ["Shooting Brake"], engine: "1.6", power: "204hp", transmissions: ["Otomatik"] },
  { name: "1.6 CRDi", fuels: ["Dizel"], bodyTypes: ["Shooting Brake"], engine: "1.6", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Rio", [
  { name: "1.0 TGDI", bodyTypes: ["Hatchback", "Sedan"], engine: "1.0", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.25 CVVT", bodyTypes: ["Hatchback", "Sedan"], engine: "1.25", power: "84hp", transmissions: ["Manuel"] },
  { name: "1.2 MPI", bodyTypes: ["Hatchback", "Sedan"], engine: "1.2", power: "84hp", transmissions: ["Manuel"] },
  { name: "1.3", bodyTypes: ["Hatchback", "Sedan"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 CRDi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 CVVT", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "97hp", transmissions: ["Otomatik"] },
  { name: "1.4 EX", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "97hp", transmissions: ["Otomatik"] },
  { name: "1.4 GSL", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "97hp", transmissions: ["Otomatik"] },
  { name: "1.4L MPI", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "100hp", transmissions: ["Otomatik"] },
  { name: "1.4 WGT CRDI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Hatchback", "Sedan"], engine: "1.5", power: "97hp", transmissions: ["Manuel"] },
  { name: "1.5 CRDi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.5", power: "110hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Kia", "Sephia", [
  { name: "1.5", bodyTypes: ["Sedan"], engine: "1.5", power: "88hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Kia", "Shuma", [
  { name: "GS", bodyTypes: ["Hatchback", "Sedan"], engine: "1.5", power: "88hp", transmissions: ["Manuel"] },
  { name: "LS", bodyTypes: ["Hatchback", "Sedan"], engine: "1.5", power: "88hp", transmissions: ["Manuel"] },
  { name: "RS", bodyTypes: ["Hatchback", "Sedan"], engine: "1.8", power: "111hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Kia", "Stinger", [
  { name: "2.0 GDI", bodyTypes: ["Fastback"], engine: "2.0", power: "255hp", transmissions: ["Otomatik"] },
  { name: "GT Line", bodyTypes: ["Fastback"], engine: "2.0", power: "255hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kia", "Venga", [
  { name: "1.4 CRDi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "125hp", transmissions: ["Otomatik"] },
  { name: "1.6 CRDi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "128hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Kuba", "City", [
  { name: "Standart", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "4hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Kuba", "M5", [
  { name: "Standart", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "4hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lada", "Kalina", [
  { name: "1.6", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.6", power: "98hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Lada", "Samara", [
  { name: "1.3", bodyTypes: ["Hatchback", "Sedan"], engine: "1.3", power: "65hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Hatchback", "Sedan"], engine: "1.5", power: "72hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Lada", "VAZ", [
  { name: "2103", bodyTypes: ["Sedan"], engine: "1.5", power: "71hp", transmissions: ["Manuel"] },
  { name: "2104", bodyTypes: ["Station Wagon"], engine: "1.5", power: "71hp", transmissions: ["Manuel"] },
  { name: "2107", bodyTypes: ["Sedan"], engine: "1.6", power: "75hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Lada", "Vega", [
  { name: "1.5", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.5", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Lamborghini", "Aventador", [
  { name: "LP 700-4", bodyTypes: ["Coupe"], engine: "6.5", power: "700hp", transmissions: ["Otomatik"] },
  { name: "LP 750-4", bodyTypes: ["Coupe"], engine: "6.5", power: "750hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lamborghini", "Gallardo", [
  { name: "5.0", bodyTypes: ["Coupe"], engine: "5.0", power: "500hp", transmissions: ["Otomatik"] },
  { name: "LP 560-4", bodyTypes: ["Coupe"], engine: "5.2", power: "560hp", transmissions: ["Otomatik"] },
  { name: "LP 570-4 Superleggera", bodyTypes: ["Coupe"], engine: "5.2", power: "570hp", transmissions: ["Otomatik"] },
  { name: "Spyder", bodyTypes: ["Roadster"], engine: "5.2", power: "560hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lamborghini", "Huracan", [
  { name: "Evo", bodyTypes: ["Coupe"], engine: "5.2", power: "640hp", transmissions: ["Otomatik"] },
  { name: "LP-610-4", bodyTypes: ["Coupe"], engine: "5.2", power: "610hp", transmissions: ["Otomatik"] },
  { name: "LP-640-2", bodyTypes: ["Coupe"], engine: "5.2", power: "640hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lamborghini", "Revuelto", [
  { name: "V12", fuels: ["Hibrit"], bodyTypes: ["Coupe"], engine: "6.5", power: "1015hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lamborghini", "Temerario", [
  { name: "4.0", fuels: ["Hibrit"], bodyTypes: ["Coupe"], engine: "4.0", power: "920hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lancia", "Delta Modern", [
  { name: "1.4 T", bodyTypes: ["Hatchback"], engine: "1.4", power: "150hp", transmissions: ["Manuel"] },
  { name: "1.6 Mjet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Hatchback"], engine: "1.8", power: "200hp", transmissions: ["Otomatik"] },
  { name: "1.9 TT Mjet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "190hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lancia", "Lybra", [
  { name: "1.9 JTD", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.9", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Lancia", "Thema", [
  { name: "3.0 CRD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "239hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lancia", "Ypsilon Classic", [
  { name: "0.9", bodyTypes: ["Hatchback"], engine: "0.9", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "69hp", transmissions: ["Manuel"] },
  { name: "1.3 Mjet", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "95hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Lancia", "Kappa", [
  { name: "2.4", bodyTypes: ["Sedan"], engine: "2.4", power: "175hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lancia", "Phedra", [
  { name: "2.2", bodyTypes: ["MPV"], engine: "2.2", power: "170hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lancia", "Thesis", [
  { name: "2.4 JTD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.4", power: "175hp", transmissions: ["Otomatik"] },
  { name: "Sportiva", bodyTypes: ["Sedan"], engine: "2.4", power: "170hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lexus", "CT", [
  { name: "200h", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.8", power: "136hp", transmissions: ["Otomatik"] },
  { name: "Comfort", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.8", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lexus", "ES", [
  { name: "300h", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "2.5", power: "218hp", transmissions: ["Otomatik"] },
  { name: "Business", bodyTypes: ["Sedan"], engine: "2.5", power: "218hp", transmissions: ["Otomatik"] },
  { name: "Business Plus", bodyTypes: ["Sedan"], engine: "2.5", power: "218hp", transmissions: ["Otomatik"] },
  { name: "Exclusive", bodyTypes: ["Sedan"], engine: "2.5", power: "218hp", transmissions: ["Otomatik"] },
  { name: "Executive", bodyTypes: ["Sedan"], engine: "2.5", power: "218hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lexus", "GS", [
  { name: "200t", bodyTypes: ["Sedan"], engine: "2.0", power: "245hp", transmissions: ["Otomatik"] },
  { name: "300h", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "2.5", power: "223hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lexus", "IS", [
  { name: "200t", bodyTypes: ["Sedan"], engine: "2.0", power: "245hp", transmissions: ["Otomatik"] },
  { name: "220D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.2", power: "177hp", transmissions: ["Manuel"] },
  { name: "300", bodyTypes: ["Sedan"], engine: "2.0", power: "241hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lexus", "LC", [
  { name: "500h", fuels: ["Hibrit"], bodyTypes: ["Coupe"], engine: "3.5", power: "359hp", transmissions: ["Otomatik"] },
  { name: "Sport", bodyTypes: ["Coupe"], engine: "5.0", power: "477hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lexus", "LM", [
  { name: "350h", fuels: ["Hibrit"], bodyTypes: ["MPV"], engine: "2.5", power: "250hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lexus", "LS", [
  { name: "430", bodyTypes: ["Sedan"], engine: "4.3", power: "282hp", transmissions: ["Otomatik"] },
  { name: "500h", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "3.5", power: "359hp", transmissions: ["Otomatik"] },
  { name: "600", bodyTypes: ["Sedan"], engine: "5.0", power: "394hp", transmissions: ["Otomatik"] },
  { name: "600h", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "5.0", power: "438hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Lexus", "RC", [
  { name: "F", bodyTypes: ["Coupe"], engine: "5.0", power: "477hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "Cambiocorsa", [
  { name: "Coupe", bodyTypes: ["Coupe"], engine: "4.2", power: "390hp", transmissions: ["Otomatik"] },
  { name: "Spyder", bodyTypes: ["Roadster"], engine: "4.2", power: "390hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "Ghibli Modern", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "330hp", transmissions: ["Otomatik"] },
  { name: "2.0 MHEV", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "2.0", power: "330hp", transmissions: ["Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "350hp", transmissions: ["Otomatik"] },
  { name: "3.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "275hp", transmissions: ["Otomatik"] },
  { name: "3.0 GDI", bodyTypes: ["Sedan"], engine: "3.0", power: "430hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "GranCabrio Classic", [
  { name: "4.7", bodyTypes: ["Roadster"], engine: "4.7", power: "440hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "GranCabrio E", [
  { name: "Folgore", fuels: ["Elektrik"], bodyTypes: ["Roadster"], engine: "Elektrik", power: "761hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "GranSport", [
  { name: "4.2", bodyTypes: ["Coupe"], engine: "4.2", power: "400hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "GranTurismo Classic", [
  { name: "4.2", bodyTypes: ["Coupe"], engine: "4.2", power: "405hp", transmissions: ["Otomatik"] },
  { name: "4.7 S", bodyTypes: ["Coupe"], engine: "4.7", power: "440hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "GranTurismo New", [
  { name: "3.0", bodyTypes: ["Coupe"], engine: "3.0", power: "490hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "GranTurismo E", [
  { name: "Folgore", fuels: ["Elektrik"], bodyTypes: ["Coupe"], engine: "Elektrik", power: "761hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "MC20", [
  { name: "3.0", bodyTypes: ["Coupe"], engine: "3.0", power: "630hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "Spyder", [
  { name: "2.0", bodyTypes: ["Roadster"], engine: "2.0", power: "390hp", transmissions: ["Otomatik"] },
  { name: "GT", bodyTypes: ["Roadster"], engine: "4.2", power: "390hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "Quattroporte Modern", [
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "350hp", transmissions: ["Otomatik"] },
  { name: "3.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "275hp", transmissions: ["Otomatik"] },
  { name: "3.8", bodyTypes: ["Sedan"], engine: "3.8", power: "530hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "Quattroporte Classic", [
  { name: "4.2", bodyTypes: ["Sedan"], engine: "4.2", power: "400hp", transmissions: ["Otomatik"] },
  { name: "4.7 S", bodyTypes: ["Sedan"], engine: "4.7", power: "430hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Maserati", "2.24v", [
  { name: "Standart", bodyTypes: ["Coupe"], engine: "2.0", power: "245hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Maserati", "4 Serisi", [
  { name: "424", bodyTypes: ["Sedan"], engine: "2.0", power: "180hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mazda", "Mazda 2", [
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 Sky-G", bodyTypes: ["Hatchback"], engine: "1.5", power: "90hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mazda", "Mazda 3", [
  { name: "1.5 SkyActive-D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.5 SkyActive-G", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "120hp", transmissions: ["Otomatik"] },
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "109hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mazda", "5", [
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["MPV"], engine: "1.8", power: "115hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "145hp", transmissions: ["Otomatik"] },
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "143hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mazda", "Mazda 6", [
  { name: "2.0", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "165hp", transmissions: ["Otomatik"] },
  { name: "2.2", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.2", power: "175hp", transmissions: ["Otomatik"] },
  { name: "2.3 Sport", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.3", power: "166hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mazda", "MPV", [
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "122hp", transmissions: ["Manuel"] },
  { name: "2.3 TE", bodyTypes: ["MPV"], engine: "2.3", power: "141hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mazda", "MX", [
  { name: "MX-3", bodyTypes: ["Coupe"], engine: "1.8", power: "133hp", transmissions: ["Manuel"] },
  { name: "MX-5", bodyTypes: ["Roadster"], engine: "2.0", power: "184hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mazda", "Premacy", [
  { name: "1.8", bodyTypes: ["MPV"], engine: "1.8", power: "100hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mazda", "121", [
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "72hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mazda", "323", [
  { name: "1.3", bodyTypes: ["Sedan", "Hatchback"], engine: "1.3", power: "73hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "88hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "114hp", transmissions: ["Manuel"] },
  { name: "2.0 DITD", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mazda", "626", [
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.8", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.9", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "1.9", power: "100hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan", "Hatchback", "Station Wagon"], engine: "2.0", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mazda", "Lantis", [
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mazda", "RX", [
  { name: "RX-8", bodyTypes: ["Coupe"], engine: "1.3", power: "231hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mazda", "Xedos", [
  { name: "6", bodyTypes: ["Sedan"], engine: "2.0", power: "144hp", transmissions: ["Otomatik"] },
  { name: "9", bodyTypes: ["Sedan"], engine: "2.5", power: "167hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Mercedes-Benz", "A Serisi", [
  { name: "A 35 AMG", bodyTypes: ["Hatchback"], engine: "2.0", power: "306hp", transmissions: ["Otomatik"] },
  { name: "A 45 AMG", bodyTypes: ["Hatchback"], engine: "2.0", power: "387hp", transmissions: ["Otomatik"] },
  { name: "A 45 S AMG", bodyTypes: ["Hatchback"], engine: "2.0", power: "421hp", transmissions: ["Otomatik"] },
  { name: "A 140", bodyTypes: ["Hatchback"], engine: "1.4", power: "82hp", transmissions: ["Manuel"] },
  { name: "A 150", bodyTypes: ["Hatchback"], engine: "1.5", power: "95hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "A 160", bodyTypes: ["Hatchback"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "A 160 CDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "2.0", power: "82hp", transmissions: ["Manuel"] },
  { name: "A 170", bodyTypes: ["Hatchback"], engine: "1.7", power: "116hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "A 170 CDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "2.0", power: "90hp", transmissions: ["Manuel"] },
  { name: "A 180", bodyTypes: ["Hatchback"], engine: "1.3", power: "136hp", transmissions: ["Otomatik"] },
  { name: "A 180 CDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "2.0", power: "109hp", transmissions: ["Manuel"] },
  { name: "A 180 d", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "116hp", transmissions: ["Otomatik"] },
  { name: "A 190", bodyTypes: ["Hatchback"], engine: "1.9", power: "125hp", transmissions: ["Otomatik"] },
  { name: "A 200", bodyTypes: ["Hatchback"], engine: "1.3", power: "163hp", transmissions: ["Otomatik"] },
  { name: "A 200 CDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "2.0", power: "140hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "AMG GT Classic", [
  { name: "4.0 S", bodyTypes: ["Coupe"], engine: "4.0", power: "522hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "AMG GT New", [
  { name: "43 AMG GT", bodyTypes: ["Coupe"], engine: "2.0", power: "421hp", transmissions: ["Otomatik"] },
  { name: "63 AMG GT", bodyTypes: ["Coupe"], engine: "4.0", power: "585hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "AMG GT 4-Door", [
  { name: "43 4Matic", bodyTypes: ["Sedan"], engine: "3.0", power: "367hp", transmissions: ["Otomatik"] },
  { name: "53 4Matic", bodyTypes: ["Sedan"], engine: "3.0", power: "435hp", transmissions: ["Otomatik"] },
  { name: "63 S 4Matic", bodyTypes: ["Sedan"], engine: "4.0", power: "639hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "B Serisi", [
  { name: "B 150", bodyTypes: ["MPV"], engine: "1.5", power: "95hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "B 150 Boyut", bodyTypes: ["MPV"], engine: "1.5", power: "95hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "B 150 Sport", bodyTypes: ["MPV"], engine: "1.5", power: "95hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "B 180 AMG", bodyTypes: ["MPV"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "B 180 BlueEfficiency Elite", bodyTypes: ["MPV"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "B 180 BlueEfficiency Prime", bodyTypes: ["MPV"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "B 180 BlueEfficiency Sport", bodyTypes: ["MPV"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "B 180 BlueEfficiency Style", bodyTypes: ["MPV"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "B 180 BlueEfficiency Urban", bodyTypes: ["MPV"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "B 180 Progressive", bodyTypes: ["MPV"], engine: "1.3", power: "136hp", transmissions: ["Otomatik"] },
  { name: "B 180 Progressive+", bodyTypes: ["MPV"], engine: "1.3", power: "136hp", transmissions: ["Otomatik"] },
  { name: "B 180 Boyut", bodyTypes: ["MPV"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "B 180 Prestige", bodyTypes: ["MPV"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "B 180 Special Edition", bodyTypes: ["MPV"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "B 180 CDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "B 180 CDI AMG", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "B 180 CDI BlueEfficiency", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "B 180 CDI BlueEfficiency Elite", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "B 180 CDI BlueEfficiency Sport", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "B 180 CDI BlueEfficiency Style", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "B 180 CDI BlueEfficiency Urban", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "B 180 CDI Boyut", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "B 180 CDI Prestige", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "B 180 D AMG", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "116hp", transmissions: ["Otomatik"] },
  { name: "B 180 D Progressive", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "116hp", transmissions: ["Otomatik"] },
  { name: "B 180 D Style", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "116hp", transmissions: ["Otomatik"] },
  { name: "B 180 D Urban", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "116hp", transmissions: ["Otomatik"] },
  { name: "B 200 CDI BlueEfficiency", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.8", power: "136hp", transmissions: ["Otomatik"] },
  { name: "B 200 CDI Special Edition", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.8", power: "136hp", transmissions: ["Otomatik"] },
  { name: "B 200 Progressive+", bodyTypes: ["MPV"], engine: "1.3", power: "163hp", transmissions: ["Otomatik"] },
  { name: "B 200 Sport", bodyTypes: ["MPV"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] },
  { name: "B 200", bodyTypes: ["MPV"], engine: "1.3", power: "163hp", transmissions: ["Otomatik"] },
  { name: "B 200 CDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.8", power: "136hp", transmissions: ["Otomatik"] },
  { name: "B 200 CDI Prestige", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.8", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "C Serisi", [
  { name: "C 30 CDI AMG", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] },
  { name: "C 32 AMG", bodyTypes: ["Sedan"], engine: "3.2", power: "354hp", transmissions: ["Otomatik"] },
  { name: "C 36 AMG", bodyTypes: ["Sedan"], engine: "3.6", power: "280hp", transmissions: ["Otomatik"] },
  { name: "C 43 AMG", bodyTypes: ["Sedan"], engine: "3.0", power: "390hp", transmissions: ["Otomatik"] },
  { name: "C 63 AMG", bodyTypes: ["Sedan"], engine: "4.0", power: "476hp", transmissions: ["Otomatik"] },
  { name: "C 63 S AMG", bodyTypes: ["Sedan"], engine: "4.0", power: "510hp", transmissions: ["Otomatik"] },
  { name: "C 180", bodyTypes: ["Sedan"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] },
  { name: "C 180 d", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "116hp", transmissions: ["Otomatik"] },
  { name: "C 200", bodyTypes: ["Sedan"], engine: "1.5", power: "184hp", transmissions: ["Otomatik"] },
  { name: "C 200 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.1", power: "136hp", transmissions: ["Otomatik"] },
  { name: "C 200 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "160hp", transmissions: ["Otomatik"] },
  { name: "C 200 d BlueTEC", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "136hp", transmissions: ["Otomatik"] },
  { name: "C 220", bodyTypes: ["Sedan"], engine: "2.2", power: "150hp", transmissions: ["Otomatik"] },
  { name: "C 220 BlueTEC", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.1", power: "170hp", transmissions: ["Otomatik"] },
  { name: "C 220 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.1", power: "170hp", transmissions: ["Otomatik"] },
  { name: "C 220 d", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "194hp", transmissions: ["Otomatik"] },
  { name: "C 230", bodyTypes: ["Sedan"], engine: "2.3", power: "150hp", transmissions: ["Otomatik"] },
  { name: "C 240", bodyTypes: ["Sedan"], engine: "2.4", power: "170hp", transmissions: ["Otomatik"] },
  { name: "C 250", bodyTypes: ["Sedan"], engine: "1.8", power: "204hp", transmissions: ["Otomatik"] },
  { name: "C 250 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.1", power: "204hp", transmissions: ["Otomatik"] },
  { name: "C 250 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.2", power: "150hp", transmissions: ["Otomatik"] },
  { name: "C 250 TD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "C 270 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.7", power: "170hp", transmissions: ["Otomatik"] },
  { name: "C 300", bodyTypes: ["Sedan"], engine: "2.0", power: "258hp", transmissions: ["Otomatik"] },
  { name: "C 320", bodyTypes: ["Sedan"], engine: "3.2", power: "218hp", transmissions: ["Otomatik"] },
  { name: "C 320 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "224hp", transmissions: ["Otomatik"] },
  { name: "C 350", bodyTypes: ["Sedan"], engine: "3.5", power: "272hp", transmissions: ["Otomatik"] },
  { name: "C 350 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] },
  { name: "C Estate 180", bodyTypes: ["Station Wagon"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "CL", [
  { name: "63 AMG", bodyTypes: ["Coupe"], engine: "6.2", power: "525hp", transmissions: ["Otomatik"] },
  { name: "500", bodyTypes: ["Coupe"], engine: "5.0", power: "306hp", transmissions: ["Otomatik"] },
  { name: "550", bodyTypes: ["Coupe"], engine: "5.5", power: "388hp", transmissions: ["Otomatik"] },
  { name: "600", bodyTypes: ["Coupe"], engine: "5.5", power: "517hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "CLA", [
  { name: "45 S", bodyTypes: ["Coupe"], engine: "2.0", power: "421hp", transmissions: ["Otomatik"] },
  { name: "45 AMG", bodyTypes: ["Coupe"], engine: "2.0", power: "381hp", transmissions: ["Otomatik"] },
  { name: "180", bodyTypes: ["Coupe"], engine: "1.3", power: "136hp", transmissions: ["Otomatik"] },
  { name: "180 d", fuels: ["Dizel"], bodyTypes: ["Coupe"], engine: "2.0", power: "116hp", transmissions: ["Otomatik"] },
  { name: "200", bodyTypes: ["Coupe"], engine: "1.3", power: "163hp", transmissions: ["Otomatik"] },
  { name: "220", bodyTypes: ["Coupe"], engine: "2.0", power: "190hp", transmissions: ["Otomatik"] },
  { name: "220 CDI", fuels: ["Dizel"], bodyTypes: ["Coupe"], engine: "2.1", power: "170hp", transmissions: ["Otomatik"] },
  { name: "350", bodyTypes: ["Coupe"], engine: "2.0", power: "306hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "CLE", [
  { name: "300", bodyTypes: ["Coupe", "Cabriolet"], engine: "2.0", power: "258hp", transmissions: ["Otomatik"] },
  { name: "AMG", bodyTypes: ["Coupe"], engine: "3.0", power: "449hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "CLC", [
  { name: "CLC 160", bodyTypes: ["Coupe"], engine: "1.8", power: "129hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "CLC 220", bodyTypes: ["Coupe"], engine: "2.1", power: "150hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "CLK", [
  { name: "CLK 55 AMG", bodyTypes: ["Coupe", "Cabriolet"], engine: "5.4", power: "367hp", transmissions: ["Otomatik"] },
  { name: "CLK 200", bodyTypes: ["Coupe", "Cabriolet"], engine: "2.0", power: "163hp", transmissions: ["Otomatik"] },
  { name: "CLK 220 CDI", fuels: ["Dizel"], bodyTypes: ["Coupe", "Cabriolet"], engine: "2.1", power: "150hp", transmissions: ["Otomatik"] },
  { name: "CLK 230 Komp.", bodyTypes: ["Coupe", "Cabriolet"], engine: "2.3", power: "193hp", transmissions: ["Otomatik"] },
  { name: "CLK 240", bodyTypes: ["Coupe", "Cabriolet"], engine: "2.6", power: "170hp", transmissions: ["Otomatik"] },
  { name: "CLK 270 CDI", fuels: ["Dizel"], bodyTypes: ["Coupe", "Cabriolet"], engine: "2.7", power: "170hp", transmissions: ["Otomatik"] },
  { name: "CLK 280", bodyTypes: ["Coupe", "Cabriolet"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] },
  { name: "CLK 320", bodyTypes: ["Coupe", "Cabriolet"], engine: "3.2", power: "218hp", transmissions: ["Otomatik"] },
  { name: "CLK 320 CDI", fuels: ["Dizel"], bodyTypes: ["Coupe", "Cabriolet"], engine: "3.0", power: "224hp", transmissions: ["Otomatik"] },
  { name: "CLK 430", bodyTypes: ["Coupe", "Cabriolet"], engine: "4.3", power: "279hp", transmissions: ["Otomatik"] },
  { name: "CLK 500", bodyTypes: ["Coupe", "Cabriolet"], engine: "5.0", power: "306hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "CLS", [
  { name: "53 AMG", bodyTypes: ["Coupe"], engine: "3.0", power: "435hp", transmissions: ["Otomatik"] },
  { name: "63 AMG", bodyTypes: ["Coupe"], engine: "5.5", power: "557hp", transmissions: ["Otomatik"] },
  { name: "250 CDI", fuels: ["Dizel"], bodyTypes: ["Coupe"], engine: "2.1", power: "204hp", transmissions: ["Otomatik"] },
  { name: "300 D", fuels: ["Dizel"], bodyTypes: ["Coupe"], engine: "2.0", power: "245hp", transmissions: ["Otomatik"] },
  { name: "320", bodyTypes: ["Coupe"], engine: "3.0", power: "224hp", transmissions: ["Otomatik"] },
  { name: "350", bodyTypes: ["Coupe"], engine: "3.5", power: "306hp", transmissions: ["Otomatik"] },
  { name: "350 CDI", fuels: ["Dizel"], bodyTypes: ["Coupe"], engine: "3.0", power: "265hp", transmissions: ["Otomatik"] },
  { name: "350 D", fuels: ["Dizel"], bodyTypes: ["Coupe"], engine: "3.0", power: "286hp", transmissions: ["Otomatik"] },
  { name: "400 D", fuels: ["Dizel"], bodyTypes: ["Coupe"], engine: "3.0", power: "330hp", transmissions: ["Otomatik"] },
  { name: "500", bodyTypes: ["Coupe"], engine: "4.7", power: "408hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "E Serisi", [
  { name: "E 53 AMG", bodyTypes: ["Sedan"], engine: "3.0", power: "435hp", transmissions: ["Otomatik"] },
  { name: "E 55 AMG", bodyTypes: ["Sedan"], engine: "5.4", power: "476hp", transmissions: ["Otomatik"] },
  { name: "E 63 AMG", bodyTypes: ["Sedan"], engine: "6.2", power: "525hp", transmissions: ["Otomatik"] },
  { name: "E 180", bodyTypes: ["Sedan"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] },
  { name: "E 200", bodyTypes: ["Sedan"], engine: "2.0", power: "184hp", transmissions: ["Otomatik"] },
  { name: "E 200 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.1", power: "136hp", transmissions: ["Otomatik"] },
  { name: "E 200 CGI", bodyTypes: ["Sedan"], engine: "1.8", power: "184hp", transmissions: ["Otomatik"] },
  { name: "E 200 d", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "150hp", transmissions: ["Otomatik"] },
  { name: "E 220", bodyTypes: ["Sedan"], engine: "2.2", power: "150hp", transmissions: ["Otomatik"] },
  { name: "E 220 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.1", power: "170hp", transmissions: ["Otomatik"] },
  { name: "E 220 d", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "194hp", transmissions: ["Otomatik"] },
  { name: "E 230", bodyTypes: ["Sedan"], engine: "2.3", power: "150hp", transmissions: ["Otomatik"] },
  { name: "E 240", bodyTypes: ["Sedan"], engine: "2.6", power: "177hp", transmissions: ["Otomatik"] },
  { name: "E 250", bodyTypes: ["Sedan"], engine: "1.8", power: "211hp", transmissions: ["Otomatik"] },
  { name: "E 250 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.1", power: "204hp", transmissions: ["Otomatik"] },
  { name: "E 250 CGI", bodyTypes: ["Sedan"], engine: "1.8", power: "204hp", transmissions: ["Otomatik"] },
  { name: "E 250 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.5", power: "113hp", transmissions: ["Otomatik"] },
  { name: "E 250 TD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "E 270 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.7", power: "177hp", transmissions: ["Otomatik"] },
  { name: "E 280", bodyTypes: ["Sedan"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] },
  { name: "E 280 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "190hp", transmissions: ["Otomatik"] },
  { name: "E 290 TD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.9", power: "129hp", transmissions: ["Otomatik"] },
  { name: "E 300", bodyTypes: ["Sedan"], engine: "2.0", power: "258hp", transmissions: ["Otomatik"] },
  { name: "E 300 CGI", bodyTypes: ["Sedan"], engine: "3.5", power: "292hp", transmissions: ["Otomatik"] },
  { name: "E 300 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "245hp", transmissions: ["Otomatik"] },
  { name: "E 300 DE", fuels: ["Hibrit", "Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "306hp", transmissions: ["Otomatik"] },
  { name: "E 300 TD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "136hp", transmissions: ["Otomatik"] },
  { name: "E 320", bodyTypes: ["Sedan"], engine: "3.2", power: "224hp", transmissions: ["Otomatik"] },
  { name: "E 320 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "224hp", transmissions: ["Otomatik"] },
  { name: "E 350", bodyTypes: ["Sedan"], engine: "3.5", power: "272hp", transmissions: ["Otomatik"] },
  { name: "E 350 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] },
  { name: "E 350 CGI", bodyTypes: ["Sedan"], engine: "3.5", power: "292hp", transmissions: ["Otomatik"] },
  { name: "E 350 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "258hp", transmissions: ["Otomatik"] },
  { name: "E 400", bodyTypes: ["Sedan"], engine: "3.0", power: "333hp", transmissions: ["Otomatik"] },
  { name: "E 400 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "4.0", power: "260hp", transmissions: ["Otomatik"] },
  { name: "E 420", bodyTypes: ["Sedan"], engine: "4.2", power: "279hp", transmissions: ["Otomatik"] },
  { name: "E 430", bodyTypes: ["Sedan"], engine: "4.3", power: "279hp", transmissions: ["Otomatik"] },
  { name: "E 450", bodyTypes: ["Sedan"], engine: "3.0", power: "367hp", transmissions: ["Otomatik"] },
  { name: "E 500", bodyTypes: ["Sedan"], engine: "5.0", power: "306hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "EQE Sedan", [
  { name: "280", bodyTypes: ["Sedan"], engine: "Elektrik", power: "245hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] },
  { name: "300+", bodyTypes: ["Sedan"], engine: "Elektrik", power: "245hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] },
  { name: "350", bodyTypes: ["Sedan"], engine: "Elektrik", power: "292hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] },
  { name: "350+", bodyTypes: ["Sedan"], engine: "Elektrik", power: "292hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] },
  { name: "43", bodyTypes: ["Sedan"], engine: "Elektrik", power: "476hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] },
  { name: "53 AMG", bodyTypes: ["Sedan"], engine: "Elektrik", power: "687hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "EQS Sedan", [
  { name: "350 AMG", bodyTypes: ["Sedan"], engine: "Elektrik", power: "360hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] },
  { name: "450", bodyTypes: ["Sedan"], engine: "Elektrik", power: "360hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] },
  { name: "450+", bodyTypes: ["Sedan"], engine: "Elektrik", power: "360hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] },
  { name: "53 AMG", bodyTypes: ["Sedan"], engine: "Elektrik", power: "658hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] },
  { name: "580", bodyTypes: ["Sedan"], engine: "Elektrik", power: "544hp", fuels: ["Elektrik"], transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "Maybach S-Class", [
  { name: "S 450", bodyTypes: ["Sedan"], engine: "3.0", power: "367hp", transmissions: ["Otomatik"] },
  { name: "S 500", bodyTypes: ["Sedan"], engine: "3.0", power: "435hp", transmissions: ["Otomatik"] },
  { name: "S 560", bodyTypes: ["Sedan"], engine: "4.0", power: "469hp", transmissions: ["Otomatik"] },
  { name: "S 580", bodyTypes: ["Sedan"], engine: "4.0", power: "503hp", transmissions: ["Otomatik"] },
  { name: "S 680", bodyTypes: ["Sedan"], engine: "6.0", power: "612hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "R Serisi", [
  { name: "R 280", bodyTypes: ["MPV"], engine: "3.0", power: "190hp", transmissions: ["Otomatik"] },
  { name: "R 320", bodyTypes: ["MPV"], engine: "3.0", power: "224hp", transmissions: ["Otomatik"] },
  { name: "R 350", bodyTypes: ["MPV"], engine: "3.5", power: "272hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "S Serisi", [
  { name: "S 55 AMG", bodyTypes: ["Sedan"], engine: "5.4", power: "500hp", transmissions: ["Otomatik"] },
  { name: "S 63 AMG", bodyTypes: ["Sedan"], engine: "6.2", power: "525hp", transmissions: ["Otomatik"] },
  { name: "S 280", bodyTypes: ["Sedan"], engine: "2.8", power: "193hp", transmissions: ["Otomatik"] },
  { name: "S 300", bodyTypes: ["Sedan"], engine: "3.0", power: "177hp", transmissions: ["Otomatik"] },
  { name: "S 320", bodyTypes: ["Sedan"], engine: "3.2", power: "224hp", transmissions: ["Otomatik"] },
  { name: "S 350", bodyTypes: ["Sedan"], engine: "3.5", power: "272hp", transmissions: ["Otomatik"] },
  { name: "S 400", bodyTypes: ["Sedan"], engine: "3.5", power: "279hp", transmissions: ["Otomatik"] },
  { name: "S 420", bodyTypes: ["Sedan"], engine: "4.2", power: "279hp", transmissions: ["Otomatik"] },
  { name: "S 450", bodyTypes: ["Sedan"], engine: "3.0", power: "367hp", transmissions: ["Otomatik"] },
  { name: "S 500", bodyTypes: ["Sedan"], engine: "5.0", power: "306hp", transmissions: ["Otomatik"] },
  { name: "S 550", bodyTypes: ["Sedan"], engine: "4.7", power: "455hp", transmissions: ["Otomatik"] },
  { name: "S 580", bodyTypes: ["Sedan"], engine: "4.0", power: "503hp", transmissions: ["Otomatik"] },
  { name: "S 600", bodyTypes: ["Sedan"], engine: "6.0", power: "530hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "S 450", [
  { name: "450", bodyTypes: ["Sedan"], engine: "3.0", power: "367hp", transmissions: ["Otomatik"] },
  { name: "450 D Inspration", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "367hp", transmissions: ["Otomatik"] },
  { name: "450 L", bodyTypes: ["Sedan"], engine: "3.0", power: "367hp", transmissions: ["Otomatik"] },
  { name: "450 Spor", bodyTypes: ["Sedan"], engine: "3.0", power: "367hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "300", [
  { name: "300 Turbo D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "147hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "S 400", [
  { name: "400 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "4.0", power: "250hp", transmissions: ["Otomatik"] },
  { name: "400 d", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "330hp", transmissions: ["Otomatik"] },
  { name: "400 L", bodyTypes: ["Sedan"], engine: "3.5", power: "279hp", transmissions: ["Otomatik"] },
  { name: "400 L CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "4.0", power: "250hp", transmissions: ["Otomatik"] },
  { name: "Sport", bodyTypes: ["Sedan"], engine: "3.5", power: "279hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "S 420", [
  { name: "420", bodyTypes: ["Sedan"], engine: "4.2", power: "279hp", transmissions: ["Otomatik"] },
  { name: "420 CDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "4.0", power: "314hp", transmissions: ["Otomatik"] },
  { name: "420 L", bodyTypes: ["Sedan"], engine: "4.2", power: "279hp", transmissions: ["Otomatik"] },
  { name: "420 L CD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "4.0", power: "314hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "S 63 AMG", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "4.0", power: "612hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "S 500", [
  { name: "500", bodyTypes: ["Sedan"], engine: "5.0", power: "306hp", transmissions: ["Otomatik"] },
  { name: "500 AMG", bodyTypes: ["Sedan"], engine: "5.0", power: "306hp", transmissions: ["Otomatik"] },
  { name: "500 L", bodyTypes: ["Sedan"], engine: "5.0", power: "306hp", transmissions: ["Otomatik"] },
  { name: "500 L Inspiration", bodyTypes: ["Sedan"], engine: "5.0", power: "306hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "S 550", [
  { name: "550 L", bodyTypes: ["Sedan"], engine: "4.7", power: "455hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "S 580", [
  { name: "AMG Line", bodyTypes: ["Sedan"], engine: "4.0", power: "503hp", transmissions: ["Otomatik"] },
  { name: "Executive Line", bodyTypes: ["Sedan"], engine: "4.0", power: "503hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "S Serisi", [
  { name: "S 600 L", bodyTypes: ["Sedan"], engine: "6.0", power: "530hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "SL", [
  { name: "43 AMG", bodyTypes: ["Roadster"], engine: "2.0", power: "381hp", transmissions: ["Otomatik"] },
  { name: "55 AMG", bodyTypes: ["Roadster"], engine: "4.0", power: "476hp", transmissions: ["Otomatik"] },
  { name: "63 AMG", bodyTypes: ["Roadster"], engine: "4.0", power: "585hp", transmissions: ["Otomatik"] },
  { name: "280", bodyTypes: ["Roadster"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] },
  { name: "300", bodyTypes: ["Roadster"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] },
  { name: "320", bodyTypes: ["Roadster"], engine: "3.2", power: "218hp", transmissions: ["Otomatik"] },
  { name: "350", bodyTypes: ["Roadster"], engine: "3.5", power: "272hp", transmissions: ["Otomatik"] },
  { name: "500", bodyTypes: ["Roadster"], engine: "5.0", power: "306hp", transmissions: ["Otomatik"] },
  { name: "550", bodyTypes: ["Roadster"], engine: "5.5", power: "388hp", transmissions: ["Otomatik"] },
  { name: "600", bodyTypes: ["Roadster"], engine: "5.5", power: "517hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "SLC", [
  { name: "180 AMG", bodyTypes: ["Roadster"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "SLK", [
  { name: "200 Kompressor", bodyTypes: ["Roadster"], engine: "2.0", power: "163hp", transmissions: ["Otomatik"] },
  { name: "230 Kompressor", bodyTypes: ["Roadster"], engine: "2.3", power: "193hp", transmissions: ["Otomatik"] },
  { name: "250", bodyTypes: ["Roadster"], engine: "1.8", power: "204hp", transmissions: ["Otomatik"] },
  { name: "280", bodyTypes: ["Roadster"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] },
  { name: "300 AMG", bodyTypes: ["Roadster"], engine: "3.0", power: "231hp", transmissions: ["Otomatik"] },
  { name: "350", bodyTypes: ["Roadster"], engine: "3.5", power: "306hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "SLS AMG", [
  { name: "Coupe", bodyTypes: ["Coupe"], engine: "6.2", power: "571hp", transmissions: ["Otomatik"] },
  { name: "Roadster", bodyTypes: ["Roadster"], engine: "6.2", power: "571hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "190", [
  { name: "190", bodyTypes: ["Sedan"], engine: "2.0", power: "109hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "190 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "72hp", transmissions: ["Manuel"] },
  { name: "190 E", bodyTypes: ["Sedan"], engine: "2.0", power: "122hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "200", [
  { name: "200", bodyTypes: ["Sedan"], engine: "2.0", power: "109hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "200 CE", bodyTypes: ["Coupe"], engine: "2.0", power: "136hp", transmissions: ["Otomatik"] },
  { name: "200 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "75hp", transmissions: ["Manuel"] },
  { name: "200 E", bodyTypes: ["Sedan"], engine: "2.0", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "220", [
  { name: "220 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.2", power: "60hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mercedes-Benz", "230", [
  { name: "230", bodyTypes: ["Sedan"], engine: "2.3", power: "109hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "230.4", bodyTypes: ["Sedan"], engine: "2.3", power: "110hp", transmissions: ["Manuel"] },
  { name: "230.6", bodyTypes: ["Sedan"], engine: "2.3", power: "120hp", transmissions: ["Manuel"] },
  { name: "230 CE", bodyTypes: ["Coupe"], engine: "2.3", power: "136hp", transmissions: ["Otomatik"] },
  { name: "230 E", bodyTypes: ["Sedan"], engine: "2.3", power: "136hp", transmissions: ["Otomatik"] },
  { name: "230 GE", bodyTypes: ["SUV"], engine: "2.3", power: "125hp", transmissions: ["Manuel"] },
  { name: "230 TE", bodyTypes: ["Station Wagon"], engine: "2.3", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "240", [
  { name: "240 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.4", power: "72hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mercedes-Benz", "250", [
  { name: "250", bodyTypes: ["Sedan"], engine: "2.5", power: "129hp", transmissions: ["Otomatik"] },
  { name: "250 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.5", power: "90hp", transmissions: ["Manuel"] },
  { name: "250 TD", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.5", power: "113hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "260", [
  { name: "260 E", bodyTypes: ["Sedan"], engine: "2.6", power: "160hp", transmissions: ["Otomatik"] },
  { name: "260 SE", bodyTypes: ["Sedan"], engine: "2.6", power: "160hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "280", [
  { name: "280", bodyTypes: ["Sedan"], engine: "2.8", power: "156hp", transmissions: ["Otomatik"] },
  { name: "280 CE", bodyTypes: ["Coupe"], engine: "2.8", power: "185hp", transmissions: ["Otomatik"] },
  { name: "280 E", bodyTypes: ["Sedan"], engine: "2.8", power: "185hp", transmissions: ["Otomatik"] },
  { name: "280 S", bodyTypes: ["Sedan"], engine: "2.8", power: "156hp", transmissions: ["Otomatik"] },
  { name: "280 SE", bodyTypes: ["Sedan"], engine: "2.8", power: "185hp", transmissions: ["Otomatik"] },
  { name: "280 SEL", bodyTypes: ["Sedan"], engine: "2.8", power: "185hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "300", [
  { name: "300", bodyTypes: ["Sedan"], engine: "3.0", power: "180hp", transmissions: ["Otomatik"] },
  { name: "300 CE", bodyTypes: ["Coupe"], engine: "3.0", power: "188hp", transmissions: ["Otomatik"] },
  { name: "300 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "109hp", transmissions: ["Otomatik"] },
  { name: "300 E", bodyTypes: ["Sedan"], engine: "3.0", power: "188hp", transmissions: ["Otomatik"] },
  { name: "300 E 24", bodyTypes: ["Sedan"], engine: "3.0", power: "220hp", transmissions: ["Otomatik"] },
  { name: "300 SE", bodyTypes: ["Sedan"], engine: "3.0", power: "177hp", transmissions: ["Otomatik"] },
  { name: "300 SEL", bodyTypes: ["Sedan"], engine: "3.0", power: "177hp", transmissions: ["Otomatik"] },
  { name: "300 TD", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "3.0", power: "147hp", transmissions: ["Otomatik"] },
  { name: "300 TE", bodyTypes: ["Station Wagon"], engine: "3.0", power: "188hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "320", [
  { name: "320 E", bodyTypes: ["Sedan"], engine: "3.2", power: "220hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "380", [
  { name: "380 SE", bodyTypes: ["Sedan"], engine: "3.8", power: "204hp", transmissions: ["Otomatik"] },
  { name: "380 SEL", bodyTypes: ["Sedan"], engine: "3.8", power: "204hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "400", [
  { name: "400 SEL", bodyTypes: ["Sedan"], engine: "4.2", power: "279hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "420", [
  { name: "420 SE", bodyTypes: ["Sedan"], engine: "4.2", power: "218hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "500", [
  { name: "500 SE", bodyTypes: ["Sedan"], engine: "5.0", power: "245hp", transmissions: ["Otomatik"] },
  { name: "500 SEC", bodyTypes: ["Coupe"], engine: "5.0", power: "245hp", transmissions: ["Otomatik"] },
  { name: "500 SEL", bodyTypes: ["Sedan"], engine: "5.0", power: "245hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mercedes-Benz", "560", [
  { name: "560 SEC", bodyTypes: ["Coupe"], engine: "5.6", power: "300hp", transmissions: ["Otomatik"] },
  { name: "560 SEL", bodyTypes: ["Sedan"], engine: "5.6", power: "300hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("MG", "F", [
  { name: "1.8", bodyTypes: ["Roadster"], engine: "1.8", power: "120hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("MG", "MG3", [
  { name: "1.5 Hibrit Plus", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.5", power: "194hp", transmissions: ["Otomatik"] },
  { name: "Luxury", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.5", power: "194hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("MG", "MG4 EV", [
  { name: "MG4", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "170hp", transmissions: ["Otomatik"] },
  { name: "Comfort", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "204hp", transmissions: ["Otomatik"] },
  { name: "Luxury", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "204hp", transmissions: ["Otomatik"] },
  { name: "XPower", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "435hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("MG", "MG7", [
  { name: "1.5", bodyTypes: ["Sedan"], engine: "1.5", power: "188hp", transmissions: ["Otomatik"] },
  { name: "Excellence", bodyTypes: ["Sedan"], engine: "1.5", power: "188hp", transmissions: ["Otomatik"] },
  { name: "Excellence Red Edition", bodyTypes: ["Sedan"], engine: "1.5", power: "188hp", transmissions: ["Otomatik"] },
  { name: "Passion", bodyTypes: ["Sedan"], engine: "1.5", power: "188hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("MG", "ZR", [
  { name: "160", bodyTypes: ["Hatchback"], engine: "1.8", power: "160hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("MG", "ZT", [
  { name: "190", bodyTypes: ["Sedan"], engine: "2.5", power: "190hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("MINI", "MINI Cooper F66", [
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "136hp", transmissions: ["Otomatik"] },
  { name: "1.5 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "116hp", transmissions: ["Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "112hp", transmissions: ["Otomatik"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "192hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("MINI", "MINI F54 Clubman", [
  { name: "1.5", bodyTypes: ["Station Wagon"], engine: "1.5", power: "136hp", transmissions: ["Otomatik"] },
  { name: "1.5 D", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.5", power: "116hp", transmissions: ["Otomatik"] },
  { name: "1.6", bodyTypes: ["Station Wagon"], engine: "1.6", power: "122hp", transmissions: ["Otomatik"] },
  { name: "1.6 S", bodyTypes: ["Station Wagon"], engine: "1.6", power: "184hp", transmissions: ["Otomatik"] },
  { name: "2.0", bodyTypes: ["Station Wagon"], engine: "2.0", power: "192hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("MINI", "John Cooper Works", [
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "211hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "231hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("MINI", "MINI One", [
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "98hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("MINI", "MINI Cooper S", [
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "184hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "192hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mitsubishi", "Attrage", [
  { name: "1.2", bodyTypes: ["Sedan"], engine: "1.2", power: "80hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Intense", bodyTypes: ["Sedan"], engine: "1.2", power: "80hp", transmissions: ["Otomatik"] },
  { name: "Intense Plus", bodyTypes: ["Sedan"], engine: "1.2", power: "80hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mitsubishi", "Colt", [
  { name: "1.1", bodyTypes: ["Hatchback"], engine: "1.1", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "95hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "109hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 DI-D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "112hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Mitsubishi", "Galant", [
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "116hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.4 GDI", bodyTypes: ["Sedan"], engine: "2.4", power: "150hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mitsubishi", "Lancer", [
  { name: "1.3", bodyTypes: ["Sedan"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Sedan"], engine: "1.5", power: "109hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "117hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "143hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mitsubishi", "Lancer Evolution", [
  { name: "VI", bodyTypes: ["Sedan"], engine: "2.0", power: "280hp", transmissions: ["Manuel"] },
  { name: "VII", bodyTypes: ["Sedan"], engine: "2.0", power: "280hp", transmissions: ["Manuel"] },
  { name: "IX", bodyTypes: ["Sedan"], engine: "2.0", power: "280hp", transmissions: ["Manuel"] },
  { name: "X", bodyTypes: ["Sedan"], engine: "2.0", power: "295hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Mitsubishi", "3000GT", [
  { name: "3000GT", bodyTypes: ["Coupe"], engine: "3.0", power: "286hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Mitsubishi", "Carisma", [
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "103hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "116hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 GDI", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.9 DI-D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.9", power: "102hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mitsubishi", "Diamante", [
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "210hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Mitsubishi", "Eclipse", [
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Mitsubishi", "Grandis", [
  { name: "2.0 DI-D", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "136hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mitsubishi", "Space Star", [
  { name: "1.2 Intense", bodyTypes: ["Hatchback"], engine: "1.2", power: "80hp", transmissions: ["Otomatik"] },
  { name: "1.2 Intense Sport Pack", bodyTypes: ["Hatchback"], engine: "1.2", power: "80hp", transmissions: ["Otomatik"] },
  { name: "1.2 Invite", bodyTypes: ["Hatchback"], engine: "1.2", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "98hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 DI-D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "102hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Mitsubishi", "Space Wagon", [
  { name: "1800 GLX", bodyTypes: ["MPV"], engine: "1.8", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Morgan", "Plus Four", [
  { name: "2.0 Twin Power", bodyTypes: ["Roadster"], engine: "2.0", power: "255hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Morgan", "Supersport", [
  { name: "3.0", bodyTypes: ["Roadster"], engine: "3.0", power: "335hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "200 SX", [
  { name: "1.8 Turbo", bodyTypes: ["Coupe"], engine: "1.8", power: "169hp", transmissions: ["Manuel"] },
  { name: "2.0 Turbo", bodyTypes: ["Coupe"], engine: "2.0", power: "200hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Nissan", "300 ZX", [
  { name: "3.0 Twin Turbo", bodyTypes: ["Coupe"], engine: "3.0", power: "283hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Nissan", "350 Z", [
  { name: "3.5", bodyTypes: ["Coupe"], engine: "3.5", power: "280hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Coupe", bodyTypes: ["Coupe"], engine: "3.5", power: "280hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Roadster", bodyTypes: ["Roadster"], engine: "3.5", power: "280hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "Almera", [
  { name: "1.5", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "98hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "114hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "75hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Nissan", "Altima", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "140hp", transmissions: ["Otomatik"] },
  { name: "2.4", bodyTypes: ["Sedan"], engine: "2.4", power: "152hp", transmissions: ["Otomatik"] },
  { name: "2.5", bodyTypes: ["Sedan"], engine: "2.5", power: "182hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "Bluebird", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "130hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "SSS", bodyTypes: ["Sedan"], engine: "2.0", power: "143hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Nissan", "GT-R", [
  { name: "Black Edition", bodyTypes: ["Coupe"], engine: "3.8", power: "565hp", transmissions: ["Otomatik"] },
  { name: "Premium Edition", bodyTypes: ["Coupe"], engine: "3.8", power: "565hp", transmissions: ["Otomatik"] },
  { name: "R35", bodyTypes: ["Coupe"], engine: "3.8", power: "565hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "Laurel Altima", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "130hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "Maxima", [
  { name: "2.0 QX", bodyTypes: ["Sedan"], engine: "2.0", power: "140hp", transmissions: ["Otomatik"] },
  { name: "3.0 QX", bodyTypes: ["Sedan"], engine: "3.0", power: "193hp", transmissions: ["Otomatik"] },
  { name: "3.5 V6", bodyTypes: ["Sedan"], engine: "3.5", power: "255hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "Micra", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "71hp", transmissions: ["Manuel"] },
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "80hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "88hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Nissan", "Note", [
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "80hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "88hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "110hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "NX Coupe", [
  { name: "1.6", bodyTypes: ["Coupe"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Nissan", "Primera", [
  { name: "1.6", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.8", power: "116hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TD", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Nissan", "Pulsar", [
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "109hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Nissan", "Skyline", [
  { name: "2.5", bodyTypes: ["Sedan"], engine: "2.5", power: "200hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "Sunny", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "143hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "Teana", [
  { name: "2.3", bodyTypes: ["Sedan"], engine: "2.3", power: "173hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Nissan", "Z", [
  { name: "3.0", bodyTypes: ["Coupe"], engine: "3.0", power: "405hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Opel", "Adam", [
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "87hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Opel", "Agila", [
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "86hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Club", bodyTypes: ["Hatchback"], engine: "1.2", power: "86hp", transmissions: ["Manuel"] },
  { name: "Comfort", bodyTypes: ["Hatchback"], engine: "1.2", power: "86hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Opel", "Ascona", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "75hp", transmissions: ["Manuel"] },
  { name: "C GLS", bodyTypes: ["Sedan"], engine: "1.6", power: "75hp", transmissions: ["Manuel"] },
  { name: "C L", bodyTypes: ["Sedan"], engine: "1.6", power: "75hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Opel", "Astra", [
  { name: "1.0 T", bodyTypes: ["Hatchback", "Sedan"], engine: "1.0", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.2 GL", bodyTypes: ["Hatchback"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.2 T", bodyTypes: ["Hatchback", "Sedan"], engine: "1.2", power: "130hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.3 CDTI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.3", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 T", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 D", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.5", power: "122hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Sedan"], engine: "1.6", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 CDTI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.6", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 T", bodyTypes: ["Hatchback", "Sedan"], engine: "1.6", power: "180hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.7 CDTI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.7", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.7 D", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.7", power: "68hp", transmissions: ["Manuel"] },
  { name: "1.7 DTI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.7", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Hatchback", "Sedan"], engine: "1.8", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 CDTI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.9", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Hatchback", "Sedan"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 DTI Comfort", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "2.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "2.0 T", bodyTypes: ["Hatchback", "Sedan"], engine: "2.0", power: "200hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.2", bodyTypes: ["Hatchback", "Sedan"], engine: "2.2", power: "147hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Opel", "Astra-e", [
  { name: "GS", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "156hp", transmissions: ["Otomatik"] },
  { name: "Ultimate", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "156hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Opel", "Calibra", [
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 Turbo", bodyTypes: ["Coupe"], engine: "2.0", power: "204hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Opel", "Cascada", [
  { name: "1.6 XHT Cosmo", bodyTypes: ["Cabriolet"], engine: "1.6", power: "170hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Opel", "Corsa", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "60hp", transmissions: ["Manuel"] },
  { name: "1.0 T", bodyTypes: ["Hatchback"], engine: "1.0", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "80hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 Hibrit", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.2", power: "100hp", transmissions: ["Otomatik"] },
  { name: "1.2 T", bodyTypes: ["Hatchback"], engine: "1.2", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 Twinport", bodyTypes: ["Hatchback"], engine: "1.2", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.3 CDTI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 Twinport", bodyTypes: ["Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.5 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 D Swing", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "102hp", transmissions: ["Manuel"] },
  { name: "1.5 TD", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "102hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.7 DTI Comfort", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.7", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.8 GSi", bodyTypes: ["Hatchback"], engine: "1.8", power: "125hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Opel", "Corsa-e", [
  { name: "GS", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "156hp", transmissions: ["Otomatik"] },
  { name: "Ultimate", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "156hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Opel", "GT (Roadster)", [
  { name: "GT 2.0 Turbo", bodyTypes: ["Roadster"], engine: "2.0", power: "264hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Opel", "Insignia", [
  { name: "1.4 T", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.4", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.5", power: "122hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 T", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.5", power: "165hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "170hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 CDTI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "136hp", transmissions: ["Manuel"] },
  { name: "1.6 T", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "180hp", transmissions: ["Otomatik"] },
  { name: "2.0 CDTI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "170hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "250hp", transmissions: ["Otomatik"] },
  { name: "2.8", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.8", power: "325hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Opel", "Kadett", [
  { name: "1.3", bodyTypes: ["Hatchback", "Sedan"], engine: "1.3", power: "60hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Sedan"], engine: "1.6", power: "82hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback", "Sedan"], engine: "2.0", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Opel", "Manta", [
  { name: "2.0 GTE", bodyTypes: ["Coupe"], engine: "2.0", power: "110hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Opel", "Meriva", [
  { name: "1.3 CDTI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.3", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.4 T", bodyTypes: ["MPV"], engine: "1.4", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.7 CDTI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.7", power: "110hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Opel", "Omega", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.2", bodyTypes: ["Sedan"], engine: "2.2", power: "144hp", transmissions: ["Otomatik"] },
  { name: "2.5", bodyTypes: ["Sedan"], engine: "2.5", power: "170hp", transmissions: ["Otomatik"] },
  { name: "2.5 TD", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.5", power: "131hp", transmissions: ["Otomatik"] },
  { name: "2.6", bodyTypes: ["Sedan"], engine: "2.6", power: "180hp", transmissions: ["Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "211hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Opel", "Rekord", [
  { name: "1.7", bodyTypes: ["Sedan"], engine: "1.7", power: "75hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "100hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Opel", "Signum", [
  { name: "1.9 CDTI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Hatchback"], engine: "2.0", power: "175hp", transmissions: ["Otomatik"] },
  { name: "2.2", bodyTypes: ["Hatchback"], engine: "2.2", power: "155hp", transmissions: ["Otomatik"] },
  { name: "3.0 CDTi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "3.0", power: "177hp", transmissions: ["Otomatik"] },
  { name: "3.2", bodyTypes: ["Hatchback"], engine: "3.2", power: "211hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Opel", "Tigra", [
  { name: "1.4", bodyTypes: ["Coupe", "Roadster"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 TT Sport", bodyTypes: ["Roadster"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Coupe", "Roadster"], engine: "1.6", power: "106hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 TT Sport", bodyTypes: ["Roadster"], engine: "1.8", power: "125hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Opel", "Vectra", [
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.7 TD GLS", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.7", power: "82hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 CDTI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.9", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 DTI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "2.0 T", bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "175hp", transmissions: ["Otomatik"] },
  { name: "2.2", bodyTypes: ["Sedan", "Hatchback"], engine: "2.2", power: "147hp", transmissions: ["Otomatik"] },
  { name: "2.2 DTI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "2.2", power: "125hp", transmissions: ["Manuel"] },
  { name: "2.5", bodyTypes: ["Sedan", "Hatchback"], engine: "2.5", power: "170hp", transmissions: ["Otomatik"] },
  { name: "3.0 CDTI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "3.0", power: "177hp", transmissions: ["Otomatik"] },
  { name: "3.2 GTS", bodyTypes: ["Hatchback"], engine: "3.2", power: "211hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Opel", "Zafira", [
  { name: "1.4", bodyTypes: ["MPV"], engine: "1.4", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 CDTI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "136hp", transmissions: ["Manuel"] },
  { name: "1.7 CDTI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.7", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["MPV"], engine: "1.8", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 CDTI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 CDTI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "165hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 DTI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "2.0 T", bodyTypes: ["MPV"], engine: "2.0", power: "200hp", transmissions: ["Otomatik"] },
  { name: "2.2 16V", bodyTypes: ["MPV"], engine: "2.2", power: "147hp", transmissions: ["Otomatik"] },
  { name: "2.2 DTI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.2", power: "125hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "106", [
  { name: "GTI", bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp", transmissions: ["Manuel"] },
  { name: "Quicksilver", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "XN", bodyTypes: ["Hatchback"], engine: "1.1", power: "60hp", transmissions: ["Manuel"] },
  { name: "XR", bodyTypes: ["Hatchback"], engine: "1.1", power: "60hp", transmissions: ["Manuel"] },
  { name: "XS", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "XSi", bodyTypes: ["Hatchback"], engine: "1.4", power: "95hp", transmissions: ["Manuel"] },
  { name: "XT", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "107", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "68hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "54hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "205", [
  { name: "1.1", bodyTypes: ["Hatchback"], engine: "1.1", power: "60hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.9", bodyTypes: ["Hatchback"], engine: "1.9", power: "130hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "206", [
  { name: "1.1", bodyTypes: ["Hatchback"], engine: "1.1", power: "60hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "68hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "109hp", transmissions: ["Manuel"] },
  { name: "1.9", bodyTypes: ["Hatchback"], engine: "1.9", power: "90hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "138hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "2.0", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "206 +", [
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "68hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "207", [
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4 VTi", bodyTypes: ["Hatchback"], engine: "1.4", power: "95hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "109hp", transmissions: ["Manuel"] },
  { name: "1.6 THP", bodyTypes: ["Hatchback"], engine: "1.6", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 VTi", bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Peugeot", "208", [
  { name: "1.0 VTi", bodyTypes: ["Hatchback"], engine: "1.0", power: "68hp", transmissions: ["Manuel"] },
  { name: "1.2 PureTech", bodyTypes: ["Hatchback"], engine: "1.2", power: "82hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 VTi", bodyTypes: ["Hatchback"], engine: "1.2", power: "82hp", transmissions: ["Manuel"] },
  { name: "1.4 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "68hp", transmissions: ["Manuel"] },
  { name: "1.5 BlueHDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.6 BlueHDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.6 e-HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "92hp", transmissions: ["Otomatik"] },
  { name: "1.6 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "92hp", transmissions: ["Manuel"] },
  { name: "1.6 THP", bodyTypes: ["Hatchback"], engine: "1.6", power: "208hp", transmissions: ["Manuel"] },
  { name: "1.6 VTi", bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Peugeot", "e-208", [
  { name: "GT", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Peugeot", "301", [
  { name: "1.2 PureTech", bodyTypes: ["Sedan"], engine: "1.2", power: "82hp", transmissions: ["Manuel"] },
  { name: "1.2 VTi", bodyTypes: ["Sedan"], engine: "1.2", power: "72hp", transmissions: ["Manuel"] },
  { name: "1.5 BlueHDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.5", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.6 BlueHDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.6 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "92hp", transmissions: ["Manuel"] },
  { name: "1.6 VTi", bodyTypes: ["Sedan"], engine: "1.6", power: "115hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Peugeot", "305", [
  { name: "1.9", bodyTypes: ["Sedan"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "306", [
  { name: "1.4", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Sedan"], engine: "1.6", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Hatchback", "Sedan"], engine: "1.8", power: "103hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9", bodyTypes: ["Hatchback", "Sedan"], engine: "1.9", power: "90hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback", "Sedan"], engine: "2.0", power: "121hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Peugeot", "307", [
  { name: "1.4", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "68hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "109hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback", "Station Wagon"], engine: "2.0", power: "138hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Peugeot", "308", [
  { name: "1.2 Puretech", bodyTypes: ["Hatchback"], engine: "1.2", power: "130hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 VTi", bodyTypes: ["Hatchback"], engine: "1.2", power: "82hp", transmissions: ["Manuel"] },
  { name: "1.5 BlueHDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "130hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 BlueHDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 e-HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "115hp", transmissions: ["Otomatik"] },
  { name: "1.6 HDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "92hp", transmissions: ["Manuel"] },
  { name: "1.6 THP", bodyTypes: ["Hatchback"], engine: "1.6", power: "156hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 VTi", bodyTypes: ["Hatchback"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Peugeot", "e-308", [
  { name: "GT", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "156hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Peugeot", "405", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "92hp", transmissions: ["Manuel"] },
  { name: "1.9", bodyTypes: ["Sedan"], engine: "1.9", power: "120hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "406", [
  { name: "1.6", bodyTypes: ["Sedan", "Coupe"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Coupe"], engine: "1.8", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan", "Coupe"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Coupe"], engine: "2.0", power: "110hp", transmissions: ["Manuel"] },
  { name: "2.2", bodyTypes: ["Sedan", "Coupe"], engine: "2.2", power: "158hp", transmissions: ["Otomatik"] },
  { name: "2.2 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Coupe"], engine: "2.2", power: "133hp", transmissions: ["Manuel"] },
  { name: "3.0", bodyTypes: ["Sedan", "Coupe"], engine: "3.0", power: "210hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Peugeot", "407", [
  { name: "1.6 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.2", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.2", power: "160hp", transmissions: ["Otomatik"] },
  { name: "2.2 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.2", power: "170hp", transmissions: ["Otomatik"] },
  { name: "2.7 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.7", power: "204hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Peugeot", "508", [
  { name: "1.5 BlueHDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.5", power: "130hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 BlueHDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "120hp", transmissions: ["Otomatik"] },
  { name: "1.6 e-HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "115hp", transmissions: ["Otomatik"] },
  { name: "1.6 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "112hp", transmissions: ["Manuel"] },
  { name: "1.6 Puretech", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "180hp", transmissions: ["Otomatik"] },
  { name: "1.6 THP", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] },
  { name: "1.6 VTi", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "163hp", transmissions: ["Otomatik"] },
  { name: "2.2 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.2", power: "204hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Peugeot", "605", [
  { name: "2.0 SRi", bodyTypes: ["Sedan"], engine: "2.0", power: "121hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Peugeot", "607", [
  { name: "2.2", bodyTypes: ["Sedan"], engine: "2.2", power: "158hp", transmissions: ["Otomatik"] },
  { name: "2.2 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.2", power: "170hp", transmissions: ["Otomatik"] },
  { name: "2.7 HDi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.7", power: "204hp", transmissions: ["Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "211hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Peugeot", "806", [
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "121hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "ST HDi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "109hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "Pars", [
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "101hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Peugeot", "RCZ", [
  { name: "1.6 THP", bodyTypes: ["Coupe"], engine: "1.6", power: "156hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Asphalt", bodyTypes: ["Coupe"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] },
  { name: "Carbon", bodyTypes: ["Coupe"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] },
  { name: "Evolution", bodyTypes: ["Coupe"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] },
  { name: "Yearling", bodyTypes: ["Coupe"], engine: "1.6", power: "156hp", transmissions: ["Otomatik"] },
  { name: "R", bodyTypes: ["Coupe"], engine: "1.6", power: "270hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Porsche", "718", [
  { name: "718", bodyTypes: ["Coupe", "Roadster"], engine: "2.0", power: "300hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Boxster", bodyTypes: ["Roadster"], engine: "2.0", power: "300hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Boxster T", bodyTypes: ["Roadster"], engine: "2.0", power: "300hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Cayman", bodyTypes: ["Coupe"], engine: "2.0", power: "300hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Cayman GT4 RS", bodyTypes: ["Coupe"], engine: "4.0", power: "500hp", transmissions: ["Otomatik"] },
  { name: "Cayman Style Edition", bodyTypes: ["Coupe"], engine: "2.0", power: "300hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Porsche", "911", [
  { name: "Carrera", bodyTypes: ["Coupe"], engine: "3.0", power: "385hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Carrera 4", bodyTypes: ["Coupe"], engine: "3.0", power: "385hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Carrera 4 GTS", bodyTypes: ["Coupe"], engine: "3.0", power: "480hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Carrera 4S", bodyTypes: ["Coupe"], engine: "3.0", power: "450hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Carrera GTS", bodyTypes: ["Coupe"], engine: "3.0", power: "480hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Carrera S", bodyTypes: ["Coupe"], engine: "3.0", power: "450hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "GT3", bodyTypes: ["Coupe"], engine: "4.0", power: "510hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "GT3 RS", bodyTypes: ["Coupe"], engine: "4.0", power: "525hp", transmissions: ["Otomatik"] },
  { name: "Targa 4", bodyTypes: ["Targa"], engine: "3.0", power: "385hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Targa 4 GTS", bodyTypes: ["Targa"], engine: "3.0", power: "480hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Targa 4S", bodyTypes: ["Targa"], engine: "3.0", power: "450hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "Turbo", bodyTypes: ["Coupe"], engine: "3.8", power: "580hp", transmissions: ["Otomatik"] },
  { name: "Turbo S", bodyTypes: ["Coupe"], engine: "3.8", power: "650hp", transmissions: ["Otomatik"] },
  { name: "Turbo S Cabriolet", bodyTypes: ["Cabriolet"], engine: "3.8", power: "650hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Porsche", "Boxster", [
  { name: "Boxster", bodyTypes: ["Roadster"], engine: "2.7", power: "265hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "S", bodyTypes: ["Roadster"], engine: "3.4", power: "315hp", transmissions: ["Otomatik", "Manuel"] }
]);
ensureSeriesModels("Porsche", "Cayman", [
  { name: "Cayman", bodyTypes: ["Coupe"], engine: "2.7", power: "275hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "S", bodyTypes: ["Coupe"], engine: "3.4", power: "325hp", transmissions: ["Otomatik", "Manuel"] }
]);
ensureSeriesModels("Porsche", "Panamera", [
  { name: "Panamera", bodyTypes: ["Sedan"], engine: "3.0", power: "330hp", transmissions: ["Otomatik"] },
  { name: "Panamera Diesel", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "300hp", transmissions: ["Otomatik"] },
  { name: "Panamera GTS", bodyTypes: ["Sedan"], engine: "4.0", power: "460hp", transmissions: ["Otomatik"] },
  { name: "Panamera S", bodyTypes: ["Sedan"], engine: "4.8", power: "400hp", transmissions: ["Otomatik"] },
  { name: "Panamera 4", bodyTypes: ["Sedan"], engine: "3.0", power: "330hp", transmissions: ["Otomatik"] },
  { name: "Panamera 4 - 10 Years Edition", bodyTypes: ["Sedan"], engine: "3.0", power: "330hp", transmissions: ["Otomatik"] },
  { name: "Panamera 4 - 10 Years Edition E-Hybrid", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "2.9", power: "462hp", transmissions: ["Otomatik"] },
  { name: "Panamera 4 E-Hybrid", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "2.9", power: "462hp", transmissions: ["Otomatik"] },
  { name: "Panamera 4 Platinum Edition", bodyTypes: ["Sedan"], engine: "2.9", power: "330hp", transmissions: ["Otomatik"] },
  { name: "Panamera 4 Sport Turismo", bodyTypes: ["Station Wagon"], engine: "2.9", power: "330hp", transmissions: ["Otomatik"] },
  { name: "Panamera 4S Diesel", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "4.0", power: "422hp", transmissions: ["Otomatik"] },
  { name: "Panamera 4S E-Hybrid", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "2.9", power: "560hp", transmissions: ["Otomatik"] },
  { name: "Panamera Turbo", bodyTypes: ["Sedan"], engine: "4.0", power: "550hp", transmissions: ["Otomatik"] },
  { name: "Panamera Turbo S", bodyTypes: ["Sedan"], engine: "4.0", power: "630hp", transmissions: ["Otomatik"] },
  { name: "Panamera Turbo S E-Hybrid", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "4.0", power: "700hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Porsche", "Taycan Elektrik", [
  { name: "4 Black Edition", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "476hp", transmissions: ["Otomatik"] },
  { name: "4 Cross Turismo", fuels: ["Elektrik"], bodyTypes: ["Station Wagon"], engine: "Elektrik", power: "476hp", transmissions: ["Otomatik"] },
  { name: "4S", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "530hp", transmissions: ["Otomatik"] },
  { name: "4S Cross Turismo", fuels: ["Elektrik"], bodyTypes: ["Station Wagon"], engine: "Elektrik", power: "571hp", transmissions: ["Otomatik"] },
  { name: "4S Performance", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "530hp", transmissions: ["Otomatik"] },
  { name: "4S Performance Plus", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "571hp", transmissions: ["Otomatik"] },
  { name: "4S Sport Turismo", fuels: ["Elektrik"], bodyTypes: ["Station Wagon"], engine: "Elektrik", power: "571hp", transmissions: ["Otomatik"] },
  { name: "GTS", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "598hp", transmissions: ["Otomatik"] },
  { name: "GTS Sport Turismo", fuels: ["Elektrik"], bodyTypes: ["Station Wagon"], engine: "Elektrik", power: "598hp", transmissions: ["Otomatik"] },
  { name: "Taycan", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "408hp", transmissions: ["Otomatik"] },
  { name: "Turbo", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "680hp", transmissions: ["Otomatik"] },
  { name: "Turbo S", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "761hp", transmissions: ["Otomatik"] },
  { name: "Turbo S Cross Turismo", fuels: ["Elektrik"], bodyTypes: ["Station Wagon"], engine: "Elektrik", power: "761hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Proton", "Saga", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Medium Line", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Proton", "Savvy", [
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "Medium Line", bodyTypes: ["Hatchback"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Proton", "Waja", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "103hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Medium Line", bodyTypes: ["Sedan"], engine: "1.6", power: "103hp", transmissions: ["Otomatik"] },
  { name: "Premium", bodyTypes: ["Sedan"], engine: "1.6", power: "103hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Proton", "218", [
  { name: "GLXi", bodyTypes: ["Sedan"], engine: "1.8", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Proton", "315", [
  { name: "GLSi", bodyTypes: ["Sedan"], engine: "1.5", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Proton", "415", [
  { name: "GLSi", bodyTypes: ["Sedan"], engine: "1.5", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Proton", "416", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "1.6", power: "111hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Proton", "418", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "1.8", power: "140hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Proton", "420", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "2.0", power: "150hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Proton", "Persona", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Renault", "Clio", [
  { name: "0.9 TCe", bodyTypes: ["Hatchback"], engine: "0.9", power: "90hp", transmissions: ["Manuel"] },
  { name: "0.9 TCe Sport Tourer", bodyTypes: ["Station Wagon"], engine: "0.9", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.0 SCe", bodyTypes: ["Hatchback"], engine: "1.0", power: "72hp", transmissions: ["Manuel"] },
  { name: "1.0 TCe", bodyTypes: ["Hatchback"], engine: "1.0", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.2 TCe", bodyTypes: ["Hatchback"], engine: "1.2", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 Grandtour", bodyTypes: ["Station Wagon"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.2 SportTourer", bodyTypes: ["Station Wagon"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.3 TCe", bodyTypes: ["Hatchback"], engine: "1.3", power: "130hp", transmissions: ["Otomatik"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "98hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 Grandtour", bodyTypes: ["Station Wagon"], engine: "1.4", power: "98hp", transmissions: ["Manuel"] },
  { name: "1.5 BlueDCI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 dCi Grandtour", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.5", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.5 dCi SportTourer", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.5", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 E-Tech", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.6", power: "145hp", transmissions: ["Otomatik"] },
  { name: "1.6 Grandtour", bodyTypes: ["Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Hatchback"], engine: "1.8", power: "172hp", transmissions: ["Manuel"] },
  { name: "1.9 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "65hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "200hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Renault", "Espace", [
  { name: "1.6 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "160hp", transmissions: ["Otomatik"] },
  { name: "1.9 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "120hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 dCi Grand", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "150hp", transmissions: ["Otomatik"] },
  { name: "2.0 T", bodyTypes: ["MPV"], engine: "2.0", power: "170hp", transmissions: ["Otomatik"] },
  { name: "2.2", bodyTypes: ["MPV"], engine: "2.2", power: "140hp", transmissions: ["Otomatik"] },
  { name: "2.2 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.2", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "3.0", bodyTypes: ["MPV"], engine: "3.0", power: "190hp", transmissions: ["Otomatik"] },
  { name: "3.0 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "3.0", power: "177hp", transmissions: ["Otomatik"] },
  { name: "3.0 dCi Grand", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "3.0", power: "177hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Fluence", [
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.5", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Authentique 1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "Authentique", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "Business", bodyTypes: ["Sedan"], engine: "1.5", power: "110hp", transmissions: ["Otomatik"] },
  { name: "Dynamique", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Expression", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "Extreme", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "Icon", bodyTypes: ["Sedan"], engine: "1.5", power: "110hp", transmissions: ["Otomatik"] },
  { name: "Joy", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "Privilege", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Otomatik"] },
  { name: "Touch", bodyTypes: ["Sedan"], engine: "1.5", power: "110hp", transmissions: ["Otomatik"] },
  { name: "Touch Plus", bodyTypes: ["Sedan"], engine: "1.5", power: "110hp", transmissions: ["Otomatik"] },
  { name: "Bold Edition", bodyTypes: ["Sedan"], engine: "1.5", power: "110hp", transmissions: ["Otomatik"] },
  { name: "Elegance", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Otomatik"] },
  { name: "Extreme Edition", bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Renault", "1.6 dCi", [
  { name: "Icon", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "130hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Fluence Z.E.", [
  { name: "Dynamique", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "95hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Grand Scenic", [
  { name: "1.4 T", bodyTypes: ["MPV"], engine: "1.4", power: "130hp", transmissions: ["Manuel"] },
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.5", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "130hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Laguna", [
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.5", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.8", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.9", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.9 DTi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.9", power: "98hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback", "Station Wagon"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Hatchback", "Station Wagon"], engine: "2.0", power: "170hp", transmissions: ["Otomatik"] },
  { name: "2.2 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "2.2", power: "150hp", transmissions: ["Manuel"] },
  { name: "3.0", bodyTypes: ["Hatchback", "Station Wagon"], engine: "3.0", power: "210hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Latitude", [
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.5", power: "110hp", transmissions: ["Otomatik"] },
  { name: "2.0 dCi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "150hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Megane", [
  { name: "1.0 TCe", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.0", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.2 TCe", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.2", power: "130hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.3 TCe", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.3", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.4", power: "98hp", transmissions: ["Manuel"] },
  { name: "1.4 T", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.4", power: "130hp", transmissions: ["Manuel"] },
  { name: "1.4 T Sport Tourer", bodyTypes: ["Station Wagon"], engine: "1.4", power: "130hp", transmissions: ["Manuel"] },
  { name: "1.5 Blue DCI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.5", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.5", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 dCi Grandtour", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.5", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.5 dCi Sport Tourer", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.5", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 Cabrio", bodyTypes: ["Cabriolet"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.6 CC", bodyTypes: ["Cabriolet"], engine: "1.6", power: "110hp", transmissions: ["Otomatik"] },
  { name: "1.6 Coupe", bodyTypes: ["Coupe"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.6 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.6", power: "130hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 Grandtour", bodyTypes: ["Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 Sport Tourer", bodyTypes: ["Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 CC", bodyTypes: ["Cabriolet"], engine: "1.9", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.9 D", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.9", power: "65hp", transmissions: ["Manuel"] },
  { name: "1.9 dCi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "1.9", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.9 dCi Grandtour", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.9", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.9 DTi", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Sedan"], engine: "1.9", power: "98hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 CC", bodyTypes: ["Cabriolet"], engine: "2.0", power: "140hp", transmissions: ["Otomatik"] },
  { name: "2.0 Coupe", bodyTypes: ["Coupe"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Hatchback", "Sedan", "Station Wagon"], engine: "2.0", power: "180hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Megane E-Tech", [
  { name: "Esprit Alpine", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "220hp", transmissions: ["Otomatik"] },
  { name: "Iconic", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "220hp", transmissions: ["Otomatik"] },
  { name: "Techno", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "220hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Modus", [
  { name: "1.2", bodyTypes: ["MPV"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["MPV"], engine: "1.4", power: "98hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.5", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Renault", "Safrane", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.1", bodyTypes: ["Sedan"], engine: "2.1", power: "107hp", transmissions: ["Manuel"] },
  { name: "2.2", bodyTypes: ["Sedan"], engine: "2.2", power: "137hp", transmissions: ["Otomatik"] },
  { name: "2.5", bodyTypes: ["Sedan"], engine: "2.5", power: "170hp", transmissions: ["Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "170hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Scenic", [
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.5", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 dCi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "120hp", transmissions: ["Manuel"] },
  { name: "1.9 DTi", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "98hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Renault", "Symbol", [
  { name: "0.9 TCe", bodyTypes: ["Sedan"], engine: "0.9", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.0 SCe", bodyTypes: ["Sedan"], engine: "1.0", power: "72hp", transmissions: ["Manuel"] },
  { name: "1.0 TCe", bodyTypes: ["Sedan"], engine: "1.0", power: "100hp", transmissions: ["Manuel"] },
  { name: "1.2", bodyTypes: ["Sedan"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Sedan"], engine: "1.4", power: "98hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 BlueDCI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.5", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.5 DCI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.5", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Renault", "Taliant", [
  { name: "1.0 Sce", bodyTypes: ["Sedan"], engine: "1.0", power: "65hp", transmissions: ["Manuel"] },
  { name: "1.0 T", bodyTypes: ["Sedan"], engine: "1.0", power: "90hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Renault", "Talisman", [
  { name: "1.3 Tce", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.3", power: "160hp", transmissions: ["Otomatik"] },
  { name: "1.5 dCi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.5", power: "110hp", transmissions: ["Otomatik"] },
  { name: "1.6 dCi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "160hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Twingo", [
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "75hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "60hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "75hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Renault", "Twizy", [
  { name: "75", fuels: ["Elektrik"], bodyTypes: ["Mikro Otomobil"], engine: "Elektrik", power: "17hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "Vel Satis", [
  { name: "2.0 T", bodyTypes: ["Sedan"], engine: "2.0", power: "165hp", transmissions: ["Otomatik"] },
  { name: "3.0 dCi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "177hp", transmissions: ["Otomatik"] },
  { name: "3.5", bodyTypes: ["Sedan"], engine: "3.5", power: "245hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "ZOE", [
  { name: "Intense", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "135hp", transmissions: ["Otomatik"] },
  { name: "ZOE", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "109hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "R5 E-Tech", [
  { name: "EV40", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "120hp", transmissions: ["Otomatik"] },
  { name: "EV52", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "150hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Renault", "R 5", [
  { name: "1.1", bodyTypes: ["Hatchback"], engine: "1.1", power: "45hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "60hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Renault", "R 9", [
  { name: "1.4", bodyTypes: ["Sedan"], engine: "1.4", power: "72hp", transmissions: ["Manuel"] },
  { name: "1.4 Broadway", bodyTypes: ["Sedan"], engine: "1.4", power: "72hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.7", bodyTypes: ["Sedan"], engine: "1.7", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Renault", "R 11", [
  { name: "Flash", bodyTypes: ["Hatchback"], engine: "1.4", power: "72hp", transmissions: ["Manuel"] },
  { name: "Flash S", bodyTypes: ["Hatchback"], engine: "1.4", power: "80hp", transmissions: ["Manuel"] },
  { name: "GTL", bodyTypes: ["Hatchback"], engine: "1.4", power: "68hp", transmissions: ["Manuel"] },
  { name: "GTS", bodyTypes: ["Hatchback"], engine: "1.4", power: "72hp", transmissions: ["Manuel"] },
  { name: "GTX", bodyTypes: ["Hatchback"], engine: "1.7", power: "90hp", transmissions: ["Manuel"] },
  { name: "Rainbow", bodyTypes: ["Hatchback"], engine: "1.4", power: "72hp", transmissions: ["Manuel"] },
  { name: "Turbo", bodyTypes: ["Hatchback"], engine: "1.4", power: "105hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Renault", "R 12", [
  { name: "GTS", bodyTypes: ["Sedan"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "SW", bodyTypes: ["Station Wagon"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "TL", bodyTypes: ["Sedan"], engine: "1.3", power: "54hp", transmissions: ["Manuel"] },
  { name: "TN", bodyTypes: ["Sedan"], engine: "1.3", power: "54hp", transmissions: ["Manuel"] },
  { name: "Toros", bodyTypes: ["Sedan"], engine: "1.4", power: "72hp", transmissions: ["Manuel"] },
  { name: "TS", bodyTypes: ["Sedan"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "TSW", bodyTypes: ["Station Wagon"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "TX", bodyTypes: ["Sedan"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Renault", "R 19", [
  { name: "1.4", bodyTypes: ["Hatchback", "Sedan"], engine: "1.4", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.4 Europa", bodyTypes: ["Sedan"], engine: "1.4", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Sedan"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.6 Europa", bodyTypes: ["Sedan"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.7", bodyTypes: ["Hatchback", "Sedan"], engine: "1.7", power: "92hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Hatchback", "Sedan"], engine: "1.8", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 Europa", bodyTypes: ["Sedan"], engine: "1.8", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.8 RTi", bodyTypes: ["Hatchback", "Sedan"], engine: "1.8", power: "140hp", transmissions: ["Manuel"] },
  { name: "1.9", bodyTypes: ["Hatchback", "Sedan"], engine: "1.9", power: "65hp", fuels: ["Dizel"], transmissions: ["Manuel"] },
  { name: "1.9 Europa", bodyTypes: ["Sedan"], engine: "1.9", power: "65hp", fuels: ["Dizel"], transmissions: ["Manuel"] }
]);
ensureSeriesModels("Renault", "R 21", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.7", bodyTypes: ["Sedan"], engine: "1.7", power: "90hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "120hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Renault", "R 25", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "123hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.2", bodyTypes: ["Sedan"], engine: "2.2", power: "123hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rolls-Royce", "Ghost", [
  { name: "6.6", bodyTypes: ["Sedan"], engine: "6.6", power: "570hp", transmissions: ["Otomatik"] },
  { name: "6.75", bodyTypes: ["Sedan"], engine: "6.75", power: "563hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rolls-Royce", "Phantom", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "6.75", power: "571hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rolls-Royce", "Wraith", [
  { name: "Standart", bodyTypes: ["Coupe"], engine: "6.6", power: "632hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rolls-Royce", "Spectre", [
  { name: "Standart", fuels: ["Elektrik"], bodyTypes: ["Coupe"], engine: "Elektrik", power: "585hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rover", "25", [
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "109hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Club", bodyTypes: ["Hatchback"], engine: "1.6", power: "109hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Rover", "45", [
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "109hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "117hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "150hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rover", "75", [
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 CDTi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "131hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.5", bodyTypes: ["Sedan"], engine: "2.5", power: "177hp", transmissions: ["Otomatik"] },
  { name: "2.5 CDTi", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.5", power: "150hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rover", "200", [
  { name: "Si", bodyTypes: ["Hatchback"], engine: "1.6", power: "111hp", transmissions: ["Manuel"] },
  { name: "Vi", bodyTypes: ["Hatchback"], engine: "1.8", power: "145hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Rover", "214", [
  { name: "Si", bodyTypes: ["Sedan"], engine: "1.4", power: "103hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Rover", "216", [
  { name: "Standart", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "111hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Rover", "220", [
  { name: "Standart", bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Rover", "414", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "1.4", power: "103hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Rover", "416", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "1.6", power: "111hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Rover", "420", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "2.0", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rover", "620", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "2.0", power: "131hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rover", "820", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "2.0", power: "136hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Rover", "Streetwise", [
  { name: "Standart", bodyTypes: ["Crossover"], engine: "1.4", power: "103hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Seat", "Alhambra", [
  { name: "1.4 TSI", bodyTypes: ["MPV"], engine: "1.4", power: "150hp", transmissions: ["Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "115hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["MPV"], engine: "2.0", power: "150hp", transmissions: ["Otomatik"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Seat", "Altea", [
  { name: "1.4 TSI", bodyTypes: ["MPV"], engine: "1.4", power: "125hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Seat", "Arosa", [
  { name: "1.0 EcoTSI", bodyTypes: ["Hatchback"], engine: "1.0", power: "95hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Seat", "Cordoba", [
  { name: "1.4", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.4", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 SDi", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.9", power: "68hp", transmissions: ["Manuel"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.9", power: "90hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Seat", "Exeo", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "102hp", transmissions: ["Manuel"] },
  { name: "2.0 TSI", bodyTypes: ["Sedan"], engine: "2.0", power: "211hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Seat", "Ibiza", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.0 EcoTSI", bodyTypes: ["Hatchback"], engine: "1.0", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.2 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.2 TSI", bodyTypes: ["Hatchback"], engine: "1.2", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 TSI Sport Coupe", bodyTypes: ["Coupe"], engine: "1.2", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.2 TSI Sport Tourer", bodyTypes: ["Station Wagon"], engine: "1.2", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "85hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 Sport Coupe", bodyTypes: ["Coupe"], engine: "1.4", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.4 Sport Tourer", bodyTypes: ["Station Wagon"], engine: "1.4", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.4 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.4 TSI Sport Coupe", bodyTypes: ["Coupe"], engine: "1.4", power: "150hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "1.5 EcoTSI", bodyTypes: ["Hatchback"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 Sport Coupe", bodyTypes: ["Coupe"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Hatchback"], engine: "1.8", power: "192hp", transmissions: ["Otomatik"] },
  { name: "1.8 TSI Sport Coupe", bodyTypes: ["Coupe"], engine: "1.8", power: "192hp", transmissions: ["Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "100hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "150hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Seat", "Leon", [
  { name: "1.0 EcoTSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.0 eTSI", fuels: ["Hibrit"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.0", power: "110hp", transmissions: ["Otomatik"] },
  { name: "1.0 TSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 TSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.2", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.4 TSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 EcoTSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 EcoTSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 eHybrid", fuels: ["Hibrit"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.5", power: "204hp", transmissions: ["Otomatik"] },
  { name: "1.5 eTSI", fuels: ["Hibrit"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "1.5 TSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "102hp", transmissions: ["Manuel"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 T", bodyTypes: ["Hatchback"], engine: "1.8", power: "180hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "2.0", power: "190hp", transmissions: ["Otomatik"] },
  { name: "2.0 TFSI", bodyTypes: ["Hatchback"], engine: "2.0", power: "240hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Seat", "Marbella", [
  { name: "903 Special", bodyTypes: ["Hatchback"], engine: "0.9", power: "40hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Seat", "Toledo", [
  { name: "1.2 TSI", bodyTypes: ["Sedan"], engine: "1.2", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 TSI", bodyTypes: ["Sedan"], engine: "1.4", power: "122hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "150hp", transmissions: ["Otomatik"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Skoda", "Citigo", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "75hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "Ambition", bodyTypes: ["Hatchback"], engine: "1.0", power: "75hp", transmissions: ["Manuel"] },
  { name: "Elegance", bodyTypes: ["Hatchback"], engine: "1.0", power: "75hp", transmissions: ["Manuel", "Otomatik"] }
]);
ensureSeriesModels("Skoda", "Fabia", [
  { name: "1.0 GreenTec", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.0", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.0 TSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.0", power: "95hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.2", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.2 TSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.2", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "85hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.4 TSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.4", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 TSI", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.9", power: "100hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Skoda", "Favorit", [
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "58hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "68hp", transmissions: ["Manuel"] },
  { name: "135", bodyTypes: ["Hatchback"], engine: "1.3", power: "58hp", transmissions: ["Manuel"] },
  { name: "136", bodyTypes: ["Hatchback"], engine: "1.3", power: "62hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Skoda", "Felicia", [
  { name: "1.3", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.3", power: "68hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.6", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.9 D", fuels: ["Dizel"], bodyTypes: ["Hatchback", "Station Wagon"], engine: "1.9", power: "64hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Skoda", "Forman", [
  { name: "135 L", bodyTypes: ["Station Wagon"], engine: "1.3", power: "58hp", transmissions: ["Manuel"] },
  { name: "135 LS", bodyTypes: ["Station Wagon"], engine: "1.3", power: "58hp", transmissions: ["Manuel"] },
  { name: "Blackline", bodyTypes: ["Station Wagon"], engine: "1.3", power: "58hp", transmissions: ["Manuel"] },
  { name: "GLX", bodyTypes: ["Station Wagon"], engine: "1.3", power: "58hp", transmissions: ["Manuel"] },
  { name: "LE", bodyTypes: ["Station Wagon"], engine: "1.3", power: "58hp", transmissions: ["Manuel"] },
  { name: "LX", bodyTypes: ["Station Wagon"], engine: "1.3", power: "58hp", transmissions: ["Manuel"] },
  { name: "Silverline", bodyTypes: ["Station Wagon"], engine: "1.3", power: "58hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Skoda", "Octavia", [
  { name: "1.0 e-Tec", fuels: ["Hibrit"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.0", power: "110hp", transmissions: ["Otomatik"] },
  { name: "1.0 TSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.0", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 TSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.2", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.4", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 e-Tec", fuels: ["Hibrit"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "1.5 Mhev", fuels: ["Hibrit"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "1.5 TSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 FSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.8", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 T", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.8", power: "150hp", transmissions: ["Manuel"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "2.0 FSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TDSI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "150hp", transmissions: ["Otomatik"] },
  { name: "2.0 TSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "190hp", transmissions: ["Otomatik"] }
]);
ensureSeriesModels("Skoda", "Rapid", [
  { name: "1.0 TSI GreenTec", bodyTypes: ["Sedan", "Hatchback"], engine: "1.0", power: "95hp", transmissions: ["Manuel"] },
  { name: "1.2", bodyTypes: ["Sedan", "Hatchback"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.2 TSI", bodyTypes: ["Sedan", "Hatchback"], engine: "1.2", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 TSI GreenTec", bodyTypes: ["Sedan", "Hatchback"], engine: "1.2", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.4 TDI GreenTec", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 TSI", bodyTypes: ["Sedan", "Hatchback"], engine: "1.4", power: "122hp", transmissions: ["Otomatik"] },
  { name: "1.4 TSI GreenTec", bodyTypes: ["Sedan", "Hatchback"], engine: "1.4", power: "122hp", transmissions: ["Otomatik"] },
  { name: "1.6 CR TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.6 TDI GreenTec", fuels: ["Dizel"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Skoda", "Roomster", [
  { name: "1.2", bodyTypes: ["MPV"], engine: "1.2", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["MPV"], engine: "1.4", power: "86hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.4", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 CR TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Skoda", "Scala", [
  { name: "1.0 TSI", bodyTypes: ["Hatchback"], engine: "1.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 TSI", bodyTypes: ["Hatchback"], engine: "1.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] }
]);
ensureSeriesModels("Skoda", "Superb", [
  { name: "1.4 TSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.4", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 TSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 TSI Hybrid", fuels: ["Hibrit"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.5", power: "204hp", transmissions: ["Otomatik"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 T", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.8", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.9", power: "130hp", transmissions: ["Manuel"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "220hp", transmissions: ["Otomatik"] },
  { name: "2.5 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.5", power: "163hp", transmissions: ["Otomatik"] },
  { name: "3.6 FSI", bodyTypes: ["Sedan", "Station Wagon"], engine: "3.6", power: "260hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Smart", "Fortwo", [
  { name: "0.6", bodyTypes: ["Hatchback"], engine: "0.6", power: "55hp", transmissions: ["Otomatik"] },
  { name: "0.7", bodyTypes: ["Hatchback"], engine: "0.7", power: "61hp", transmissions: ["Otomatik"] },
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "71hp", transmissions: ["Otomatik"] },
  { name: "EQ", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "82hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Smart", "Forfour", [
  { name: "0.9 T", bodyTypes: ["Hatchback"], engine: "0.9", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "71hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.1", bodyTypes: ["Hatchback"], engine: "1.1", power: "75hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "109hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 CDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.5", power: "95hp", transmissions: ["Otomatik"] },
  { name: "EQ", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "82hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Smart", "Roadster", [
  { name: "Roadster", bodyTypes: ["Roadster"], engine: "0.7", power: "82hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Subaru", "BRZ", [
  { name: "2.0R Premium", bodyTypes: ["Coupe"], engine: "2.0", power: "200hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Subaru", "Impreza", [
  { name: "1.5", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "107hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Sedan", "Hatchback"], engine: "1.6", power: "114hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan", "Hatchback"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.5", bodyTypes: ["Sedan", "Hatchback"], engine: "2.5", power: "170hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Subaru", "Legacy", [
  { name: "1.8", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.8", power: "103hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TD", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "150hp", transmissions: ["Manuel"] },
  { name: "2.2", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.2", power: "136hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Subaru", "Levorg", [
  { name: "1.6", bodyTypes: ["Station Wagon"], engine: "1.6", power: "170hp", transmissions: ["Otomatik"] },
  { name: "GT-S CVT", bodyTypes: ["Station Wagon"], engine: "1.6", power: "170hp", transmissions: ["Otomatik"] },
  { name: "Sport Plus", bodyTypes: ["Station Wagon"], engine: "1.8", power: "177hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Subaru", "Justy", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "68hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 GLi", bodyTypes: ["Hatchback"], engine: "1.2", power: "80hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Subaru", "Vivio", [
  { name: "2WD GL", bodyTypes: ["Hatchback"], engine: "0.7", power: "44hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tata", "Indica", [
  { name: "1.4 Basic", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 Comfort", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 DLX", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 TDI Comfort", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4 TDI Trend", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tata", "Indigo", [
  { name: "1.4 MPFI Comfort", bodyTypes: ["Sedan"], engine: "1.4", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.4 MPFI Trend", bodyTypes: ["Sedan"], engine: "1.4", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.4 TDI Comfort", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4 TDI Trend", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tata", "Marina", [
  { name: "1.4 TDI Comfort", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4 TDI Trend", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tata", "Vista", [
  { name: "1.3 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 Safire Aura", bodyTypes: ["Hatchback"], engine: "1.4", power: "85hp", transmissions: ["Manuel"] },
  { name: "1.4 Safire Mystic", bodyTypes: ["Hatchback"], engine: "1.4", power: "85hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tata", "Manza", [
  { name: "Aura 1.4 Safire", bodyTypes: ["Sedan"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "Ignis 1.4 Safire", bodyTypes: ["Sedan"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tesla", "Model 3", [
  { name: "Long Range", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "498hp", transmissions: ["Otomatik"] },
  { name: "Standart", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "283hp", transmissions: ["Otomatik"] },
  { name: "Standart Plus", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "325hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Tesla", "Model S", [
  { name: "75", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "320hp", transmissions: ["Otomatik"] },
  { name: "75D", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "333hp", transmissions: ["Otomatik"] },
  { name: "85", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "367hp", transmissions: ["Otomatik"] },
  { name: "P100D", fuels: ["Elektrik"], bodyTypes: ["Sedan"], engine: "Elektrik", power: "772hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Tesla", "Model X", [
  { name: "75D", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "333hp", transmissions: ["Otomatik"] },
  { name: "90D", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "417hp", transmissions: ["Otomatik"] },
  { name: "100D", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "417hp", transmissions: ["Otomatik"] },
  { name: "Plaid", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "1020hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Tesla", "Model Y", [
  { name: "RWD (Juniper)", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "299hp", transmissions: ["Otomatik"] },
  { name: "RWD (Legacy)", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "299hp", transmissions: ["Otomatik"] },
  { name: "Standart (Juniper)", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "299hp", transmissions: ["Otomatik"] },
  { name: "Long Range (Juniper)", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "384hp", transmissions: ["Otomatik"] },
  { name: "Long Range (Legacy)", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "384hp", transmissions: ["Otomatik"] },
  { name: "Performance (Legacy)", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "534hp", transmissions: ["Otomatik"] },
  { name: "Premium (Juniper)", fuels: ["Elektrik"], bodyTypes: ["SUV"], engine: "Elektrik", power: "384hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Tofaş", "Doğan", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.6 ie", bodyTypes: ["Sedan"], engine: "1.6", power: "86hp", transmissions: ["Manuel"] },
  { name: "L", bodyTypes: ["Sedan"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "S", bodyTypes: ["Sedan"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "SL", bodyTypes: ["Sedan"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "SLX", bodyTypes: ["Sedan"], engine: "1.6", power: "86hp", transmissions: ["Manuel"] },
  { name: "SLX ie", bodyTypes: ["Sedan"], engine: "1.6", power: "86hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tofaş", "Kartal", [
  { name: "1.6", bodyTypes: ["Station Wagon"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.6 ie", bodyTypes: ["Station Wagon"], engine: "1.6", power: "86hp", transmissions: ["Manuel"] },
  { name: "Kartal 5 Vites", bodyTypes: ["Station Wagon"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "L", bodyTypes: ["Station Wagon"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "S", bodyTypes: ["Station Wagon"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "SL", bodyTypes: ["Station Wagon"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "SLX", bodyTypes: ["Station Wagon"], engine: "1.6", power: "86hp", transmissions: ["Manuel"] },
  { name: "SLX ie", bodyTypes: ["Station Wagon"], engine: "1.6", power: "86hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tofaş", "Murat", [
  { name: "124", bodyTypes: ["Sedan"], engine: "1.2", power: "65hp", transmissions: ["Manuel"] },
  { name: "131", bodyTypes: ["Sedan"], engine: "1.3", power: "70hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tofaş", "Şahin", [
  { name: "1.4", bodyTypes: ["Sedan"], engine: "1.4", power: "71hp", transmissions: ["Manuel"] },
  { name: "1.4 ie", bodyTypes: ["Sedan"], engine: "1.4", power: "78hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "1.6 ie", bodyTypes: ["Sedan"], engine: "1.6", power: "86hp", transmissions: ["Manuel"] },
  { name: "1.9", bodyTypes: ["Sedan"], engine: "1.9", power: "64hp", transmissions: ["Manuel"] },
  { name: "S", bodyTypes: ["Sedan"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] },
  { name: "Şahin 5 vites", bodyTypes: ["Sedan"], engine: "1.6", power: "80hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Tofaş", "Serçe", [
  { name: "Standart", bodyTypes: ["Sedan"], engine: "1.3", power: "65hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Togg", "T10F", [
  { name: "V1 Standart Menzil", fuels: ["Elektrik"], bodyTypes: ["Fastback"], engine: "Elektrik", power: "218hp", transmissions: ["Otomatik"] },
  { name: "V1 Uzun Menzil", fuels: ["Elektrik"], bodyTypes: ["Fastback"], engine: "Elektrik", power: "218hp", transmissions: ["Otomatik"] },
  { name: "V2 4More", fuels: ["Elektrik"], bodyTypes: ["Fastback"], engine: "Elektrik", power: "435hp", transmissions: ["Otomatik"] },
  { name: "V2 Uzun Menzil", fuels: ["Elektrik"], bodyTypes: ["Fastback"], engine: "Elektrik", power: "218hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Toyota", "Auris", [
  { name: "1.33", bodyTypes: ["Hatchback"], engine: "1.33", power: "99hp", transmissions: ["Manuel"] },
  { name: "1.4 D-4D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 D-4D Touring Sports", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "132hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 Touring Sports", bodyTypes: ["Station Wagon"], engine: "1.6", power: "132hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 Hybrid", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.8", power: "136hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Toyota", "Avensis", [
  { name: "1.6", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "132hp", transmissions: ["Manuel"] },
  { name: "1.6 D-4D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "1.6", power: "112hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Station Wagon"], engine: "1.8", power: "147hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "152hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "116hp", transmissions: ["Manuel"] },
  { name: "2.0 D-4D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "126hp", transmissions: ["Manuel"] },
  { name: "2.2 D-4D", fuels: ["Dizel"], bodyTypes: ["Sedan", "Station Wagon"], engine: "2.2", power: "150hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Toyota", "Avalon", [
  { name: "3.5 L", bodyTypes: ["Sedan"], engine: "3.5", power: "301hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Toyota", "Camry", [
  { name: "2.0 XLi", bodyTypes: ["Sedan"], engine: "2.0", power: "145hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.2 GL", bodyTypes: ["Sedan"], engine: "2.2", power: "131hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.4", bodyTypes: ["Sedan"], engine: "2.4", power: "167hp", transmissions: ["Otomatik"] },
  { name: "2.5 Hybrid Passion", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "2.5", power: "218hp", transmissions: ["Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "188hp", transmissions: ["Otomatik"] },
  { name: "3.0 GX", bodyTypes: ["Sedan"], engine: "3.0", power: "188hp", transmissions: ["Otomatik"] },
  { name: "3.5", bodyTypes: ["Sedan"], engine: "3.5", power: "277hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Toyota", "Carina", [
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "133hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "GLi", bodyTypes: ["Sedan"], engine: "2.0", power: "133hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Toyota", "Celica", [
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "156hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "GTi", bodyTypes: ["Coupe"], engine: "2.0", power: "175hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Toyota", "Corolla", [
  { name: "1.2 T", bodyTypes: ["Sedan", "Hatchback"], engine: "1.2", power: "116hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.3", bodyTypes: ["Sedan"], engine: "1.3", power: "88hp", transmissions: ["Manuel"] },
  { name: "1.33", bodyTypes: ["Sedan", "Hatchback"], engine: "1.33", power: "99hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Sedan"], engine: "1.4", power: "97hp", transmissions: ["Manuel"] },
  { name: "1.4 D-4D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Sedan", "Hatchback"], engine: "1.5", power: "125hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "132hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "140hp", transmissions: ["Otomatik"] },
  { name: "1.8 Hybrid", fuels: ["Hibrit"], bodyTypes: ["Sedan", "Hatchback"], engine: "1.8", power: "122hp", transmissions: ["Otomatik"] },
  { name: "2.0 D-4D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "126hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Toyota", "Corona", [
  { name: "1.6 XL", bodyTypes: ["Sedan"], engine: "1.6", power: "90hp", transmissions: ["Manuel"] },
  { name: "2.0 GLi", bodyTypes: ["Sedan"], engine: "2.0", power: "133hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 XL", bodyTypes: ["Sedan"], engine: "2.0", power: "133hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Toyota", "Cressida", [
  { name: "2.0 GLX", bodyTypes: ["Sedan"], engine: "2.0", power: "116hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Toyota", "Crown", [
  { name: "4.0", bodyTypes: ["Sedan"], engine: "4.0", power: "280hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Toyota", "GT86", [
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "200hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Toyota", "MR2", [
  { name: "Roadster", bodyTypes: ["Roadster"], engine: "1.8", power: "140hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Toyota", "Previa", [
  { name: "2.4", bodyTypes: ["Minivan"], engine: "2.4", power: "156hp", transmissions: ["Otomatik", "Manuel"] }
]);

ensureSeriesModels("Toyota", "Starlet", [
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 XLi", bodyTypes: ["Hatchback"], engine: "1.4", power: "82hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Toyota", "Supra", [
  { name: "3.0", bodyTypes: ["Coupe"], engine: "3.0", power: "340hp", transmissions: ["Otomatik", "Manuel"] }
]);

ensureSeriesModels("Toyota", "Urban Cruiser", [
  { name: "1.33", bodyTypes: ["SUV"], engine: "1.33", power: "99hp", transmissions: ["Manuel"] },
  { name: "1.4 D-4D", fuels: ["Dizel"], bodyTypes: ["SUV"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Toyota", "Verso", [
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "132hp", transmissions: ["Manuel"] },
  { name: "1.6 D-4D", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "112hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["MPV"], engine: "1.8", power: "147hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.0 D-4D", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "126hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Toyota", "Yaris", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "72hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "87hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.33", bodyTypes: ["Hatchback"], engine: "1.33", power: "99hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 D-4D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "111hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "1.5 Hybrid", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.5", power: "116hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Arteon", [
  { name: "1.5 TSI", bodyTypes: ["Sedan"], engine: "1.5", power: "150hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "200hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Beetle", [
  { name: "1.2 TSI", bodyTypes: ["Hatchback"], engine: "1.2", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "44hp", transmissions: ["Manuel"] },
  { name: "1.4 TSI", bodyTypes: ["Hatchback"], engine: "1.4", power: "160hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 TDI Design", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDi", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "90hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Bora", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.9", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.9 TDi Comfortline Variant", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.9", power: "110hp", transmissions: ["Manuel"] },
  { name: "2.3", bodyTypes: ["Sedan"], engine: "2.3", power: "150hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "EOS", [
  { name: "1.4 TSI", bodyTypes: ["Cabrio"], engine: "1.4", power: "122hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 FSi", bodyTypes: ["Cabrio"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Cabrio"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Golf", [
  { name: "1.0 eTSI", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.0", power: "110hp", transmissions: ["Otomatik"] },
  { name: "1.0 TSI", bodyTypes: ["Hatchback"], engine: "1.0", power: "110hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.1", bodyTypes: ["Hatchback"], engine: "1.1", power: "50hp", transmissions: ["Manuel"] },
  { name: "1.2 TSI", bodyTypes: ["Hatchback"], engine: "1.2", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "55hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.4 CDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.4 TSI", bodyTypes: ["Hatchback"], engine: "1.4", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 eTSI", fuels: ["Hibrit"], bodyTypes: ["Hatchback"], engine: "1.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "1.5 TSI", bodyTypes: ["Hatchback"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 FSI", bodyTypes: ["Hatchback"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Hatchback"], engine: "1.8", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.8 T", bodyTypes: ["Hatchback"], engine: "1.8", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9", bodyTypes: ["Hatchback"], engine: "1.9", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TSI", bodyTypes: ["Hatchback"], engine: "2.0", power: "245hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.5", bodyTypes: ["Hatchback"], engine: "2.5", power: "170hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "3.2 R", bodyTypes: ["Hatchback"], engine: "3.2", power: "250hp", transmissions: ["Otomatik", "Manuel"] }
]);

ensureSeriesModels("Volkswagen", "ID.3", [
  { name: "Pro", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "204hp", transmissions: ["Otomatik"] },
  { name: "Pure", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "170hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "ID.7", [
  { name: "Pro S", fuels: ["Elektrik"], bodyTypes: ["Sedan", "Wagon"], engine: "Elektrik", power: "286hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Jetta", [
  { name: "1.2 TSI", bodyTypes: ["Sedan"], engine: "1.2", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2 TSI BlueMotion", bodyTypes: ["Sedan"], engine: "1.2", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.3 GL", bodyTypes: ["Sedan"], engine: "1.3", power: "55hp", transmissions: ["Manuel"] },
  { name: "1.4 TSI", bodyTypes: ["Sedan"], engine: "1.4", power: "122hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TSI BlueMotion", bodyTypes: ["Sedan"], engine: "1.4", power: "122hp", transmissions: ["Manuel"] },
  { name: "1.5", bodyTypes: ["Sedan"], engine: "1.5", power: "150hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "105hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Lupo", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "50hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 GT", bodyTypes: ["Hatchback"], engine: "1.6", power: "125hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Volkswagen", "Passat", [
  { name: "1.4 TSI", bodyTypes: ["Sedan"], engine: "1.4", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TSI BlueMotion", bodyTypes: ["Sedan"], engine: "1.4", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TSI Hybrid", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "1.4", power: "218hp", transmissions: ["Otomatik"] },
  { name: "1.5 TSI", bodyTypes: ["Sedan"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 FSI", bodyTypes: ["Sedan"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 TD GL", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "70hp", transmissions: ["Manuel"] },
  { name: "1.6 TDI BlueMotion", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 T", bodyTypes: ["Sedan"], engine: "1.8", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 TSI", bodyTypes: ["Sedan"], engine: "1.8", power: "160hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 FSI", bodyTypes: ["Sedan"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TDI BlueMotion", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TFSI", bodyTypes: ["Sedan"], engine: "2.0", power: "200hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.5 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.5", power: "163hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.8", bodyTypes: ["Sedan"], engine: "2.8", power: "193hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Passat Alltrack", [
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "200hp", transmissions: ["Otomatik"] },
  { name: "Alltrack", fuels: ["Dizel", "Benzin"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "190hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Passat Variant", [
  { name: "1.4 TSI", bodyTypes: ["Station Wagon"], engine: "1.4", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TSI BlueMotion", bodyTypes: ["Station Wagon"], engine: "1.4", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.5 eHybrid", fuels: ["Hibrit"], bodyTypes: ["Station Wagon"], engine: "1.5", power: "204hp", transmissions: ["Otomatik"] },
  { name: "1.5 e-TSI", fuels: ["Hibrit"], bodyTypes: ["Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Otomatik"] },
  { name: "1.5 TSI", bodyTypes: ["Station Wagon"], engine: "1.5", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Station Wagon"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 FSI", bodyTypes: ["Station Wagon"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 TDI BlueMotion", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.6", power: "120hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 TDi", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.6", power: "105hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Station Wagon"], engine: "1.8", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 T", bodyTypes: ["Station Wagon"], engine: "1.8", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 TSI", bodyTypes: ["Station Wagon"], engine: "1.8", power: "160hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Station Wagon"], engine: "2.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TDI BlueMotion", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.5 TDI", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.5", power: "163hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Phaeton", [
  { name: "3.0 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "3.0", power: "240hp", transmissions: ["Otomatik"] },
  { name: "5.0 TDI Long", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "5.0", power: "313hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Polo", [
  { name: "1.0", bodyTypes: ["Hatchback"], engine: "1.0", power: "50hp", transmissions: ["Manuel"] },
  { name: "1.0 TSI", bodyTypes: ["Hatchback"], engine: "1.0", power: "95hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.2", bodyTypes: ["Hatchback"], engine: "1.2", power: "60hp", transmissions: ["Manuel"] },
  { name: "1.2 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.2", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.2 TSI", bodyTypes: ["Hatchback"], engine: "1.2", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.3", bodyTypes: ["Hatchback"], engine: "1.3", power: "55hp", transmissions: ["Manuel"] },
  { name: "1.4", bodyTypes: ["Hatchback"], engine: "1.4", power: "75hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.4 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.4", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.4 TSI", bodyTypes: ["Hatchback"], engine: "1.4", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "75hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "90hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9", bodyTypes: ["Hatchback"], engine: "1.9", power: "64hp", transmissions: ["Manuel"] },
  { name: "1.9 SDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "64hp", transmissions: ["Manuel"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "100hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Volkswagen", "Scirocco", [
  { name: "1.4 TSI", bodyTypes: ["Coupe"], engine: "1.4", power: "160hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Coupe"], engine: "2.0", power: "210hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Sharan", [
  { name: "1.8 T Comfortline", bodyTypes: ["MPV"], engine: "1.8", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 T Highline", bodyTypes: ["MPV"], engine: "1.8", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.9 TDI Comfortline", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.9 TDI Highline", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "115hp", transmissions: ["Manuel"] },
  { name: "2.0 TDI Basic", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TDI Highline", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.8", bodyTypes: ["MPV"], engine: "2.8", power: "204hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Touran", [
  { name: "1.4 TSI", bodyTypes: ["MPV"], engine: "1.4", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["MPV"], engine: "1.6", power: "102hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 FSI", bodyTypes: ["MPV"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.6", power: "115hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "1.9", power: "105hp", transmissions: ["Manuel"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["MPV"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Up Club", [
  { name: "E-Up", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "83hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "VW CC", [
  { name: "1.4 TSI", bodyTypes: ["Sedan"], engine: "1.4", power: "160hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 TFSI", bodyTypes: ["Sedan"], engine: "1.8", power: "160hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8 TSI", bodyTypes: ["Sedan"], engine: "1.8", power: "160hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TDI", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "140hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 TSI", bodyTypes: ["Sedan"], engine: "2.0", power: "210hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volkswagen", "Vento", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "75hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "90hp", transmissions: ["Manuel"] },
  { name: "1.9", bodyTypes: ["Sedan"], engine: "1.9", power: "64hp", transmissions: ["Manuel"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "115hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "C30", [
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "109hp", transmissions: ["Manuel"] }
]);

ensureSeriesModels("Volvo", "C70", [
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Cabrio", "Coupe"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Cabrio", "Coupe"], engine: "2.0", power: "163hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.3", bodyTypes: ["Cabrio", "Coupe"], engine: "2.3", power: "240hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.5", bodyTypes: ["Cabrio", "Coupe"], engine: "2.5", power: "220hp", transmissions: ["Otomatik", "Manuel"] }
]);

ensureSeriesModels("Volvo", "S40", [
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "109hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Sedan"], engine: "1.8", power: "122hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 T4", bodyTypes: ["Sedan"], engine: "1.9", power: "200hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Sedan"], engine: "2.0", power: "145hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Sedan"], engine: "2.0", power: "163hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T4", bodyTypes: ["Sedan"], engine: "2.0", power: "180hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.4", bodyTypes: ["Sedan"], engine: "2.4", power: "170hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.5 T5", bodyTypes: ["Sedan"], engine: "2.5", power: "220hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "S60", [
  { name: "1.5 T3", bodyTypes: ["Sedan"], engine: "1.5", power: "152hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "1.6", bodyTypes: ["Sedan"], engine: "1.6", power: "180hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "2.0 B5", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "2.0", power: "250hp", transmissions: ["Otomatik"] },
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "163hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Sedan"], engine: "2.0", power: "180hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T5", bodyTypes: ["Sedan"], engine: "2.0", power: "245hp", transmissions: ["Otomatik"] },
  { name: "2.3 T5", bodyTypes: ["Sedan"], engine: "2.3", power: "250hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.4", bodyTypes: ["Sedan"], engine: "2.4", power: "170hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.4 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.4", power: "163hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.4 T5", bodyTypes: ["Sedan"], engine: "2.4", power: "260hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.5 R", bodyTypes: ["Sedan"], engine: "2.5", power: "300hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.5 T", bodyTypes: ["Sedan"], engine: "2.5", power: "210hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "S70", [
  { name: "2.0 T", bodyTypes: ["Sedan"], engine: "2.0", power: "180hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T5", bodyTypes: ["Sedan"], engine: "2.0", power: "240hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.5 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.5", power: "140hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "S80", [
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "1.6", power: "110hp", transmissions: ["Manuel"] },
  { name: "1.6 T4", bodyTypes: ["Sedan"], engine: "1.6", power: "180hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Sedan"], engine: "2.0", power: "203hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.0 T5", bodyTypes: ["Sedan"], engine: "2.0", power: "240hp", transmissions: ["Otomatik"] },
  { name: "2.4", bodyTypes: ["Sedan"], engine: "2.4", power: "170hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.4 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.4", power: "163hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.4 D5", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.4", power: "185hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.5 D", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.5", power: "140hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.5 T", bodyTypes: ["Sedan"], engine: "2.5", power: "200hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.8 T6", bodyTypes: ["Sedan"], engine: "2.8", power: "272hp", transmissions: ["Otomatik"] },
  { name: "2.9 T6", bodyTypes: ["Sedan"], engine: "2.9", power: "272hp", transmissions: ["Otomatik"] },
  { name: "3.0 T6", bodyTypes: ["Sedan"], engine: "3.0", power: "304hp", transmissions: ["Otomatik"] },
  { name: "4.4", bodyTypes: ["Sedan"], engine: "4.4", power: "315hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volvo", "S90", [
  { name: "2.0 D B5", fuels: ["Dizel", "Hibrit"], bodyTypes: ["Sedan"], engine: "2.0", power: "235hp", transmissions: ["Otomatik"] },
  { name: "2.0 D D4", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "190hp", transmissions: ["Otomatik"] },
  { name: "2.0 D D5", fuels: ["Dizel"], bodyTypes: ["Sedan"], engine: "2.0", power: "235hp", transmissions: ["Otomatik"] },
  { name: "2.0 T8", fuels: ["Hibrit"], bodyTypes: ["Sedan"], engine: "2.0", power: "390hp", transmissions: ["Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan"], engine: "3.0", power: "204hp", transmissions: ["Otomatik", "Manuel"] }
]);

ensureSeriesModels("Volvo", "V40", [
  { name: "1.5", bodyTypes: ["Hatchback"], engine: "1.5", power: "122hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6", bodyTypes: ["Hatchback"], engine: "1.6", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 T3", bodyTypes: ["Hatchback"], engine: "1.6", power: "150hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 T4", bodyTypes: ["Hatchback"], engine: "1.6", power: "180hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.8", bodyTypes: ["Hatchback"], engine: "1.8", power: "122hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.9 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.9", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.9 T4", bodyTypes: ["Hatchback"], engine: "1.9", power: "200hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0", bodyTypes: ["Hatchback"], engine: "2.0", power: "145hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T", bodyTypes: ["Hatchback"], engine: "2.0", power: "163hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "V40 Cross Country", [
  { name: "1.5 T3", bodyTypes: ["Hatchback"], engine: "1.5", power: "152hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Hatchback"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 T4", bodyTypes: ["Hatchback"], engine: "1.6", power: "180hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.0 T5", bodyTypes: ["Hatchback"], engine: "2.0", power: "245hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volvo", "V50", [
  { name: "1.6", bodyTypes: ["Station Wagon"], engine: "1.6", power: "100hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.6", power: "109hp", transmissions: ["Manuel"] },
  { name: "1.8", bodyTypes: ["Station Wagon"], engine: "1.8", power: "125hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 D", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "136hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.5 T5", bodyTypes: ["Station Wagon"], engine: "2.5", power: "220hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "V60", [
  { name: "1.5 T3", bodyTypes: ["Station Wagon"], engine: "1.5", power: "152hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "1.6 D", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "1.6", power: "115hp", transmissions: ["Manuel"] },
  { name: "1.6 T4", bodyTypes: ["Station Wagon"], engine: "1.6", power: "180hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.0 B4", fuels: ["Hibrit"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "197hp", transmissions: ["Otomatik"] },
  { name: "2.0 D3", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "150hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.0 T5", bodyTypes: ["Station Wagon"], engine: "2.0", power: "250hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volvo", "V60 Cross Country", [
  { name: "2.0 B4", fuels: ["Hibrit"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "197hp", transmissions: ["Otomatik"] },
  { name: "2.0 B5", fuels: ["Hibrit"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "250hp", transmissions: ["Otomatik"] },
  { name: "2.0 D4", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "190hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volvo", "V70", [
  { name: "2.0 D4", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "181hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.0 T", bodyTypes: ["Station Wagon"], engine: "2.0", power: "180hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.3 T-5", bodyTypes: ["Station Wagon"], engine: "2.3", power: "250hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.4 D5", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.4", power: "185hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.4 T", bodyTypes: ["Station Wagon"], engine: "2.4", power: "200hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.4 T5", bodyTypes: ["Station Wagon"], engine: "2.4", power: "260hp", transmissions: ["Otomatik", "Manuel"] },
  { name: "2.5 D", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.5", power: "140hp", transmissions: ["Otomatik", "Manuel"] }
]);

ensureSeriesModels("Volvo", "V90 Cross Country", [
  { name: "2.0 B6", fuels: ["Hibrit"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "300hp", transmissions: ["Otomatik"] },
  { name: "2.0 D B5", fuels: ["Dizel", "Hibrit"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "235hp", transmissions: ["Otomatik"] },
  { name: "2.0 D D5", fuels: ["Dizel"], bodyTypes: ["Station Wagon"], engine: "2.0", power: "235hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Volvo", "440", [
  { name: "1.7 GLT", bodyTypes: ["Hatchback"], engine: "1.7", power: "102hp", transmissions: ["Manuel"] },
  { name: "2.0i", bodyTypes: ["Hatchback"], engine: "2.0", power: "110hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "740", [
  { name: "GL", bodyTypes: ["Sedan"], engine: "2.0", power: "112hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "850", [
  { name: "2.0 GLE", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "126hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 T5", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "225hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.3 T5", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.3", power: "240hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.5 GLT", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.5", power: "170hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "940", [
  { name: "2.0 GL", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "112hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.0 GL Turbo", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.0", power: "155hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "2.3 GLE", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.3", power: "135hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Volvo", "960", [
  { name: "2.5", bodyTypes: ["Sedan", "Station Wagon"], engine: "2.5", power: "170hp", transmissions: ["Manuel", "Otomatik"] },
  { name: "3.0", bodyTypes: ["Sedan", "Station Wagon"], engine: "3.0", power: "204hp", transmissions: ["Manuel", "Otomatik"] }
]);

ensureSeriesModels("Yuki Motor", "Amy", [
  { name: "Standart", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "8hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Yuki Motor", "Hector Pro", [
  { name: "Standart", fuels: ["Elektrik"], bodyTypes: ["Scooter"], engine: "Elektrik", power: "5hp", transmissions: ["Otomatik"] }
]);

ensureSeriesModels("Zlin Motors", "Spark-H", [
  { name: "Standart", fuels: ["Elektrik"], bodyTypes: ["Hatchback"], engine: "Elektrik", power: "20hp", transmissions: ["Otomatik"] }
]);

module.exports = data;
