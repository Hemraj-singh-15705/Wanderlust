const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../Models/review.js");
const listing = require("../Models/listing.js");
const {valiDateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Review route
//review post  request 
router.post("/",isLoggedIn, valiDateReview,wrapAsync(reviewController.createReview));

// Delete Review route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;