require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Listing = require("../models/Listing");

function buildLegacyVisibilityQuery() {
  return {
    isDeleted: { $ne: true },
    $or: [
      { approved: false },
      { status: { $in: ["pending", "approved", "rejected"] } },
      { isActive: false }
    ]
  };
}

function buildMediaPresenceQuery(baseQuery) {
  return {
    ...baseQuery,
    $and: [
      {
        $or: [
          { image: { $ne: "" } },
          { coverImage: { $ne: "" } },
          { mainImage: { $ne: "" } },
          { "images.0": { $exists: true } },
          { "gallery.0": { $exists: true } },
          { "photos.0": { $exists: true } }
        ]
      }
    ]
  };
}

function getMediaSnapshot(listing) {
  if (!listing) return null;
  return {
    id: String(listing._id || ""),
    image: String(listing.image || ""),
    coverImage: String(listing.coverImage || ""),
    mainImage: String(listing.mainImage || ""),
    imagesCount: Array.isArray(listing.images) ? listing.images.length : 0,
    galleryCount: Array.isArray(listing.gallery) ? listing.gallery.length : 0,
    photosCount: Array.isArray(listing.photos) ? listing.photos.length : 0
  };
}

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const legacyQuery = buildLegacyVisibilityQuery();
  const beforeCount = await Listing.countDocuments(legacyQuery);
  const missingDeletedFlagCount = await Listing.countDocuments({ isDeleted: { $exists: false } });
  const missingShowcaseFlagCount = await Listing.countDocuments({ isDeleted: { $ne: true }, isShowcase: { $exists: false } });
  const missingFeaturedFlagCount = await Listing.countDocuments({ isDeleted: { $ne: true }, isFeatured: { $exists: false } });
  const sampleBefore = await Listing.findOne(buildMediaPresenceQuery(legacyQuery)).lean();
  const sampleMediaBefore = getMediaSnapshot(sampleBefore);

  const updateResult = await Listing.updateMany(legacyQuery, {
    $set: {
      approved: true,
      status: "active",
      isActive: true
    }
  });

  const deletedFlagFix = await Listing.updateMany(
    { isDeleted: { $exists: false } },
    { $set: { isDeleted: false } }
  );

  const showcaseFlagFix = await Listing.updateMany(
    { isDeleted: { $ne: true }, isShowcase: { $exists: false } },
    { $set: { isShowcase: false } }
  );

  const featuredFlagFix = await Listing.updateMany(
    { isDeleted: { $ne: true }, isFeatured: { $exists: false } },
    { $set: { isFeatured: false } }
  );

  const afterCount = await Listing.countDocuments(legacyQuery);
  const restoredCount = Number(updateResult.modifiedCount || updateResult.nModified || 0);
  const matchedCount = Number(updateResult.matchedCount || updateResult.n || 0);
  const deletedFlagFixedCount = Number(deletedFlagFix.modifiedCount || deletedFlagFix.nModified || 0);
  const showcaseFlagFixedCount = Number(showcaseFlagFix.modifiedCount || showcaseFlagFix.nModified || 0);
  const featuredFlagFixedCount = Number(featuredFlagFix.modifiedCount || featuredFlagFix.nModified || 0);

  const sampleAfter = sampleMediaBefore
    ? await Listing.findById(sampleMediaBefore.id).lean()
    : null;
  const sampleMediaAfter = getMediaSnapshot(sampleAfter);
  const publicVisibleCount = await Listing.countDocuments({
    approved: true,
    status: "active",
    isActive: true,
    isDeleted: false
  });
  const normalFeedEligibleCount = await Listing.countDocuments({
    approved: true,
    status: "active",
    isActive: true,
    isDeleted: false,
    isShowcase: false,
    isFeatured: false
  });

  console.log("OLD_LISTINGS_RESTORED", JSON.stringify({
    beforeCount,
    restoredCount,
    afterCount
  }, null, 2));
  console.log("LEGACY_LISTINGS_ACTIVATED", JSON.stringify({
    matchedCount,
    modifiedCount: restoredCount,
    missingDeletedFlagCount,
    missingShowcaseFlagCount,
    missingFeaturedFlagCount,
    deletedFlagFixedCount,
    showcaseFlagFixedCount,
    featuredFlagFixedCount
  }, null, 2));
  console.log("MEDIA_LINKS_OK", JSON.stringify({
    sampleMediaBefore,
    sampleMediaAfter,
    unchanged: JSON.stringify(sampleMediaBefore) === JSON.stringify(sampleMediaAfter)
  }, null, 2));
  console.log("HOME_FEED_RESTORED", JSON.stringify({
    publicVisibleCount,
    normalFeedEligibleCount
  }, null, 2));
}

run()
  .catch((error) => {
    console.error("RESTORE_LEGACY_LISTINGS_ERROR", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
  });
