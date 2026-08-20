const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLogedIn,isOwner,validateListing}= require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router.get(
    "/search-suggestions",
    wrapAsync(listingController.searchSuggestions)
);

router.route("/")
  .get(wrapAsync(listingController.index))
  
  .post(   
    isLogedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
    );
  
router.post(
    "/recent-listings",
    wrapAsync(listingController.getRecentListings)
);


 //new  
router.get("/new",isLogedIn,
   listingController.renderNewForm);

router.route("/:id")
  .get(wrapAsync(listingController.showListing)
  )
  .put(
     isLogedIn,
     isOwner,
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(listingController.updateListing)
    )
  .delete(
      isLogedIn,
      isOwner,
      wrapAsync(listingController.deleteListing));


//wishlist route

  router.post(
    "/:id/wishlist",
    isLogedIn,
    wrapAsync(listingController.toggleWishlist)
  );

// EDIT - Form to edit a listing
  router.get("/:id/edit",
    isLogedIn,
    isOwner,
    wrapAsync(listingController.editListing)
  );


  module.exports=router;