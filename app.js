if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// Requiring Express
const express = require('express');
const app = express();


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Setting up Sessions
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")

// Setting static files and decoding
const path = require("path");
app.use(express.static(path.join(__dirname,"/public/CSS")));
app.use(express.static(path.join(__dirname,"/public/JS")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Method override
const methodOverride = require('method-override');
app.use(methodOverride("_method"));


// Setting up ejs and its path
const ejsMate = require("ejs-mate");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.engine('ejs',ejsMate);


// Requiring error handlers
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


// Mongoose and Schema
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const Listing = require("./models/listing.js");
const mongoose = require('mongoose');
const { title } = require('process');

const dbUrl = process.env.ATLASDB_URL;
const MONGO_URL = 'mongodb://127.0.0.1:27017/travelone'

main()
.then((res)=>{
    console.log("Connection Successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl); // Connect to next database in MongoDB
}



// Routing starts

const port = process.env.PORT_NO;
app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
});


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
})


store.on("error", () => {
    console.log("Error in MONGO SESSION STORE", err);
})


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7*24*60*60*1000,  // !000 multiplied because values is generally considered in milliseconds
        maxAge : 7*24*60*60*1000,
        httpOnly: true  // for security purposes of cross scripting attacks
    }
}



app.use(session(sessionOptions));  // passport is written after session middleware because we need session to implement the authentication because we donot want multiple authentication for a single session. 
app.use(flash());

app.use(passport.initialize());  // For every request passport will be initialized
app.use(passport.session()); // aseries of requests and responses each associated with the same user is known as a session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    console.log(res.locals);
    next();
})


app.get("/demouser",async (req,res)=>{
    let fakeUser = new User({
        email : "student@gmail.com",
        username : "delta-student"    // we can add username because the mongoose-local will add username to the usermodel
    })

    let registeredUser = await User.register(fakeUser,"helloworld");  // register method will automatically save the new user in the database with password as "helloworld"
    res.send(registeredUser);
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);  // We use reviews and listings together because we will se reviews with listings not individually
app.use("/",userRouter);

// Page not found middleware
app.use("/",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})


// Error handling route
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode). render("error.ejs",{message});
})


// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         country : "India"
//     })

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })