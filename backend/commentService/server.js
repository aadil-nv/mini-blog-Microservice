const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT;
const colors = require('colors')
const commentRoutes = require('./Routes/commentRoute')
const connectDB = require('./config/db')

app.use(express.json())
connectDB()

app.get('/', (req, res) => {
    console.log("serever is satrted");
})
app.use('/api/comment', commentRoutes)

app.listen(PORT, () => {
    console.log(`comment-server is started on http://localhost:${PORT}`.bgBrightGreen
        .bold.underline);
})