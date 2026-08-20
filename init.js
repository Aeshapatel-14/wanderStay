require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const initData = require("./init/data");
const User = require("./models/user");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  
  await mongoose.connect(dbUrl);

  const user = await User.findOne();

  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,

     owner: user._id,

     geometry: {

    type: "Point",

    coordinates: [77.1025, 28.7041],
    },
  }));

  await Listing.deleteMany({});
  await Listing.insertMany(listingsWithOwner);

  console.log("Data added successfully");
}

main();