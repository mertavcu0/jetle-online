const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    fuel: {
      type: [String],
      default: []
    },
    transmission: {
      type: [String],
      default: []
    },
    body: {
      type: [String],
      default: []
    },
    engine: String,
    hp: String
  },
  { _id: false }
);

const SeriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    models: {
      type: [ModelSchema],
      default: []
    }
  },
  { _id: false }
);

const CarBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  series: {
    type: [SeriesSchema],
    default: []
  }
});

module.exports = mongoose.model("CarBrand", CarBrandSchema);
