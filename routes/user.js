const express = require("express");
const router = express.Router();
const User = require('../modals/user.js');
const wrapAsync = require("../utils/wrapAsync.js");


router.get("/signup", (req,res)=>{
    res.render('users/signup.ejs')
})


router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body
            const newUser =  new User({
                email,
                username
            })
            const registeredUser = await User.register(newUser, password)
            console.log(registeredUser);
            req.flash("success", "user was registered")
            res.redirect("/listing")
    }catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")
    }
    
}))





module.exports = router;