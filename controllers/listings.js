const Listing= require("../models/listing");
const User = require("../models/user");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


// NEW
module.exports.renderNewForm=(req, res) => {
  res.render("listings/new.ejs");
};

//recentyly view

module.exports.getRecentListings = async (req, res) => {

    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
        return res.json([]);
    }

    const listings = await Listing.find({
        _id: { $in: ids }
    }).select("title price location image");

    // Keep same order as localStorage
    const orderedListings = ids
        .map(id =>
            listings.find(item => item._id.toString() === id)
        )
        .filter(Boolean);

    res.json(orderedListings);

};

// show
module.exports.showListing=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{
      path:"author",
    },
  })
  .populate("owner");

  if(!listing){

    req.flash("error","Your listing request dose not exit!");

        return res.redirect("/listings");

    }

    // ======================================
// SIMILAR LISTINGS
// ======================================

const similarListings = await Listing.aggregate([

  {
    $match: {
      _id: { $ne: listing._id }
    }
  },

  {
    $addFields: {

      similarityScore: {

        $add: [

          // Same location = 3 points
          {
            $cond: [
              { $eq: ["$location", listing.location] },
              3,
              0
            ]
          },

          // Same category = 2 points
          {
            $cond: [
              { $eq: ["$category", listing.category] },
              2,
              0
            ]
          },

          // Same country = 1 point
          {
            $cond: [
              { $eq: ["$country", listing.country] },
              1,
              0
            ]
          }

        ]

      }

    }

  },

  {
    $match: {
      similarityScore: { $gt: 0 }
    }
  },

  {
    $sort: {
      similarityScore: -1,
      averageRating: -1
    }
  },

  {
    $limit: 8
  }

]);

    let isWishlisted = false;

    if (req.user) {
        const user = await User.findById(req.user._id);

        const wishlist = user.wishlist.map(item => item.toString());

        isWishlisted = wishlist.includes(listing._id.toString());
 
    }
        res.render("listings/show.ejs", {
            listing,
            isWishlisted,
            similarListings,
        });    
    };

// CREATE
module.exports.createListing=async (req, res, next) => { 
 let response= await geocodingClient.forwardGeocode({
  query:req.body.listing.location,
  limit: 1,
}).send();
  
  if (!response.body.features.length) {
  req.flash("error", "Invalid location!");
  return res.redirect("/listings/new");
}
   
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);

    newListing.owner=req.user._id;
    newListing.image={url,filename};

   newListing.geometry = response.body.features[0].geometry;

    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","new Listing created!");
    res.redirect("/listings");
};

// EDIT
module.exports.editListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Your listing request dose not  exit!");
        return res.redirect("/listings");
    }
     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/w_250"
    );

    res.render("listings/edit.ejs", {listing,originalImageUrl});
    };

    // update
    module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// delete  (destory)
module.exports.deleteListing=async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","New Listing deleted!");
  res.redirect("/listings");
};

module.exports.searchSuggestions = async (req, res) => {

    const query = req.query.q?.trim();

    if (!query) {
        return res.json([]);
    }

    const listings = await Listing.find({

        $or: [

            {
                title: {
                    $regex: query,
                    $options: "i"
                }
            },

            {
                location: {
                    $regex: query,
                    $options: "i"
                }
            },

            {
                country: {
                    $regex: query,
                    $options: "i"
                }
            }

        ]

    }).limit(6);

    const suggestions = [];

    listings.forEach((listing) => {

        if (
            listing.title &&
            !suggestions.includes(listing.title)
        ) {
            suggestions.push(listing.title);
        }

        if (
            listing.location &&
            !suggestions.includes(listing.location)
        ) {
            suggestions.push(listing.location);
        }

        if (
            listing.country &&
            !suggestions.includes(listing.country)
        ) {
            suggestions.push(listing.country);
        }

    });

    res.json(suggestions.slice(0, 6));

};
