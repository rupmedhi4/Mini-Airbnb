const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require('./modals/listing')

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

app.get('/',(req,res)=>{
    res.send('hi i am root')
})


app.get('/testListing', async (req,res)=>{
    let sampleListing = new Listing({
        title :"my home",
        description : " this is my home",
        price : 1200,
     
        country : 'india'
    })
    await sampleListing.save()
    console.log('sample was save');
    res.send('successful testing')
})
















