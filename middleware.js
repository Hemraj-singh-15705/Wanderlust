const listing = require("./Models/listing");
const Review = require("./Models/review");
const ExpressError = require("./Utils/ExpressError.js");
const {listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing !");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};



module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if(!Listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing ");
       return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.valiDatelisting =(req,res,next)=>{
    console.log(req.body.listing);
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsj = error.details.map((el)=>el.message).join(",");
    throw new ExpressError (400 , errMsj);
    }else{
        next();
    }
};


module.exports.valiDateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsj = error.details.map((el)=>el.message).join(",");
    throw new ExpressError (400 , errMsj);
    }else{
        next();
    }
};


module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review ");
       return res.redirect(`/listings/${id}`);
    }
    next();
};