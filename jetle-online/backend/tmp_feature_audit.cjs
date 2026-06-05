const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const mongoose = require("mongoose");
const Listing = require("./models/Listing");
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const listing = await Listing.findOne({ title: /WTRETRE/i }).lean();
    if (!listing) {
      console.log(JSON.stringify({ found: false }));
      return;
    }
    console.log(JSON.stringify({
      found: true,
      id: String(listing._id),
      features: listing.features,
      options: listing.options,
      equipment: listing.equipment,
      selectedFeatures: listing.selectedFeatures
    }, null, 2));
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
