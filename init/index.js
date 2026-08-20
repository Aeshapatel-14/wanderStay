
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
      })

    .catch((err) => {
      console.log(err);
    });

    async function main() {
      await mongoose.connect(MONGO_URL);
    }

// init DB
    const initDB = async () => {
       await Listing.deleteMany({});

      initData.data = initData.data.map((obj)=>({
      ...obj,
      owner:"69d13e28daf51948b4e69ea5",

      geometry: {
        type: "Point",
        coordinates: [77.1025, 28.7041] 
      }
    }));
 

    await Listing.insertMany(initData.data);
      console.log("data was initialized");
      };

  initDB();