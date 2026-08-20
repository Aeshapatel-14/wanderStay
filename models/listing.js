const mongoose = require("mongoose");
const review = require("./review.js");
const { required } = require("joi");
const Schema = mongoose.Schema;


const listingSchema = new mongoose.Schema({
    title: {
      type:String,
      required:true,
    },
      
description: String,

price: {
    type: Number,
    required: true,
    min: 0
},

location: String,

country: String,
  

    image:{ 

      url:String,

      filename:String,

    },
    category: {

      type: String,

      default: "new"

    },
    reviews:[
      {
        type:Schema.Types.ObjectId,

        ref:"Review",

      },
    ],
      owner:{

        type:Schema.Types.ObjectId,

        ref:"User",
      },

      geometry: {

        type: {
          type: String, // Don't do `{ location: {  type: String } }`
         enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },

        coordinates: {

        type: [Number],

        required: true
      }
  },

      averageRating: {
        type: Number,
        default: 0,
      },

      reviewCount: {
        type: Number,
        default: 0,
      },
      },
       {
    timestamps: true
});

      
listingSchema.post("findOneAndDelete",async (listing) => {
 if (listing){
  await review.deleteMany({_id:{$in:listing.reviews}});
 }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


