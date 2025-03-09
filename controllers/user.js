const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    if(res.locals.currUser){
        req.flash("success","Already logged in");
        return res.redirect("/listings");
    }
    res.render("users/signup.ejs");
};


module.exports.signup = async(req,res)=>{
    try{  
        let {username,email,password} = req.body;   // Error comes when u have more than one same username
        let newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            req.flash("success","Welcome to Aventra");
            res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req,res)=>{
    if(res.locals.currUser){
        req.flash("success","Already logged in");
        return res.redirect("/listings");
    }
    res.render("users/login.ejs");
};


module.exports.login = async (req,res)=>{   
    req.flash("success","Welcome to Aventra. You are logged in");
    let redirectUrl = res.locals.redirectUrl; 
    if(redirectUrl){
        return res.redirect(redirectUrl);
    }
    res.redirect("/listings");  
}


module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
}