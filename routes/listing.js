const express = require("express")
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const {listingSchema,reviewSchema} = require("../schema.js")
const expressError = require('../utils/expressError.js')
const Listing = require('../modals/listing')


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
     throw new expressError(400,errMsg)
    }else{ 
        next()
    }
}


//index route
router.get('/', wrapAsync(async (req, res) => {
    let allListing = await Listing.find({})
    res.render('listing/index.ejs', { allListing })
}))

//new route
router.get('/new', (req, res) => {
    res.render('listing/new.ejs')
})

//show route
router.get('/:id',wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews')
    res.render('listing/show.ejs', { listing })
}))


//create route
router.post('/',validateListing, wrapAsync(async (req, res, next) => {
  
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect('/listing');
}))

//edit route
router.get('/:id/edit',wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render('listing/edit.ejs', { listing })
}))

//UPDATE ROUTE
router.put('/:id',validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listing/${id}`)
}))

//delete route
router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect('/listing')
}))


module.exports = router