const listing = require("../Models/listing");

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
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
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
    await listing.save();
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
