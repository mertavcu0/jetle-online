const dopingService = require("../services/doping.service");

const { Listing } = require("../models/Listing");

const User = require("../models/User");

const { ApiError } = require("../utils/ApiError");

const { asyncHandler } = require("../utils/asyncHandler");



function listPackages(req, res) {

  res.json({

    ok: true,

    data: {

      packages: ["basic", "featured", "showcase", "store"],

      dopingTypes: ["featured", "showcase", "urgent", "highlight"]

    }

  });

}



/** Ödeme simülasyonu: vitrin kataloğundaki ürün kodlarına göre hak ekler (admin değil). */

const activatePackage = asyncHandler(async function activatePackage(req, res) {
  var user = await User.findById(req.auth.userId);
  if (!user) throw new ApiError(404, "Kullanıcı bulunamadı.");
  var pid = String((req.body && req.body.productId) || "").trim();
  if (!pid) throw new ApiError(400, "productId gerekli.");

  function extendStore(plan, days) {
    user.storePlan = plan;
    var base = user.storeActiveUntil && new Date(user.storeActiveUntil) > new Date() ? new Date(user.storeActiveUntil) : new Date();
    user.storeActiveUntil = new Date(base.getTime() + (days || 30) * 864e5);
  }

  if (pid === "doping-guncelle") {
    user.bumpCredits = (user.bumpCredits || 0) + 1;
  } else if (pid === "doping-one-cikar") {
    user.featuredSlots = (user.featuredSlots || 0) + 1;
  } else if (pid === "doping-vitrin") {
    user.showcaseSlots = (user.showcaseSlots || 0) + 1;
  } else if (pid === "doping-ana-vitrin") {
    user.showcaseSlots = (user.showcaseSlots || 0) + 2;
  } else if (pid === "doping-sponsor") {
    user.featuredSlots = (user.featuredSlots || 0) + 1;
    user.dopingCredits = (user.dopingCredits || 0) + 2;
  } else if (pid === "store-baslangic") {
    extendStore("baslangic", 30);
  } else if (pid === "store-standart") {
    extendStore("standart", 30);
  } else if (pid === "store-pro") {
    extendStore("pro", 30);
  } else if (pid === "store-kurumsal") {
    extendStore("kurumsal_plus", 30);
  } else if (pid === "extra-ilan-1" || pid === "extra-ilan-2-5") {
    user.extraListingSlots = (user.extraListingSlots || 0) + 1;
  } else if (pid === "extra-ilan-10") {
    user.extraListingSlots = (user.extraListingSlots || 0) + 10;
  } else if (pid === "kredi-5") {
    user.dopingCredits = (user.dopingCredits || 0) + 5;
  } else if (pid === "kredi-10") {
    user.dopingCredits = (user.dopingCredits || 0) + 10;
  } else if (pid === "kredi-25") {
    user.dopingCredits = (user.dopingCredits || 0) + 25;
  } else if (pid.indexOf("kredi") === 0 || pid.indexOf("doping") === 0) {
    user.dopingCredits = (user.dopingCredits || 0) + 5;
  } else {
    throw new ApiError(400, "Bilinmeyen ürün kodu.");
  }

  await user.save();
  res.status(201).json({
    ok: true,
    message: "Paket aktif (simülasyon).",
    data: {
      productId: pid,
      dopingCredits: user.dopingCredits,
      featuredSlots: user.featuredSlots,
      showcaseSlots: user.showcaseSlots,
      bumpCredits: user.bumpCredits,
      extraListingSlots: user.extraListingSlots,
      storePlan: user.storePlan || "",
      storeActiveUntil: user.storeActiveUntil || null
    }
  });
});



const activateDoping = asyncHandler(async function activateDoping(req, res) {

  var listingId = String((req.body && req.body.listingId) || "").trim();

  var type = String((req.body && req.body.type) || "").trim();

  if (!listingId || !type) throw new ApiError(400, "listingId ve type gerekli.");

  var listing = await Listing.findById(listingId);

  if (!listing) throw new ApiError(404, "İlan bulunamadı.");

  if (String(listing.ownerId) !== String(req.auth.userId)) throw new ApiError(403, "Bu ilan size ait değil.");

  if (listing.status !== "approved") throw new ApiError(400, "Doping yalnızca yayındaki ilanlar için geçerlidir.");

  var user = await User.findById(req.auth.userId);

  if (!user) throw new ApiError(404, "Kullanıcı bulunamadı.");

  var costCredits = 0;

  var useFeaturedSlot = false;

  var useShowcaseSlot = false;

  if (type === "featured") {

    if ((user.featuredSlots || 0) > 0) useFeaturedSlot = true;

    else costCredits = 1;

  } else if (type === "showcase") {

    if ((user.showcaseSlots || 0) > 0) useShowcaseSlot = true;

    else costCredits = 2;

  } else if (type === "urgent" || type === "highlight") {

    costCredits = 1;

  } else {

    throw new ApiError(400, "Geçersiz doping türü.");

  }

  if (!useFeaturedSlot && !useShowcaseSlot) {

    if ((user.dopingCredits || 0) < costCredits) {

      throw new ApiError(403, "Yetersiz doping kredisi veya paket hakkı. Paketler bölümünden satın alın.");

    }

    user.dopingCredits = (user.dopingCredits || 0) - costCredits;

  } else {

    if (useFeaturedSlot) user.featuredSlots = Math.max(0, (user.featuredSlots || 0) - 1);

    if (useShowcaseSlot) user.showcaseSlots = Math.max(0, (user.showcaseSlots || 0) - 1);

  }

  var patch = dopingService.activateDoping({ type: type });

  if (patch.featured != null) listing.featured = patch.featured;

  if (patch.showcase != null) listing.showcase = patch.showcase;

  if (patch.urgent != null) listing.urgent = patch.urgent;

  if (patch.highlight != null) listing.highlight = patch.highlight;

  if (patch.featuredUntil != null) listing.featuredUntil = patch.featuredUntil;

  if (patch.showcaseUntil != null) listing.showcaseUntil = patch.showcaseUntil;

  await listing.save();

  await user.save();

  res.status(201).json({ ok: true, message: "Doping uygulandı.", data: { listingId: listingId, type: type } });

});



module.exports = { listPackages, activatePackage, activateDoping };


