const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});  // Don't put slash when rendering the file
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate: {path:"author"}}).populate('owner');
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }

    console.log(listing);
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image =  {filename,url};
    try {
        const address = newListing.location+","+newListing.country;
        const newAddress = address.replace(/[^a-zA-Z0-9]+/g, ',');
        const encodedAddress = encodeURIComponent(newAddress);
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&limit=1&format=json&apiKey=${process.env.MAP_COORDINATE_TOKEN}`);

        if (!response.ok) {
            req.flash("error","Please enter correct address");
            return res.redirect(`/listing`);
        }
        
        const data = await response.json();
        const locationData = {
            lon: data.results[0].lon,
            lat: data.results[0].lat
        };
        
        const geoPoint = {
            type: "Point",
            coordinates: [locationData.lon, locationData.lat]
        };
        newListing.geometry = geoPoint;
    } catch (err) {
        req.flash("error","Error getting geo data");
        return res.redirect(`/listings`);
    }

    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing Created")
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    console.log(originalImageUrl);
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}); // is there is some error in id then mongoose will throw a error
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {filename,url};
        await listing.save();
    }
    console.log(listing);
    req.flash("success","Listing Updated")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);  //  the post middleware is defined on the listing.js model that will delete all the reviews associated with the listing
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}