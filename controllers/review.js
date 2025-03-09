const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);  // Important concept
    
    newReview.author = res.locals.currUser._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    console.log("New review saved");
    req.flash("success","New Review Created")
    res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  // in reviews array remove object with reviewId == id
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`);
};