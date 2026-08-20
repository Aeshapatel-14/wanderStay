const Listing=require("../models/listing");
const Review=require("../models/review");

const updateAverageRating = async (listingId) => {

    const listing = await Listing.findById(listingId).populate("reviews");

    if (!listing) return;

    if (listing.reviews.length === 0) {
        listing.averageRating = 0;
        listing.reviewCount = 0;
    } else {

        let total = 0;

        listing.reviews.forEach((review) => {
            total += review.rating;
        });

        listing.averageRating = total / listing.reviews.length;
        listing.reviewCount = listing.reviews.length;
    }

    await listing.save();
};

// Create Review

module.exports.createReview = async (req, res) => {

     console.log(req.body);
    console.log(req.body.review);

    const listing = await Listing.findById(req.params.id);
   
    const newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    await newReview.save();

    listing.reviews.push(newReview);

    await listing.save();

    await updateAverageRating(listing._id);

    // Populate author
    await newReview.populate("author");

    // Latest Listing
    const updatedListing = await Listing.findById(listing._id);

    // AJAX Request
    if (req.xhr || req.headers.accept.includes("application/json")) {

        return res.json({

            success: true,

            review: {
                _id: newReview._id,
                comment: newReview.comment,
                rating: newReview.rating,
                author: newReview.author.username
            },

            averageRating: updatedListing.averageRating,
            reviewCount: updatedListing.reviewCount

        });

    }

    // Normal Request
    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);

};


// // Render Edit Review Form

// module.exports.renderEditForm = async (req, res) => {

//     const { id, reviewId } = req.params;

//     const listing = await Listing.findById(id);

//     const review = await Review.findById(reviewId);


//     if (!review) {
//         req.flash("error", "Review not found!");
//         return res.redirect(`/listings/${id}`);
//     }

//     res.render("reviews/edit.ejs", {
//         listingId: id,
//         review
//     });

// };

//delete(destory) review
 
module.exports.destoryReview=async (req, res) =>{
    let {id, reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    await Review.findByIdAndDelete(reviewId);

    await updateAverageRating(id);

    // AJAX Request
    if (req.xhr || req.headers.accept.includes("application/json")) {
    const updatedListing = await Listing.findById(id);

    return res.json({
     success: true,
     reviewId,

        reviewCount: updatedListing.reviewCount,

        averageRating:
            updatedListing.reviewCount > 0
                ? updatedListing.averageRating.toFixed(1)
                : "New",
    });
}

// Normal Request
req.flash("success", "Review Deleted!");
res.redirect(`/listings/${id}`);
  };

  // Update Review

module.exports.updateReview = async (req, res) => {

    const { id, reviewId } = req.params;

    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        req.body.review,
        {
            new: true,
            runValidators: true,
        }
    ).populate("author");

    // Update Average Rating
    await updateAverageRating(id);

    const listing = await Listing.findById(id);

    // AJAX Request
    if (req.xhr || req.headers.accept.includes("application/json")) {

        return res.json({

            success: true,

            review: {

                _id: updatedReview._id,

                comment: updatedReview.comment,

                rating: updatedReview.rating,

                author: updatedReview.author.username,

                isOwner: true

            },

            reviewCount: listing.reviewCount,

            averageRating:
                listing.reviewCount > 0
                    ? listing.averageRating.toFixed(1)
                    : "New",

        });

    }

    // Normal Request
    req.flash("success", "Review Updated Successfully!");

    res.redirect(`/listings/${id}`);

};