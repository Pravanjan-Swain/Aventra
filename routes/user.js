const express = require("express");
const router = express.Router();


const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

let {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");


router.route("/signup")
    .get(userController.renderSignupForm)   //signupForm
    .post(wrapAsync(userController.signup));   // signup


router.route("/login")
    .get(userController.renderLoginForm)  // login form
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash: true}), userController.login); //login
    // passport.authenticate is a middleware that will authenticate the user


//logout
router.get("/logout",userController.logout);

module.exports = router;