// replace with your Stitch app ID
const stitchAppId = 'YOUR_STITCH_APP_ID';

// replace with Stitch server names of the linked cluster(s)
// can use the same name for all three if products, reviews and users are stored on the same cluster
const stitchClusterNames = {
  products: 'mongodb-atlas',
  reviews: 'mongodb-atlas',
  users: 'mongodb-atlas'
};

// replace with your name, email address and phone number
// is used by notification functions
const jwtUser = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890'
};

export { stitchAppId, stitchClusterNames, jwtUser };
