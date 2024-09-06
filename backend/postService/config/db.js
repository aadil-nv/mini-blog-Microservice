const mongoose = require('mongoose')
const colors = require('colors')


const connectDB = async ()=>{
    try {
        const mongoURI = process.env.MONGO_URI;
        const conn = await mongoose.connect(mongoURI);
        console.log(`post-Database connected on ${conn.connection.host}`.bgBrightMagenta
            .bold.underline);
        
    } catch (error) {
        console.log(`user-database error ${error.message}`);
        process.exit(1)
    }
}

module.exports=connectDB;