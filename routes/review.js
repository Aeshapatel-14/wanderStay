const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review= require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,
   isLogedIn,
    isReviewAuthor
  }=require("../middleware.js");

  const reviewController =require("../controllers/reviews.js");

//Reviews post route
router.post("/",
  isLogedIn,
  validateReview,
  wrapAsync(reviewController.createReview));


// Update Review
router.put(
  "/:reviewId",
  isLogedIn,
  isReviewAuthor,
  validateReview,
  wrapAsync(reviewController.updateReview)
);

//delete review route
router.delete
("/:reviewId",
  isLogedIn, 
  isReviewAuthor,
  wrapAsync(reviewController.destoryReview)
);

 module.exports =router;