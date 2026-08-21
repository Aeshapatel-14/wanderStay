require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to Atlas DB");

  await Listing.deleteMany({});

  const data = initData.data.map((obj) => ({
    ...obj,
    owner: "69d13e28daf51948b4e69ea5",
    geometry: {
      type: "Point",
      coordinates: [77.1025, 28.7041]
    }
  }));

  await Listing.insertMany(data);

  console.log("data was initialized");
  await mongoose.connection.close();
}

main().catch((err) => {
  console.log(err);
});