const mongoose = require('./jetle-online/backend/node_modules/mongoose');
const User = require('./jetle-online/backend/models/User');
(async () => {
  const email = process.argv[1];
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email }).lean();
  console.log(JSON.stringify({
    found: !!user,
    userId: user ? String(user._id) : null,
    favoritesCount: Array.isArray(user?.favorites) ? user.favorites.length : 0,
    favorites: Array.isArray(user?.favorites) ? user.favorites.map(String) : []
  }, null, 2));
  await mongoose.connection.close();
})().catch(err => { console.error(err); process.exit(1); });
