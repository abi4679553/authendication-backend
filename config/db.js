const mongoose = require("mongoose")

    const connectDb = async(mongoose) =>{
        try{
            await mongoose.connect(process.env.MONGO_URI);
            console.log("database connected successfully")
        }
        catch(err){
            console.log("network error in  database ",err.mongoose)
        }
    }

    module.exports = connectDb;
