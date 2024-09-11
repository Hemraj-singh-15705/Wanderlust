const listing = require("../Models/listing");
const mbxGeocoding  = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'tomtom',
  
    // Optionnal depending of the providers
    httpAdapter: 'https', // Default
    apiKey: mapToken, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

  const geocoder = NodeGeocoder(options);

module.exports.index = async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log(Listing);
  if (!Listing) {
    req.flash("error", "Listing your requested for does not exist !");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { Listing });
};

module.exports.createListing = async (req, res) => {
   let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created !");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);
  if (!Listing) {
    req.flash("error", "Listing your requested for does not exist !");
    res.redirect("/listings");
  }

  let originalImageUrl = Listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");

  res.render("listings/edit.ejs", { Listing ,originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }
  req.flash("success", "Listing Updated !");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted !");
  res.redirect("/listings");
};


module.exports.filter = async(req,res,next)=>{
  let {id} = req.params;
  let allListings = await listing.find({category: id});
  if(allListings.length != 0){
      res.render("listings/index.ejs", { allListings });
  }else{
      req.flash("error",`No listing with ${id}`);
      res.redirect("/listings")
  }
}

module.exports.search = async (req, res) => {
  let { location } = req.query;

  const allListings = await listing.find({ location });
  res.render("./listings/index.ejs", { allListings });
};