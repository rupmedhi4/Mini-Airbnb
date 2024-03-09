const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
var methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const expressError = require('./utils/expressError.js')
const {reviewSchema,listingSchema} = require("./schema.js")
const Review = require('./modals/review.js');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require( "passport" ) 
const LocalStrategy = require('passport-local')
const User = require('./modals/user.js')

const listing = require('./routes/listing.js')
const reviews = require('./routes/review.js')
const userRouter = require('./routes/user.js')




const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

app.listen(4000, () => {
    console.log('server is listening to port 4000');
})

main().then(() => {
    console.log('connected to DB');
})
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')))

const sessionOption = {
    secret :"mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}


app.get('/', (req, res) => {
    res.send('hi i am root')
})

app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{ 
    res.locals.success= req.flash("success")
    res.locals.error= req.flash("error")
    next()
})

// app.get('/demouser',async (req,res)=>{
//     let fakeUser = new User({
//         email : "rup@rup.com",
//         username : "rupmedhi"
//     })

//  let registeredUser = await User.register(fakeUser, 'rupmedhi123')
//  res.send(registeredUser)
// })





app.use("/listing",listing)
app.use("/listing/:id/review",reviews)
app.use("/",userRouter)

// page not found route
app.all("*",(req,res,next)=>{
    next(new expressError(404,"page not found"))
})
  

// ERROR MIDDLEWARE
app.use((err, req, res, next) => {
    let {statusCode, message} = err
    //res.status(statusCode).send(message)
    res.render("error.ejs", {message})
});

