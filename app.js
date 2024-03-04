const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require('./modals/listing')
const path = require('path')
var methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync.js')
const expressError = require('./utils/expressError.js')
const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require('./modals/review.js')


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
app.set('views', path.join(
    __dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')))




app.get('/', (req, res) => {
    res.send('hi i am root')
})


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
     throw new expressError(400,errMsg)
    }else{
        next()
    }
}
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
     throw new expressError(400,errMsg)
    }else{
        next()
    }
}



// app.get('/testListing', async (req,res)=>{
//     let sampleListing = new Listing({
//         title :"my home",
//         description : " this is my home",
//         price : 1200,

//         country : 'india'
//     })
//     await sampleListing.save()
//     console.log('sample was save');
//     res.send('successful testing')
// })

//index route
app.get('/listing', wrapAsync(async (req, res) => {
    let allListing = await Listing.find({})
    res.render('listing/index.ejs', { allListing })
}))

//new route
app.get('/listing/new', (req, res) => {
    res.render('listing/new.ejs')
})

//show route
app.get('/listing/:id',wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews')
    res.render('listing/show.ejs', { listing })
}))


//create route
app.post('/listing',validateListing, wrapAsync(async (req, res, next) => {
  
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect('/listing');
}))

//edit route
app.get('/listing/:id/edit',wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render('listing/edit.ejs', { listing })
}))

//UPDATE ROUTE
app.put('/listing/:id',validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listing/${id}`)
}))

//delete route
app.delete('/listing/:id', wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect('/listing')
}))

//Reviews
//POST ROUTE

app.post('/listing/:id/review',validateReview, wrapAsync(async (req,res)=>{
  let listing = await Listing.findById(req.params.id)
  console.log(req.body.review);
  let newReview = new Review(req.body.review)

  listing.reviews.push(newReview)
  await listing.save()
  await newReview.save()

  console.log("new review saved");
  res.redirect(`/listing/${listing._id}`)

}))
 
//DELETE REVIEW ROUTE
app.delete('/listing/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listing/${id}`)

}))


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

