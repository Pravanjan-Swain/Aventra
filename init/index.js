const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then((res)=>{
    console.log("Connection Successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travelone'); // Connect to next database in MongoDB
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'67b0ebb4e3b8722ab8a5b916'}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
}

initDB();