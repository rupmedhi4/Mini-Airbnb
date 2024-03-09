const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const expressError = require('../utils/expressError.js');
const { reviewSchema } = require("../schema.js");
const Review = require('../modals/review.js');
const Listing = require('../modals/listing.js'); 


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};

// Route to add a new review
router.post('/', validateReview, wrapAsync(async (req, res) => {

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new expressError(404, "Listing not found");
    }
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    console.log("New review saved");
    res.redirect(`/listing/${listing._id}`);
}));

// Route to delete a review
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}));

module.exports = router;
