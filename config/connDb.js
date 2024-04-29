const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/hbsDB"


const dbConnect = async () => {
  try {

    await mongoose.connect(url)
    console.log(`db Connected on ${url}`)
  } catch (err) {
    console.log(err);
  }
};

module.exports =  dbConnect