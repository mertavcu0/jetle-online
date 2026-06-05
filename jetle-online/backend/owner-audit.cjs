const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');
(async () => {
  const listingId = process.argv[2];
  await mongoose.connect(process.env.MONGO_URI);
  const listing = await Listing.findById(listingId).populate('user', 'name email role').lean();
  const ownerId = String(listing?.user?._id || listing?.userId || listing?.user || '');
  const ownerEmail = String(listing?.user?.email || '');
  const ownerUser = ownerId ? await User.findById(ownerId).select('name email role').lean() : null;
  console.log(JSON.stringify({
    listingId,
    listingUserFieldType: typeof listing?.user,
    listingUserId: ownerId,
    listingUserEmail: ownerEmail,
    ownerUser,
    title: listing?.title || null,
    status: listing?.status || null,
    isActive: listing?.isActive,
    approved: listing?.approved
  }, null, 2));
  await mongoose.connection.close();
})().catch(err => { console.error(err); process.exit(1); });
