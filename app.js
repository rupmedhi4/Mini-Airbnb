const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require('./modals/listing')
const path = require('path')
var methodOverride = require('method-override')



const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'

app.listen(4000,()=>{
    console.log('server is listening to port 4000');
})

main().then(()=>{
    console.log('connected to DB');
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(MONGO_URL);
}


app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))



app.get('/',(req,res)=>{
    res.send('hi i am root')
})


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
app.get('/listing',async (req,res)=>{
    let allListing = await Listing.find({})
    res.render('listing/index.ejs',{allListing})
})

//new route
app.get('/listing/new',(req,res)=>{
    res.render('listing/new.ejs')
})

//show route
app.get('/listing/:id',async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render('listing/show.ejs',{listing})
})


//create route
app.post('/listing', async(req,res)=>{
    let listing = req.body.listing
   const newListing = new Listing(listing)
    await newListing.save()
    res.redirect('/listing');
})

//edit route
app.get('/listing/:id/edit',async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render('listing/edit.ejs',{listing})
})

//UPDATE ROUTE
app.put('/listing/:id', async(req,res)=>{
    let {id}= req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect( `/listing/${id}`)
})

//delete route
app.delete('/listing/:id',async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect('/listing')
})


