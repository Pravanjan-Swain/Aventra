const express = require("express");
const router = express.Router();
const multer  = require('multer');
const {storage} = require("../cloudconfig.js"); 
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");


router.route("/")
    .get(wrapAsync(listingController.index))  //Index Route   //Do not put semiColon
    .post(isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createListing)); //create Route

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);  // New written above /:id because server whill think new as id


router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //Show Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))  //Update Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)); //Delete Route


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;