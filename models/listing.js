const mongoose = require('mongoose');
const Review = require("./review")

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required: true
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    price : {
        type : Number,
        required : true,
        min : 0
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
});



// Important concept Project-Phase2 Handling:Delete Listing
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;

