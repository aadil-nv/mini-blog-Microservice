const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT;
const colors = require('colors')
const userRoutes = require('./Routes/userRouter')
const connectDB = require('./config/db')

// jjhghujgjghjgjhhgjghdfsdfsdfsdfgj
app.use(express.json())
connectDB()

app.get('/',(req,res)=>{
    console.log("serever is satrted");
})
app.use('/api/user',userRoutes)

app.listen(PORT ,()=>{
    console.log(`user-server is started on http://localhost:${PORT}`.bgRed);
    
})