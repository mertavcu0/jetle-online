const listingsService = require("../services/listings.service");

const authService = require("../services/auth.service");

const { asyncHandler } = require("../utils/asyncHandler");



const myListings = asyncHandler(async function myListings(req, res) {

  var rows = await listingsService.byOwner(req.auth.userId);

  res.json({ ok: true, data: rows });

});



const patchMyListingStatus = asyncHandler(async function patchMyListingStatus(req, res) {

  var row = await listingsService.updateStatusByOwner(req.params.id, req.auth.userId, req.body.status);

  res.json({ ok: true, data: row });

});



const deleteMyListing = asyncHandler(async function deleteMyListing(req, res) {

  await listingsService.deleteByOwner(req.params.id, req.auth.userId);

  res.json({ ok: true, message: "İlan silindi." });

});



const patchProfile = asyncHandler(async function patchProfile(req, res) {

  var data = await authService.updateMe(req.auth, req.body || {});

  res.json({ ok: true, data: data });

});



function myFavorites(req, res) {

  res.json({ ok: true, data: [] });

}



function myMessages(req, res) {

  res.json({ ok: true, data: [] });

}



const myPackages = asyncHandler(async function myPackages(req, res) {

  var me = await authService.me(req.auth);

  res.json({
    ok: true,
    data: {
      dopingCredits: me.dopingCredits,
      featuredSlots: me.featuredSlots,
      showcaseSlots: me.showcaseSlots,
      bumpCredits: me.bumpCredits,
      extraListingSlots: me.extraListingSlots,
      storePlan: me.storePlan || "",
      storeActiveUntil: me.storeActiveUntil || null,
      role: me.role
    }
  });

});



module.exports = {

  myListings,

  patchMyListingStatus,

  deleteMyListing,

  patchProfile,

  myFavorites,

  myMessages,

  myPackages

};


