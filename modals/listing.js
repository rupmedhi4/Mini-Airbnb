const mongoose = require('mongoose')
const Schema = mongoose.Schema


const listingSchema = new Schema({
    title : {
        type :String,
        // required: true
    },
    description : String,
    image :{
        type : String,
        default : "https://cdn.pixabay.com/photo/2014/11/21/17/17/house-540796_1280.jpg",
        set : (v)=> v === ""? "https://cdn.pixabay.com/photo/2014/11/21/17/17/house-540796_1280.jpg" : v,
    },
    location : String,
    price : Number,
    country : String,
    reviews : [{
                type : Schema.Types.ObjectId,
                ref: "Review"
            }]
    
})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing